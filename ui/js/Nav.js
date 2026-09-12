.pragma library
.import "DirSizes.js" as DirSizes
.import "Filter.js" as Filter
.import "Kinds.js" as Kinds
.import "Thumbs.js" as Thumbs

// Where the pane has been and how it gets back, taking ui/Pane.qml's root the way Search.js and
// Ops.js do: the pane holds the state, this holds what the state does.

// A new destination discards the forward branch; refreshing the same directory preserves it.
function open(pane, newPath) {
    // The guard runs before the push for the same reason back()'s runs before the pop: the listing
    // is refused while one is loading, and by then the entry pushed was a duplicate of the directory
    // the pane never left, which the next back press then went "back" to.
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    if (pane.path.length > 0 && newPath !== pane.path) {
        pane.history = pane.history.concat([pane.path])
        pane.forwardHistory = []
    }
    pane.openWithoutHistory(newPath)
}

function back(pane) {
    if (pane.history.length === 0) {
        return
    }
    // The guard runs before the pop and not only inside openWithoutHistory: that call refuses the
    // listing while one is loading, and the entry was already gone by then, so a back taken during
    // a listing threw the place away and went nowhere. parent() below guards the same way.
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    var target = pane.history[pane.history.length - 1]
    pane.forwardHistory = (pane.forwardHistory || []).concat([pane.path])
    // The pop happens before the open, because open() is what would otherwise push it straight back on.
    pane.history = pane.history.slice(0, pane.history.length - 1)
    pane.openWithoutHistory(target)
}

function forward(pane) {
    if (!pane.forwardHistory || pane.forwardHistory.length === 0) return
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    var target = pane.forwardHistory[pane.forwardHistory.length - 1]
    pane.history = pane.history.concat([pane.path])
    pane.forwardHistory = pane.forwardHistory.slice(0, -1)
    pane.openWithoutHistory(target)
}

// The mouse back button follows history, or climbs when no history exists.
function mouseBack(pane) {
    // The pane's own context menu covers the listing and no navigation closes it, so a press behind
    // one left the menu standing over another directory's rows and its next row acted on whichever
    // file had arrived at that index. ui/shell.qml refuses the overlays the window itself holds.
    if (pane.menuVisible) {
        return
    }
    if (pane.history.length > 0) {
        back(pane)
        return
    }
    parent(pane)
}

// Everything a fresh listing has to forget. Called by open, by refresh and by the hidden toggle, so
function openWithoutHistory(pane, newPath, keep) {
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    pane.listInFlight = true
    pane.listedSeen = false
    pane.path = newPath
    if (!keep) {
        pane.total = 0
        pane.held = 0
        pane.rows = []
        pane.kindNames = []
        pane.cursorIndex = 0
        pane.pendingCursor = -1
    }
    pane.thumbState = Thumbs.empty()
    pane.dirSizeState = DirSizes.empty()
    pane.trashArmedAt = 0
    // The row the editor sat on belongs to the listing being replaced, so the rename goes with it:
    // leaving the index set opened an empty editor over whatever file arrived at that row instead.
    pane.renamingIndex = -1
    // A filter narrows the rows already listed, so a new listing is exactly what forgets it.
    Filter.close(pane)
    pane.listingState = "loading"
    pane.stateMessage = ""
    pane.lockedMode = 0
    pane.clearSelection()
    pane.listArea.primeSettle()
    pane.appliedListingPreferences = pane.listingPreferences
    pane.backend.list(newPath, pane.windowSize, pane.showHidden)
    // One statfs per directory, not per row: the bar's right half only changes when the pane moves.
    pane.backend.askFsInfo()
}

// Which row the listing re-reveals after a rename. A rename the pointer committed keeps the row the
// pointer chose instead, because re-selecting the renamed one would undo the click a round trip
// after it landed. One shot: the next rename reveals again.
function renameRefreshTarget(pane, path) {
    if (!pane.renameKeepsPointerRow) {
        return path
    }
    pane.renameKeepsPointerRow = false
    return ""
}

// An operation changed the directory under the listing, so it is read again. Passing the path the
function refresh(pane, selectPath) {
    pane.pendingSelect = selectPath ? selectPath : ""
    pane.pendingCursor = selectPath ? -1 : pane.cursorIndex
    pane.pendingMenu = false
    openWithoutHistory(pane, pane.path, true)
}

