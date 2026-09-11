# nbshell trial adapter

Flea v0.2.0 is built unchanged on the Rust side. This private trial vendors the
required MIT-licensed Omarchy Commons and UI components from local upstream
checkout 346e69e1cec6c4e8924531874af6ba010a1bc99e. LICENSE.omarchy preserves
its license. Automatic Omarchy/Hyprland theme and font readers are disabled;
ui/Theme.qml reads nbshell config.json and the generated palette.sh as data,
with live file watchers. No Omarchy commands or system portal configuration
are installed by tools/install-nbshell-trial. Dolphin remains the default.

Build: cargo build --release --locked
Install: python3 tools/install-nbshell-trial

Native file operations passed the upstream Rust unit tests. Network account
setup and system file-chooser/default integration are not part of this trial.
