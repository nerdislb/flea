# nbshell trial integration: Flea 0.2.1

The integration branch is `nbshell-021`, based on the installed trial snapshot
`deba77c` and official `v0.2.1` (`c6a0149` peeled commit). The original
`nbshell-trial` working tree is unchanged, including its uncommitted work.

## Reconciliation

- Preserve the nbshell palette/font adapter, compatibility modules and private installer.
- Preserve ZIP double-click `extract-here`, while accepting upstream single-click search reveal
  and middle-column directory navigation. Enter retains archive preview behavior.
- Preserve the cancellable, bounded directory-size worker. Include its barrier-based protocol
  regressions from our isolated upstream PR #118.
- Combine upstream actual-root / device-mapper / multiple-mountpoint device parsing with the
  existing trial USB-bridge inheritance and unmounted internal-partition visibility.
- Preserve search-exit tab refresh and thumbnail/cache resets alongside new tab destination settings.
- Use upstream Anchor extraction while retaining the trial's recorded deletion cursor.
- Keep automatic 30-day trash deletion off. No portal/default-handler takeover.

## Test harness adjustments

Device fixtures now use the actual MOUNTPOINTS schema and do not invent a root disk when no
root mount exists. The ZIP search test follows upstream first-click reveal. The acceptance
menu inventory includes our existing LocalSend entry (31 rather than 30). The settings-writer
fixture imports pinned `compat/Commons` rather than assuming global Omarchy files.
The file-budget ledger explicitly accounts for pre-existing trial additions; it is not an
upstream performance or size claim.

## Validation

- Rust debug: final 616 passed; first run had one pre-existing recovery-test intermittent failure,
  isolated retry and full final run passed. Release: 616 passed. Four existing compiler warnings.
- JavaScript: 3218 + 4 + 9 checks passed.
- ZIP release protocol: direct extraction, existing-content refusal, all-entry preflight,
  traversal refusal, empty and damaged archives passed.
- Pinned size-worker barrier: cancel, list, sort and quit remain responsive without stale replies.
- Headless functional suites passed, including archive, operations, sandbox, capabilities,
  GVFS/auth, protocol, portal, thumbnails/media, network, mounts, UI state/writer,
  FileManager1, dragwire, shellload, LocalSend and acceptance matrix.
- The initial run-all was started while merge tests were being repaired; its stale JS failure was
  resolved and the suite rerun. The runner was stopped at the stale Omarchy-only uiwriter fixture;
  repaired uiwriter and all remaining suites were run separately. Suite inventory is complete.
- Chart reproducibility still fails on the pre-existing generated benchmark PNG; no full runner
  green claim. QML lint categories match the installed-source baseline exactly: 2 unused imports,
  1 property override, 4 incompatible types. No new category/count.
- Native Umbriel window: ready state, palette and JetBrainsMono Nerd Font 14 verified; list,
  columns, grid, settings Opening section, Escape focus and new/close tab checked. Existing host
  portal app-ID warning remains. External shares and physical-pointer ZIP double-click were not
  newly tested; dispatch tests and real backend extraction cover the latter's software path.

Independent review and deployment results are recorded in the canonical Second Brain.

## Independent review

Claude Fable inspected the merge and confirmed preservation of all six focus areas. Its only
blocker was the acceptance-matrix LocalSend count, already corrected to 31 and tested by the
implementer during the review. The device-parser stale comment was corrected too. The trial
file-budget ledger remains local and is not proposed upstream. No PR changes were published.
