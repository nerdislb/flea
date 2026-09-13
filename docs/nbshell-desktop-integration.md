# Local desktop integration (Umbriel)

`tools/install-nbshell-integration` opts the already-installed nbshell trial into
FileChooser, FileManager1 and archive associations. It deliberately does not call
`flea --default` or `flea --picker`, whose upstream setup also edits Hyprland settings.

It installs unchanged upstream Python helpers under `~/.local/lib/flea`, with wrappers
that invoke the existing local Flea launcher. User D-Bus registrations and `flea.portal`
activate them. The effective Umbriel portal configuration is copied into the user config
directory and only FileChooser is changed to `flea;gtk`. Existing ScreenCast/Screenshot
routing is preserved. GTK_USE_PORTAL=1 is stored in environment.d for future sessions;
Qt platform theme selection is deliberately untouched.

Archive types have a separate hidden desktop entry using `--select`, not a directory
argument. Opening a ZIP therefore reveals it in Flea. Space previews it, and the existing
ZIP double-click action extracts it. Other document/viewer associations are unchanged.

## Apply and verify

Run `tools/install-nbshell-integration`, then restart the user `xdg-desktop-portal`
service. Existing applications can require restarting. Re-run this opt-in installer after
updating Flea if its portal helpers changed; the main trial installer does not copy them.

Zen may use GTK rather than the portal when its file-picker preference is on automatic.
In the active profile, set `widget.use-xdg-desktop-portal.file-picker` to integer `1` in
about:config for the running browser, and add the same user_pref to an existing `user.js`
without replacing its other preferences. The installer intentionally does not guess profiles.

## Verified 2026-09-13

- Public portal OpenFile: real Flea picker, synthetic alpha.txt selected, response 0 and correct URI.
- Public portal SaveFile: response 0 with the requested destination URI (a chooser returns a
  destination; it does not write the document itself). Cancel: response 1.
- Zen file-input on a local HTML page opens Flea with `app=zen`; cancelled without uploading data.
- FileManager1.ShowItems opens the parent and selects the requested synthetic file.
- `xdg-open sample.zip` opens Flea with the archive selected; Space opens its archive preview.
- Public ScreenCast/Screenshot interfaces remain available and Umbriel backend stays active.

## Limits and rollback

Applications with their own non-portal dialogs are outside this routing. GTK preference
changes cannot modify already-running processes; Zen was updated live as well as persistently.
The picker is a separate window under Umbriel; no floating/window-parent rules were added.
`gtk` is a registration-selection fallback, not a promise of retry after a running Flea fails.

Each installation records a backup manifest under `~/.local/state/flea/integration-<time>`.
Restore only the changed files from that manifest, merging later edits rather than overwriting
them blindly, and restart xdg-desktop-portal. The previous data-directory Umbriel config remains
unchanged underneath the explicit user override. Browser settings require their own restoration.
