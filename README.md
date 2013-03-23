#CanvasHandle

A nice easy grab-drag-drop handle for Canvas.
For example usage, see [here](http://http://novorobo.com/programming/javascript/utilities/13-03-23_canvas-handle.html).

##Constructor Params
###canvas
- The canvas to which the handle belongs.

###pos
- An array, [x,y], of the initial position of the handle on the canvas.

###grabRadius
- The radius within which the handle will be grabbed by mousedown events.

##Properties
###pos
- The current position of the handle.

###deltaPos
- The handle's most recent displacement.

###mouseDownPos
- The location of the most recent mouse event.

##Method Hooks
###grab
- Fires when the handle registers a mousedown event on the canvas within grabRadius of itself.

###move
- Fires on mousemove if the handle is being held.

###drop
- Fires when the handle is dropped.
