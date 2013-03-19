
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

	////////////////////////////////////////////////
	// here's the part that we actually care about
	////////////////////////////////////////////////


	function CanvasHandle (canvas, pos, grabRadius) {
		var sqrGrabRadius = grabRadius * grabRadius; // faster math if it's squared beforehand
		
		// generally useful stuff
		this.pos = pos;
		this.deltaPos = [0,0];
		this.mouseDownPos = null;

		// hook functionality in here
		this.grab = null;
		this.move = null;
		this.drop = null;

		// toggle me on/off
		this.disabled = false;


		// keep these private so they don't get accidentally overwritten
		// and so I remember who I am when a listener on something else calls me
		var self = this;

		function startDrag (event) {
			if (self.disabled || self.isLocked())
				return;

			var mouseDownPos = canvas.relMouseCoords(event);
			if (sqrDistance2(self.pos, mouseDownPos) > sqrGrabRadius)
				return;

			self.lock();
			self.mouseDownPos = mouseDownPos;

			if (self.grab != null)
				self.grab();

			bindEventListener(window, "mousemove", drag);
			bindEventListener(window, "mouseup", killDrag);		
		}

		function drag (event) {
			if (self.disabled)
				return killDrag(null);

		self.mouseDownPos = canvas.relMouseCoords(event);
		self.deltaPos = [ self.mouseDownPos[0] - self.pos[0], self.mouseDownPos[1] - self.pos[1] ];
		self.pos = newPos;

			if (self.move != null)
				self.move();
		}

		function killDrag () {
			if (self.drop != null)
				self.drop();

			unbindEventListener(window, "mousemove", drag);
			unbindEventListener(window, "mouseup", killDrag);
			self.unlock();
		}

		bindEventListener(canvas, "mousedown", startDrag);
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