// Only the first rows response looks for the target, then it is forgotten either way, so a later
// directory change never re-reveals it. The target is a full path, which is what --select carries.
// row leaves the cursor on the new last row rather than one past the end.
function applyPendingSelect(pane) {
    if (pane.pendingCursor >= 0) {
        var row = Math.min(pane.pendingCursor, Math.max(0, pane.total - 1))
        pane.pendingCursor = -1
        pane.setCursor(row)
    }
    if (pane.pendingSelect.length === 0) {
        return
    }
    var target = pane.pendingSelect
    pane.pendingSelect = ""
    for (var i = 0; i < pane.rows.length; i++) {
        if (pane.join(pane.path, pane.rows[i].n) === target) {
            var index = pane.held + i
            pane.setCursor(index)
            pane.selection.only(index)
            pane.selectionAnchor = index
            pane.selectionVersion++
            if (pane.pendingMenu) {
                pane.pendingMenu = false
                pane.openCursorMenu()
            }
            return
        }
    }
    // The row is not in this listing, so the intent behind it must not fire on some later match.
    pane.pendingMenu = false
}

// Enter on the cursor row: a directory navigates, an archive opens Flea's own view, anything else
// goes to the opener. The in-flight guard is what stops a second Enter queueing a second listing.
function openCursor(pane, opener, extractZip) {
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    if (!Filter.cursorShown(pane)) {
        pane.message("That row is hidden by the filter.", false)
        return
    }
    var row = pane.rowFor(pane.cursorIndex)
    if (!row) {
        pane.message("That row has not loaded yet.", false)
        return
    }
    var path = pane.join(pane.path, row.n)
    if (row.d) {
        pane.open(path)
        return
    }
    if (extractZip && /\.zip$/i.test(row.n)) { pane.openFile(path); return }
    // Handing an archive on opens another file manager, and this is ui/Preview.qml's own classifier.
    if (Kinds.quickLookKind(row.i, path) === Kinds.ARCHIVE) {
        pane.preview.open(path, row.i, row.s)
        return
    }
    opener.open(path)
}

// The path helpers the columns view needs. A root has no parent and no leaf of its own.
function parentOf(path) {
    var cut = String(path).lastIndexOf("/")
    return cut <= 0 ? "/" : String(path).substring(0, cut)
}

function leafOf(path) {
    var text = String(path)
    var cut = text.lastIndexOf("/")
    return cut < 0 || cut === text.length - 1 ? text : text.substring(cut + 1)
}

// Issue 45: the chrome's path as the pieces a click can land on. text is what is drawn, including
// the separator that follows it, so the pieces concatenate to exactly the one line they replace;
// path is the directory the piece names, which is what ui/ChromeBar.qml hands to pathEntered. The
// home test is on whole components, the same one Format.tilde and ui/js/Search.js scopeRoot make,
// because a crumb built on a bare prefix would carry a click on /home/gmx to /home/gm, another directory.
function crumbs(path, home) {
    var text = String(path)
    var base = String(home)
    var inHome = base.length > 0 && (text === base || text.indexOf(base + "/") === 0)
    var display = inHome ? "~" + text.substring(base.length) : text
    var parts = display.split("/")
    var walked = inHome ? base : ""
    // The leading "~" and the leading "/" are each a crumb of their own: one names home and the
    // other names the root, and neither is a component the split hands back.
    var out = [{ text: parts.length > 1 ? parts[0] + "/" : parts[0],
                 path: walked.length > 0 ? walked : "/", last: false }]
    for (var i = 1; i < parts.length; i++) {
        if (parts[i].length === 0) {
            continue
        }
        walked = walked + "/" + parts[i]
        out.push({ text: parts[i] + "/", path: walked, last: false })
    }
    // Only a crumb with another after it carries a separator, so the last one gives its own back.
    var end = out[out.length - 1]
    if (out.length > 1) {
        end.text = end.text.substring(0, end.text.length - 1)
    }
    end.last = true
    return out
}

// Backspace and the chrome's up arrow: the root has no parent, so it is where climbing stops.
// Backspace, h, and the chrome's up arrow. The root has no parent, so it is where climbing stops.
// pendingSelect is the directory we are leaving, so the parent listing puts the cursor on it
// rather than on the first row: h then l is a round trip.
function parent(pane) {
    if (pane.listInFlight) {
        pane.message("A directory is already loading.", false)
        return
    }
    if (pane.path === "/") {
        return
    }
    var here = pane.path
    var cut = here.lastIndexOf("/")
    pane.pendingSelect = here
    pane.open(cut <= 0 ? "/" : here.substring(0, cut))
}
