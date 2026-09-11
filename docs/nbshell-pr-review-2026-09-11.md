# Flea nbshell trial: review of all open PRs

Reviewed 2026-09-11 against upstream v0.2.0 (`b992e76475731041b0c13b50f5cbec3e5c04faa4`), on local branch `nbshell-trial`. All 36 open PRs, including the draft, were inspected by description, patch, relevant discussion and comparison with release code. Ancestry alone does not detect upstream manual incorporation.

22 PRs were incorporated wholly or in adapted/partial form. The other 14 contain existing functions, alternate designs, inapplicable integrations, concrete issues or deferred ports. **Deferred means feature work remains; it does not mean integrated.** No upstream PR was merged or commented on.

| PR | Outcome | Evidence / decision |
| --- | --- | --- |
| [#108](https://github.com/thisisgm/flea/pull/108) | Integrated | RAR recognition and extract destination; libarchive format limitations remain. |
| [#106](https://github.com/thisisgm/flea/pull/106) | Adapted | Ctrl-click selection preservation. Kept current filter and Pane behavior; legacy Hyprland UI script omitted. |
| [#104](https://github.com/thisisgm/flea/pull/104) | Superseded | Release has TrashView/TrashHost and trashbrowse/trashdelete with backing-identity checks and recovery. PR instead adds trashfs/trashlist and a different protocol; replacing current code would discard newer safeguards. |
| [#103](https://github.com/thisisgm/flea/pull/103) | Deferred | Picker rewrite is absent. Its 58 commits change shared sort, fetch/cache, trash replies and portal contracts. Requires a dedicated port to current identity-checked operations and Open/Save validation. This standalone trial does not register the portal. |
| [#97](https://github.com/thisisgm/flea/pull/97) | Integrated | Shared setView writer and validated saved-view fallback. Most view persistence was already in the release. |
| [#96](https://github.com/thisisgm/flea/pull/96) | Integrated | Exact line-count budget distinguishes EOF from a partial result. |
| [#95](https://github.com/thisisgm/flea/pull/95) | Integrated | Home abbreviation matches whole path components. |
| [#94](https://github.com/thisisgm/flea/pull/94) | Adapted | Restore tab selection only for the same listing generation/order; clear row caches on reorder. |
| [#93](https://github.com/thisisgm/flea/pull/93) | Adapted | Leaving search through tabs forces a directory listing even when the path matches. |
| [#92](https://github.com/thisisgm/flea/pull/92) | Adapted | Hidden cursor rows cannot become operation targets. Retained current identity-aware rename in all views. |
| [#91](https://github.com/thisisgm/flea/pull/91) | Integrated | Consume pending sort even when the listing already has that order. |
| [#90](https://github.com/thisisgm/flea/pull/90) | Integrated | JPEG dimensions seek over long EXIF segments; local review added a minimum frame-segment length guard. |
| [#89](https://github.com/thisisgm/flea/pull/89) | Integrated | MIME lookup uses leaf names for search/listpaths rows. |
| [#88](https://github.com/thisisgm/flea/pull/88) | Adapted | Missing paths are not journaled as successful trash operations. Both current source-identity validations remain. |
| [#87](https://github.com/thisisgm/flea/pull/87) | Integrated | Protocol strings use the shared surrogate-aware JSON reader. |
| [#86](https://github.com/thisisgm/flea/pull/86) | Already present | renamecompat::rename_path in v0.2.0 already handles EXDEV through copy_then_remove. |
| [#85](https://github.com/thisisgm/flea/pull/85) | Superseded / alternate store | Add/remove favorites exists through Favourites.qml and locked Rust --favourites updater. PR writes GTK bookmarks; that sharing was not added because it introduces a competing store. |
| [#84](https://github.com/thisisgm/flea/pull/84) | Adapted | Internal automounted/unmounted partitions in Devices. Combined with #74, preserved byte capacities and guarded direct eject. Fixed mounts outside /run/media/<user> remain excluded. |
| [#82](https://github.com/thisisgm/flea/pull/82) | Integrated | Optional LocalSend menu and argument-array handoff. Visible only when installed. Tests use stubs and transmit nothing. |
| [#81](https://github.com/thisisgm/flea/pull/81) | Partly present | Maintainer confirms regular running text shipped in 0.1.6. Retained newer smaller grid/metadata captions and the nbshell adapter; did not apply the older broad typography replacement. |
| [#80](https://github.com/thisisgm/flea/pull/80) | Already present | Maintainer confirms watching shipped in 0.1.5. backend/watch.rs plus PaneWire defer refresh during operations. No duplicate inotify-tools watcher/control added. |
| [#74](https://github.com/thisisgm/flea/pull/74) | Adapted | RM=false USB bridges use TRAN/SUBSYSTEMS and inherited externality. Retained lsblk --bytes. |
| [#71](https://github.com/thisisgm/flea/pull/71) | Integrated | Explicitly executable ELF/AppImage files launch directly with detached streams/process group. Other scripts keep desktop associations; no automatic chmod. |
| [#70](https://github.com/thisisgm/flea/pull/70) | Partly present | Release reads saved view/sort and exposes sort menus/key presets; #97 supplies view guards. Exact last-click sort persistence and alternate dotfile ordering remain unported. Retained current settings/per-pane semantics rather than replacing listing priming and newer sort keys. |
| [#69](https://github.com/thisisgm/flea/pull/69) | Adapted | Responsive two/three columns and separators. Preserved lazy loaders, integer models, stroke width and network ownership; aligned current Pane empty state. |
| [#61](https://github.com/thisisgm/flea/pull/61) | Rejected as submitted | Opener concatenates directory/URL into sh -c single-quoted git clone and rm -rf commands. Apostrophes break quoting; cleanup can remove directory contents. Also depends on omarchy-default-agent/Omacut and replaces newer trash code. |
| [#60](https://github.com/thisisgm/flea/pull/60) | Not applicable here | AppShelf is absent. This separate Omarchy application/package-manager integration has no effect without it. #71 adds executable AppImage opening. |
| [#59](https://github.com/thisisgm/flea/pull/59) | Rejected as submitted | Reclaim treats names such as build/out/target as proof of regenerable content and stages all matches for trash. Names alone do not justify that assumption; no cleanup enabled. |
| [#57](https://github.com/thisisgm/flea/pull/57) | Incompatible as submitted | Keyboard drag calls hyprctl dispatch cursor center and targets the old List drag code. Needs an Umbriel port and real pointer validation; ordinary FileDrag remains. |
| [#53](https://github.com/thisisgm/flea/pull/53) | Integrated | Trash arming preview for list/grid and cursor continuity on refresh/trash. |
| [#51](https://github.com/thisisgm/flea/pull/51) | Partly integrated | Retained hovered-tooltip stacking fix. Release already has PreserveAspectFit, two caption lines, glyph ceiling and adjustable thumbnailPixels; preserved newer zoom/rename layout. |
| [#48](https://github.com/thisisgm/flea/pull/48) | Adapted | Parent navigation reselects departed directory; current breadcrumbs preserved. |
| [#39](https://github.com/thisisgm/flea/pull/39) | Partly present; deferred | Maintainer confirms ICC reproducer and 2 GiB RLIMIT_AS fix shipped in 0.1.4; ICC fixture matches. Remaining delegated-cgroup broker replaces sandbox/gate/process ownership and needs independent security/resource validation before a port. |
| [#32](https://github.com/thisisgm/flea/pull/32) | Draft; deferred | Draft LAN/tailnet/Wake manager includes dependencies #16/#21/#31/#33/#35 and older mount/rename/scroll code. Some prerequisites shipped; discovery manager has not. Whole stack would replace current network request ownership. |
| [#31](https://github.com/thisisgm/flea/pull/31) | Adapted | Paste transfer labels distinguish separate GVFS roots. Retained retry state, middle-dot typography and Object.assign progress fields. This labels existing transfers; it is not server-side transfer transport. |
| [#21](https://github.com/thisisgm/flea/pull/21) | Partly present; deferred | Release has Rename/Remove, normalized default ports and bookmark labels (maintainer confirms partial incorporation). URI-edit dialog and per-connection SFTP coverage remain absent. Old patch replaces current request-id/owner/cancel network flow; needs a dedicated port and live share tests. |

## Local installation

Run `flea`, or choose Flea in the app finder. `tools/install-nbshell-trial` deploys the source to `~/.local/share/flea`, with `~/.local/bin/flea` and a user desktop entry. Dolphin remains the default directory handler; no portal replacement or D-Bus file-manager takeover is installed.

The nbshell palette is parsed as data, never executed. Small MIT-licensed Omarchy compatibility modules are pinned and documented in `compat/README.md`; no global Omarchy directory is created. Private helpers provide Ghostty terminal launch and the upstream expect-based network authentication helper. `expect` and `zip` were installed.

## Validation and limits

Claude Fable was unavailable due to session quota, so an independent model review was not completed. Live external SFTP/SMB credentials, actual LocalSend transmission, keyboard-generated drag and portal activation were not tested. This is a local trial, not a new upstream release.

### Passed

- `cargo test --release --locked`: **608 passed, 0 failed**; debug and release binaries built. Four existing Rust warnings remain.
- `tests/js.sh`: **3,108 + 4 + 9 checks, 0 failed**.
- File operations (including synthetic remote copy/move), protocol, sandbox, capability ownership, authentication helper, GVFS mount lifecycle, thumbnails, media, portal protocol, network-open-share, mount-listing, FileManager1, dragwire, key generation, shell loading and LocalSend stub handoffs passed.
- Missing test fixtures were generated as 20 synthetic media files on Btrfs under `/home/flea-sandbox`; no personal files were used for destructive tests.
- Live isolated theme probe: `monospace / 14 / #223344` changed to `DejaVu Sans / 18 / #112233`, accent `#f0a050`, in the same process.
- Installed Wayland window opened Downloads, rendered list/columns/grid, and returned to list. IPC confirmed 14 px JetBrainsMono Nerd Font and nbshell palette. No QML runtime error during these view changes. Column separators were confirmed through IPC and private screenshots.
- Installed binary matches the built release binary; directory MIME default remains `org.kde.dolphin.desktop`.
- `git diff --check` passes. File-budget comparison adds no new over-cap file and grows no existing over-cap file. QML lint has the same actionable/category findings as untouched v0.2.0.

### Existing/environmental failures retained transparently

The full runner is **not green**. Its first run reported 13 failures (including its orphan-suite audit); missing ZIP/media prerequisites and the local empty-config warning were subsequently resolved, with affected suites rerun successfully.

Seven remaining suite failures also reproduce on a separate untouched v0.2.0 checkout in this environment: `charts` (stale generated benchmark pictures), `budget` (many existing oversized files), `empty-state` (script expects the old shell placement), `modes` (stale FLEA_BIN expectation), `archive` (conversion reply assertion, while the JPEG is correctly produced), `uistate` (patched-width assertion), and `uiwriter` (probe/state-file failures). The last has environment-dependent QML imports and is not evidence of a new local writer regression. The runner also flags numerous upstream scripts missing from its suite inventory. QML lint reports pre-existing unused imports, TrashMonitor.enabled override and QVariant type findings. These are recorded, not reclassified as passing.

Logs: `/tmp/flea-pr-rust.log`, `/tmp/flea-pr-final-js.log`, `/tmp/flea-pr-all.log`, `/tmp/flea-pr-final-*.log`, `/tmp/flea-baseline-*.log`, `/tmp/flea-pr-installed.log`. Private screenshots remain under `/tmp` and are not committed.

A host-portal app-ID registration warning remains on launch; the standalone UI works. External share authentication and replacement desktop portal activation remain unvalidated.
