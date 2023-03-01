# Electron diagrams

## TODO
1. Change cursor upon entering/leaving MouseInteractible (cursorType or currentTool cursorType)
1. Resizable shapes (activity boxes) (These should just have an updating boundingbox and be drawn based on bounding box)
1. Connections that spawn from ActionPoint items on activity boxes
1. Labels for shapes
1. Text boxes
1. ToolboxUpdate Command
1. Resizing (For the resizable shapes this is as easy as checking which point was dragged and setting the bounding box to that + the opposite corner. In case of adjusting only horizontal/vertical just pick either of the corners on that and the opposite side)
1. Moving/scaling the entire canvas (scrolling/dragging)
1. Keyboard hotkeys (unselecting with escape especially)
1. Exporting to image
1. Serializing and persisting of data to keep on reload (save/loading basically)

## Known BugO's
1. When moving shapes quickly the boundingbox updates properly, but the connected ActionPoint lags behind


## To think about
1. Maybe make selecting items require a modifier key. Currently you can't draw within the bounding box of another shape which is annoying
1. Resizing Freehand shapes will be tough because you can't simply increase width/height. Look into some scaling option
1. Resizing a 

