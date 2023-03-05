# Electron diagrams

## TODO
1. Dynamic BoundingBox for connections and Freehand -> BoundingPolygon with points
1. Connection should be made of more points and calculate it's path on every move
1. Change cursor upon entering/leaving MouseInteractible (cursorType or currentTool cursorType)
1. Labels for shapes
1. Text boxes
1. ToolboxUpdate Command
1. Resizing (For the resizable shapes this is as easy as checking which point was dragged and setting the bounding box to that + the opposite corner. In case of adjusting only horizontal/vertical just pick either of the corners on that and the opposite side)
1. Moving/scaling the entire canvas (scrolling/dragging)
1. Keyboard hotkeys (unselecting with escape especially)
1. Exporting to image
1. Serializing and persisting of data to keep on reload (save/loading basically)
1. Snap to lineup with other things while moving

## Known BugO's
1. If the canvas is not the full screen the x and y in the data don't match with the actual cursor position


## To think about
1. Maybe make selecting items require a modifier key. Currently you can't draw within the bounding box of another shape which is annoying
1. Resizing Freehand shapes will be tough because you can't simply increase width/height. Look into some scaling option
1. Added a padded bounding box property to shapes, so we have the true size (used for drawing), and the padded version used for selection based actionpoints


