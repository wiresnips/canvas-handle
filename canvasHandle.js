
// all wrapped up to minimize namespace pollution
var CanvasHandle = (function () {

	//////////////////////////////////////
	// simple utility functions
	//////////////////////////////////////

	function bindEventListener (target, event, handler) {
		if (target.addEventListener)
			target.addEventListener(event, handler, false);
		else if (target.attachEvent)
			target.attachEvent('on'+event, handler);
	}

	function unbindEventListener (target, event, handler) {
		if (target.removeEventListener)
			target.removeEventListener(event, handler, false);
		else if (target.detachEvent)
			target.detachEvent('on'+event, handler);
	}

	function relMouseCoords (event) {
		var rect = this.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		return [ x, y ];
	}
	HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

	function sqrDistance2 (a, b) {
		var xd = a[0] - b[0];
		var yd = a[1] - b[1];
		return (xd * xd) + (yd * yd);
	}

	function __add2 (a, b) {
		a[0] += b[0];
		a[1] += b[1];
		return a;
	}

	function __sub2 (a, b) {
		a[0] -= b[0];
		a[1] -= b[1];
		return a;
	}


	////////////////////////////////////////////////
	// here's the part that we actually care about
	////////////////////////////////////////////////


	function CanvasHandle (canvas, pos, grabRadius) {
		var self = this;
		var sqrGrabRadius = grabRadius * grabRadius; // faster math if it's squared beforehand

		self.onMouseDown = null;

		self.onGrab = null;
		self.onMoveDelta = null;
		self.onMove = null;
		self.onDrop = null;

		self.disabled = false;

		function mouseDown (evt) {
			var mousedownPos = canvas.relMouseCoords(evt);

			if (sqrDistance2(pos, mousedownPos) > sqrGrabRadius)
				return;

			// handle the mouse-down
			if (!self.disabled && self.onMouseDown != null && !self.isLocked())
				self.onMouseDown(mousedownPos);

			// handle the drag
			startDrag();
		}

		function startDrag () {
			if (self.disabled || self.isLocked())
				return;

			self.lock();

			if (self.onGrab != null)
				self.onGrab(pos);

			bindEventListener(window, "mousemove", drag);
			bindEventListener(window, "mouseup", killDrag);
		}

		function drag (evt) {
			if (self.disabled)
				return killDrag(null);

			var movement = __sub2(canvas.relMouseCoords(evt), pos);
			__add2(pos, movement);

			if (self.onMoveDelta != null)
				self.onMoveDelta(movement);

			if (self.onMove != null)
				self.onMove(pos)
		}

		function killDrag (evt) {
			if (self.onDrop != null)
				self.onDrop(pos);

			unbindEventListener(window, "mousemove", drag);
			unbindEventListener(window, "mouseup", killDrag);
			self.unlock();
		}

		bindEventListener(canvas, "mousedown", mouseDown);
	}

	// this is a flag lock: only allow one handle to be grabbed at a time
	(function () {
		var locked = false;
		CanvasHandle.prototype.isLocked = function () { return locked; }
		CanvasHandle.prototype.lock = function () { locked = true; }
		CanvasHandle.prototype.unlock = function () { locked = false; }
	})();

	return CanvasHandle;
})();


