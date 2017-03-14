console.log('Arrived');
console.log('Demo JS confirmed!');

/**
 * This is the Utils library I will build that you can drop into any page you'd like to use
 */
function Utils() {

}

Utils.prototype = {
    constructor: Utils,
    scroll_events: [],
    parallax_elements: [],
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

    /**
     * Initializes all Digits on the page.
     * The following example creates an odometer on a static page
     * which will scroll to the number 17.
     * <div class="digit-container">
     *  <div class="digit" value="1"></div>
     *  <div class="digit" value="7"></div>
     * </div>
     */
    initDigits: function() {
	// Finds each element with the class 'digit'
	var digits = document.getElementsByClassName('digit');

	for(var i = 0; i < digits.length; i++){
	    var digit = digits[i];
	    var scroll = parseInt(digit.getAttribute('value'));
	    digit.innerHTML = "0 1 2 3 4 5 6 7 8 9 0";

	    // This function is necessary to curry the digit / scroll values
	    // and pass them to the function when it is fired. The term for this
	    // is a closuer (it is powerful and worth reading about also, it is
	    // where the programming language gets its name).
	    var f = function (digit, scroll) {
		Utils.registerScrollEvent(function (e) {
		    // Get the parent element and check if it is in view
		    var parent = digit.parentElement;
		    if(!Utils.isElementInView(parent)) return;

		    // If it is, translate to the appropriate digit
		    var value = 'translateY(-' + scroll + 'em)';

		    // Necessary to have both for cross platform
		    digit.style.transform = value;
		    digit.style.webkitTransform = value;

		});
	    };

	    // Finally, create the closure which registers the event.
	    f(digit, scroll);
	}
    },

    /**
     * Given an DOM element id and the number of pixels to scrool
     * registers the element to have parallax scrolling.
     * @param {string} elem_id The id of the element to use parallax scrolling on
     * @param {number} The total number of pixels to scroll
     */
    registerParallax: function (elem_id, amount) {
	Utils.parallax_elements.push( { elem_id: elem_id, amount: amount } )
    },

    /**
     * Runs the parallax event for each element registerred using registerParallax
     */
    runParallaxEvents: function (e) {
	var window_bounds = Utils.getWindowBounds();
	var window_height = window_bounds.bottom - window_bounds.top;

	// For each registered element
	Utils.parallax_elements.forEach(function (par) {
	    // Find the element on the dom
	    var elem = document.getElementById(par.elem_id);
	    var bounds = Utils.getBounds(elem);
	    var height = bounds.bottom - bounds.top;
	    // Calculate how far it is currently scrolled on the screen
	    var ratio = (window_bounds.bottom + height - bounds.bottom)/(window_height + height);
	    // Keep the ratio in bounds
	    ratio = Math.max(0, Math.min(1, ratio));
	    // Calculate how much to move the image based on the ratio
	    var position = -(par.amount)*ratio;
	    // Apply the movement
	    elem.style.backgroundPositionY = '' + position + 'px';
	});
    },

    /**
     * Registers a selection div to be used for showing / hiding hidden data.
     * @param {String} selectDiv_id the id of the div to register
     */
    registerSelect: function(selectDiv_id){

	var select = document.getElementById(selectDiv_id);
	// Create a closure;
	var f = function(select) {

	    var selected = select.value;
	    select.onchange = function (e) {

		// Hide the old item
		var elem = document.getElementById(selected);
		Utils.addClass(elem, "data-item-hidden");

		selected = select.value;
		elem = document.getElementById(selected);

		// Clear the contents of the new item to be shown
		var temp = elem.innerHTML;
		elem.innerHTML = '';
		// Set it to be visible and redraw its contents
		Utils.removeClass(elem, "data-item-hidden");
		elem.innerHTML = temp;

	    }
	};
	// Call the closure
	f(select);

    },

    /**
     * Given an element and a class name, checks to see if the element contains the class name
     * @param {HTMLElement} The element to check
     * @param {String} The class name to look up
     * @return true if the element contains the class and false otherwise
     */
    hasClass: function (ele,cls) {
	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    },

    /**
     * Given an alement and a class name, add the class to the element if it does not already
     * have the specified class.
     * @param {HTMLElement} The element to modify
     * @param {String} The class name to add
     */
    addClass: function (ele,cls) {
	if (!Utils.hasClass(ele,cls)) ele.className += " "+cls;
    },

    /**
     * Given an element and a class name, remove the class from the element if it contains it
     * @param {HTMLElement} ele The element to modify
     * @param {String} cls The class name to remove
     */
    removeClass: function (ele,cls) {
	if (Utils.hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
	}
    },


};


function init() {

    // Build up a list of the circles we want to animate specifying each id with the percentage
    // we want
    var circles = [];
    circles.push({ parent_id: "svg_element1", circle_id: "circle1", percent: 0.71 });
    circles.push({ parent_id: "svg_element2", circle_id: "circle2", percent: 0.52 });
    circles.push({ parent_id: "svg_element3", circle_id: "circle3", percent: 0.51 });

    // for each circle, register an event that it should animate when it comes on the screen
    circles.forEach(function (circle) {
	Utils.registerScrollEvent(function(e) {
	    var parent = document.getElementById(circle.parent_id);
	    if(!Utils.isElementInView(parent)) return;
	    var svg = document.getElementById(circle.circle_id);
	    Utils.animateCircle(svg, circle.percent);
	});
    });

    // Initialize all of the digits on the page
    Utils.initDigits();

    // Register Parallax Divs
    Utils.registerParallax("parallax__bg", 300);
    Utils.registerParallax("blue-background", 600);

    // Register your Data Divs
    Utils.registerSelect('data-selector');
    Utils.registerSelect('data-selector-2');

    // Ensures that events that are visible on page load run.
    Utils.runScrollEvents(null);
    Utils.runParallaxEvents(null);
    console.log("Loaded!");

}



// This is how you initialize the Utils library
var Utils = new Utils();

// When the page is completely loaded, run the init function. This ensure that the entire page has loaded and not just part of it.

window.onload = function () { init() }

// When the page is scrolled, run all registered scroll events
window.onscroll = function (e) { Utils.runScrollEvents(e); Utils.runParallaxEvents(e) }
