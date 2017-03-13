console.log('Demo JS confirmed!');

/**
 * This is the Utils library I will build that you can drop into any page you'd like to use
 */
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    scroll_events: [],
    /**
     * Checks to see if the specified dom element is in the view
     * @param {object} el The element to be checked
     * @return {boolean} true if the element is completely in the view and false otherwise
     * @throws "Invalid element:" if the object passed in is not a DOM object
     */      
    isElementInView: function (el) {
	if(!Utils.isDOMElement(el)) throw "Invalid Argument. Expected instanceof DomElement but received: " + el;
	return Utils.intersectsAll(Utils.getWindowBounds(), Utils.getBounds(el), 25);
    },

    /**
     * Returns the bounds of the current view
     * @retun the bounds of the current view
     */
    getWindowBounds: function () {
	var window_bounds = {};
	window_bounds.left = window.pageXOffset;
	window_bounds.right = window_bounds.left + window.innerWidth;
	window_bounds.top = window.pageYOffset;
	window_bounds.bottom = window_bounds.top + window.innerHeight;
	return window_bounds;
    },

    /**
     * Returns the bounds of the specified DOM element
     * @param {HTMLElement} 
     * @return the bounds of the specified DOM Element
     * @throws "Invalid Argument" if the specified element is not a DOM Element
     */
    getBounds: function (el) {
	if(!Utils.isDOMElement(el)) throw "Invalid Argument. Expected instanceof DomElement but received: " + el;
	var bounds = {};
	bounds.left = el.offsetLeft;
	bounds.top = el.offsetTop;
	bounds.right = bounds.left + el.offsetWidth;
	bounds.bottom = bounds.top + el.offsetHeight;
	return bounds;
    },

    /**
     * Checks if the specified value is an HTMLElement
     * @param {var} object to be checked
     * @return true if the object is an HTMLElement and false otherwise
     */
    isDOMElement: function (obj) {
	try {
	    //Using W3 DOM2 (works for FF, Opera and Chrom)
	    return obj instanceof HTMLElement;
	}
	catch(e){
	    //Browsers not supporting W3 DOM2 don't have HTMLElement and
	    //an exception is thrown and we end up here. Testing some
	    //properties that all elements have. (works on IE7)
	    return (typeof obj==="object") &&
		(obj.nodeType===1) && (typeof obj.style === "object") &&
		(typeof obj.ownerDocument ==="object");
	}
    },


    /**
     * Checks to see if a parent bounds contains the child bounds
     * @param {bounds} parent the parent bounds
     * @param {bounds} child the child bounds
     * @param {number} Optional offset value to use on the bottom edge of the parent
     * @return true if the parent completely contains the child and false otherwise.
     */
    intersectsAll: function(parent, child, offset){
	if(typeof offset === 'undefined') offset = 0;
	return parent.left <= child.left
	    && parent.top <= child.top
	    && parent.bottom + offset >= child.bottom
	    && parent.right >= child.right;
	
	    
    },

    /**
     * Animates the specified circle element
     * @param circle the svg-stroke that will be animated
     * @param percentage the percentage of to fill
     * @return void
     */
    animateCircle: function(circle, percentage){
	var p = Math.max(0, Math.min(1, percentage));
	var r = 540 * (1 - p);
	circle.setAttribute('stroke-dashoffset', r);
    },

    /**
     * Adds an event to fire when the screen scrolls
     */
    registerScrollEvent: function(f) {
	Utils.scroll_events.push(f);
    },

    /**
     * Runs all of the registered scroll events
     */
    runScrollEvents: function(e) {
	Utils.scroll_events.forEach(function(f) {
	    f(e);
	});
    },

};


function init() {

    // Build up a list of the circles we want to animate specifying each id with the percentage
    // we want
    var circles = [];
    circles.push({ parent_id: "svg_element1", circle_id: "circle1", percent: 0.65 });
    circles.push({ parent_id: "svg_element2", circle_id: "circle2", percent: 0.45 });
    circles.push({ parent_id: "svg_element3", circle_id: "circle3", percent: 0.87 });
    circles.push({ parent_id: "svg_element4", circle_id: "circle4", percent: 0.65 });
    circles.push({ parent_id: "svg_element5", circle_id: "circle5", percent: 0.45 });
    circles.push({ parent_id: "svg_element6", circle_id: "circle6", percent: 0.87 });

    // for each circle, register an event that it should animate when it comes on the screen
    circles.forEach(function (circle) {
	Utils.registerScrollEvent(function(e) {
	    var parent = document.getElementById(circle.parent_id);
	    if(!Utils.isElementInView(parent)) return;
	    var svg = document.getElementById(circle.circle_id);
	    Utils.animateCircle(svg, circle.percent);
	});
    });
			      
	
    console.log("Loaded!");
    
}



// This is how you initialize the Utils library
var Utils = new Utils();

// When the page is completely loaded, run the init function. This ensure that the entire page has loaded and not just part of it.

window.onload = function () { init() }

// When the page is scrolled, run all registered scroll events
window.onscroll = function (e) { Utils.runScrollEvents(e) }

