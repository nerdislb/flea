// Reuse sandboxed, verified extraction; publish complete top-level entries without overwriting.
use super::archive::Formats;
use super::archiveops::extract;
use super::archivework::Work;
use super::ops::rename_noreplace;
use super::opsreq::op_err;
use crate::error::{from_io, FleaError};
use std::path::Path;

pub fn extract_here(formats: &Formats, archive: &Path, dest: &Path) -> Result<bool, FleaError> {
    if !archive.is_absolute() || archive.parent() != Some(dest) || !dest.is_dir() {
        return Err(op_err("archive", &dest.to_string_lossy(), "extract-here requires the archive's own directory"));
    }
    let work = Work::new(dest, "ext")?;
    let staged = work.dir.join("out");
    let verified = extract(formats, archive, &staged)?;
    publish(&staged, dest)?;
    Ok(verified)
}

fn publish(staged: &Path, dest: &Path) -> Result<(), FleaError> {
    let mut entries = std::fs::read_dir(staged)
        .map_err(|e| from_io("archive", &staged.to_string_lossy(), &e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| from_io("archive", &staged.to_string_lossy(), &e))?;
    entries.sort_by_key(|e| e.file_name());
    // Check the whole set first: an existing file, folder or dangling link aborts this archive.
    for entry in &entries {
        let target = dest.join(entry.file_name());
        match target.symlink_metadata() {
            Ok(_) => return Err(op_err("archive", &target.to_string_lossy(), "already exists; nothing was extracted")),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
            Err(e) => return Err(from_io("archive", &target.to_string_lossy(), &e)),
        }
    }
    for (done, entry) in entries.iter().enumerate() {
        let target = dest.join(entry.file_name());
        // A concurrent creator still cannot be overwritten. Already published entries stay intact.
        if let Err(e) = rename_noreplace(&entry.path(), &target) {
            return Err(op_err("archive", &target.to_string_lossy(),
                &format!("stopped after {} entries; existing files were preserved: {}", done, e.msg)));
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::backend::testdir::TestDir;
    fn fixture() -> (TestDir, std::path::PathBuf, std::path::PathBuf) {
        let root = TestDir::new("zip-here");
        root.dir("stage"); root.dir("dest");
        let stage = root.join("stage"); let dest = root.join("dest");
        (root, stage, dest)
    }
    #[test]
    fn publishes_files_and_nested_folders_beside_archive() {
        let (_root, stage, dest) = fixture();
        std::fs::write(dest.join("archive.zip"), "original").unwrap();
        std::fs::write(stage.join("a.txt"), "hello").unwrap();
        std::fs::create_dir(stage.join("nested")).unwrap();
        std::fs::write(stage.join("nested/b.txt"), "nested").unwrap();
        publish(&stage, &dest).unwrap();
        assert_eq!(std::fs::read_to_string(dest.join("a.txt")).unwrap(), "hello");
        assert_eq!(std::fs::read_to_string(dest.join("nested/b.txt")).unwrap(), "nested");
        assert_eq!(std::fs::read_to_string(dest.join("archive.zip")).unwrap(), "original");
    }
    #[test]
    fn conflict_preflight_keeps_all_existing_data_and_publishes_nothing() {
        for symlink in [false, true] {
            let (_root, stage, dest) = fixture();
            std::fs::write(stage.join("a-new.txt"), "new").unwrap();
            std::fs::write(stage.join("z-existing"), "replacement").unwrap();
            if symlink { std::os::unix::fs::symlink("missing", dest.join("z-existing")).unwrap(); }
            else { std::fs::create_dir(dest.join("z-existing")).unwrap(); }
            assert!(publish(&stage, &dest).is_err());
            assert!(!dest.join("a-new.txt").exists());
            assert!(dest.join("z-existing").symlink_metadata().is_ok());
            assert!(stage.join("a-new.txt").exists());
        }
    }
}
