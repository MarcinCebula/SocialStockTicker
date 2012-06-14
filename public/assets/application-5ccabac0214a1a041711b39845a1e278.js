/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, crossDomain, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        crossDomain = element.data('cross-domain') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
/* ==========================================================
 * bootstrap-alert.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      clearTimeout(this.timeout)
      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ===================================================
 * bootstrap-transition.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
(function() {



}).call(this);
// ==========================================================================
// Project:   Ember - JavaScript Application Framework
// Copyright: Â©2011-2012 Tilde Inc. and contributors
//            Portions Â©2006-2011 Strobe Inc.
//            Portions Â©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


(function(){var a={};window.Handlebars=a,a.VERSION="1.0.beta.6",a.helpers={},a.partials={},a.registerHelper=function(a,b,c){c&&(b.not=c),this.helpers[a]=b},a.registerPartial=function(a,b){this.partials[a]=b},a.registerHelper("helperMissing",function(a){if(arguments.length===2)return undefined;throw new Error("Could not find property '"+a+"'")});var b=Object.prototype.toString,c="[object Function]";a.registerHelper("blockHelperMissing",function(a,d){var e=d.inverse||function(){},f=d.fn,g="",h=b.call(a);h===c&&(a=a.call(this));if(a===!0)return f(this);if(a===!1||a==null)return e(this);if(h==="[object Array]"){if(a.length>0)for(var i=0,j=a.length;i<j;i++)g+=f(a[i]);else g=e(this);return g}return f(a)}),a.registerHelper("each",function(a,b){var c=b.fn,d=b.inverse,e="";if(a&&a.length>0)for(var f=0,g=a.length;f<g;f++)e+=c(a[f]);else e=d(this);return e}),a.registerHelper("if",function(d,e){var f=b.call(d);return f===c&&(d=d.call(this)),!d||a.Utils.isEmpty(d)?e.inverse(this):e.fn(this)}),a.registerHelper("unless",function(b,c){var d=c.fn,e=c.inverse;return c.fn=e,c.inverse=d,a.helpers["if"].call(this,b,c)}),a.registerHelper("with",function(a,b){return b.fn(a)}),a.registerHelper("log",function(b){a.log(b)});var d=function(){var a={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,statements:6,simpleInverse:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,OPEN_PARTIAL:24,params:25,hash:26,param:27,STRING:28,INTEGER:29,BOOLEAN:30,hashSegments:31,hashSegment:32,ID:33,EQUALS:34,pathSegments:35,SEP:36,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},productions_:[0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],performAction:function(b,c,d,e,f,g,h){var i=g.length-1;switch(f){case 1:return g[i-1];case 2:this.$=new e.ProgramNode(g[i-2],g[i]);break;case 3:this.$=new e.ProgramNode(g[i]);break;case 4:this.$=new e.ProgramNode([]);break;case 5:this.$=[g[i]];break;case 6:g[i-1].push(g[i]),this.$=g[i-1];break;case 7:this.$=new e.InverseNode(g[i-2],g[i-1],g[i]);break;case 8:this.$=new e.BlockNode(g[i-2],g[i-1],g[i]);break;case 9:this.$=g[i];break;case 10:this.$=g[i];break;case 11:this.$=new e.ContentNode(g[i]);break;case 12:this.$=new e.CommentNode(g[i]);break;case 13:this.$=new e.MustacheNode(g[i-1][0],g[i-1][1]);break;case 14:this.$=new e.MustacheNode(g[i-1][0],g[i-1][1]);break;case 15:this.$=g[i-1];break;case 16:this.$=new e.MustacheNode(g[i-1][0],g[i-1][1]);break;case 17:this.$=new e.MustacheNode(g[i-1][0],g[i-1][1],!0);break;case 18:this.$=new e.PartialNode(g[i-1]);break;case 19:this.$=new e.PartialNode(g[i-2],g[i-1]);break;case 20:break;case 21:this.$=[[g[i-2]].concat(g[i-1]),g[i]];break;case 22:this.$=[[g[i-1]].concat(g[i]),null];break;case 23:this.$=[[g[i-1]],g[i]];break;case 24:this.$=[[g[i]],null];break;case 25:g[i-1].push(g[i]),this.$=g[i-1];break;case 26:this.$=[g[i]];break;case 27:this.$=g[i];break;case 28:this.$=new e.StringNode(g[i]);break;case 29:this.$=new e.IntegerNode(g[i]);break;case 30:this.$=new e.BooleanNode(g[i]);break;case 31:this.$=new e.HashNode(g[i]);break;case 32:g[i-1].push(g[i]),this.$=g[i-1];break;case 33:this.$=[g[i]];break;case 34:this.$=[g[i-2],g[i]];break;case 35:this.$=[g[i-2],new e.StringNode(g[i])];break;case 36:this.$=[g[i-2],new e.IntegerNode(g[i])];break;case 37:this.$=[g[i-2],new e.BooleanNode(g[i])];break;case 38:this.$=new e.IdNode(g[i]);break;case 39:g[i-2].push(g[i]),this.$=g[i-2];break;case 40:this.$=[g[i]]}},table:[{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],defaultActions:{16:[2,1],37:[2,23],53:[2,21]},parseError:function(b,c){throw new Error(b)},parse:function(b){function o(a){d.length=d.length-2*a,e.length=e.length-a,f.length=f.length-a}function p(){var a;return a=c.lexer.lex()||1,typeof a!="number"&&(a=c.symbols_[a]||a),a}var c=this,d=[0],e=[null],f=[],g=this.table,h="",i=0,j=0,k=0,l=2,m=1;this.lexer.setInput(b),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,typeof this.lexer.yylloc=="undefined"&&(this.lexer.yylloc={});var n=this.lexer.yylloc;f.push(n),typeof this.yy.parseError=="function"&&(this.parseError=this.yy.parseError);var q,r,s,t,u,v,w={},x,y,z,A;for(;;){s=d[d.length-1],this.defaultActions[s]?t=this.defaultActions[s]:(q==null&&(q=p()),t=g[s]&&g[s][q]);if(typeof t=="undefined"||!t.length||!t[0])if(!k){A=[];for(x in g[s])this.terminals_[x]&&x>2&&A.push("'"+this.terminals_[x]+"'");var B="";this.lexer.showPosition?B="Parse error on line "+(i+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+A.join(", ")+", got '"+this.terminals_[q]+"'":B="Parse error on line "+(i+1)+": Unexpected "+(q==1?"end of input":"'"+(this.terminals_[q]||q)+"'"),this.parseError(B,{text:this.lexer.match,token:this.terminals_[q]||q,line:this.lexer.yylineno,loc:n,expected:A})}if(t[0]instanceof Array&&t.length>1)throw new Error("Parse Error: multiple actions possible at state: "+s+", token: "+q);switch(t[0]){case 1:d.push(q),e.push(this.lexer.yytext),f.push(this.lexer.yylloc),d.push(t[1]),q=null,r?(q=r,r=null):(j=this.lexer.yyleng,h=this.lexer.yytext,i=this.lexer.yylineno,n=this.lexer.yylloc,k>0&&k--);break;case 2:y=this.productions_[t[1]][1],w.$=e[e.length-y],w._$={first_line:f[f.length-(y||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(y||1)].first_column,last_column:f[f.length-1].last_column},v=this.performAction.call(w,h,j,i,this.yy,t[1],e,f);if(typeof v!="undefined")return v;y&&(d=d.slice(0,-1*y*2),e=e.slice(0,-1*y),f=f.slice(0,-1*y)),d.push(this.productions_[t[1]][0]),e.push(w.$),f.push(w._$),z=g[d[d.length-2]][d[d.length-1]],d.push(z);break;case 3:return!0}}return!0}},b=function(){var a={EOF:1,parseError:function(b,c){if(!this.yy.parseError)throw new Error(b);this.yy.parseError(b,c)},setInput:function(a){return this._input=a,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this},input:function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.match+=a,this.matched+=a;var b=a.match(/\n/);return b&&this.yylineno++,this._input=this._input.slice(1),a},unput:function(a){return this._input=a+this._input,this},more:function(){return this._more=!0,this},pastInput:function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var a=this.pastInput(),b=(new Array(a.length+1)).join("-");return a+this.upcomingInput()+"\n"+b+"^"},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,b,c,d;this._more||(this.yytext="",this.match="");var e=this._currentRules();for(var f=0;f<e.length;f++){b=this._input.match(this.rules[e[f]]);if(b){d=b[0].match(/\n.*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-1:this.yylloc.last_column+b[0].length},this.yytext+=b[0],this.match+=b[0],this.matches=b,this.yyleng=this.yytext.length,this._more=!1,this._input=this._input.slice(b[0].length),this.matched+=b[0],a=this.performAction.call(this,this.yy,this,e[f],this.conditionStack[this.conditionStack.length-1]);if(a)return a;return}}if(this._input==="")return this.EOF;this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var b=this.next();return typeof b!="undefined"?b:this.lex()},begin:function(b){this.conditionStack.push(b)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(b){this.begin(b)}};return a.performAction=function(b,c,d,e){var f=e;switch(d){case 0:c.yytext.slice(-1)!=="\\"&&this.begin("mu"),c.yytext.slice(-1)==="\\"&&(c.yytext=c.yytext.substr(0,c.yyleng-1),this.begin("emu"));if(c.yytext)return 14;break;case 1:return 14;case 2:return this.popState(),14;case 3:return 24;case 4:return 16;case 5:return 20;case 6:return 19;case 7:return 19;case 8:return 23;case 9:return 23;case 10:return c.yytext=c.yytext.substr(3,c.yyleng-5),this.popState(),15;case 11:return 22;case 12:return 34;case 13:return 33;case 14:return 33;case 15:return 36;case 16:break;case 17:return this.popState(),18;case 18:return this.popState(),18;case 19:return c.yytext=c.yytext.substr(1,c.yyleng-2).replace(/\\"/g,'"'),28;case 20:return 30;case 21:return 30;case 22:return 29;case 23:return 33;case 24:return c.yytext=c.yytext.substr(1,c.yyleng-2),33;case 25:return"INVALID";case 26:return 5}},a.rules=[/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/],a.conditions={mu:{rules:[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],inclusive:!1},emu:{rules:[2],inclusive:!1},INITIAL:{rules:[0,1,26],inclusive:!0}},a}();return a.lexer=b,a}();typeof require!="undefined"&&typeof exports!="undefined"&&(exports.parser=d,exports.parse=function(){return d.parse.apply(d,arguments)},exports.main=function(b){if(!b[1])throw new Error("Usage: "+b[0]+" FILE");if(typeof process!="undefined")var c=require("fs").readFileSync(require("path").join(process.cwd(),b[1]),"utf8");else var d=require("file").path(require("file").cwd()),c=d.join(b[1]).read({charset:"utf-8"});return exports.parser.parse(c)},typeof module!="undefined"&&require.main===module&&exports.main(typeof process!="undefined"?process.argv.slice(1):require("system").args)),a.Parser=d,a.parse=function(b){return a.Parser.yy=a.AST,a.Parser.parse(b)},a.print=function(b){return(new a.PrintVisitor).accept(b)},a.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,log:function(a,b){}},a.log=function(b,c){a.logger.log(b,c)},function(){a.AST={},a.AST.ProgramNode=function(b,c){this.type="program",this.statements=b,c&&(this.inverse=new a.AST.ProgramNode(c))},a.AST.MustacheNode=function(a,b,c){this.type="mustache",this.id=a[0],this.params=a.slice(1),this.hash=b,this.escaped=!c},a.AST.PartialNode=function(a,b){this.type="partial",this.id=a,this.context=b};var b=function(b,c){if(b.original!==c.original)throw new a.Exception(b.original+" doesn't match "+c.original)};a.AST.BlockNode=function(a,c,d){b(a.id,d),this.type="block",this.mustache=a,this.program=c},a.AST.InverseNode=function(a,c,d){b(a.id,d),this.type="inverse",this.mustache=a,this.program=c},a.AST.ContentNode=function(a){this.type="content",this.string=a},a.AST.HashNode=function(a){this.type="hash",this.pairs=a},a.AST.IdNode=function(a){this.type="ID",this.original=a.join(".");var b=[],c=0;for(var d=0,e=a.length;d<e;d++){var f=a[d];f===".."?c++:f==="."||f==="this"?this.isScoped=!0:b.push(f)}this.parts=b,this.string=b.join("."),this.depth=c,this.isSimple=b.length===1&&c===0},a.AST.StringNode=function(a){this.type="STRING",this.string=a},a.AST.IntegerNode=function(a){this.type="INTEGER",this.integer=a},a.AST.BooleanNode=function(a){this.type="BOOLEAN",this.bool=a},a.AST.CommentNode=function(a){this.type="comment",this.comment=a}}(),a.Exception=function(a){var b=Error.prototype.constructor.apply(this,arguments);for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c]);this.message=b.message},a.Exception.prototype=new Error,a.SafeString=function(a){this.string=a},a.SafeString.prototype.toString=function(){return this.string.toString()},function(){var b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[<>"'`]/g,d=/[&<>"'`]/,e=function(a){return b[a]||"&amp;"};a.Utils={escapeExpression:function(b){return b instanceof a.SafeString?b.toString():b==null||b===!1?"":d.test(b)?b.replace(c,e):b},isEmpty:function(a){return typeof a=="undefined"?!0:a===null?!0:a===!1?!0:Object.prototype.toString.call(a)==="[object Array]"&&a.length===0?!0:!1}}}(),a.Compiler=function(){},a.JavaScriptCompiler=function(){},function(b,c){b.OPCODE_MAP={appendContent:1,getContext:2,lookupWithHelpers:3,lookup:4,append:5,invokeMustache:6,appendEscaped:7,pushString:8,truthyOrFallback:9,functionOrFallback:10,invokeProgram:11,invokePartial:12,push:13,assignToHash:15,pushStringParam:16},b.MULTI_PARAM_OPCODES={appendContent:1,getContext:1,lookupWithHelpers:2,lookup:1,invokeMustache:3,pushString:1,truthyOrFallback:1,functionOrFallback:1,invokeProgram:3,invokePartial:1,push:1,assignToHash:1,pushStringParam:1},b.DISASSEMBLE_MAP={};for(var d in b.OPCODE_MAP){var e=b.OPCODE_MAP[d];b.DISASSEMBLE_MAP[e]=d}b.multiParamSize=function(a){return b.MULTI_PARAM_OPCODES[b.DISASSEMBLE_MAP[a]]},b.prototype={compiler:b,disassemble:function(){var a=this.opcodes,c,d,e=[],f,g,h;for(var i=0,j=a.length;i<j;i++){c=a[i];if(c==="DECLARE")g=a[++i],h=a[++i],e.push("DECLARE "+g+" = "+h);else{f=b.DISASSEMBLE_MAP[c];var k=b.multiParamSize(c),l=[];for(var m=0;m<k;m++)d=a[++i],typeof d=="string"&&(d='"'+d.replace("\n","\\n")+'"'),l.push(d);f=f+" "+l.join(" "),e.push(f)}}return e.join("\n")},guid:0,compile:function(a,b){this.children=[],this.depths={list:[]},this.options=b;var c=this.options.knownHelpers;this.options.knownHelpers={helperMissing:!0,blockHelperMissing:!0,each:!0,"if":!0,unless:!0,"with":!0,log:!0};if(c)for(var d in c)this.options.knownHelpers[d]=c[d];return this.program(a)},accept:function(a){return this[a.type](a)},program:function(a){var b=a.statements,c;this.opcodes=[];for(var d=0,e=b.length;d<e;d++)c=b[d],this[c.type](c);return this.isSimple=e===1,this.depths.list=this.depths.list.sort(function(a,b){return a-b}),this},compileProgram:function(a){var b=(new this.compiler).compile(a,this.options),c=this.guid++;this.usePartial=this.usePartial||b.usePartial,this.children[c]=b;for(var d=0,e=b.depths.list.length;d<e;d++){depth=b.depths.list[d];if(depth<2)continue;this.addDepth(depth-1)}return c},block:function(a){var b=a.mustache,c,d,e,f,g=this.setupStackForMustache(b),h=this.compileProgram(a.program);a.program.inverse&&(f=this.compileProgram(a.program.inverse),this.declare("inverse",f)),this.opcode("invokeProgram",h,g.length,!!b.hash),this.declare("inverse",null),this.opcode("append")},inverse:function(a){var b=this.setupStackForMustache(a.mustache),c=this.compileProgram(a.program);this.declare("inverse",c),this.opcode("invokeProgram",null,b.length,!!a.mustache.hash),this.declare("inverse",null),this.opcode("append")},hash:function(a){var b=a.pairs,c,d;this.opcode("push","{}");for(var e=0,f=b.length;e<f;e++)c=b[e],d=c[1],this.accept(d),this.opcode("assignToHash",c[0])},partial:function(a){var b=a.id;this.usePartial=!0,a.context?this.ID(a.context):this.opcode("push","depth0"),this.opcode("invokePartial",b.original),this.opcode("append")},content:function(a){this.opcode("appendContent",a.string)},mustache:function(a){var b=this.setupStackForMustache(a);this.opcode("invokeMustache",b.length,a.id.original,!!a.hash),a.escaped&&!this.options.noEscape?this.opcode("appendEscaped"):this.opcode("append")},ID:function(a){this.addDepth(a.depth),this.opcode("getContext",a.depth),this.opcode("lookupWithHelpers",a.parts[0]||null,a.isScoped||!1);for(var b=1,c=a.parts.length;b<c;b++)this.opcode("lookup",a.parts[b])},STRING:function(a){this.opcode("pushString",a.string)},INTEGER:function(a){this.opcode("push",a.integer)},BOOLEAN:function(a){this.opcode("push",a.bool)},comment:function(){},pushParams:function(a){var b=a.length,c;while(b--)c=a[b],this.options.stringParams?(c.depth&&this.addDepth(c.depth),this.opcode("getContext",c.depth||0),this.opcode("pushStringParam",c.string)):this[c.type](c)},opcode:function(a,c,d,e){this.opcodes.push(b.OPCODE_MAP[a]),c!==undefined&&this.opcodes.push(c),d!==undefined&&this.opcodes.push(d),e!==undefined&&this.opcodes.push(e)},declare:function(a,b){this.opcodes.push("DECLARE"),this.opcodes.push(a),this.opcodes.push(b)},addDepth:function(a){if(a===0)return;this.depths[a]||(this.depths[a]=!0,this.depths.list.push(a))},setupStackForMustache:function(a){var b=a.params;return this.pushParams(b),a.hash&&this.hash(a.hash),this.ID(a.id),b}},c.prototype={nameLookup:function(a,b,d){return/^[0-9]+$/.test(b)?a+"["+b+"]":c.isValidJavaScriptVariableName(b)?a+"."+b:a+"['"+b+"']"},appendToBuffer:function(a){return this.environment.isSimple?"return "+a+";":"buffer += "+a+";"},initializeBuffer:function(){return this.quotedString("")},namespace:"Handlebars",compile:function(a,b,c,d){this.environment=a,this.options=b||{},this.name=this.environment.name,this.isChild=!!c,this.context=c||{programs:[],aliases:{self:"this"},registers:{list:[]}},this.preamble(),this.stackSlot=0,this.stackVars=[],this.compileChildren(a,b);var e=a.opcodes,f;this.i=0;for(i=e.length;this.i<i;this.i++)f=this.nextOpcode(0),f[0]==="DECLARE"?(this.i=this.i+2,this[f[1]]=f[2]):(this.i=this.i+f[1].length,this[f[0]].apply(this,f[1]));return this.createFunctionContext(d)},nextOpcode:function(a){var c=this.environment.opcodes,d=c[this.i+a],e,f,g,h;if(d==="DECLARE")return e=c[this.i+1],f=c[this.i+2],["DECLARE",e,f];e=b.DISASSEMBLE_MAP[d],g=b.multiParamSize(d),h=[];for(var i=0;i<g;i++)h.push(c[this.i+i+1+a]);return[e,h]},eat:function(a){this.i=this.i+a.length},preamble:function(){var a=[];this.useRegister("foundHelper");if(!this.isChild){var b=this.namespace,c="helpers = helpers || "+b+".helpers;";this.environment.usePartial&&(c=c+" partials = partials || "+b+".partials;"),a.push(c)}else a.push("");this.environment.isSimple?a.push(""):a.push(", buffer = "+this.initializeBuffer()),this.lastContext=0,this.source=a},createFunctionContext:function(b){var c=this.stackVars;this.isChild||(c=c.concat(this.context.registers.list)),c.length>0&&(this.source[1]=this.source[1]+", "+c.join(", "));if(!this.isChild){var d=[];for(var e in this.context.aliases)this.source[1]=this.source[1]+", "+e+"="+this.context.aliases[e]}this.source[1]&&(this.source[1]="var "+this.source[1].substring(2)+";"),this.isChild||(this.source[1]+="\n"+this.context.programs.join("\n")+"\n"),this.environment.isSimple||this.source.push("return buffer;");var f=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];for(var g=0,h=this.environment.depths.list.length;g<h;g++)f.push("depth"+this.environment.depths.list[g]);if(b)return f.push(this.source.join("\n  ")),Function.apply(this,f);var i="function "+(this.name||"")+"("+f.join(",")+") {\n  "+this.source.join("\n  ")+"}";return a.log(a.logger.DEBUG,i+"\n\n"),i},appendContent:function(a){this.source.push(this.appendToBuffer(this.quotedString(a)))},append:function(){var a=this.popStack();this.source.push("if("+a+" || "+a+" === 0) { "+this.appendToBuffer(a)+" }"),this.environment.isSimple&&this.source.push("else { "+this.appendToBuffer("''")+" }")},appendEscaped:function(){var a=this.nextOpcode(1),b="";this.context.aliases.escapeExpression="this.escapeExpression",a[0]==="appendContent"&&(b=" + "+this.quotedString(a[1][0]),this.eat(a)),this.source.push(this.appendToBuffer("escapeExpression("+this.popStack()+")"+b))},getContext:function(a){this.lastContext!==a&&(this.lastContext=a)},lookupWithHelpers:function(a,b){if(a){var c=this.nextStack();this.usingKnownHelper=!1;var d;!b&&this.options.knownHelpers[a]?(d=c+" = "+this.nameLookup("helpers",a,"helper"),this.usingKnownHelper=!0):b||this.options.knownHelpersOnly?d=c+" = "+this.nameLookup("depth"+this.lastContext,a,"context"):(this.register("foundHelper",this.nameLookup("helpers",a,"helper")),d=c+" = foundHelper || "+this.nameLookup("depth"+this.lastContext,a,"context")),d+=";",this.source.push(d)}else this.pushStack("depth"+this.lastContext)},lookup:function(a){var b=this.topStack();this.source.push(b+" = ("+b+" === null || "+b+" === undefined || "+b+" === false ? "+b+" : "+this.nameLookup(b,a,"context")+");")},pushStringParam:function(a){this.pushStack("depth"+this.lastContext),this.pushString(a)},pushString:function(a){this.pushStack(this.quotedString(a))},push:function(a){this.pushStack(a)},invokeMustache:function(a,b,c){this.populateParams(a,this.quotedString(b),"{}",null,c,function(a,b,c){this.usingKnownHelper||(this.context.aliases.helperMissing="helpers.helperMissing",this.context.aliases.undef="void 0",this.source.push("else if("+c+"=== undef) { "+a+" = helperMissing.call("+b+"); }"),a!==c&&this.source.push("else { "+a+" = "+c+"; }"))})},invokeProgram:function(a,b,c){var d=this.programExpression(this.inverse),e=this.programExpression(a);this.populateParams(b,null,e,d,c,function(a,b,c){this.usingKnownHelper||(this.context.aliases.blockHelperMissing="helpers.blockHelperMissing",this.source.push("else { "+a+" = blockHelperMissing.call("+b+"); }"))})},populateParams:function(a,b,c,d,e,f){var g=e||this.options.stringParams||d||this.options.data,h=this.popStack(),i,j=[],k,l,m;g?(this.register("tmp1",c),m="tmp1"):m="{ hash: {} }";if(g){var n=e?this.popStack():"{}";this.source.push("tmp1.hash = "+n+";")}this.options.stringParams&&this.source.push("tmp1.contexts = [];");for(var o=0;o<a;o++)k=this.popStack(),j.push(k),this.options.stringParams&&this.source.push("tmp1.contexts.push("+this.popStack()+");");d&&(this.source.push("tmp1.fn = tmp1;"),this.source.push("tmp1.inverse = "+d+";")),this.options.data&&this.source.push("tmp1.data = data;"),j.push(m),this.populateCall(j,h,b||h,f,c!=="{}")},populateCall:function(a,b,c,d,e){var f=["depth0"].concat(a).join(", "),g=["depth0"].concat(c).concat(a).join(", "),h=this.nextStack();if(this.usingKnownHelper)this.source.push(h+" = "+b+".call("+f+");");else{this.context.aliases.functionType='"function"';var i=e?"foundHelper && ":"";this.source.push("if("+i+"typeof "+b+" === functionType) { "+h+" = "+b+".call("+f+"); }")}d.call(this,h,g,b),this.usingKnownHelper=!1},invokePartial:function(a){params=[this.nameLookup("partials",a,"partial"),"'"+a+"'",this.popStack(),"helpers","partials"],this.options.data&&params.push("data"),this.pushStack("self.invokePartial("+params.join(", ")+");")},assignToHash:function(a){var b=this.popStack(),c=this.topStack();this.source.push(c+"['"+a+"'] = "+b+";")},compiler:c,compileChildren:function(a,b){var c=a.children,d,e;for(var f=0,g=c.length;f<g;f++){d=c[f],e=new this.compiler,this.context.programs.push("");var h=this.context.programs.length;d.index=h,d.name="program"+h,this.context.programs[h]=e.compile(d,b,this.context)}},programExpression:function(a){if(a==null)return"self.noop";var b=this.environment.children[a],c=b.depths.list,d=[b.index,b.name,"data"];for(var e=0,f=c.length;e<f;e++)depth=c[e],depth===1?d.push("depth0"):d.push("depth"+(depth-1));return c.length===0?"self.program("+d.join(", ")+")":(d.shift(),"self.programWithDepth("+d.join(", ")+")")},register:function(a,b){this.useRegister(a),this.source.push(a+" = "+b+";")},useRegister:function(a){this.context.registers[a]||(this.context.registers[a]=!0,this.context.registers.list.push(a))},pushStack:function(a){return this.source.push(this.nextStack()+" = "+a+";"),"stack"+this.stackSlot},nextStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push("stack"+this.stackSlot),"stack"+this.stackSlot},popStack:function(){return"stack"+this.stackSlot--},topStack:function(){return"stack"+this.stackSlot},quotedString:function(a){return'"'+a.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"'}};var f="break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "),g=c.RESERVED_WORDS={};for(var h=0,i=f.length;h<i;h++)g[f[h]]=!0;c.isValidJavaScriptVariableName=function(a){return!c.RESERVED_WORDS[a]&&/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(a)?!0:!1}}(a.Compiler,a.JavaScriptCompiler),a.precompile=function(b,c){c=c||{};var d=a.parse(b),e=(new a.Compiler).compile(d,c);return(new a.JavaScriptCompiler).compile(e,c)},a.compile=function(b,c){function e(){var d=a.parse(b),e=(new a.Compiler).compile(d,c),f=(new a.JavaScriptCompiler).compile(e,c,undefined,!0);return a.template(f)}c=c||{};var d;return function(a,b){return d||(d=e()),d.call(this,a,b)}},a.VM={template:function(b){var c={escapeExpression:a.Utils.escapeExpression,invokePartial:a.VM.invokePartial,programs:[],program:function(b,c,d){var e=this.programs[b];return d?a.VM.program(c,d):e?e:(e=this.programs[b]=a.VM.program(c),e)},programWithDepth:a.VM.programWithDepth,noop:a.VM.noop};return function(d,e){return e=e||{},b.call(c,a,d,e.helpers,e.partials,e.data)}},programWithDepth:function(a,b,c){var d=Array.prototype.slice.call(arguments,2);return function(c,e){return e=e||{},a.apply(this,[c,e.data||b].concat(d))}},program:function(a,b){return function(c,d){return d=d||{},a(c,d.data||b)}},noop:function(){return""},invokePartial:function(b,c,d,e,f,g){options={helpers:e,partials:f,data:g};if(b===undefined)throw new a.Exception("The partial "+c+" could not be found");if(b instanceof Function)return b(d,options);if(!a.compile)throw new a.Exception("The partial "+c+" could not be compiled when running in runtime-only mode");return f[c]=a.compile(b),f[c](d,options)}},a.template=a.VM.template})(),function(){"undefined"==typeof Ember&&(Ember={},"undefined"!=typeof window&&(window.Em=window.Ember=Em=Ember)),Ember.isNamespace=!0,Ember.toString=function(){return"Ember"},Ember.VERSION="0.9.8.1",Ember.ENV="undefined"==typeof ENV?{}:ENV,Ember.EXTEND_PROTOTYPES=Ember.ENV.EXTEND_PROTOTYPES!==!1,Ember.SHIM_ES5=Ember.ENV.SHIM_ES5===!1?!1:Ember.EXTEND_PROTOTYPES,Ember.CP_DEFAULT_CACHEABLE=!!Ember.ENV.CP_DEFAULT_CACHEABLE,Ember.VIEW_PRESERVES_CONTEXT=!!Ember.ENV.VIEW_PRESERVES_CONTEXT,Ember.K=function(){return this},"undefined"==typeof Ember.assert&&(Ember.assert=Ember.K),"undefined"==typeof Ember.warn&&(Ember.warn=Ember.K),"undefined"==typeof Ember.deprecate&&(Ember.deprecate=Ember.K),"undefined"==typeof Ember.deprecateFunc&&(Ember.deprecateFunc=function(a,b){return b}),"undefined"==typeof ember_assert&&(window.ember_assert=Ember.K),"undefined"==typeof ember_warn&&(window.ember_warn=Ember.K),"undefined"==typeof ember_deprecate&&(window.ember_deprecate=Ember.K),"undefined"==typeof ember_deprecateFunc&&(window.ember_deprecateFunc=function(a,b){return b}),Ember.Logger=window.console||{log:Ember.K,warn:Ember.K,error:Ember.K}}(),function(){var a=Ember.platform={};a.create=Object.create;if(!a.create){var b=function(){},c=b.prototype;a.create=function(d,e){b.prototype=d,d=new b,b.prototype=c;if(e!==undefined)for(var f in e){if(!e.hasOwnProperty(f))continue;a.defineProperty(d,f,e[f])}return d},a.create.isSimulated=!0}var d=Object.defineProperty,e,f;if(d)try{d({},"a",{get:function(){}})}catch(g){d=null}d&&(e=function(){var a={};return d(a,"a",{configurable:!0,enumerable:!0,get:function(){},set:function(){}}),d(a,"a",{configurable:!0,enumerable:!0,writable:!0,value:!0}),a.a===!0}(),f=function(){try{return d(document.createElement("div"),"definePropertyOnDOM",{}),!0}catch(a){}return!1}(),e?f||(d=function(a,b,c){var d;return typeof Node=="object"?d=a instanceof Node:d=typeof a=="object"&&typeof a.nodeType=="number"&&typeof a.nodeName=="string",d?a[b]=c.value:Object.defineProperty(a,b,c)}):d=null),a.defineProperty=d,a.hasPropertyAccessors=!0,a.defineProperty||(a.hasPropertyAccessors=!1,a.defineProperty=function(a,b,c){a[b]=c.value},a.defineProperty.isSimulated=!0)}(),function(){var a="__ember"+ +(new Date),b,c,d;b=0,c=[],d={};var e=Ember.GUID_DESC={configurable:!0,writable:!0,enumerable:!1},f=Ember.platform.defineProperty,g=Ember.platform.create;Ember.GUID_KEY=a,Ember.generateGuid=function(c,d){d||(d="ember");var g=d+b++;return c&&(e.value=g,f(c,a,e),e.value=null),g},Ember.guidFor=function(e){if(e===undefined)return"(undefined)";if(e===null)return"(null)";var f,g,h=typeof e;switch(h){case"number":return g=c[e],g||(g=c[e]="nu"+e),g;case"string":return g=d[e],g||(g=d[e]="st"+b++),g;case"boolean":return e?"(true)":"(false)";default:if(e[a])return e[a];if(e===Object)return"(Object)";if(e===Array)return"(Array)";return Ember.generateGuid(e,"ember")}};var h={writable:!0,configurable:!1,enumerable:!1,value:null},i=Ember.GUID_KEY+"_meta";Ember.META_KEY=i;var j={descs:{},watching:{}};Object.freeze&&Object.freeze(j);var k=Ember.platform.defineProperty.isSimulated?g:function(a){return a};Ember.meta=function(b,c){var d=b[i];return c===!1?d||j:(d?d.source!==b&&(d=g(d),d.descs=g(d.descs),d.values=g(d.values
),d.watching=g(d.watching),d.lastSetValues={},d.cache={},d.source=b,f(b,i,h),d=b[i]=k(d)):(f(b,i,h),d=b[i]=k({descs:{},watching:{},values:{},lastSetValues:{},cache:{},source:b}),d.descs.constructor=null),d)},Ember.getMeta=function(b,c){var d=Ember.meta(b,!1);return d[c]},Ember.setMeta=function(b,c,d){var e=Ember.meta(b,!0);return e[c]=d,d},Ember.metaPath=function(a,b,c){var d=Ember.meta(a,c),e,f;for(var h=0,i=b.length;h<i;h++){e=b[h],f=d[e];if(!f){if(!c)return undefined;f=d[e]={__ember_source__:a}}else if(f.__ember_source__!==a){if(!c)return undefined;f=d[e]=g(f),f.__ember_source__=a}d=f}return f},Ember.wrap=function(a,b){function c(){}var d=function(){var d,e=this._super;return this._super=b||c,d=a.apply(this,arguments),this._super=e,d};return d.base=a,d},Ember.isArray=function(a){return!a||a.setInterval?!1:Array.isArray&&Array.isArray(a)?!0:Ember.Array&&Ember.Array.detect(a)?!0:a.length!==undefined&&"object"==typeof a?!0:!1},Ember.makeArray=function(a){return a===null||a===undefined?[]:Ember.isArray(a)?a:[a]}}(),function(){function g(a){return a.indexOf("*")===-1||a==="*"?a:a.replace(/(^|.)\*/,function(a,b){return b==="."?a:b+"."})}function h(a){a=g(a);if(a==="*")return a;var b=a.charAt(0);return b==="."?"this"+a:a}function i(a,b){var d=b.length,e,f,h;b=g(b),e=0;while(a&&e<d){f=b.indexOf(".",e),f<0&&(f=d),h=b.slice(e,f),a=h==="*"?a:c(a,h);if(a&&a.isDestroyed)return undefined;e=f+1}return a}function o(a){return a.match(n)[0]}function p(a,b){var d=m.test(b),e=!d&&l.test(b),f;if(!a||e)a=window;d&&(b=b.slice(5)),b=g(b),a===window&&(f=o(b),a=c(a,f),b=b.slice(f.length+1));if(!b||b.length===0)throw new Error("Invalid Path");return j[0]=a,j[1]=b,j}var a=Ember.platform.hasPropertyAccessors&&Ember.ENV.USE_ACCESSORS;Ember.USE_ACCESSORS=!!a;var b=Ember.meta,c,d;c=function(b,c){c===undefined&&"string"==typeof b&&(c=b,b=Ember);if(!b)return undefined;var d=b[c];return d===undefined&&"function"==typeof b.unknownProperty&&(d=b.unknownProperty(c)),d},d=function(b,c,d){return"object"!=typeof b||c in b?b[c]=d:"function"==typeof b.setUnknownProperty?b.setUnknownProperty(c,d):"function"==typeof b.unknownProperty?b.unknownProperty(c,d):b[c]=d,d};if(!a){var e=c,f=d;c=function(a,c){c===undefined&&"string"==typeof a&&(c=a,a=Ember);if(!a)return undefined;var d=b(a,!1).descs[c];return d?d.get(a,c):e(a,c)},d=function(a,c,d){var e=b(a,!1).descs[c];return e?e.set(a,c,d):f(a,c,d),d}}Ember.get=c,Ember.set=d;var j=[],k=/^([A-Z$]|([0-9][A-Z$]))/,l=/^([A-Z$]|([0-9][A-Z$])).*[\.\*]/,m=/^this[\.\*]/,n=/^([^\.\*]+)/;Ember.normalizePath=h,Ember.normalizeTuple=function(a,b){return p(a,h(b))},Ember.normalizeTuple.primitive=p,Ember.getWithDefault=function(a,b,c){var d=Ember.get(a,b);return d===undefined?c:d},Ember.getPath=function(a,b){var d,e,f;if(b==="")return a;!b&&"string"==typeof a&&(b=a,a=null),b=g(b);if(a===null&&b.indexOf(".")<0)return c(window,b);b=h(b),d=m.test(b);if(!a||d){var j=p(a,b);a=j[0],b=j[1],j.length=0}return i(a,b)},Ember.setPath=function(a,b,c,d){var e;arguments.length===2&&"string"==typeof a&&(c=b,b=a,a=null),b=h(b);if(b.indexOf(".")>0)e=b.slice(b.lastIndexOf(".")+1),b=b.slice(0,b.length-(e.length+1)),b!=="this"&&(a=Ember.getPath(a,b));else{if(k.test(b))throw new Error("Invalid Path");e=b}if(!e||e.length===0||e==="*")throw new Error("Invalid Path");if(!a){if(d)return;throw new Error("Object in path "+b+" could not be found or was destroyed.")}return Ember.set(a,e,c)},Ember.trySetPath=function(a,b,c){return arguments.length===2&&"string"==typeof a&&(c=b,b=a,a=null),Ember.setPath(a,b,c,!0)},Ember.isGlobalPath=function(a){return!m.test(a)&&k.test(a)}}(),function(){function n(a,b,c){c=c||d(a,!1).values;if(c){var e=c[b];if(e!==undefined)return e;if(a.unknownProperty)return a.unknownProperty(b)}}function o(a,b,c){var e=d(a),f;return f=e.watching[b]>0&&c!==e.values[b],f&&Ember.propertyWillChange(a,b),e.values[b]=c,f&&Ember.propertyDidChange(a,b),c}function q(a){var b=p[a];return b||(b=p[a]=function(){return n(this,a)}),b}function s(a){var b=r[a];return b||(b=r[a]=function(b){return o(this,a,b)}),b}function t(a,b){return b==="toString"?"function"!=typeof a.toString:!!a[b]}var a=Ember.USE_ACCESSORS,b=Ember.GUID_KEY,c=Ember.META_KEY,d=Ember.meta,e=Ember.platform.create,f=Ember.platform.defineProperty,g,h,i={writable:!0,configurable:!0,enumerable:!0,value:null},j=Ember.Descriptor=function(){},k=j.setup=function(a,b,c){i.value=c,f(a,b,i),i.value=null},l=Ember.Descriptor.prototype;l.set=function(a,b,c){return a[b]=c,c},l.get=function(a,b){return n(a,b,a)},l.setup=k,l.teardown=function(a,b){return a[b]},l.val=function(a,b){return a[b]},a||(Ember.Descriptor.MUST_USE_GETTER=function(){!(this instanceof Ember.Object)},Ember.Descriptor.MUST_USE_SETTER=function(){this instanceof Ember.Object&&!this.isDestroyed});var m={configurable:!0,enumerable:!0,set:Ember.Descriptor.MUST_USE_SETTER},p={},r={};h=new Ember.Descriptor,Ember.platform.hasPropertyAccessors?(h.get=n,h.set=o,a?h.setup=function(a,b,c){m.get=q(b),m.set=s(b),f(a,b,m),m.get=m.set=null,c!==undefined&&(d(a).values[b]=c)}:h.setup=function(a,b,c){m.get=q(b),f(a,b,m),m.get=null,c!==undefined&&(d(a).values[b]=c)},h.teardown=function(a,b){var c=d(a).values[b];return delete d(a).values[b],c}):h.set=function(a,b,c){var e=d(a),f;return f=e.watching[b]>0&&c!==a[b],f&&Ember.propertyWillChange(a,b),a[b]=c,f&&Ember.propertyDidChange(a,b),c},Ember.SIMPLE_PROPERTY=new Ember.Descriptor,g=Ember.SIMPLE_PROPERTY,g.unwatched=h.unwatched=g,g.watched=h.watched=h,Ember.defineProperty=function(a,b,c,e){var h=d(a,!1),i=h.descs,j=h.watching[b]>0,k=!0;return e===undefined?(k=!1,e=t(i,b)?i[b].teardown(a,b):a[b]):t(i,b)&&i[b].teardown(a,b),c||(c=g),c instanceof Ember.Descriptor?(h=d(a,!0),i=h.descs,c=(j?c.watched:c.unwatched)||c,i[b]=c,c.setup(a,b,e,j)):(i[b]&&(d(a).descs[b]=null),f(a,b,c)),k&&j&&Ember.overrideChains(a,b,h),this},Ember.create=function(a,d){var f=e(a,d);return b in f&&Ember.generateGuid(f,"ember"),c in f&&Ember.rewatch(f),f},Ember.createPrototype=function(a,f){var g=e(a,f);return d(g,!0).proto=g,b in g&&Ember.generateGuid(g,"ember"),c in g&&Ember.rewatch(g),g}}(),function(){function g(b,c){var d=a(b),f,g;return f=d.deps,f?f.__emberproto__!==b&&(f=d.deps=e(f),f.__emberproto__=b):f=d.deps={__emberproto__:b},g=f[c],g?g.__emberproto__!==b&&(g=f[c]=e(g),g.__emberproto__=b):g=f[c]={__emberproto__:b},g}function h(a,b,c){var d=g(a,c);d[b]=(d[b]||0)+1,Ember.watch(a,c)}function i(a,b,c){var d=g(a,c);d[b]=(d[b]||0)-1,Ember.unwatch(a,c)}function j(a,b,c){var d=a._dependentKeys,e=d?d.length:0;for(var f=0;f<e;f++)h(b,c,d[f])}function k(a,b){this.func=a,this._cacheable=b&&b.cacheable!==undefined?b.cacheable:Ember.CP_DEFAULT_CACHEABLE,this._dependentKeys=b&&b.dependentKeys}function m(b,c){var d=c._cacheable,e=c.func;return d?function(){var c,d=a(this).cache;return b in d?d[b]:(c=d[b]=e.call(this,b),c)}:function(){return e.call(this,b)}}function n(c,d){var e=d._cacheable,f=d.func;return function(g){var h=a(this,e),i=h.source===this&&h.watching[c]>0,j,k,l;return k=d._suspended,d._suspended=this,i=i&&h.lastSetValues[c]!==b(g),i&&(h.lastSetValues[c]=b(g),Ember.propertyWillChange(this,c)),e&&delete h.cache[c],j=f.call(this,c,g),e&&(h.cache[c]=j),i&&Ember.propertyDidChange(this,c),d._suspended=k,j}}var a=Ember.meta,b=Ember.guidFor,c=Ember.USE_ACCESSORS,d=Array.prototype.slice,e=Ember.platform.create,f=Ember.platform.defineProperty;Ember.ComputedProperty=k,k.prototype=new Ember.Descriptor;var l={configurable:!0,enumerable:!0,get:function(){return undefined},set:Ember.Descriptor.MUST_USE_SETTER},o=k.prototype;o.cacheable=function(a){return this._cacheable=a!==!1,this},o.volatile=function(){return this.cacheable(!1)},o.property=function(){return this._dependentKeys=d.call(arguments),this},o.meta=function(a){return this._meta=a,this},o.setup=function(a,b,c){l.get=m(b,this),l.set=n(b,this),f(a,b,l),l.get=l.set=null,j(this,a,b)},o.teardown=function(b,c){var d=this._dependentKeys,e=d?d.length:0;for(var f=0;f<e;f++)i(b,c,d[f]);return this._cacheable&&delete a(b).cache[c],null},o.didChange=function(b,c){this._cacheable&&this._suspended!==b&&delete a(b).cache[c]},o.get=function(b,c){var d,e;if(this._cacheable){e=a(b).cache;if(c in e)return e[c];d=e[c]=this.func.call(b,c)}else d=this.func.call(b,c);return d},o.set=function(c,d,e){var f=this._cacheable,g=a(c,f),h=g.source===c&&g.watching[d]>0,i,j,k;return j=this._suspended,this._suspended=c,h=h&&g.lastSetValues[d]!==b(e),h&&(g.lastSetValues[d]=b(e),Ember.propertyWillChange(c,d)),f&&delete g.cache[d],i=this.func.call(c,d,e),f&&(g.cache[d]=i),h&&Ember.propertyDidChange(c,d),this._suspended=j,i},o.val=function(b,c){return a(b,!1).values[c]},Ember.platform.hasPropertyAccessors?c||(o.setup=function(a,b){f(a,b,l),j(this,a,b)}):o.setup=function(a,b,c){a[b]=undefined,j(this,a,b)},Ember.computed=function(a){var b;arguments.length>1&&(b=d.call(arguments,0,-1),a=d.call(arguments,-1)[0]);var c=new k(a);return b&&c.property.apply(c,b),c},Ember.cacheFor=function(b,c){var d=a(b,!1).cache;if(d&&c in d)return d[c]}}(),function(){var a=function(a){return a&&Function.prototype.toString.call(a).indexOf("[native code]")>-1},b=a(Array.prototype.map)?Array.prototype.map:function(a){if(this===void 0||this===null)throw new TypeError;var b=Object(this),c=b.length>>>0;if(typeof a!="function")throw new TypeError;var d=new Array(c),e=arguments[1];for(var f=0;f<c;f++)f in b&&(d[f]=a.call(e,b[f],f,b));return d},c=a(Array.prototype.forEach)?Array.prototype.forEach:function(a){if(this===void 0||this===null)throw new TypeError;var b=Object(this),c=b.length>>>0;if(typeof a!="function")throw new TypeError;var d=arguments[1];for(var e=0;e<c;e++)e in b&&a.call(d,b[e],e,b)},d=a(Array.prototype.indexOf)?Array.prototype.indexOf:function(a,b){b===null||b===undefined?b=0:b<0&&(b=Math.max(0,this.length+b));for(var c=b,d=this.length;c<d;c++)if(this[c]===a)return c;return-1};Ember.ArrayUtils={map:function(a){var c=Array.prototype.slice.call(arguments,1);return a.map?a.map.apply(a,c):b.apply(a,c)},forEach:function(a){var b=Array.prototype.slice.call(arguments,1);return a.forEach?a.forEach.apply(a,b):c.apply(a,b)},indexOf:function(a){var b=Array.prototype.slice.call(arguments,1);return a.indexOf?a.indexOf.apply(a,b):d.apply(a,b)},indexesOf:function(a){var b=Array.prototype.slice.call(arguments,1);return b[0]===undefined?[]:Ember.ArrayUtils.map(b[0],function(b){return Ember.ArrayUtils.indexOf(a,b)})},removeObject:function(a,b){var c=this.indexOf(a,b);c!==-1&&a.splice(c,1)}},Ember.SHIM_ES5&&(Array.prototype.map||(Array.prototype.map=b),Array.prototype.forEach||(Array.prototype.forEach=c),Array.prototype.indexOf||(Array.prototype.indexOf=d))}(),function(){function l(a,b,c){e&&!c?j.push(a,b):Ember.sendEvent(a,b)}function m(){k.clear(),j.flush()}function n(b){return b+a}function o(a){return a+b}function p(a){return a.slice(0,-7)}function q(a){return a.slice(0,-7)}function r(a){return function(b,c,d){var e=d[0],f=p(d[1]),g,h=a.slice();c.length>2&&(g=Ember.getPath(Ember.isGlobalPath(f)?window:e,f)),h.unshift(e,f,g),c.apply(b,h)}}function t(a,b,c){var d=c[0],e=q(c[1]),f;b.length>2&&(f=Ember.getPath(d,e)),b.call(a,d,e,f)}var a=":change",b=":before",c=Ember.guidFor,d=Ember.normalizePath,e=0,f=Array.prototype.slice,g=Ember.ArrayUtils.forEach,h=function(){this.targetSet={}};h.prototype.add=function(a,b){var c=this.targetSet,d=Ember.guidFor(a),e=c[d];return e||(c[d]=e={}),e[b]?!1:e[b]=!0},h.prototype.clear=function(){this.targetSet={}};var i=function(){this.targetSet={},this.queue=[]};i.prototype.push=function(a,b){var c=this.targetSet,d=this.queue,e=Ember.guidFor(a),f=c[e],g;f||(c[e]=f={}),g=f[b],g===undefined?f[b]=d.push(Ember.deferEvent(a,b))-1:d[g]=Ember.deferEvent(a,b)},i.prototype.flush=function(){var a=this.queue;this.queue=[],this.targetSet={};for(var b=0,c=a.length;b<c;++b)a[b]()};var j=new i,k=new h;Ember.beginPropertyChanges=function(){return e++,this},Ember.endPropertyChanges=function(){e--,e<=0&&m()},Ember.changeProperties=function(a,b){Ember.beginPropertyChanges();try{a.call(b)}finally{Ember.endPropertyChanges()}},Ember.setProperties=function(a,b){return Ember.changeProperties(function(){for(var c in b)b.hasOwnProperty(c)&&Ember.set(a,c,b[c])}),a};var s=r([]);Ember.addObserver=function(a,b,c,e){b=d(b);var g;if(arguments.length>4){var h=f.call(arguments,4);g=r(h)}else g=s;return Ember.addListener(a,n(b),c,e,g),Ember.watch(a,b),this},Ember.observersFor=function(a,b){return Ember.listenersFor(a,n(b))},Ember.removeObserver=function(a,b,c,e){return b=d(b),Ember.unwatch(a,b),Ember.removeListener(a,n(b),c,e),this},Ember.addBeforeObserver=function(a,b,c,e){return b=d(b),Ember.addListener(a,o(b),c,e,t),Ember.watch(a,b),this},Ember._suspendObserver=function(a,b,c,d,e){return Ember._suspendListener(a,n(b),c,d,e)},Ember.beforeObserversFor=function(a,b){return Ember.listenersFor(a,o(b))},Ember.removeBeforeObserver=function(a,b,c,e){return b=d(b),Ember.unwatch(a,b),Ember.removeListener(a,o(b),c,e),this},Ember.notifyObservers=function(a,b){if(a.isDestroying)return;l(a,n(b))},Ember.notifyBeforeObservers=function(a,b){if(a.isDestroying)return;var c,d,f=!1;if(e){if(!k.add(a,b))return;f=!0}l(a,o(b),f)}}(),function(){function n(a){return a.match(l)[0]}function o(a){return a==="*"||!m.test(a)}function q(b,c,d,e,f){var g=a(c);e[g]||(e[g]={});if(e[g][d])return;e[g][d]=!0;var h=f.deps;h=h&&h[d];if(h)for(var i in h){if(p[i])continue;b(c,i)}}function t(a,b,c){if(a.isDestroying)return;var d=r,e=!d;e&&(d=r={}),q(H,a,b,d,c),e&&(r=null)}function u(a,b,c){if(a.isDestroying)return;var d=s,e=!d;e&&(d=s={}),q(I,a,b,d,c),e&&(s=null)}function v(c,d,e){if(!c||"object"!=typeof c)return;var f=b(c),g=f.chainWatchers;if(!g||g.__emberproto__!==c)g=f.chainWatchers={__emberproto__:c};g[d]||(g[d]={}),g[d][a(e)]=e,Ember.watch(c,d)}function w(c,d,e){if(!c||"object"!=typeof c)return;var f=b(c,!1),g=f.chainWatchers;if(!g||g.__emberproto__!==c)return;g[d]&&delete g[d][a(e)],Ember.unwatch(c,d)}function y(){if(x.length===0)return;var a=x;x=[],k(a,function(a){a[0].add(a[1])})}function z(a){return b(a,!1).proto===a}function C(a){var c=b(a),d=c.chains;return d?d.value()!==a&&(d=c.chains=d.copy(a)):d=c.chains=new A(null,null,a),d}function D(a,b,c,d,e){var f=b.chainWatchers;if(!f||f.__emberproto__!==a)return;f=f[c];if(!f)return;for(var g in f){if(!f.hasOwnProperty(g))continue;f[g][d](e)}}function E(a,b,c){D(a,c,b,"willChange")}function F(a,b,c){D(a,c,b,"didChange")}function H(a,c){var d=b(a,!1),e=d.proto,f=d.descs[c];if(e===a)return;f&&f.willChange&&f.willChange(a,c),t(a,c,d),E(a,c,d),Ember.notifyBeforeObservers(a,c)}function I(a,c){var d=b(a,!1),e=d.proto,f=d.descs[c];if(e===a)return;f&&f.didChange&&f.didChange(a,c),u(a,c,d),F(a,c,d),Ember.notifyObservers(a,c)}var a=Ember.guidFor,b=Ember.meta,c=Ember.get,d=Ember.set,e=Ember.normalizeTuple.primitive,f=Ember.normalizePath,g=Ember.SIMPLE_PROPERTY,h=Ember.GUID_KEY,i=Ember.META_KEY,j=Ember.notifyObservers,k=Ember.ArrayUtils.forEach,l=/^([^\.\*]+)/,m=/[\.\*]/,p={__emberproto__:!0},r,s,x=[],A=function(a,b,c,d){var e;this._parent=a,this._key=b,this._watching=c===undefined,this._value=c,this._separator=d||".",this._paths={},this._watching&&(this._object=a.value(),this._object&&v(this._object,this._key,this)),this._parent&&this._parent._key==="@each"&&this.value()},B=A.prototype;B.value=function(){if(this._value===undefined&&this._watching){var a=this._parent.value();this._value=a&&!z(a)?c(a,this._key):undefined}return this._value},B.destroy=function(){if(this._watching){var a=this._object;a&&w(a,this._key,this),this._watching=!1}},B.copy=function(a){var b=new A(null,null,a,this._separator),c=this._paths,d;for(d in c){if(c[d]<=0)continue;b.add(d)}return b},B.add=function(a){var b,c,d,f,g,h;h=this._paths,h[a]=(h[a]||0)+1,b=this.value(),c=e(b,a);if(c[0]&&c[0]===b)a=c[1],d=n(a),a=a.slice(d.length+1);else{if(!c[0]){x.push([this,a]),c.length=0;return}f=c[0],d=a.slice(0,0-(c[1].length+1)),g=a.slice(d.length,d.length+1),a=c[1]}c.length=0,this.chain(d,a,f,g)},B.remove=function(a){var b,c,d,f,g;g=this._paths,g[a]>0&&g[a]--,b=this.value(),c=e(b,a),c[0]===b?(a=c[1],d=n(a),a=a.slice(d.length+1)):(f=c[0],d=a.slice(0,0-(c[1].length+1)),a=c[1]),c.length=0,this.unchain(d,a)},B.count=0,B.chain=function(a,b,c,d){var e=this._chains,f;e||(e=this._chains={}),f=e[a],f||(f=e[a]=new A(this,a,c,d)),f.count++,b&&b.length>0&&(a=n(b),b=b.slice(a.length+1),f.chain(a,b))},B.unchain=function(a,b){var c=this._chains,d=c[a];b&&b.length>1&&(a=n(b),b=b.slice(a.length+1),d.unchain(a,b)),d.count--,d.count<=0&&(delete c[d._key],d.destroy())},B.willChange=function(){var a=this._chains;if(a)for(var b in a){if(!a.hasOwnProperty(b))continue;a[b].willChange()}this._parent&&this._parent.chainWillChange(this,this._key,1)},B.chainWillChange=function(a,b,c){this._key&&(b=this._key+this._separator+b),this._parent?this._parent.chainWillChange(this,b,c+1):(c>1&&Ember.propertyWillChange(this.value(),b),b="this."+b,this._paths[b]>0&&Ember.propertyWillChange(this.value(),b))},B.chainDidChange=function(a,b,c){this._key&&(b=this._key+this._separator+b),this._parent?this._parent.chainDidChange(this,b,c+1):(c>1&&Ember.propertyDidChange(this.value(),b),b="this."+b,this._paths[b]>0&&Ember.propertyDidChange(this.value(),b))},B.didChange=function(a){if(this._watching){var b=this._parent.value();b!==this._object&&(w(this._object,this._key,this),this._object=b,v(b,this._key,this)),this._value=undefined,this._parent&&this._parent._key==="@each"&&this.value()}var c=this._chains;if(c)for(var d in c){if(!c.hasOwnProperty(d))continue;c[d].didChange(a)}if(a)return;this._parent&&this._parent.chainDidChange(this,this._key,1)},Ember.overrideChains=function(a,b,c){D(a,c,b,"didChange",!0)};var G=Ember.SIMPLE_PROPERTY.watched;Ember.watch=function(a,c){if(c==="length"&&Ember.typeOf(a)==="array")return this;var d=b(a),e=d.watching,g;return c=f(c),e[c]?e[c]=(e[c]||0)+1:(e[c]=1,o(c)?(g=d.descs[c],g=g?g.watched:G,g&&Ember.defineProperty(a,c,g)):C(a).add(c)),this},Ember.isWatching=function(a,c){return!!b(a).watching[c]},Ember.watch.flushPending=y,Ember.unwatch=function(a,c){if(c==="length"&&Ember.typeOf(a)==="array")return this;var d=b(a).watching,e,h;return c=f(c),d[c]===1?(d[c]=0,o(c)?(e=b(a).descs[c],e=e?e.unwatched:g,e&&Ember.defineProperty(a,c,e)):C(a).remove(c)):d[c]>1&&d[c]--,this},Ember.rewatch=function(a){var c=b(a,!1),d=c.chains,e=c.bindings,f,g;return h in a&&!a.hasOwnProperty(h)&&Ember.generateGuid(a,"ember"),d&&d.value()!==a&&C(a),this},Ember.propertyWillChange=H,Ember.propertyDidChange=I;var J=[];Ember.destroy=function(a){var b=a[i],c,d,e,f;if(b){a[i]=null,c=b.chains;if(c){J.push(c);while(J.length>0){c=J.pop(),d=c._chains;if(d)for(e in d)d.hasOwnProperty(e)&&J.push(d[e]);c._watching&&(f=c._object,f&&w(f,c._key,c))}}}}}(),function(){function f(a,b,d,f){var g=c(d);return e(a,["listeners",b,g],f)}function g(a,c){var d=b(a,!1).listeners;return d?d[c]||!1:!1}function i(a,b,c){if(!a)return!1;for(var d in a){if(h[d])continue;var e=a[d];if(e)for(var f in e){if(h[f])continue;var g=e[f];if(g&&b(g,c)===!0)return!0}}return!1}function j(a,b){var c=a.method,d=a.target,e=a.xform;d||(d=b[0]),"string"==typeof c&&(c=d[c]),e?e(d,c,b):c.apply(d,b)}function k(a,b,d,e,g){!e&&"function"==typeof d&&(e=d,d=null);var h=f(a,b,d,!0),i=c(e);h[i]?h[i].xform=g:h[i]={target:d,method:e,xform:g},"function"==typeof a.didAddListener&&a.didAddListener(b,d,e)}function l(a,b,d,e){!e&&"function"==typeof d&&(e=d,d=null);var g=f(a,b,d,!0),h=c(e);g&&g[h]&&(g[h]=null),a&&"function"==typeof a.didRemoveListener&&a.didRemoveListener(b,d,e)}function m(a,b,d,e,g){!e&&"function"==typeof d&&(e=d,d=null);var h=f(a,b,d,!0),i=c(e),j=h&&h[i];h[i]=null;try{return g.call(d)}finally{h[i]=j}}function n(a){var c=b(a,!1).listeners,d=[];if(c)for(var e in c)!h[e]&&c[e]&&d.push(e);return d}function o(a,b){a!==Ember&&"function"==typeof a.sendEvent&&a.sendEvent.apply(a,d.call(arguments,1));var c=g(a,b);return i(c,j,arguments),!0}function p(a,b){var c=g(a,b),e=[],f=arguments;return i(c,function(a){e.push(a)}),function(){a!==Ember&&"function"==typeof a.sendEvent&&a.sendEvent.apply(a,d.call(f,1));for(var b=0,c=e.length;b<c;++b)j(e[b],f)}}function q(a,b){var c=g(a,b);if(i(c,function(){return!0}))return!0;var d=e(a,["listeners"],!0);return d[b]=null,!1}function r(a,b){var c=g(a,b),d=[];return i(c,function(a){d.push([a.target,a.method])}),d}var a=Ember.platform.create,b=Ember.meta,c=Ember.guidFor,d=Array.prototype.slice,e=Ember.metaPath,h={__ember_source__:!0};Ember.addListener=k,Ember.removeListener=l,Ember._suspendListener=m,Ember.sendEvent=o,Ember.hasListeners=q,Ember.watchedEvents=n,Ember.listenersFor=r,Ember.deferEvent=p}(),function(){function c(b,c,d,e){c===undefined&&(c=b,b=undefined),"string"==typeof c&&(c=b[c]),d&&e>0&&(d=d.length>e?a.call(d,e):null);if("function"!=typeof Ember.onerror)return c.apply(b||this,d||[]);try{return c.apply(b||this,d||[])}catch(f){Ember.onerror(f)}}function i(){h=null,g.currentRunLoop&&g.end()}function l(){var a=+(new Date),b=-1;for(var d in j){if(!j.hasOwnProperty(d))continue;var e=j[d];if(e&&e.expires)if(a>=e.expires)delete j[d],c(e.target,e.method,e.args,2);else if(b<0||e.expires<b)b=e.expires}b>0&&setTimeout(l,b- +(new Date))}function m(a,b){b[this.tguid]&&delete b[this.tguid][this.mguid],j[a]&&c(this.target,this.method,this.args,2),delete j[a]}function o(){n=null;for(var a in j){if(!j.hasOwnProperty(a))continue;var b=j[a];b.next&&(delete j[a],c(b.target,b.method,b.args,2))}}var a=Array.prototype.slice,b=Ember.ArrayUtils.forEach,d,e=function(){},f=function(a){var b;return this instanceof f?b=this:b=new e,b._prev=a||null,b.onceTimers={},b};e.prototype=f.prototype,f.prototype={end:function(){this.flush()},prev:function(){return this._prev},schedule:function(b,c,d){var e=this._queues,f;e||(e=this._queues={}),f=e[b],f||(f=e[b]=[]);var g=arguments.length>3?a.call(arguments,3):null;return f.push({target:c,method:d,args:g}),this},flush:function(a){function k(a){c(a.target,a.method,a.args)}var e=this._queues,f,g,h,i,j;if(!e)return this;Ember.watch.flushPending();if(a)while(this._queues&&(i=this._queues[a])){this._queues[a]=null;if(a==="sync"){j=Ember.LOG_BINDINGS,j&&Ember.Logger.log("Begin: Flush Sync Queue"),Ember.beginPropertyChanges();try{b(i,k)}finally{Ember.endPropertyChanges()}j&&Ember.Logger.log("End: Flush Sync Queue")}else b(i,k)}else{f=Ember.run.queues,h=f.length;do{this._queues=null;for(g=0;g<h;g++){a=f[g],i=e[a];if(i)if(a==="sync"){j=Ember.LOG_BINDINGS,j&&Ember.Logger.log("Begin: Flush Sync Queue"),Ember.beginPropertyChanges();try{b(i,k)}finally{Ember.endPropertyChanges()}j&&Ember.Logger.log("End: Flush Sync Queue")}else b(i,k)}}while(e=this._queues)}return d=null,this}},Ember.RunLoop=f,Ember.run=function(a,b){var d,e;g.begin();try{if(a||b)d=c(a,b,arguments,2)}finally{g.end()}return d};var g=Ember.run;Ember.run.begin=function(){g.currentRunLoop=new f(g.currentRunLoop)},Ember.run.end=function(){try{g.currentRunLoop.end()}finally{g.currentRunLoop=g.currentRunLoop.prev()}},Ember.run.queues=["sync","actions","destroy","timers"],Ember.run.schedule=function(a,b,c){var d=g.autorun();d.schedule.apply(d,arguments)};var h;Ember.run.autorun=function(){return g.currentRunLoop||(g.begin(),Ember.testing?g.end():h||(h=setTimeout(i,1))),g.currentRunLoop},Ember.run.sync=function(){g.autorun(),g.currentRunLoop.flush("sync")};var j={},k=!1;Ember.run.later=function(b,c){var d,e,f,h,i;return arguments.length===2&&"function"==typeof b?(i=c,c=b,b=undefined,d=[b,c]):(d=a.call(arguments),i=d.pop()),e=+(new Date)+i,f={target:b,method:c,expires:e,args:d},h=Ember.guidFor(f),j[h]=f,g.once(j,l),h},Ember.run.once=function(b,c){var d=Ember.guidFor(b),e=Ember.guidFor(c),f,h,i=g.autorun().onceTimers;return f=i[d]&&i[d][e],f&&j[f]?j[f].args=a.call(arguments):(h={target:b,method:c,args:a.call(arguments),tguid:d,mguid:e},f=Ember.guidFor(h),j[f]=h,i[d]||(i[d]={}),i[d][e]=f,g.schedule("actions",h,m,f,i)),f};var n=!1;Ember.run.next=function(b,c){var d,e;return d={target:b,method:c,args:a.call(arguments),next:!0},e=Ember.guidFor(d),j[e]=d,n||(n=setTimeout(o,1)),e},Ember.run.cancel=function(a){delete j[a]}}(),function(){function a(a){return a instanceof Array?a:a===undefined||a===null?[]:[a]}function b(a,b){return a instanceof Array?a.length>1?b:a[0]:a}function j(a,b,c,d){var e=a._typeTransform;e&&(b=e(b,a._placeholder));var f=a._transforms,g=f?f.length:0,h;for(h=0;h<g;h++){var i=f[h][d];i&&(b=i.call(this,b,c))}return b}function k(a){return a===undefined||a===null||a===""||Ember.isArray(a)&&e(a,"length")===0}function l(a,b){return f(i(b)?window:a,b)}function m(a,b){var c=b._operation,d;return c?d=c(a,b._from,b._operand):d=l(a,b._from),j(b,d,a,"to")}function n(a,b){var c=f(a,b._to);return j(b,c,a,"from")}function s(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])}Ember.LOG_BINDINGS=!!Ember.ENV.LOG_BINDINGS,Ember.BENCHMARK_BINDING_NOTIFICATIONS=!!Ember.ENV.BENCHMARK_BINDING_NOTIFICATIONS,Ember.BENCHMARK_BINDING_SETUP=!!Ember.ENV.BENCHMARK_BINDING_SETUP,Ember.MULTIPLE_PLACEHOLDER="@@MULT@@",Ember.EMPTY_PLACEHOLDER="@@EMPTY@@";var c={to:function(a){return!!a}},d={to:function(b){return!b}},e=Ember.get,f=Ember.getPath,g=Ember.setPath,h=Ember.guidFor,i=Ember.isGlobalPath,o=function(a,b,c){return l(a,b)&&l(a,c)},p=function(a,b,c){return l(a,b)||l(a,c)},q=function(){},r=function(a,b){var c;return this instanceof r?c=this:c=new q,c._direction="fwd",c._from=b,c._to=a,c};q.prototype=r.prototype,r.prototype={copy:function(){var a=new r(this._to,this._from);return this._oneWay&&(a._oneWay=!0),this._transforms&&(a._transforms=this._transforms.slice(0)),this._typeTransform&&(a._typeTransform=this._typeTransform,a._placeholder=this._placeholder),this._operand&&(a._operand=this._operand,a._operation=this._operation),a},from:function(a){return this._from=a,this},to:function(a){return this._to=a,this},oneWay:function(a){return this._oneWay=a===undefined?!0:!!a,this},transform:function(a){return"function"==typeof a&&(a={to:a}),this._transforms||(this._transforms=[]),this._transforms.push(a),this},resetTransforms:function(){return this._transforms=null,this},single:function(a){return a===undefined&&(a=Ember.MULTIPLE_PLACEHOLDER),this._typeTransform=b,this._placeholder=a,this},multiple:function(){return this._typeTransform=a,this._placeholder=null,this},bool:function(){return this.transform(c),this},notEmpty:function(a){if(a===null||a===undefined)a=Ember.EMPTY_PLACEHOLDER;return this.transform({to:function(b){return k(b)?a:b}}),this},notNull:function(a){if(a===null||a===undefined)a=Ember.EMPTY_PLACEHOLDER;return this.transform({to:function(b){return b===null||b===undefined?a:b}}),this},not:function(){return this.transform(d),this},isNull:function(){return this.transform(function(a){return a===null||a===undefined}),this},toString:function(){var a=this._oneWay?"[oneWay]":"";return"Ember.Binding<"+h(this)+">("+this._from+" -> "+this._to+")"+a},connect:function(a){var b=this._oneWay,c=this._operand;return Ember.addObserver(a,this._from,this,this.fromDidChange),c&&Ember.addObserver(a,c,this,this.fromDidChange),b||Ember.addObserver(a,this._to,this,this.toDidChange),Ember.meta(a,!1).proto!==a&&this._scheduleSync(a,"fwd"),this._readyToSync=!0,this},disconnect:function(a){var b=this._oneWay,c=this._operand;return Ember.removeObserver(a,this._from,this,this.fromDidChange),c&&Ember.removeObserver(a,c,this,this.fromDidChange),b||Ember.removeObserver(a,this._to,this,this.toDidChange),this._readyToSync=!1,this},fromDidChange:function(a){this._scheduleSync(a,"fwd")},toDidChange:function(a){this._scheduleSync(a,"back")},_scheduleSync:function(a,b){var c=h(a),d=this[c];d||(Ember.run.schedule("sync",this,this._sync,a),this[c]=b),d==="back"&&b==="fwd"&&(this[c]="fwd")},_sync:function(a){var b=Ember.LOG_BINDINGS;if(a.isDestroyed||!this._readyToSync)return;var c=h(a),d=this[c],e=this._from,f=this._to;delete this[c];if(d==="fwd"){var g=m(a,this);b&&Ember.Logger.log(" ",this.toString(),"->",g,a),this._oneWay?Ember.trySetPath(Ember.isGlobalPath(f)?window:a,f,g):Ember._suspendObserver(a,f,this,this.toDidChange,function(){Ember.trySetPath(Ember.isGlobalPath(f)?window:a,f,g)})}else if(d==="back"){var i=n(a,this);b&&Ember.Logger.log(" ",this.toString(),"<-",i,a),Ember._suspendObserver(a,e,this,this.fromDidChange,function(){Ember.trySetPath(Ember.isGlobalPath(e)?window:a,e,i)})}}},s(r,{from:function(){var a=this,b=new a;return b.from.apply(b,arguments)},to:function(){var a=this,b=new a;return b.to.apply(b,arguments)},oneWay:function(a,b){var c=this,d=new c(null,a);return d.oneWay(b)},single:function(a,b){var c=this,d=new c(null,a);return d.single(b)},multiple:function(a){var b=this,c=new b(null,a);return c.multiple()},transform:function(a,b){b||(b=a,a=null);var c=this,d=new c(null,a);return d.transform(b)},notEmpty:function(a,b){var c=this,d=new c(null,a);return d.notEmpty(b)},notNull:function(a,b){var c=this,d=new c(null,a);return d.notNull(b)},bool:function(a){var b=this,c=new b(null,a);return c.bool()},not:function(a){var b=this,c=new b(null,a);return c.not()},isNull:function(a){var b=this,c=new b(null,a);return c.isNull()},and:function(a,b){var c=this,d=(new c(null,a)).oneWay();return d._operand=b,d._operation=o,d},or:function(a,b){var c=this,d=(new c(null,a)).oneWay();return d._operand=b,d._operation=p,d},registerTransform:function(a,b){this.prototype[a]=b,this[a]=function(b){var c=this,d=new c(null,b),e;return e=Array.prototype.slice.call(arguments,1),d[a].apply(d,e)}}}),Ember.Binding=r,Ember.bind=function(a,b,c){return(new Ember.Binding(b,c)).connect(a)},Ember.oneWay=function(a,b,c){return(new Ember.Binding(b,c)).oneWay().connect(a)}}(),function(){function n(a,b){var c=Ember.meta(a,b!==!1),d=c.mixins;return b===!1?d||k:(d?d.__emberproto__!==a&&(d=c.mixins=m(d),d.__emberproto__=a):d=c.mixins={__emberproto__:a},d)}function o(b,c){return c&&c.length>0&&(b.mixins=g(c,function(b){if(b instanceof a)return b;var c=new a;return c.properties=b,c})),b}function q(a){return"function"!=typeof a||a.isMethod===!1?!1:h(p,a)<0}function r(b,d,e,f,g){function u(a){delete e[a],delete f[a]}var j=b.length,k,l,m,n,o,p,s,t;for(k=0;k<j;k++){l=b[k];if(!l)throw new Error("Null value found in Ember.mixin()");if(l instanceof a){m=Ember.guidFor(l);if(d[m])continue;d[m]=l,n=l.properties}else n=l;if(n){t=f.concatenatedProperties||g.concatenatedProperties,n.concatenatedProperties&&(t=t?t.concat(n.concatenatedProperties):n.concatenatedProperties);for(p in n){if(!n.hasOwnProperty(p))continue;o=n[p];if(o instanceof Ember.Descriptor){if(o===c&&e[p])continue;e[p]=o,f[p]=undefined}else{if(q(o)){s=e[p]===Ember.SIMPLE_PROPERTY&&f[p],s||(s=g[p]),"function"!=typeof s&&(s=null);if(s){var v=o.__ember_observes__,w=o.__ember_observesBefore__;o=Ember.wrap(o,s),o.__ember_observes__=v,o.__ember_observesBefore__=w}}else if(t&&h(t,p)>=0||p==="concatenatedProperties"){var x=f[p]||g[p];o=x?x.concat(o):Ember.makeArray(o)}e[p]=Ember.SIMPLE_PROPERTY,f[p]=o}}n.hasOwnProperty("toString")&&(g.toString=n.toString)}else l.mixins&&(r(l.mixins,d,e,f,g),l._without&&i(l._without,u))}}function t(a){var b=Ember.meta(a),c=b.required;if(!c||c.__emberproto__!==a)c=b.required=c?m(c):{__ember_count__:0},c.__emberproto__=a;return c}function u(a){return"function"==typeof a&&a.__ember_observes__}function v(a){return"function"==typeof a&&a.__ember_observesBefore__}function x(a,b,c){if(w.test(b)){var d=c.bindings;d?d.__emberproto__!==a&&(d=c.bindings=m(c.bindings),d.__emberproto__=a):d=c.bindings={__emberproto__:a},d[b]=!0}}function y(a,b){b===undefined&&(b=Ember.meta(a));var c=b.bindings,d,e;if(c)for(d in c)e=d!=="__emberproto__"&&a[d],e&&(e instanceof Ember.Binding?(e=e.copy(),e.to(d.slice(0,-7))):e=new Ember.Binding(d.slice(0,-7),e),e.connect(a),a[d]=e)}function z(a,e,f){var g={},h={},i=Ember.meta(a),j=i.required,k,m,o,p,q;r(e,n(a),g,h,a),b.detect(a)&&(m=h.willApplyProperty||a.willApplyProperty,o=h.didApplyProperty||a.didApplyProperty);for(k in g){if(!g.hasOwnProperty(k))continue;q=g[k],p=h[k];if(q===c){if(!(k in a)){if(!f)throw new Error("Required property not defined: "+k);j=t(a),j.__ember_count__++,j[k]=!0}}else{while(q instanceof d){var w=q.methodName;g[w]?(p=h[w],q=g[w]):i.descs[w]?(q=i.descs[w],p=q.val(a,w)):(p=a[w],q=Ember.SIMPLE_PROPERTY)}m&&m.call(a,k);var z=u(p),A=z&&u(a[k]),B=v(p),C=B&&v(a[k]),D,E;if(A){D=A.length;for(E=0;E<D;E++)Ember.removeObserver(a,A[E],null,k)}if(C){D=C.length;for(E=0;E<D;E++)Ember.removeBeforeObserver(a,C[E],null,k)}x(a,k,i),s(a,k,q,p);if(z){D=z.length;for(E=0;E<D;E++)Ember.addObserver(a,z[E],null,k)}if(B){D=B.length;for(E=0;E<D;E++)Ember.addBeforeObserver(a,B[E],null,k)}j&&j[k]&&(j=t(a),j.__ember_count__--,j[k]=!1),o&&o.call(a,k)}}f||(p=y(a,i));if(!f&&j&&j.__ember_count__>0){var F=[];for(k in j){if(l[k])continue;F.push(k)}throw new Error("Required properties not defined: "+F.join(","))}return a}function B(a,b,c){var d=Ember.guidFor(a);if(c[d])return!1;c[d]=!0;if(a===b)return!0;var e=
a.mixins,f=e?e.length:0;while(--f>=0)if(B(e[f],b,c))return!0;return!1}function C(a,b,c){if(c[Ember.guidFor(b)])return;c[Ember.guidFor(b)]=!0;if(b.properties){var d=b.properties;for(var e in d)d.hasOwnProperty(e)&&(a[e]=!0)}else b.mixins&&i(b.mixins,function(b){C(a,b,c)})}function F(a,b,c){var d=a.length;for(var f in b){if(!b.hasOwnProperty||!b.hasOwnProperty(f))continue;var g=b[f];a[d]=f;if(g&&g.toString===e)g[D]=a.join(".");else if(g&&E(g,"isNamespace")){if(c[Ember.guidFor(g)])continue;c[Ember.guidFor(g)]=!0,F(a,g,c)}}a.length=d}function G(){var a=Ember.Namespace,b,c;if(a.PROCESSED)return;for(var d in window){if(d==="globalStorage"&&window.StorageList&&window.globalStorage instanceof window.StorageList)continue;if(window.hasOwnProperty&&!window.hasOwnProperty(d))continue;try{b=window[d],c=b&&E(b,"isNamespace")}catch(e){continue}c&&(b[D]=d)}}var a,b,c,d,e,f,g=Ember.ArrayUtils.map,h=Ember.ArrayUtils.indexOf,i=Ember.ArrayUtils.forEach,j=Array.prototype.slice,k={},l={__emberproto__:!0,__ember_count__:!0},m=Ember.platform.create,p=[Boolean,Object,Number,Array,Date,String],s=Ember.defineProperty,w=Ember.IS_BINDING=/^.+Binding$/;Ember.mixin=function(a){var b=j.call(arguments,1);return z(a,b,!1)},Ember.Mixin=function(){return o(this,arguments)},a=Ember.Mixin,a._apply=z,a.applyPartial=function(a){var b=j.call(arguments,1);return z(a,b,!0)},a.finishPartial=function(a){return y(a),a},a.create=function(){e.processed=!1;var a=this;return o(new a,arguments)},a.prototype.reopen=function(){var b,c;this.properties&&(b=a.create(),b.properties=this.properties,delete this.properties,this.mixins=[b]);var d=arguments.length,e=this.mixins,f;for(f=0;f<d;f++)b=arguments[f],b instanceof a?e.push(b):(c=a.create(),c.properties=b,e.push(c));return this};var A=[];a.prototype.apply=function(a){A[0]=this;var b=z(a,A,!1);return A.length=0,b},a.prototype.applyPartial=function(a){A[0]=this;var b=z(a,A,!0);return A.length=0,b},a.prototype.detect=function(b){return b?b instanceof a?B(b,this,{}):!!n(b,!1)[Ember.guidFor(this)]:!1},a.prototype.without=function(){var b=new a(this);return b._without=j.call(arguments),b},a.prototype.keys=function(){var a={},b={},c=[];C(a,this,b);for(var d in a)a.hasOwnProperty(d)&&c.push(d);return c};var D=Ember.GUID_KEY+"_name",E=Ember.get;Ember.identifyNamespaces=G,f=function(a){var b=a.superclass;if(b)return b[D]?b[D]:f(b);return},e=function(){var a=Ember.Namespace,b;if(a&&!this[D]&&!e.processed){a.PROCESSED||(G(),a.PROCESSED=!0),e.processed=!0;var c=a.NAMESPACES;for(var d=0,g=c.length;d<g;d++)b=c[d],F([b.toString()],b,{})}if(this[D])return this[D];var h=f(this);return h?"(subclass of "+h+")":"(unknown mixin)"},a.prototype.toString=e,a.mixins=function(a){var b=[],c=n(a,!1),d,e;for(d in c){if(l[d])continue;e=c[d],e.properties||b.push(c[d])}return b},c=new Ember.Descriptor,c.toString=function(){return"(Required Property)"},Ember.required=function(){return c},d=function(a){this.methodName=a},d.prototype=new Ember.Descriptor,Ember.alias=function(a){return new d(a)},Ember.MixinDelegate=a.create({willApplyProperty:Ember.required(),didApplyProperty:Ember.required()}),b=Ember.MixinDelegate,Ember.observer=function(a){var b=j.call(arguments,1);return a.__ember_observes__=b,a},Ember.beforeObserver=function(a){var b=j.call(arguments,1);return a.__ember_observesBefore__=b,a}}(),function(){}(),function(){}(),function(){function e(b,c,d,f){var g,h,i;if("object"!=typeof b||b===null)return b;if(c&&(h=a(d,b))>=0)return f[h];if(Ember.typeOf(b)==="array"){g=b.slice();if(c){h=g.length;while(--h>=0)g[h]=e(g[h],c,d,f)}}else if(Ember.Copyable&&Ember.Copyable.detect(b))g=b.copy(c,d,f);else{g={};for(i in b){if(!b.hasOwnProperty(i))continue;g[i]=c?e(b[i],c,d,f):b[i]}}return c&&(d.push(b),f.push(g)),g}var a=Ember.ArrayUtils.indexOf,b={},c="Boolean Number String Function Array Date RegExp Object".split(" ");Ember.ArrayUtils.forEach(c,function(a){b["[object "+a+"]"]=a.toLowerCase()});var d=Object.prototype.toString;Ember.typeOf=function(a){var c;return c=a===null||a===undefined?String(a):b[d.call(a)]||"object",c==="function"?Ember.Object&&Ember.Object.detect(a)&&(c="class"):c==="object"&&(a instanceof Error?c="error":Ember.Object&&a instanceof Ember.Object?c="instance":c="object"),c},Ember.none=function(a){return a===null||a===undefined},Ember.empty=function(a){return a===null||a===undefined||a.length===0&&typeof a!="function"},Ember.compare=function f(a,b){if(a===b)return 0;var c=Ember.typeOf(a),d=Ember.typeOf(b),e=Ember.Comparable;if(e){if(c==="instance"&&e.detect(a.constructor))return a.constructor.compare(a,b);if(d==="instance"&&e.detect(b.constructor))return 1-b.constructor.compare(b,a)}var g=Ember.ORDER_DEFINITION_MAPPING;if(!g){var h=Ember.ORDER_DEFINITION;g=Ember.ORDER_DEFINITION_MAPPING={};var i,j;for(i=0,j=h.length;i<j;++i)g[h[i]]=i;delete Ember.ORDER_DEFINITION}var k=g[c],l=g[d];if(k<l)return-1;if(k>l)return 1;switch(c){case"boolean":case"number":if(a<b)return-1;if(a>b)return 1;return 0;case"string":var m=a.localeCompare(b);if(m<0)return-1;if(m>0)return 1;return 0;case"array":var n=a.length,o=b.length,p=Math.min(n,o),q=0,r=0;while(q===0&&r<p)q=f(a[r],b[r]),r++;if(q!==0)return q;if(n<o)return-1;if(n>o)return 1;return 0;case"instance":if(Ember.Comparable&&Ember.Comparable.detect(a))return a.compare(a,b);return 0;default:return 0}},Ember.copy=function(a,b){return"object"!=typeof a||a===null?a:Ember.Copyable&&Ember.Copyable.detect(a)?a.copy(b):e(a,b,b?[]:null,b?[]:null)},Ember.inspect=function(a){var b,c=[];for(var d in a)if(a.hasOwnProperty(d)){b=a[d];if(b==="toString")continue;Ember.typeOf(b)==="function"&&(b="function() { ... }"),c.push(d+": "+b)}return"{"+c.join(" , ")+"}"},Ember.isEqual=function(a,b){return a&&"function"==typeof a.isEqual?a.isEqual(b):a===b},Ember.ORDER_DEFINITION=Ember.ENV.ORDER_DEFINITION||["undefined","null","boolean","number","string","array","object","instance","function","class"],Ember.keys=Object.keys,Ember.keys||(Ember.keys=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}),Ember.Error=function(){var a=Error.prototype.constructor.apply(this,arguments);for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);this.message=a.message},Ember.Error.prototype=Ember.create(Error.prototype)}(),function(){var a=/[ _]/g,b={},c=/([a-z])([A-Z])/g,d=/(\-|_|\s)+(.)?/g,e=/([a-z\d])([A-Z]+)/g,f=/\-|\s+/g;Ember.STRINGS={},Ember.String={fmt:function(a,b){var c=0;return a.replace(/%@([0-9]+)?/g,function(a,d){return d=d?parseInt(d,0)-1:c++,a=b[d],(a===null?"(null)":a===undefined?"":a).toString()})},loc:function(a,b){return a=Ember.STRINGS[a]||a,Ember.String.fmt(a,b)},w:function(a){return a.split(/\s+/)},decamelize:function(a){return a.replace(c,"$1_$2").toLowerCase()},dasherize:function(c){var d=b,e=d[c];return e?e:(e=Ember.String.decamelize(c).replace(a,"-"),d[c]=e,e)},camelize:function(a){return a.replace(d,function(a,b,c){return c?c.toUpperCase():""})},underscore:function(a){return a.replace(e,"$1_$2").replace(f,"_").toLowerCase()}}}(),function(){var a=Ember.String.fmt,b=Ember.String.w,c=Ember.String.loc,d=Ember.String.camelize,e=Ember.String.decamelize,f=Ember.String.dasherize,g=Ember.String.underscore;Ember.EXTEND_PROTOTYPES&&(String.prototype.fmt=function(){return a(this,arguments)},String.prototype.w=function(){return b(this)},String.prototype.loc=function(){return c(this,arguments)},String.prototype.camelize=function(){return d(this)},String.prototype.decamelize=function(){return e(this)},String.prototype.dasherize=function(){return f(this)},String.prototype.underscore=function(){return g(this)})}(),function(){var a=Array.prototype.slice;Ember.EXTEND_PROTOTYPES&&(Function.prototype.property=function(){var a=Ember.computed(this);return a.property.apply(a,arguments)},Function.prototype.observes=function(){return this.__ember_observes__=a.call(arguments),this},Function.prototype.observesBefore=function(){return this.__ember_observesBefore__=a.call(arguments),this})}(),function(){}(),function(){function f(){return e.length===0?{}:e.pop()}function g(a){return e.push(a),null}function h(b,c){function e(e){var f=a(e,b);return d?c===f:!!f}var d=arguments.length===2;return e}function i(a,b,c){b.call(a,c[0],c[2],c[3])}var a=Ember.get,b=Ember.set,c=Array.prototype.slice,d=Ember.ArrayUtils.indexOf,e=[];Ember.Enumerable=Ember.Mixin.create({isEnumerable:!0,nextObject:Ember.required(Function),firstObject:Ember.computed(function(){if(a(this,"length")===0)return undefined;var b=f(),c;return c=this.nextObject(0,null,b),g(b),c}).property("[]").cacheable(),lastObject:Ember.computed(function(){var b=a(this,"length");if(b===0)return undefined;var c=f(),d=0,e,h=null;do h=e,e=this.nextObject(d++,h,c);while(e!==undefined);return g(c),h}).property("[]").cacheable(),contains:function(a){return this.find(function(b){return b===a})!==undefined},forEach:function(b,c){if(typeof b!="function")throw new TypeError;var d=a(this,"length"),e=null,h=f();c===undefined&&(c=null);for(var i=0;i<d;i++){var j=this.nextObject(i,e,h);b.call(c,j,i,this),e=j}return e=null,h=g(h),this},getEach:function(a){return this.mapProperty(a)},setEach:function(a,c){return this.forEach(function(d){b(d,a,c)})},map:function(a,b){var c=[];return this.forEach(function(d,e,f){c[e]=a.call(b,d,e,f)}),c},mapProperty:function(b){return this.map(function(c){return a(c,b)})},filter:function(a,b){var c=[];return this.forEach(function(d,e,f){a.call(b,d,e,f)&&c.push(d)}),c},filterProperty:function(a,b){return this.filter(h.apply(this,arguments))},find:function(b,c){var d=a(this,"length");c===undefined&&(c=null);var e=null,h,i=!1,j,k=f();for(var l=0;l<d&&!i;l++){h=this.nextObject(l,e,k);if(i=b.call(c,h,l,this))j=h;e=h}return h=e=null,k=g(k),j},findProperty:function(a,b){return this.find(h.apply(this,arguments))},every:function(a,b){return!this.find(function(c,d,e){return!a.call(b,c,d,e)})},everyProperty:function(a,b){return this.every(h.apply(this,arguments))},some:function(a,b){return!!this.find(function(c,d,e){return!!a.call(b,c,d,e)})},someProperty:function(a,b){return this.some(h.apply(this,arguments))},reduce:function(a,b,c){if(typeof a!="function")throw new TypeError;var d=b;return this.forEach(function(b,e){d=a.call(null,d,b,e,this,c)},this),d},invoke:function(a){var b,d=[];return arguments.length>1&&(b=c.call(arguments,1)),this.forEach(function(c,e){var f=c&&c[a];"function"==typeof f&&(d[e]=b?f.apply(c,b):f.call(c))},this),d},toArray:function(){var a=[];return this.forEach(function(b,c){a[c]=b}),a},compact:function(){return this.without(null)},without:function(a){if(!this.contains(a))return this;var b=[];return this.forEach(function(c){c!==a&&(b[b.length]=c)}),b},uniq:function(){var a=[];return this.forEach(function(b){d(a,b)<0&&a.push(b)}),a},"[]":Ember.computed(function(a,b){return this}).property().cacheable(),addEnumerableObserver:function(b,c){var d=c&&c.willChange||"enumerableWillChange",e=c&&c.didChange||"enumerableDidChange",f=a(this,"hasEnumerableObservers");return f||Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.addListener(this,"@enumerable:before",b,d,i),Ember.addListener(this,"@enumerable:change",b,e,i),f||Ember.propertyDidChange(this,"hasEnumerableObservers"),this},removeEnumerableObserver:function(b,c){var d=c&&c.willChange||"enumerableWillChange",e=c&&c.didChange||"enumerableDidChange",f=a(this,"hasEnumerableObservers");return f&&Ember.propertyWillChange(this,"hasEnumerableObservers"),Ember.removeListener(this,"@enumerable:before",b,d),Ember.removeListener(this,"@enumerable:change",b,e),f&&Ember.propertyDidChange(this,"hasEnumerableObservers"),this},hasEnumerableObservers:Ember.computed(function(){return Ember.hasListeners(this,"@enumerable:change")||Ember.hasListeners(this,"@enumerable:before")}).property().cacheable(),enumerableContentWillChange:function(b,c){var d,e,f;return"number"==typeof b?d=b:b?d=a(b,"length"):d=b=-1,"number"==typeof c?e=c:c?e=a(c,"length"):e=c=-1,f=e<0||d<0||e-d!==0,b===-1&&(b=null),c===-1&&(c=null),Ember.propertyWillChange(this,"[]"),f&&Ember.propertyWillChange(this,"length"),Ember.sendEvent(this,"@enumerable:before",b,c),this},enumerableContentDidChange:function(b,c){var d=this.propertyDidChange,e,f,g;return"number"==typeof b?e=b:b?e=a(b,"length"):e=b=-1,"number"==typeof c?f=c:c?f=a(c,"length"):f=c=-1,g=f<0||e<0||f-e!==0,b===-1&&(b=null),c===-1&&(c=null),Ember.sendEvent(this,"@enumerable:change",b,c),g&&Ember.propertyDidChange(this,"length"),Ember.propertyDidChange(this,"[]"),this}})}(),function(){function f(a){return a===null||a===undefined}function g(a,b,c){b.call(a,c[0],c[2],c[3],c[4])}var a=Ember.get,b=Ember.set,c=Ember.meta,d=Ember.ArrayUtils.map,e=Ember.cacheFor;Ember.Array=Ember.Mixin.create(Ember.Enumerable,{isSCArray:!0,length:Ember.required(),objectAt:function(b){return b<0||b>=a(this,"length")?undefined:a(this,b)},objectsAt:function(a){var b=this;return d(a,function(a){return b.objectAt(a)})},nextObject:function(a){return this.objectAt(a)},"[]":Ember.computed(function(b,c){return c!==undefined&&this.replace(0,a(this,"length"),c),this}).property().cacheable(),firstObject:Ember.computed(function(){return this.objectAt(0)}).property().cacheable(),lastObject:Ember.computed(function(){return this.objectAt(a(this,"length")-1)}).property().cacheable(),contains:function(a){return this.indexOf(a)>=0},slice:function(b,c){var d=[],e=a(this,"length");f(b)&&(b=0);if(f(c)||c>e)c=e;while(b<c)d[d.length]=this.objectAt(b++);return d},indexOf:function(b,c){var d,e=a(this,"length");c===undefined&&(c=0),c<0&&(c+=e);for(d=c;d<e;d++)if(this.objectAt(d,!0)===b)return d;return-1},lastIndexOf:function(b,c){var d,e=a(this,"length");if(c===undefined||c>=e)c=e-1;c<0&&(c+=e);for(d=c;d>=0;d--)if(this.objectAt(d)===b)return d;return-1},addArrayObserver:function(b,c){var d=c&&c.willChange||"arrayWillChange",e=c&&c.didChange||"arrayDidChange",f=a(this,"hasArrayObservers");return f||Ember.propertyWillChange(this,"hasArrayObservers"),Ember.addListener(this,"@array:before",b,d,g),Ember.addListener(this,"@array:change",b,e,g),f||Ember.propertyDidChange(this,"hasArrayObservers"),this},removeArrayObserver:function(b,c){var d=c&&c.willChange||"arrayWillChange",e=c&&c.didChange||"arrayDidChange",f=a(this,"hasArrayObservers");return f&&Ember.propertyWillChange(this,"hasArrayObservers"),Ember.removeListener(this,"@array:before",b,d,g),Ember.removeListener(this,"@array:change",b,e,g),f&&Ember.propertyDidChange(this,"hasArrayObservers"),this},hasArrayObservers:Ember.computed(function(){return Ember.hasListeners(this,"@array:change")||Ember.hasListeners(this,"@array:before")}).property().cacheable(),arrayContentWillChange:function(b,c,d){b===undefined?(b=0,c=d=-1):(c===undefined&&(c=-1),d===undefined&&(d=-1)),Ember.sendEvent(this,"@array:before",b,c,d);var e,f;if(b>=0&&c>=0&&a(this,"hasEnumerableObservers")){e=[],f=b+c;for(var g=b;g<f;g++)e.push(this.objectAt(g))}else e=c;return this.enumerableContentWillChange(e,d),Ember.isWatching(this,"@each")&&a(this,"@each"),this},arrayContentDidChange:function(b,c,d){b===undefined?(b=0,c=d=-1):(c===undefined&&(c=-1),d===undefined&&(d=-1));var f,g;if(b>=0&&d>=0&&a(this,"hasEnumerableObservers")){f=[],g=b+d;for(var h=b;h<g;h++)f.push(this.objectAt(h))}else f=d;this.enumerableContentDidChange(c,f),Ember.sendEvent(this,"@array:change",b,c,d);var i=a(this,"length"),j=e(this,"firstObject"),k=e(this,"lastObject");return this.objectAt(0)!==j&&(Ember.propertyWillChange(this,"firstObject"),Ember.propertyDidChange(this,"firstObject")),this.objectAt(i-1)!==k&&(Ember.propertyWillChange(this,"lastObject"),Ember.propertyDidChange(this,"lastObject")),this},"@each":Ember.computed(function(){return this.__each||(this.__each=new Ember.EachProxy(this)),this.__each}).property().cacheable()})}(),function(){Ember.Comparable=Ember.Mixin.create({isComparable:!0,compare:Ember.required(Function)})}(),function(){var a=Ember.get,b=Ember.set;Ember.Copyable=Ember.Mixin.create({copy:Ember.required(Function),frozenCopy:function(){if(Ember.Freezable&&Ember.Freezable.detect(this))return a(this,"isFrozen")?this:this.copy().freeze();throw new Error(Ember.String.fmt("%@ does not support freezing",[this]))}})}(),function(){var a=Ember.get,b=Ember.set;Ember.Freezable=Ember.Mixin.create({isFrozen:!1,freeze:function(){return a(this,"isFrozen")?this:(b(this,"isFrozen",!0),this)}}),Ember.FROZEN_ERROR="Frozen object cannot be modified."}(),function(){var a=Ember.ArrayUtils.forEach;Ember.MutableEnumerable=Ember.Mixin.create(Ember.Enumerable,{addObject:Ember.required(Function),addObjects:function(b){return Ember.beginPropertyChanges(this),a(b,function(a){this.addObject(a)},this),Ember.endPropertyChanges(this),this},removeObject:Ember.required(Function),removeObjects:function(b){return Ember.beginPropertyChanges(this),a(b,function(a){this.removeObject(a)},this),Ember.endPropertyChanges(this),this}})}(),function(){var a="Index out of range",b=[],c=Ember.get,d=Ember.set,e=Ember.ArrayUtils.forEach;Ember.MutableArray=Ember.Mixin.create(Ember.Array,Ember.MutableEnumerable,{replace:Ember.required(),clear:function(){var a=c(this,"length");return a===0?this:(this.replace(0,a,b),this)},insertAt:function(b,d){if(b>c(this,"length"))throw new Error(a);return this.replace(b,0,[d]),this},removeAt:function(d,e){var f=0;if("number"==typeof d){if(d<0||d>=c(this,"length"))throw new Error(a);e===undefined&&(e=1),this.replace(d,e,b)}return this},pushObject:function(a){return this.insertAt(c(this,"length"),a),a},pushObjects:function(a){return this.replace(c(this,"length"),0,a),this},popObject:function(){var a=c(this,"length");if(a===0)return null;var b=this.objectAt(a-1);return this.removeAt(a-1,1),b},shiftObject:function(){if(c(this,"length")===0)return null;var a=this.objectAt(0);return this.removeAt(0),a},unshiftObject:function(a){return this.insertAt(0,a),a},unshiftObjects:function(a){return this.replace(0,0,a),this},removeObject:function(a){var b=c(this,"length")||0;while(--b>=0){var d=this.objectAt(b);d===a&&this.removeAt(b)}return this},addObject:function(a){return this.contains(a)||this.pushObject(a),this}})}(),function(){var a=Ember.get,b=Ember.set;Ember.Observable=Ember.Mixin.create({isObserverable:!0,get:function(b){return a(this,b)},getProperties:function(){var b={},c=arguments;arguments.length===1&&Ember.typeOf(arguments[0])==="array"&&(c=arguments[0]);for(var d=0;d<c.length;d++)b[c[d]]=a(this,c[d]);return b},set:function(a,c){return b(this,a,c),this},setProperties:function(a){return Ember.setProperties(this,a)},beginPropertyChanges:function(){return Ember.beginPropertyChanges(),this},endPropertyChanges:function(){return Ember.endPropertyChanges(),this},propertyWillChange:function(a){return Ember.propertyWillChange(this,a),this},propertyDidChange:function(a){return Ember.propertyDidChange(this,a),this},notifyPropertyChange:function(a){return this.propertyWillChange(a),this.propertyDidChange(a),this},addObserver:function(a,b,c){Ember.addObserver(this,a,b,c)},removeObserver:function(a,b,c){Ember.removeObserver(this,a,b,c)},hasObserverFor:function(a){return Ember.hasListeners(this,a+":change")},unknownProperty:function(a){return undefined},setUnknownProperty:function(a,b){this[a]=b},getPath:function(a){return Ember.getPath(this,a)},setPath:function(a,b){return Ember.setPath(this,a,b),this},getWithDefault:function(a,b){return Ember.getWithDefault(this,a,b)},incrementProperty:function(c,d){return d||(d=1),b(this,c,(a(this,c)||0)+d),a(this,c)},decrementProperty:function(c,d){return d||(d=1),b(this,c,(a(this,c)||0)-d),a(this,c)},toggleProperty:function(c){return b(this,c,!a(this,c)),a(this,c)},cacheFor:function(a){return Ember.cacheFor(this,a)},observersForKey:function(a){return Ember.observersFor(this,a)}})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath;Ember.TargetActionSupport=Ember.Mixin.create({target:null,action:null,targetObject:Ember.computed(function(){var b=a(this,"target");if(Ember.typeOf(b)==="string"){var d=c(this,b);return d===undefined&&(d=c(window,b)),d}return b}).property("target").cacheable(),triggerAction:function(){var b=a(this,"action"),c=a(this,"targetObject");if(c&&b){var d;return typeof c.send=="function"?d=c.send(b,this):(typeof b=="string"&&(b=c[b]),d=b.call(c,this)),d!==!1&&(d=!0),d}return!1}})}(),function(){function d(a,b,d){var e=c.call(d,2);b.apply(a,e)}var a=Ember.get,b=Ember.set,c=Array.prototype.slice;Ember.Evented=Ember.Mixin.create({on:function(a,b,c){c||(c=b,b=null),Ember.addListener(this,a,b,c,d)},fire:function(a){Ember.sendEvent.apply(null,[this,a].concat(c.call(arguments,1)))},off:function(a,b,c){Ember.removeListener(this,a,b,c)}})}(),function(){}(),function(){function i(){var c=!1,d,e=!1,g=!1,i=function(){c||i.proto(),d?(this.reopen.apply(this,d),d=null,a(this),Ember.Mixin.finishPartial(this),this.init.apply(this,arguments)):(g?a(this):(Ember.GUID_DESC.value=undefined,f(this,Ember.GUID_KEY,Ember.GUID_DESC)),e===!1&&(e=this.init),Ember.GUID_DESC.value=undefined,f(this,"_super",Ember.GUID_DESC),Ember.Mixin.finishPartial(this),e.apply(this,arguments))};return i.toString=b,i.willReopen=function(){c&&(i.PrototypeMixin=Ember.Mixin.create(i.PrototypeMixin)),c=!1},i._initMixins=function(a){d=a},i.proto=function(){var a=i.superclass;return a&&a.proto(),c||(c=!0,i.PrototypeMixin.applyPartial(i.prototype),Ember.rewatch(i.prototype),g=!!h(i.prototype,!1).chains),this.prototype},i}var a=Ember.rewatch,b=Ember.Mixin.prototype.toString,c=Ember.set,d=Ember.get,e=Ember.platform.create,f=Ember.platform.defineProperty,g=Array.prototype.slice,h=Ember.meta,j=i();j.PrototypeMixin=Ember.Mixin.create({reopen:function(){return Ember.Mixin._apply(this,arguments,!0),this},isInstance:!0,init:function(){},isDestroyed:!1,isDestroying:!1,destroy:function(){if(this.isDestroying)return;return this.isDestroying=!0,this.willDestroy&&this.willDestroy(),c(this,"isDestroyed",!0),Ember.run.schedule("destroy",this,this._scheduledDestroy),this},_scheduledDestroy:function(){Ember.destroy(this),this.didDestroy&&this.didDestroy()},bind:function(a,b){return b instanceof Ember.Binding||(b=Ember.Binding.from(b)),b.to(a).connect(this),b},toString:function(){return"<"+this.constructor.toString()+":"+Ember.guidFor(this)+">"}}),j.__super__=null;var k=Ember.Mixin.create({ClassMixin:Ember.required(),PrototypeMixin:Ember.required(),isClass:!0,isMethod:!1,extend:function(){var a=i(),b;a.ClassMixin=Ember.Mixin.create(this.ClassMixin),a.PrototypeMixin=Ember.Mixin.create(this.PrototypeMixin),a.ClassMixin.ownerConstructor=a,a.PrototypeMixin.ownerConstructor=a;var c=a.PrototypeMixin;return c.reopen.apply(c,arguments),a.superclass=this,a.__super__=this.prototype,b=a.prototype=e(this.prototype),b.constructor=a,Ember.generateGuid(b,"ember"),h(b).proto=b,a.subclasses=Ember.Set?new Ember.Set:null,this.subclasses&&this.subclasses.add(a),a.ClassMixin.apply(a),a},create:function(){var a=this;return arguments.length>0&&this._initMixins(arguments),new a},reopen:function(){this.willReopen();var a=this.PrototypeMixin;return a.reopen.apply(a,arguments),this},reopenClass:function(){var a=this.ClassMixin;return a.reopen.apply(a,arguments),Ember.Mixin._apply(this,arguments,!1),this},detect:function(a){if("function"!=typeof a)return!1;while(a){if(a===this)return!0;a=a.superclass}return!1},detectInstance:function(a){return a instanceof this},metaForProperty:function(a){var b=h(this.proto(),!1).descs[a];return b._meta||{}},eachComputedProperty:function(a,b){var c=this.proto(),d=h(c).descs,e={},f;for(var g in d)f=d[g],f instanceof Ember.ComputedProperty&&a.call(b||this,g,f._meta||e)}});j.ClassMixin=k,k.apply(j),Ember.CoreObject=j}(),function(){var a=Ember.get,b=Ember.set,c=Ember.guidFor,d=Ember.none;Ember.Set=Ember.CoreObject.extend(Ember.MutableEnumerable,Ember.Copyable,Ember.Freezable,{length:0,clear:function(){if(this.isFrozen)throw new Error(Ember.FROZEN_ERROR);var d=a(this,"length");if(d===0)return this;var e;this.enumerableContentWillChange(d,0),Ember.propertyWillChange(this,"firstObject"),Ember.propertyWillChange(this,"lastObject");for(var f=0;f<d;f++)e=c(this[f]),delete this[e],delete this[f];return b(this,"length",0),Ember.propertyDidChange(this,"firstObject"),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(d,0),this},isEqual:function(b){if(!Ember.Enumerable.detect(b))return!1;var c=a(this,"length");if(a(b,"length")!==c)return!1;while(--c>=0)if(!b.contains(this[c]))return!1;return!0},add:Ember.alias("addObject"),remove:Ember.alias("removeObject"),pop:function(){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);var b=this.length>0?this[this.length-1]:null;return this.remove(b),b},push:Ember.alias("addObject"),shift:Ember.alias("pop"),unshift:Ember.alias("push"),addEach:Ember.alias("addObjects"),removeEach:Ember.alias("removeObjects"),init:function(a){this._super(),a&&this.addObjects(a)},nextObject:function(a){return this[a]},firstObject:Ember.computed(function(){return this.length>0?this[0]:undefined}).property().cacheable(),lastObject:Ember.computed(function(){return this.length>0?this[this.length-1]:undefined}).property().cacheable(),addObject:function(e){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(d(e))return this;var f=c(e),g=this[f],h=a(this,"length"),i;return g>=0&&g<h&&this[g]===e?this:(i=[e],this.enumerableContentWillChange(null,i),Ember.propertyWillChange(this,"lastObject"),h=a(this,"length"),this[f]=h,this[h]=e,b(this,"length",h+1),Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(null,i),this)},removeObject:function(e){if(a(this,"isFrozen"))throw new Error(Ember.FROZEN_ERROR);if(d(e))return this;var f=c(e),g=this[f],h=a(this,"length"),i=g===0,j=g===h-1,k,l;return g>=0&&g<h&&this[g]===e&&(l=[e],this.enumerableContentWillChange(l,null),i&&Ember.propertyWillChange(this,"firstObject"),j&&Ember.propertyWillChange(this,"lastObject"),g<h-1&&(k=this[h-1],this[g]=k,this[c(k)]=g),delete this[f],delete this[h-1],b(this,"length",h-1),i&&Ember.propertyDidChange(this,"firstObject"),j&&Ember.propertyDidChange(this,"lastObject"),this.enumerableContentDidChange(l,null)),this},contains:function(a){return this[c(a)]>=0},copy:function(){var d=this.constructor,e=new d,f=a(this,"length");b(e,"length",f);while(--f>=0)e[f]=this[f],e[c(this[f])]=f;return e},toString:function(){var a=this.length,b,c=[];for(b=0;b<a;b++)c[b]=this[b];return"Ember.Set<%@>".fmt(c.join(","))}})}(),function(){Ember.CoreObject.subclasses=new Ember.Set,Ember.Object=Ember.CoreObject.extend(Ember.Observable)}(),function(){var a=Ember.ArrayUtils.indexOf;Ember.Namespace=Ember.Object.extend({isNamespace:!0,init:function(){Ember.Namespace.NAMESPACES.push(this),Ember.Namespace.PROCESSED=!1},toString:function(){return Ember.identifyNamespaces(),this[Ember.GUID_KEY+"_name"]},destroy:function(){var b=Ember.Namespace.NAMESPACES;window[this.toString()]=undefined,b.splice(a(b,this),1),this._super()}}),Ember.Namespace.NAMESPACES=[Ember],Ember.Namespace.PROCESSED=!1}(),function(){Ember.Application=Ember.Namespace.extend()}(),function(){var a=Ember.get,b=Ember.set;Ember.ArrayProxy=Ember.Object.extend(Ember.MutableArray,{content:null,objectAtContent:function(b){return a(this,"content").objectAt(b)},replaceContent:function(b,c,d){a(this,"content").replace(b,c,d)},contentWillChange:Ember.beforeObserver(function(){var b=a(this,"content"),c=b?a(b,"length"):0;this.arrayWillChange(b,0,c,undefined),b&&b.removeArrayObserver(this)},"content"),contentDidChange:Ember.observer(function(){var b=a(this,"content"),c=b?a(b,"length"):0;b&&b.addArrayObserver(this),this.arrayDidChange(b,0,undefined,c)},"content"),objectAt:function(b){return a(this,"content")&&this.objectAtContent(b)},length:Ember.computed(function(){var b=a(this,"content");return b?a(b,"length"):0}).property().cacheable(),replace:function(b,c,d){return a(this,"content")&&this.replaceContent(b,c,d),this},arrayWillChange:function(a,b,c,d){this.arrayContentWillChange(b,c,d)},arrayDidChange:function(a,b,c,d){this.arrayContentDidChange(b,c,d)},init:function(){this._super(),this.contentWillChange(),this.contentDidChange()}})}(),function(){function g(a,b,d,e,f){var g=d._objects,h;g||(g=d._objects={});while(--f>=e){var i=a.objectAt(f);i&&(Ember.addBeforeObserver(i,b,d,"contentKeyWillChange"),Ember.addObserver(i,b,d,"contentKeyDidChange"),h=c(i),g[h]||(g[h]=[]),g[h].push(f))}}function h(a,b,d,e,f){var g=d._objects;g||(g=d._objects={});var h,i;while(--f>=e){var j=a.objectAt(f);j&&(Ember.removeBeforeObserver(j,b,d,"contentKeyWillChange"),Ember.removeObserver(j,b,d,"contentKeyDidChange"),i=c(j),h=g[i],h[h.indexOf(f)]=null)}}var a=Ember.set,b=Ember.get,c=Ember.guidFor,d=Ember.ArrayUtils.forEach,e=Ember.Object.extend(Ember.Array,{init:function(a,b,c){this._super(),this._keyName=b,this._owner=c,this._content=a},objectAt:function(a){var c=this._content.objectAt(a);return c&&b(c,this._keyName)},length:Ember.computed(function(){var a=this._content;return a?b(a,"length"):0}).property().cacheable()}),f=/^.+:(before|change)$/;Ember.EachProxy=Ember.Object.extend({init:function(a){this._super(),this._content=a,a.addArrayObserver(this),d(Ember.watchedEvents(this),function(a){this.didAddListener(a)},this)},unknownProperty:function(a,b){var c;return c=new e(this._content,a,this),(new Ember.Descriptor).setup(this,a,c),this.beginObservingContentKey(a),c},arrayWillChange:function(a,b,c,d){var e=this._keys,f,g,i;i=c>0?b+c:-1,Ember.beginPropertyChanges(this);for(f in e){if(!e.hasOwnProperty(f))continue;i>0&&h(a,f,this,b,i),Ember.propertyWillChange(this,f)}Ember.propertyWillChange(this._content,"@each"),Ember.endPropertyChanges(this)},arrayDidChange:function(a,b,c,d){var e=this._keys,f,h,i;i=d>0?b+d:-1,Ember.beginPropertyChanges(this);for(f in e){if(!e.hasOwnProperty(f))continue;i>0&&g(a,f,this,b,i),Ember.propertyDidChange(this,f)}Ember.propertyDidChange(this._content,"@each"),Ember.endPropertyChanges(this)},didAddListener:function(a){f.test(a)&&this.beginObservingContentKey(a.slice(0,-7))},didRemoveListener:function(a){f.test(a)&&this.stopObservingContentKey(a.slice(0,-7))},beginObservingContentKey:function(a){var c=this._keys;c||(c=this._keys={});if(!c[a]){c[a]=1;var d=this._content,e=b(d,"length");g(d,a,this,0,e)}else c[a]++},stopObservingContentKey:function(a){var c=this._keys;if(c&&c[a]>0&&--c[a]<=0){var d=this._content,e=b(d,"length");h(d,a,this,0,e)}},contentKeyWillChange:function(a,b){Ember.propertyWillChange(this,b)},contentKeyDidChange:function(a,b){Ember.propertyDidChange(this,b)}})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.Mixin.create(Ember.MutableArray,Ember.Observable,Ember.Copyable,{get:function(a){return a==="length"?this.length:"number"==typeof a?this[a]:this._super(a)},objectAt:function(a){return this[a]},replace:function(b,c,d){if(this.isFrozen)throw Ember.FROZEN_ERROR;var e=d?a(d,"length"):0;this.arrayContentWillChange(b,c,e);if(!d||d.length===0)this.splice(b,c);else{var f=[b,c].concat(d);this.splice.apply(this,f)}return this.arrayContentDidChange(b,c,e),this},unknownProperty:function(a,b){var c;return b!==undefined&&c===undefined&&(c=this[a]=b),c},indexOf:function(a,b){var c,d=this.length;b===undefined?b=0:b=b<0?Math.ceil(b):Math.floor(b),b<0&&(b+=d);for(c=b;c<d;c++)if(this[c]===a)return c;return-1},lastIndexOf:function(a,b){var c,d=this.length;b===undefined?b=d-1:b=b<0?Math.ceil(b):Math.floor(b),b<0&&(b+=d);for(c=b;c>=0;c--)if(this[c]===a)return c;return-1},copy:function(){return this.slice()}}),d=["length"];Ember.ArrayUtils.forEach(c.keys(),function(a){Array.prototype[a]&&d.push(a)}),d.length>0&&(c=c.without.apply(c,d)),Ember.NativeArray=c,Ember.A=function(a){return a===undefined&&(a=[]),Ember.NativeArray.apply(a)},Ember.NativeArray.activate=function(){c.apply(Array.prototype),Ember.A=function(a){return a||[]}},Ember.EXTEND_PROTOTYPES&&Ember.NativeArray.activate()}(),function(){var a=Ember.guidFor,b=Ember.ArrayUtils.indexOf,c=Ember.OrderedSet=function(){this.clear()};c.create=function(){return new c},c.prototype={clear:function(){this.presenceSet={},this.list=[]},add:function(b){var c=a(b),d=this.presenceSet,e=this.list;if(c in d)return;d[c]=!0,e.push(b)},remove:function(c){var d=a(c),e=this.presenceSet,f=this.list;delete e[d];var g=b(f,c);g>-1&&f.splice(g,1)},isEmpty:function(){return this.list.length===0},forEach:function(a,b){var c=this.list.slice();for(var d=0,e=c.length;d<e;d++)a.call(b,c[d])},toArray:function(){return this.list.slice()}};var d=Ember.Map=function(){this.keys=Ember.OrderedSet.create(),this.values={}};d.create=function(){return new d},d.prototype={get:function(b){var c=this.values,d=a(b);return c[d]},set:function(b,c){var d=this.keys,e=this.values,f=a(b);d.add(b),e[f]=c},remove:function(b){var c=this.keys,d=this.values,e=a(b),f;return d.hasOwnProperty(e)?(c.remove(b),f=d[e],delete d[e],!0):!1},has:function(b){var c=this.values,d=a(b);return c.hasOwnProperty(d)},forEach:function(b,c){var d=this.keys,e=this.values;d.forEach(function(
d){var f=a(d);b.call(c,d,e[f])})}}}(),function(){var a={},b={};Ember.onLoad=function(c,d){var e;a[c]=a[c]||Ember.A(),a[c].pushObject(d),(e=b[c])&&d(e)},Ember.runLoadHooks=function(c,d){var e;b[c]=d,(e=a[c])&&a[c].forEach(function(a){a(d)})}}(),function(){}(),function(){Ember.ArrayController=Ember.ArrayProxy.extend()}(),function(){}(),function(){}(),function(){var a=Ember.get,b=Ember.set;Ember.Application=Ember.Namespace.extend({rootElement:"body",eventDispatcher:null,customEvents:null,init:function(){var c,d=a(this,"rootElement");this._super(),c=Ember.EventDispatcher.create({rootElement:d}),b(this,"eventDispatcher",c);if(Ember.$.isReady)Ember.run.once(this,this.didBecomeReady);else{var e=this;Ember.$(document).ready(function(){Ember.run.once(e,e.didBecomeReady)})}},initialize:function(b){var c=Ember.A(Ember.keys(this)),d=a(this.constructor,"injections"),e=this,f,g;Ember.runLoadHooks("application",this),c.forEach(function(a){d.forEach(function(c){c(e,b,a)})})},didBecomeReady:function(){var b=a(this,"eventDispatcher"),c=a(this,"stateManager"),d=a(this,"customEvents");b.setup(d),this.ready(),c&&c instanceof Ember.Router&&this.setupStateManager(c)},setupStateManager:function(b){var c=a(b,"location");b.route(c.getURL()),c.onUpdateURL(function(a){b.route(a)})},ready:Ember.K,destroy:function(){return a(this,"eventDispatcher").destroy(),this._super()},registerInjection:function(a){this.constructor.registerInjection(a)}}),Ember.Application.reopenClass({concatenatedProperties:["injections"],injections:Ember.A(),registerInjection:function(b){a(this,"injections").pushObject(b)}}),Ember.Application.registerInjection(function(a,b,c){if(!/^[A-Z].*Controller$/.test(c))return;var d=c[0].toLowerCase()+c.substr(1),e=a[c].create();b.set(d,e),e.set("target",b)})}(),function(){var a=Ember.get,b=Ember.set;Ember.HashLocation=Ember.Object.extend({init:function(){b(this,"location",a(this,"location")||window.location),b(this,"callbacks",Ember.A())},getURL:function(){return a(this,"location").hash.substr(1)},setURL:function(c){a(this,"location").hash=c,b(this,"lastSetURL",c)},onUpdateURL:function(c){var d=this,e=function(){var e=location.hash.substr(1);if(a(d,"lastSetURL")===e)return;b(d,"lastSetURL",null),c(location.hash.substr(1))};a(this,"callbacks").pushObject(e),window.addEventListener("hashchange",e)},willDestroy:function(){a(this,"callbacks").forEach(function(a){window.removeEventListener("hashchange",a)}),b(this,"callbacks",null)}}),Ember.Location={create:function(a){var b=a&&a.style;if(b==="hash")return Ember.HashLocation.create.apply(Ember.HashLocation,arguments)}}}(),function(){}(),function(){}(),function(){Ember.$=window.jQuery}(),function(){var a=Ember.get,b=Ember.set,c=Ember.ArrayUtils.forEach,d=Ember.ArrayUtils.indexOf,e=function(){this.seen={},this.list=[]};e.prototype={add:function(a){if(a in this.seen)return;this.seen[a]=!0,this.list.push(a)},toDOM:function(){return this.list.join(" ")}},Ember.RenderBuffer=function(a){return new Ember._RenderBuffer(a)},Ember._RenderBuffer=function(a){this.elementTag=a,this.childBuffers=[]},Ember._RenderBuffer.prototype={elementClasses:null,elementId:null,elementAttributes:null,elementTag:null,elementStyle:null,parentBuffer:null,push:function(a){return this.childBuffers.push(String(a)),this},addClass:function(a){var b=this.elementClasses=this.elementClasses||new e;return this.elementClasses.add(a),this},id:function(a){return this.elementId=a,this},attr:function(a,b){var c=this.elementAttributes=this.elementAttributes||{};return arguments.length===1?c[a]:(c[a]=b,this)},removeAttr:function(a){var b=this.elementAttributes;return b&&delete b[a],this},style:function(a,b){var c=this.elementStyle=this.elementStyle||{};return this.elementStyle[a]=b,this},newBuffer:function(a,b,c,d){var e=new Ember._RenderBuffer(a);return e.parentBuffer=b,d&&e.setProperties(d),c&&c.call(this,e),e},replaceWithBuffer:function(a){var b=this.parentBuffer;if(!b)return;var c=b.childBuffers,e=d(c,this);a?c.splice(e,1,a):c.splice(e,1)},begin:function(a){return this.newBuffer(a,this,function(a){this.childBuffers.push(a)})},prepend:function(a){return this.newBuffer(a,this,function(a){this.childBuffers.splice(0,0,a)})},replaceWith:function(a){var b=this.parentBuffer;return this.newBuffer(a,b,function(a){this.replaceWithBuffer(a)})},insertAfter:function(b){var c=a(this,"parentBuffer");return this.newBuffer(b,c,function(a){var b=c.childBuffers,e=d(b,this);b.splice(e+1,0,a)})},end:function(){var a=this.parentBuffer;return a||this},remove:function(){this.replaceWithBuffer(null)},element:function(){return Ember.$(this.string())[0]},string:function(){var a="",b=this.elementTag,d;if(b){var e=this.elementId,f=this.elementClasses,g=this.elementAttributes,h=this.elementStyle,i="",j;d=["<"+b],e&&d.push('id="'+this._escapeAttribute(e)+'"'),f&&d.push('class="'+this._escapeAttribute(f.toDOM())+'"');if(h){for(j in h)h.hasOwnProperty(j)&&(i+=j+":"+this._escapeAttribute(h[j])+";");d.push('style="'+i+'"')}if(g)for(j in g)g.hasOwnProperty(j)&&d.push(j+'="'+this._escapeAttribute(g[j])+'"');d=d.join(" ")+">"}var k=this.childBuffers;return c(k,function(b){var c=typeof b=="string";a+=c?b:b.string()}),b?d+a+"</"+b+">":a},_escapeAttribute:function(a){var b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[<>"'`]/g,d=/[&<>"'`]/,e=function(a){return b[a]||"&amp;"},f=a.toString();return d.test(f)?f.replace(c,e):f}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.String.fmt;Ember.EventDispatcher=Ember.Object.extend({rootElement:"body",setup:function(b){var c,d={touchstart:"touchStart",touchmove:"touchMove",touchend:"touchEnd",touchcancel:"touchCancel",keydown:"keyDown",keyup:"keyUp",keypress:"keyPress",mousedown:"mouseDown",mouseup:"mouseUp",contextmenu:"contextMenu",click:"click",dblclick:"doubleClick",mousemove:"mouseMove",focusin:"focusIn",focusout:"focusOut",mouseenter:"mouseEnter",mouseleave:"mouseLeave",submit:"submit",input:"input",change:"change",dragstart:"dragStart",drag:"drag",dragenter:"dragEnter",dragleave:"dragLeave",dragover:"dragOver",drop:"drop",dragend:"dragEnd"};Ember.$.extend(d,b||{});var e=Ember.$(a(this,"rootElement"));e.addClass("ember-application");for(c in d)d.hasOwnProperty(c)&&this.setupHandler(e,c,d[c])},setupHandler:function(a,b,c){var d=this;a.delegate(".ember-view",b+".ember",function(a,b){var e=Ember.View.views[this.id],f=!0,g=null;return g=d._findNearestEventManager(e,c),g&&g!==b?f=d._dispatchEvent(g,a,c,e):e?f=d._bubbleEvent(e,a,c):a.stopPropagation(),f}),a.delegate("[data-ember-action]",b+".ember",function(a){var b=Ember.$(a.currentTarget).attr("data-ember-action"),d=Ember.Handlebars.ActionHelper.registeredActions[b],e=d.handler;if(d.eventName===c)return e(a)})},_findNearestEventManager:function(b,c){var d=null;while(b){d=a(b,"eventManager");if(d&&d[c])break;b=a(b,"parentView")}return d},_dispatchEvent:function(a,b,c,d){var e=!0,f=a[c];return Ember.typeOf(f)==="function"?(e=f.call(a,b,d),b.stopPropagation()):e=this._bubbleEvent(d,b,c),e},_bubbleEvent:function(a,b,c){return Ember.run(function(){return a.handleEvent(c,b)})},destroy:function(){var b=a(this,"rootElement");return Ember.$(b).undelegate(".ember").removeClass("ember-application"),this._super()}})}(),function(){var a=Ember.run.queues;a.splice(Ember.$.inArray("actions",a)+1,0,"render")}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.addObserver,d=Ember.getPath,e=Ember.meta,f=Ember.String.fmt,g=Array.prototype.slice,h=Ember.ArrayUtils.forEach,i=Ember.computed(function(){var b=a(this,"_childViews"),c=Ember.A();return h(b,function(b){b.isVirtual?c.pushObjects(a(b,"childViews")):c.push(b)}),c}).property().cacheable(),j=Ember.VIEW_PRESERVES_CONTEXT;Ember.TEMPLATES={};var k={preRender:{},inBuffer:{},hasElement:{},inDOM:{},destroyed:{}};Ember.View=Ember.Object.extend(Ember.Evented,{concatenatedProperties:["classNames","classNameBindings","attributeBindings"],isView:!0,templateName:null,layoutName:null,templates:Ember.TEMPLATES,template:Ember.computed(function(b,c){if(c!==undefined)return c;var d=a(this,"templateName"),e=this.templateForName(d,"template");return e||a(this,"defaultTemplate")}).property("templateName").cacheable(),controller:null,layout:Ember.computed(function(b,c){if(arguments.length===2)return c;var d=a(this,"layoutName"),e=this.templateForName(d,"layout");return e||a(this,"defaultLayout")}).property("layoutName").cacheable(),templateForName:function(b,c){if(!b)return;var d=a(this,"templates"),e=a(d,b);if(!e)throw new Ember.Error(f('%@ - Unable to find %@ "%@".',[this,c,b]));return e},templateContext:Ember.computed(function(c,d){return arguments.length===2?(b(this,"_templateContext",d),d):a(this,"_templateContext")}).cacheable(),_templateContext:Ember.computed(function(b,c){var d;if(arguments.length===2)return c;if(j){d=a(this,"_parentView");if(d)return a(d,"_templateContext")}return this}).cacheable(),_displayPropertyDidChange:Ember.observer(function(){this.rerender()},"templateContext","controller"),parentView:Ember.computed(function(){var b=a(this,"_parentView");return b&&b.isVirtual?a(b,"parentView"):b}).property("_parentView").volatile(),_parentView:null,concreteView:Ember.computed(function(){return this.isVirtual?a(this,"parentView"):this}).property("_parentView").volatile(),isVisible:!0,childViews:i,_childViews:[],_childViewsWillChange:Ember.beforeObserver(function(){if(this.isVirtual){var b=a(this,"parentView");b&&Ember.propertyWillChange(b,"childViews")}},"childViews"),_childViewsDidChange:Ember.observer(function(){if(this.isVirtual){var b=a(this,"parentView");b&&Ember.propertyDidChange(b,"childViews")}},"childViews"),nearestInstanceOf:function(b){var c=a(this,"parentView");while(c){if(c instanceof b)return c;c=a(c,"parentView")}},nearestWithProperty:function(b){var c=a(this,"parentView");while(c){if(b in c)return c;c=a(c,"parentView")}},nearestChildOf:function(b){var c=a(this,"parentView");while(c){if(a(c,"parentView")instanceof b)return c;c=a(c,"parentView")}},collectionView:Ember.computed(function(){return this.nearestInstanceOf(Ember.CollectionView)}).cacheable(),itemView:Ember.computed(function(){return this.nearestChildOf(Ember.CollectionView)}).cacheable(),contentView:Ember.computed(function(){return this.nearestWithProperty("content")}).cacheable(),_parentViewDidChange:Ember.observer(function(){if(this.isDestroying)return;this.invokeRecursively(function(a){a.propertyDidChange("collectionView"),a.propertyDidChange("itemView"),a.propertyDidChange("contentView")})},"_parentView"),cloneKeywords:function(){var b=a(this,"templateData"),c=a(this,"controller"),d=b?Ember.copy(b.keywords):{};return d.view=a(this,"concreteView"),c&&(d.controller=c),d},render:function(b){var c=a(this,"layout")||a(this,"template");if(c){var d=a(this,"_templateContext"),e=this.cloneKeywords(),f={view:this,buffer:b,isRenderData:!0,keywords:e},g=c(d,{data:f});g!==undefined&&b.push(g)}},invokeForState:function(a){var b=this.state,c;if(h=k[b][a])return c=g.call(arguments),c[0]=this,h.apply(this,c);var d=this,e=d.states,f;while(e){f=e[b];while(f){var h=f[a];if(h)return k[b][a]=h,c=g.call(arguments,1),c.unshift(this),h.apply(this,c);f=f.parentState}e=e.parent}},rerender:function(){return this.invokeForState("rerender")},clearRenderedChildren:function(){var b=this.lengthBeforeRender,c=this.lengthAfterRender,d=a(this,"_childViews");for(var e=c-1;e>=b;e--)d[e]&&d[e].destroy()},_applyClassNameBindings:function(){var b=a(this,"classNameBindings"),d=a(this,"classNames"),e,f,g;if(!b)return;h(b,function(a){var b,h,i=function(){f=this._classStringForProperty(a),e=this.$(),b&&(e.removeClass(b),d.removeObject(b)),f?(e.addClass(f),b=f):b=null};g=this._classStringForProperty(a),g&&(d.push(g),b=g),h=a.split(":")[0],c(this,h,i)},this)},_applyAttributeBindings:function(b){var d=a(this,"attributeBindings"),e,f,g;if(!d)return;h(d,function(d){var g=d.split(":"),h=g[0],i=g[1]||h,j=function(){f=this.$(),e=a(this,h),Ember.View.applyAttributeBindings(f,i,e)};c(this,h,j),e=a(this,h),Ember.View.applyAttributeBindings(b,i,e)},this)},_classStringForProperty:function(a){var b=a.split(":"),c=b[1];a=b[0];var d=Ember.getPath(this,a,!1);d===undefined&&Ember.isGlobalPath(a)&&(d=Ember.getPath(window,a));if(!!d&&c)return c;if(d===!0){var e=a.split(".");return Ember.String.dasherize(e[e.length-1])}return d!==!1&&d!==undefined&&d!==null?d:null},element:Ember.computed(function(a,b){return b!==undefined?this.invokeForState("setElement",b):this.invokeForState("getElement")}).property("_parentView").cacheable(),$:function(a){return this.invokeForState("$",a)},mutateChildViews:function(b){var c=a(this,"_childViews"),d=a(c,"length"),e;while(--d>=0)e=c[d],b.call(this,e,d);return this},forEachChildView:function(b){var c=a(this,"_childViews");if(!c)return this;var d=a(c,"length"),e,f;for(f=0;f<d;f++)e=c[f],b.call(this,e);return this},appendTo:function(a){return this._insertElementLater(function(){this.$().appendTo(a)}),this},replaceIn:function(a){return this._insertElementLater(function(){Ember.$(a).empty(),this.$().appendTo(a)}),this},_insertElementLater:function(a){this._lastInsert=Ember.guidFor(a),Ember.run.schedule("render",this,this.invokeForState,"insertElement",a)},append:function(){return this.appendTo(document.body)},remove:function(){this.destroyElement(),this.invokeRecursively(function(a){a.clearRenderedChildren()})},elementId:Ember.computed(function(a,b){return b!==undefined?b:Ember.guidFor(this)}).cacheable(),_elementIdDidChange:Ember.beforeObserver(function(){throw"Changing a view's elementId after creation is not allowed."},"elementId"),findElementInParentElement:function(b){var c="#"+a(this,"elementId");return Ember.$(c)[0]||Ember.$(c,b)[0]},renderBuffer:function(b){b=b||a(this,"tagName");if(b===null||b===undefined)b="div";return Ember.RenderBuffer(b)},createElement:function(){if(a(this,"element"))return this;var c=this.renderToBuffer();return b(this,"element",c.element()),this},willInsertElement:Ember.K,didInsertElement:Ember.K,willRerender:Ember.K,invokeRecursively:function(a){a.call(this,this),this.forEachChildView(function(b){b.invokeRecursively(a)})},invalidateRecursively:function(a){this.forEachChildView(function(b){b.propertyDidChange(a)})},_notifyWillInsertElement:function(){this.invokeRecursively(function(a){a.fire("willInsertElement")})},_notifyDidInsertElement:function(){this.invokeRecursively(function(a){a.fire("didInsertElement")})},_notifyWillRerender:function(){this.invokeRecursively(function(a){a.fire("willRerender")})},destroyElement:function(){return this.invokeForState("destroyElement")},willDestroyElement:function(){},_notifyWillDestroyElement:function(){this.invokeRecursively(function(a){a.fire("willDestroyElement")})},_elementWillChange:Ember.beforeObserver(function(){this.forEachChildView(function(a){Ember.propertyWillChange(a,"element")})},"element"),_elementDidChange:Ember.observer(function(){this.forEachChildView(function(a){Ember.propertyDidChange(a,"element")})},"element"),parentViewDidChange:Ember.K,renderToBuffer:function(b,c){var d;Ember.run.sync(),c=c||"begin";if(b){var e=a(this,"tagName");if(e===null||e===undefined)e="div";d=b[c](e)}else d=this.renderBuffer();return this.buffer=d,this.transitionTo("inBuffer",!1),this.lengthBeforeRender=a(a(this,"_childViews"),"length"),this.beforeRender(d),this.render(d),this.afterRender(d),this.lengthAfterRender=a(a(this,"_childViews"),"length"),d},beforeRender:function(a){this.applyAttributesToBuffer(a)},afterRender:Ember.K,applyAttributesToBuffer:function(b){this._applyClassNameBindings(),this._applyAttributeBindings(b),h(a(this,"classNames"),function(a){b.addClass(a)}),b.id(a(this,"elementId"));var c=a(this,"ariaRole");c&&b.attr("role",c),a(this,"isVisible")===!1&&b.style("display","none")},tagName:null,ariaRole:null,classNames:["ember-view"],classNameBindings:[],attributeBindings:[],state:"preRender",init:function(){this._super(),Ember.View.views[a(this,"elementId")]=this;var c=a(this,"_childViews").slice();b(this,"_childViews",c),this.classNameBindings=Ember.A(this.classNameBindings.slice()),this.classNames=Ember.A(this.classNames.slice());var d=a(this,"viewController");d&&(d=Ember.getPath(d),d&&b(d,"view",this))},appendChild:function(a,b){return this.invokeForState("appendChild",a,b)},removeChild:function(c){if(this.isDestroying)return;b(c,"_parentView",null);var d=a(this,"_childViews");return Ember.ArrayUtils.removeObject(d,c),this.propertyDidChange("childViews"),this},removeAllChildren:function(){return this.mutateChildViews(function(a){this.removeChild(a)})},destroyAllChildren:function(){return this.mutateChildViews(function(a){a.destroy()})},removeFromParent:function(){var b=a(this,"_parentView");return this.remove(),b&&b.removeChild(this),this},willDestroy:function(){var c=a(this,"_childViews"),d=a(this,"_parentView"),e=a(this,"elementId"),f;this.removedFromDOM||this.destroyElement();if(this.viewName){var g=a(this,"parentView");g&&b(g,this.viewName,null)}d&&d.removeChild(this),this.state="destroyed",f=a(c,"length");for(var h=f-1;h>=0;h--)c[h].removedFromDOM=!0,c[h].destroy();delete Ember.View.views[a(this,"elementId")]},createChildView:function(c,d){var e,f;if(Ember.View.detect(c)){e={_parentView:this,templateData:a(this,"templateData")},d?c=c.create(e,d):c=c.create(e);var g=c.viewName;g&&b(a(this,"concreteView"),g,c)}else a(c,"templateData")||b(c,"templateData",a(this,"templateData")),b(c,"_parentView",this);return c},becameVisible:Ember.K,becameHidden:Ember.K,_isVisibleDidChange:Ember.observer(function(){var b=a(this,"isVisible");this.$().toggle(b);if(this._isAncestorHidden())return;b?this._notifyBecameVisible():this._notifyBecameHidden()},"isVisible"),_notifyBecameVisible:function(){this.fire("becameVisible"),this.forEachChildView(function(b){var c=a(b,"isVisible");(c||c===null)&&b._notifyBecameVisible()})},_notifyBecameHidden:function(){this.fire("becameHidden"),this.forEachChildView(function(b){var c=a(b,"isVisible");(c||c===null)&&b._notifyBecameHidden()})},_isAncestorHidden:function(){var b=a(this,"parentView");while(b){if(a(b,"isVisible")===!1)return!0;b=a(b,"parentView")}return!1},clearBuffer:function(){this.invokeRecursively(function(a){this.buffer=null})},transitionTo:function(a,b){this.state=a,b!==!1&&this.forEachChildView(function(b){b.transitionTo(a)})},fire:function(a){this[a]&&this[a].apply(this,[].slice.call(arguments,1)),this._super.apply(this,arguments)},handleEvent:function(a,b){return this.invokeForState("handleEvent",a,b)}});var l={prepend:function(a,b){b._insertElementLater(function(){var c=a.$();c.prepend(b.$())})},after:function(a,b){b._insertElementLater(function(){var c=a.$();c.after(b.$())})},replace:function(c){var d=a(c,"element");b(c,"element",null),c._insertElementLater(function(){Ember.$(d).replaceWith(a(c,"element"))})},remove:function(c){var d=a(c,"element");b(c,"element",null),c._lastInsert=null,Ember.$(d).remove()},empty:function(a){a.$().empty()}};Ember.View.reopen({states:Ember.View.states,domManager:l}),Ember.View.views={},Ember.View.childViewsProperty=i,Ember.View.applyAttributeBindings=function(a,b,c){var d=Ember.typeOf(c),e=a.attr(b);(d==="string"||d==="number"&&!isNaN(c))&&c!==e?a.attr(b,c):c&&d==="boolean"?a.attr(b,b):c||a.removeAttr(b)}}(),function(){var a=Ember.get,b=Ember.set;Ember.View.states={_default:{appendChild:function(){throw"You can't use appendChild outside of the rendering process"},$:function(){return Ember.$()},getElement:function(){return null},handleEvent:function(){return!0},destroyElement:function(a){return b(a,"element",null),a._lastInsert=null,a}}},Ember.View.reopen({states:Ember.View.states})}(),function(){Ember.View.states.preRender={parentState:Ember.View.states._default,insertElement:function(a,b){if(a._lastInsert!==Ember.guidFor(b))return;a.createElement(),a._notifyWillInsertElement(),b.call(a),a.transitionTo("inDOM"),a._notifyDidInsertElement()},empty:Ember.K,setElement:function(a,b){return a.beginPropertyChanges(),a.invalidateRecursively("element"),b!==null&&a.transitionTo("hasElement"),a.endPropertyChanges(),b}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta;Ember.View.states.inBuffer={parentState:Ember.View.states._default,$:function(a,b){return a.rerender(),Ember.$()},rerender:function(a){a._notifyWillRerender(),a.clearRenderedChildren(),a.renderToBuffer(a.buffer,"replaceWith")},appendChild:function(b,c,d){var e=b.buffer;return c=this.createChildView(c,d),a(b,"_childViews").push(c),c.renderToBuffer(e),b.propertyDidChange("childViews"),c},destroyElement:function(a){return a.clearBuffer(),a._notifyWillDestroyElement(),a.transitionTo("preRender"),a},empty:function(){},insertElement:function(){throw"You can't insert an element that has already been rendered"},setElement:function(a,b){return a.invalidateRecursively("element"),b===null?a.transitionTo("preRender"):(a.clearBuffer(),a.transitionTo("hasElement")),b}}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta;Ember.View.states.hasElement={parentState:Ember.View.states._default,$:function(b,c){var d=a(b,"element");return c?Ember.$(c,d):Ember.$(d)},getElement:function(b){var c=a(b,"parentView");return c&&(c=a(c,"element")),c?b.findElementInParentElement(c):Ember.$("#"+a(b,"elementId"))[0]},setElement:function(a,b){if(b!==null)throw"You cannot set an element to a non-null value when the element is already in the DOM.";return a.invalidateRecursively("element"),a.transitionTo("preRender"),b},rerender:function(a){return a._notifyWillRerender(),a.clearRenderedChildren(),a.domManager.replace(a),a},destroyElement:function(a){return a._notifyWillDestroyElement(),a.domManager.remove(a),a},empty:function(b){var c=a(b,"_childViews"),d,e;if(c){d=a(c,"length");for(e=0;e<d;e++)c[e]._notifyWillDestroyElement()}b.domManager.empty(b)},handleEvent:function(a,b,c){var d=a[b];return Ember.typeOf(d)==="function"?d.call(a,c):!0}},Ember.View.states.inDOM={parentState:Ember.View.states.hasElement,insertElement:function(a,b){if(a._lastInsert!==Ember.guidFor(b))return;throw"You can't insert an element into the DOM that has already been inserted"}}}(),function(){var a="You can't call %@ on a destroyed view",b=Ember.String.fmt;Ember.View.states.destroyed={parentState:Ember.View.states._default,appendChild:function(){throw b(a,["appendChild"])},rerender:function(){throw b(a,["rerender"])},destroyElement:function(){throw b(a,["destroyElement"])},empty:function(){throw b(a,["empty"])},setElement:function(){throw b(a,["set('element', ...)"])},insertElement:Ember.K}}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.meta,d=Ember.ArrayUtils.forEach,e=Ember.computed(function(){return a(this,"_childViews")}).property("_childViews").cacheable();Ember.ContainerView=Ember.View.extend({init:function(){var c=a(this,"childViews");Ember.defineProperty(this,"childViews",e),this._super();var f=a(this,"_childViews");d(c,function(c,d){var e;"string"==typeof c?(e=a(this,c),e=this.createChildView(e),b(this,c,e)):e=this.createChildView(c),f[d]=e},this),Ember.A(f),a(this,"childViews").addArrayObserver(this,{willChange:"childViewsWillChange",didChange:"childViewsDidChange"})},render:function(a){this.forEachChildView(function(b){b.renderToBuffer(a)})},willDestroy:function(){a(this,"childViews").removeArrayObserver(this,{willChange:"childViewsWillChange",didChange:"childViewsDidChange"}),this._super()},childViewsWillChange:function(a,b,c){if(c===0)return;var d=a.slice(b,b+c);this.initializeViews(d,null,null),this.invokeForState("childViewsWillChange",a,b,c)},childViewsDidChange:function(b,c,d,e){var f=a(b,"length");if(e===0)return;var g=b.slice(c,c+e);this.initializeViews(g,this,a(this,"templateData")),this.invokeForState("childViewsDidChange",b,c,e)},initializeViews:function(c,e,f){d(c,function(c){b(c,"_parentView",e),a(c,"templateData")||b(c,"templateData",f)})},_scheduleInsertion:function(a,b){b?b.domManager.after(b,a):this.domManager.prepend(this,a)},currentView:null,_currentViewWillChange:Ember.beforeObserver(function(){var b=a(this,"childViews"),c=a(this,"currentView");c&&b.removeObject(c)},"currentView"),_currentViewDidChange:Ember.observer(function(){var b=a(this,"childViews"),c=a(this,"currentView");c&&b.pushObject(c)},"currentView")}),Ember.ContainerView.states={parent:Ember.View.states,inBuffer:{childViewsDidChange:function(a,b,c,d){var e=a.buffer,f,g,h,i;c===0?(i=b[c],f=c+1,i.renderToBuffer(e,"prepend")):(i=b[c-1],f=c);for(var j=f;j<c+d;j++)g=i,i=b[j],h=g.buffer,i.renderToBuffer(h,"insertAfter")}},hasElement:{childViewsWillChange:function(a,b,c,d){for(var e=c;e<c+d;e++)b[e].remove()},childViewsDidChange:function(a,b,c,d){var e=c===0?null:b[c-1];for(var f=c;f<c+d;f++)a=b[f],this._scheduleInsertion(a,e),e=a}}},Ember.ContainerView.states.inDOM={parentState:Ember.ContainerView.states.hasElement},Ember.ContainerView.reopen({states:Ember.ContainerView.states})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.String.fmt;Ember.CollectionView=Ember.ContainerView.extend({content:null,emptyViewClass:Ember.View,emptyView:null,itemViewClass:Ember.View,init:function(){var a=this._super();return this._contentDidChange(),a},_contentWillChange:Ember.beforeObserver(function(){var b=this.get("content");b&&b.removeArrayObserver(this);var c=b?a(b,"length"):0;this.arrayWillChange(b,0,c)},"content"),_contentDidChange:Ember.observer(function(){var b=a(this,"content");b&&b.addArrayObserver(this);var c=b?a(b,"length"):0;this.arrayDidChange(b,0,null,c)},"content"),willDestroy:function(){var b=a(this,"content");b&&b.removeArrayObserver(this),this._super()},arrayWillChange:function(b,c,d){var e=a(this,"emptyView");e&&e instanceof Ember.View&&e.removeFromParent();var f=a(this,"childViews"),g,h,i;i=a(f,"length");var j=d===i;j&&this.invokeForState("empty");for(h=c+d-1;h>=c;h--)g=f[h],j&&(g.removedFromDOM=!0),g.destroy()},arrayDidChange:function(c,d,e,f){var g=a(this,"itemViewClass"),h=a(this,"childViews"),i=[],j,k,l,m,n;"string"==typeof g&&(g=Ember.getPath(g)),m=c?a(c,"length"):0;if(m)for(l=d;l<d+f;l++)k=c.objectAt(l),j=this.createChildView(g,{content:k,contentIndex:l}),i.push(j);else{var o=a(this,"emptyView");if(!o)return;o=this.createChildView(o),i.push(o),b(this,"emptyView",o)}h.replace(d,0,i)},createChildView:function(c,d){c=this._super(c,d);var e=a(c,"tagName"),f=e===null||e===undefined?Ember.CollectionView.CONTAINER_MAP[a(this,"tagName")]:e;return b(c,"tagName",f),c}}),Ember.CollectionView.CONTAINER_MAP={ul:"li",ol:"li",table:"tr",thead:"tr",tbody:"tr",tfoot:"tr",tr:"td",select:"option"}}(),function(){}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath;Ember.State=Ember.Object.extend(Ember.Evented,{isState:!0,parentState:null,start:null,name:null,path:Ember.computed(function(){var b=c(this,"parentState.path"),d=a(this,"name");return b&&(d=b+"."+d),d}).property().cacheable(),fire:function(a){this[a]&&this[a].apply(this,[].slice.call(arguments,1)),this._super.apply(this,arguments)},init:function(){var c=a(this,"states"),d;b(this,"childStates",Ember.A());var e;if(!c){c={};for(e in this){if(e==="constructor")continue;this.setupChild(c,e,this[e])}b(this,"states",c)}else for(e in c)this.setupChild(c,e,c[e]);b(this,"routes",{})},setupChild:function(c,d,e){if(!e)return!1;Ember.State.detect(e)?e=e.create({name:d}):e.isState&&b(e,"name",d),e.isState&&(b(e,"parentState",this),a(this,"childStates").pushObject(e),c[d]=e)},isLeaf:Ember.computed(function(){return!a(this,"childStates").length}).cacheable(),setupControllers:Ember.K,enter:Ember.K,exit:Ember.K})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath,d=Ember.String.fmt;Ember.StateManager=Ember.State.extend({init:function(){this._super(),b(this,"stateMeta",Ember.Map.create());var d=a(this,"initialState");!d&&c(this,"states.start")&&(d="start"),d&&this.goToState(d)},currentState:null,errorOnUnhandledEvent:!0,send:function(b,c){this.sendRecursively(b,a(this,"currentState"),c)},sendRecursively:function(b,e,f){var g=this.enableLogging,h=e[b];if(typeof h=="function")g&&Ember.Logger.log(d("STATEMANAGER: Sending event '%@' to state %@.",[b,a(e,"path")])),h.call(e,this,f);else{var i=a(e,"parentState");if(i)this.sendRecursively(b,i,f);else if(a(this,"errorOnUnhandledEvent"))throw new Ember.Error(this.toString()+" could not respond to event "+b+" in state "+c(this,"currentState.path")+".")}},findStatesByRoute:function(b,c){if(!c||c==="")return undefined;var d=c.split("."),e=[];for(var f=0,g=d.length;f<g;f+=1){var h=a(b,"states");if(!h)return undefined;var i=a(h,d[f]);if(!i)return undefined;b=i,e.push(i)}return e},goToState:function(){return this.transitionTo.apply(this,arguments)},pathForSegments:function(a){return Ember.ArrayUtils.map(a,function(a){return a[0]}).join(".")},transitionTo:function(b,c){if(Ember.empty(b))return;var d;Ember.typeOf(b)==="array"?d=Array.prototype.slice.call(arguments):d=[[b,c]];var e=this.pathForSegments(d),f=a(this,"currentState")||this,g,h,i=[],j,k;g=f;if(g.routes[e]){var l=g.routes[e];i=l.exitStates,j=l.enterStates,g=l.futureState,k=l.resolveState}else{h=this.findStatesByRoute(f,e);while(g&&!h){i.unshift(g),g=a(g,"parentState");if(!g){h=this.findStatesByRoute(this,e);if(!h)return}h=this.findStatesByRoute(g,e)}k=g,j=h.slice(0),i=i.slice(0);if(j.length>0){g=j[j.length-1];while(j.length>0&&j[0]===i[0])j.shift(),i.shift()}f.routes[e]={exitStates:i,enterStates:j,futureState:g,resolveState:k}}this.enterState(i,j,g),this.triggerSetupContext(k,d)},triggerSetupContext:function(a,b){var c=a;Ember.ArrayUtils.forEach(b,function(a){var b=a[0],d=a[1];c=this.findStatesByRoute(c,b),c=c[c.length-1],c.fire("setupControllers",this,d)},this)},getState:function(b){var c=a(this,b),d=a(this,"parentState");if(c)return c;if(d)return d.getState(b)},asyncEach:function(a,b,c){var d=!1,e=this;if(!a.length){c&&c.call(this);return}var f=a[0],g=a.slice(1),h={async:function(){d=!0},resume:function(){e.asyncEach(g,b,c)}};b.call(this,f,h),d||h.resume()},enterState:function(c,d,e){var f=this.enableLogging,g=this;c=c.slice(0).reverse(),this.asyncEach(c,function(a,b){a.fire("exit",g,b)},function(){this.asyncEach(d,function(b,c){f&&Ember.Logger.log("STATEMANAGER: Entering "+a(b,"path")),b.fire("enter",g,c)},function(){var c=e,d,h;h=a(c,"initialState"),h||(h="start");while(c=a(a(c,"states"),h))d=c,f&&Ember.Logger.log("STATEMANAGER: Entering "+a(c,"path")),c.fire("enter",g),h=a(c,"initialState"),h||(h="start");b(this,"currentState",d||e)})})}})}(),function(){var a=function(a){return a.replace(/[\-\[\]{}()*+?.,\\\^\$|#\s]/g,"\\$&")};Ember._RouteMatcher=Ember.Object.extend({state:null,init:function(){var b=this.route,c=[],d=1,e;b.charAt(0)==="/"&&(b=this.route=b.substr(1)),e=a(b);var f=e.replace(/:([a-z_]+)(?=$|\/)/gi,function(a,b){return c[d++]=b,"([^/]+)"});this.identifiers=c,this.regex=new RegExp("^/?"+f)},match:function(a){var b=a.match(this.regex);if(b){var c=this.identifiers,d={};for(var e=1,f=c.length;e<f;e++)d[c[e]]=b[e];return{remaining:a.substr(b[0].length),hash:d}}},generate:function(a){var b=this.identifiers,c=this.route,d;for(var e=1,f=b.length;e<f;e++)d=b[e],c=c.replace(new RegExp(":"+d),a[d]);return c}})}(),function(){var a=Ember.get,b=Ember.getPath;Ember.Routable=Ember.Mixin.create({init:function(){this.on("setupControllers",this,this.stashContext),this._super()},stashContext:function(b,c){var d=a(b,"stateMeta"),e=this.serialize(b,c);d.set(this,e),a(this,"isRoutable")&&this.updateRoute(b,a(b,"location"))},updateRoute:function(b,c){if(c&&a(this,"isLeaf")){var d=this.absoluteRoute(b);c.setURL(d)}},absoluteRoute:function(b){var c=a(this,"parentState"),d="";a(c,"isRoutable")&&(d=c.absoluteRoute(b));var e=a(this,"routeMatcher"),f=a(b,"stateMeta").get(this),g=e.generate(f);return g!==""?d+"/"+e.generate(f):d},isRoutable:Ember.computed(function(){return typeof this.route=="string"}).cacheable(),routeMatcher:Ember.computed(function(){return Ember._RouteMatcher.create({route:a(this,"route")})}).cacheable(),deserialize:function(a,b){return b},serialize:function(a,b){return b},routePath:function(c,d){if(a(this,"isLeaf"))return;var e=a(this,"childStates"),f;e=e.sort(function(a,c){return b(c,"route.length")-b(a,"route.length")});var g=e.find(function(b){var c=a(b,"routeMatcher");if(f=c.match(d))return!0}),h=g.deserialize(c,f.hash)||{};c.transitionTo(a(g,"path"),h),c.send("routePath",f.remaining)}}),Ember.State.reopen(Ember.Routable)}(),function(){Ember.Router=Ember.StateManager.extend({route:function(a){a.charAt(0)==="/"&&(a=a.substr(1)),this.send("routePath",a)}})}(),function(){}(),function(){var a=Ember.get,b=Ember.set,c=Ember.getPath,d=Ember.String.fmt;Ember.StateManager.reopen({currentView:Ember.computed(function(){var b=a(this,"currentState"),c;while(b){if(a(b,"isViewState")){c=a(b,"view");if(c)return c}b=a(b,"parentState")}return null}).property("currentState").cacheable()})}(),function(){var a=Ember.get,b=Ember.set;Ember.ViewState=Ember.State.extend({isViewState
:!0,enter:function(c){var d=a(this,"view"),e,f;d&&(Ember.View.detect(d)&&(d=d.create(),b(this,"view",d)),e=c.get("rootView"),e?(f=a(e,"childViews"),f.pushObject(d)):(e=c.get("rootElement")||"body",d.appendTo(e)))},exit:function(b){var c=a(this,"view");c&&(a(c,"parentView")?c.removeFromParent():c.remove())}})}(),function(){}(),function(){(function(a){var b=function(){},c=0,d=a.document,e="createRange"in d&&typeof Range!="undefined"&&Range.prototype.createContextualFragment,f=function(){var a=d.createElement("div");return a.innerHTML="<div></div>",a.firstChild.innerHTML="<script></script>",a.firstChild.innerHTML===""}(),g=function(a){var d;this instanceof g?d=this:d=new b,d.innerHTML=a;var e="metamorph-"+c++;return d.start=e+"-start",d.end=e+"-end",d};b.prototype=g.prototype;var h,i,j,k,l,m,n,o,p;k=function(){return this.startTag()+this.innerHTML+this.endTag()},o=function(){return"<script id='"+this.start+"' type='text/x-placeholder'></script>"},p=function(){return"<script id='"+this.end+"' type='text/x-placeholder'></script>"};if(e)h=function(a,b){var c=d.createRange(),e=d.getElementById(a.start),f=d.getElementById(a.end);return b?(c.setStartBefore(e),c.setEndAfter(f)):(c.setStartAfter(e),c.setEndBefore(f)),c},i=function(a,b){var c=h(this,b);c.deleteContents();var d=c.createContextualFragment(a);c.insertNode(d)},j=function(){var a=h(this,!0);a.deleteContents()},l=function(a){var b=d.createRange();b.setStart(a),b.collapse(!1);var c=b.createContextualFragment(this.outerHTML());a.appendChild(c)},m=function(a){var b=d.createRange(),c=d.getElementById(this.end);b.setStartAfter(c),b.setEndAfter(c);var e=b.createContextualFragment(a);b.insertNode(e)},n=function(a){var b=d.createRange(),c=d.getElementById(this.start);b.setStartAfter(c),b.setEndAfter(c);var e=b.createContextualFragment(a);b.insertNode(e)};else{var q={select:[1,"<select multiple='multiple'>","</select>"],fieldset:[1,"<fieldset>","</fieldset>"],table:[1,"<table>","</table>"],tbody:[2,"<table><tbody>","</tbody></table>"],tr:[3,"<table><tbody><tr>","</tr></tbody></table>"],colgroup:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],map:[1,"<map>","</map>"],_default:[0,"",""]},r=function(a,b){var c=q[a.tagName.toLowerCase()]||q._default,e=c[0],g=c[1],h=c[2];f&&(b="&shy;"+b);var i=d.createElement("div");i.innerHTML=g+b+h;for(var j=0;j<=e;j++)i=i.firstChild;if(f){var k=i;while(k.nodeType===1&&!k.nodeName)k=k.firstChild;k.nodeType===3&&k.nodeValue.charAt(0)==="Â­"&&(k.nodeValue=k.nodeValue.slice(1))}return i},s=function(a){while(a.parentNode.tagName==="")a=a.parentNode;return a},t=function(a,b){a.parentNode!==b.parentNode&&b.parentNode.insertBefore(a,b.parentNode.firstChild)};i=function(a,b){var c=s(d.getElementById(this.start)),e=d.getElementById(this.end),f=e.parentNode,g,h,i;t(c,e),g=c.nextSibling;while(g){h=g.nextSibling,i=g===e;if(i){if(!b)break;e=g.nextSibling}g.parentNode.removeChild(g);if(i)break;g=h}g=r(c.parentNode,a);while(g)h=g.nextSibling,f.insertBefore(g,e),g=h},j=function(){var a=s(d.getElementById(this.start)),b=d.getElementById(this.end);this.html(""),a.parentNode.removeChild(a),b.parentNode.removeChild(b)},l=function(a){var b=r(a,this.outerHTML());while(b)nextSibling=b.nextSibling,a.appendChild(b),b=nextSibling},m=function(a){var b=d.getElementById(this.end),c=b.nextSibling,e=b.parentNode,f,g;g=r(e,a);while(g)f=g.nextSibling,e.insertBefore(g,c),g=f},n=function(a){var b=d.getElementById(this.start),c=b.parentNode,e,f;f=r(c,a);var g=b.nextSibling;while(f)e=f.nextSibling,c.insertBefore(f,g),f=e}}g.prototype.html=function(a){this.checkRemoved();if(a===undefined)return this.innerHTML;i.call(this,a),this.innerHTML=a},g.prototype.replaceWith=function(a){this.checkRemoved(),i.call(this,a,!0)},g.prototype.remove=j,g.prototype.outerHTML=k,g.prototype.appendTo=l,g.prototype.after=m,g.prototype.prepend=n,g.prototype.startTag=o,g.prototype.endTag=p,g.prototype.isRemoved=function(){var a=d.getElementById(this.start),b=d.getElementById(this.end);return!a||!b},g.prototype.checkRemoved=function(){if(this.isRemoved())throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.")},a.Metamorph=g})(this)}(),function(){Ember.Handlebars=Ember.create(Handlebars),Ember.Handlebars.helpers=Ember.create(Handlebars.helpers),Ember.Handlebars.Compiler=function(){},Ember.Handlebars.Compiler.prototype=Ember.create(Handlebars.Compiler.prototype),Ember.Handlebars.Compiler.prototype.compiler=Ember.Handlebars.Compiler,Ember.Handlebars.JavaScriptCompiler=function(){},Ember.Handlebars.JavaScriptCompiler.prototype=Ember.create(Handlebars.JavaScriptCompiler.prototype),Ember.Handlebars.JavaScriptCompiler.prototype.compiler=Ember.Handlebars.JavaScriptCompiler,Ember.Handlebars.JavaScriptCompiler.prototype.namespace="Ember.Handlebars",Ember.Handlebars.JavaScriptCompiler.prototype.initializeBuffer=function(){return"''"},Ember.Handlebars.JavaScriptCompiler.prototype.appendToBuffer=function(a){return"data.buffer.push("+a+");"},Ember.Handlebars.Compiler.prototype.mustache=function(a){if(a.params.length||a.hash)return Handlebars.Compiler.prototype.mustache.call(this,a);var b=new Handlebars.AST.IdNode(["_triageMustache"]);return a.escaped&&(a.hash=a.hash||new Handlebars.AST.HashNode([]),a.hash.pairs.push(["escaped",new Handlebars.AST.StringNode("true")])),a=new Handlebars.AST.MustacheNode([b].concat([a.id]),a.hash,!a.escaped),Handlebars.Compiler.prototype.mustache.call(this,a)},Ember.Handlebars.precompile=function(a){var b=Handlebars.parse(a),c={data:!0,stringParams:!0},d=(new Ember.Handlebars.Compiler).compile(b,c);return(new Ember.Handlebars.JavaScriptCompiler).compile(d,c,undefined,!0)},Ember.Handlebars.compile=function(a){var b=Handlebars.parse(a),c={data:!0,stringParams:!0},d=(new Ember.Handlebars.Compiler).compile(b,c),e=(new Ember.Handlebars.JavaScriptCompiler).compile(d,c,undefined,!0);return Handlebars.template(e)};var a=Ember.Handlebars.normalizePath=function(a,b,c){var d=c&&c.keywords||{},e,f;return e=b.split(".",1)[0],d.hasOwnProperty(e)&&(a=d[e],f=!0,b===e?b="":b=b.substr(e.length)),{root:a,path:b,isKeyword:f}};Ember.Handlebars.getPath=function(b,c,d){var e=d&&d.data,f=a(b,c,e),g;return b=f.root,c=f.path,g=Ember.getPath(b,c),g===undefined&&b!==window&&Ember.isGlobalPath(c)&&(g=Ember.getPath(window,c)),g},Ember.Handlebars.registerHelper("helperMissing",function(a,b){var c,d="";throw c="%@ Handlebars error: Could not find property '%@' on object %@.",b.data&&(d=b.data.view),new Ember.Error(Ember.String.fmt(c,[d,a,this]))})}(),function(){Ember.String.htmlSafe=function(a){return new Handlebars.SafeString(a)};var a=Ember.String.htmlSafe;Ember.EXTEND_PROTOTYPES&&(String.prototype.htmlSafe=function(){return a(this)})}(),function(){var a=Ember.set,b=Ember.get,c=Ember.getPath,d={remove:function(b){var c=b.morph;if(c.isRemoved())return;a(b,"element",null),b._lastInsert=null,c.remove()},prepend:function(a,b){b._insertElementLater(function(){var c=a.morph;c.prepend(b.outerHTML),b.outerHTML=null})},after:function(a,b){b._insertElementLater(function(){var c=a.morph;c.after(b.outerHTML),b.outerHTML=null})},replace:function(a){var c=a.morph;a.transitionTo("preRender"),a.clearRenderedChildren();var d=a.renderToBuffer();Ember.run.schedule("render",this,function(){if(b(a,"isDestroyed"))return;a.invalidateRecursively("element"),a._notifyWillInsertElement(),c.replaceWith(d.string()),a.transitionTo("inDOM"),a._notifyDidInsertElement()})},empty:function(a){a.morph.html("")}};Ember._Metamorph=Ember.Mixin.create({isVirtual:!0,tagName:"",init:function(){this._super(),this.morph=Metamorph()},beforeRender:function(a){a.push(this.morph.startTag())},afterRender:function(a){a.push(this.morph.endTag())},createElement:function(){var a=this.renderToBuffer();this.outerHTML=a.string(),this.clearBuffer()},domManager:d}),Ember._MetamorphView=Ember.View.extend(Ember._Metamorph)}(),function(){var a=Ember.get,b=Ember.set,c=Ember.Handlebars.getPath;Ember._HandlebarsBoundView=Ember._MetamorphView.extend({shouldDisplayFunc:null,preserveContext:!1,previousContext:null,displayTemplate:null,inverseTemplate:null,path:null,pathRoot:null,normalizedValue:Ember.computed(function(){var b=a(this,"path"),d=a(this,"pathRoot"),e=a(this,"valueNormalizerFunc"),f,g;return b===""?f=d:(g=a(this,"templateData"),f=c(d,b,{data:g})),e?e(f):f}).property("path","pathRoot","valueNormalizerFunc").volatile(),rerenderIfNeeded:function(){!a(this,"isDestroyed")&&a(this,"normalizedValue")!==this._lastNormalizedValue&&this.rerender()},render:function(c){var d=a(this,"isEscaped"),e=a(this,"shouldDisplayFunc"),f=a(this,"preserveContext"),g=a(this,"previousContext"),h=a(this,"inverseTemplate"),i=a(this,"displayTemplate"),j=a(this,"normalizedValue");this._lastNormalizedValue=j;if(e(j)){b(this,"template",i);if(f)b(this,"_templateContext",g);else{if(!i){j===null||j===undefined?j="":j instanceof Handlebars.SafeString||(j=String(j)),d&&(j=Handlebars.Utils.escapeExpression(j)),c.push(j);return}b(this,"_templateContext",j)}}else h?(b(this,"template",h),f?b(this,"_templateContext",g):b(this,"_templateContext",j)):b(this,"template",function(){return""});return this._super(c)}})}(),function(){var a=Ember.get,b=Ember.set,c=Ember.String.fmt,d=Ember.Handlebars.getPath,e=Ember.Handlebars.normalizePath,f=Ember.ArrayUtils.forEach,g=Ember.Handlebars,h=g.helpers,i=function(a,b,c,f,g){var h=b.data,i=b.fn,j=b.inverse,k=h.view,l=this,m,n,o;o=e(l,a,h),m=o.root,n=o.path;if("object"==typeof this){var p=k.createChildView(Ember._HandlebarsBoundView,{preserveContext:c,shouldDisplayFunc:f,valueNormalizerFunc:g,displayTemplate:i,inverseTemplate:j,path:n,pathRoot:m,previousContext:l,isEscaped:b.hash.escaped,templateData:b.data});k.appendChild(p);var q=function(){Ember.run.once(p,"rerenderIfNeeded")};n!==""&&Ember.addObserver(m,n,q)}else h.buffer.push(d(m,n,b))};g.registerHelper("_triageMustache",function(a,b){return h[a]?h[a].call(this,b):h.bind.apply(this,arguments)}),g.registerHelper("bind",function(a,b){var c=b.contexts&&b.contexts[0]||this;return i.call(c,a,b,!1,function(a){return!Ember.none(a)})}),g.registerHelper("boundIf",function(b,c){var d=c.contexts&&c.contexts[0]||this,e=function(b){return Ember.typeOf(b)==="array"?a(b,"length")!==0:!!b};return i.call(d,b,c,!0,e,e)}),g.registerHelper("with",function(a,b){if(arguments.length===4){var c,d;b=arguments[3],c=arguments[2],d=arguments[0];var e=Ember.$.expando+Ember.guidFor(this);return b.data.keywords[e]=this,Ember.bind(b.data.keywords,c,e+"."+d),i.call(this,d,b.fn,!0,function(a){return!Ember.none(a)})}return h.bind.call(b.contexts[0],a,b)}),g.registerHelper("if",function(a,b){return h.boundIf.call(b.contexts[0],a,b)}),g.registerHelper("unless",function(a,b){var c=b.fn,d=b.inverse;return b.fn=d,b.inverse=c,h.boundIf.call(b.contexts[0],a,b)}),g.registerHelper("bindAttr",function(a){var b=a.hash,c=a.data.view,h=[],i=this,j=++Ember.$.uuid,k=b["class"];if(k!==null&&k!==undefined){var l=g.bindClasses(this,k,c,j,a);h.push('class="'+Handlebars.Utils.escapeExpression(l.join(" "))+'"'),delete b["class"]}var m=Ember.keys(b);return f(m,function(f){var g=b[f],k,l;l=e(i,g,a.data),k=l.root,g=l.path;var m=g==="this"?k:d(k,g,a),n=Ember.typeOf(m),o,p;o=function(){var e=d(k,g,a),h=c.$("[data-bindattr-"+j+"='"+j+"']");if(h.length===0){Ember.removeObserver(k,g,p);return}Ember.View.applyAttributeBindings(h,f,e)},p=function(){Ember.run.once(o)},g!=="this"&&Ember.addObserver(k,g,p),n==="string"||n==="number"&&!isNaN(m)?h.push(f+'="'+Handlebars.Utils.escapeExpression(m)+'"'):m&&n==="boolean"&&h.push(f+'="'+f+'"')},this),h.push("data-bindattr-"+j+'="'+j+'"'),new g.SafeString(h.join(" "))}),g.bindClasses=function(a,b,c,g,h){var i=[],j,k,l,m=function(a,b,c,e){var f=b!==""?d(a,b,e):!0;if(!!f&&c)return c;if(f===!0){var g=b.split(".");return Ember.String.dasherize(g[g.length-1])}return f!==!1&&f!==undefined&&f!==null?f:null};return f(b.split(" "),function(b){var d,f,n,o=b.split(":"),p=o[0],q=o[1],r=a,s;p!==""&&(s=e(a,p,h.data),r=s.root,p=s.path),f=function(){j=m(r,p,q,h),l=g?c.$("[data-bindattr-"+g+"='"+g+"']"):c.$(),l.length===0?Ember.removeObserver(r,p,n):(d&&l.removeClass(d),j?(l.addClass(j),d=j):d=null)},n=function(){Ember.run.once(f)},p!==""&&Ember.addObserver(r,p,n),k=m(r,p,q,h),k&&(i.push(k),d=k)}),i}}(),function(){var a=Ember.get,b=Ember.set,c=Ember.ArrayUtils.indexOf,d=/^parentView\./,e=Ember.Handlebars;e.ViewHelper=Ember.Object.create({viewClassFromHTMLOptions:function(a,b,c){var d=b.hash,e=b.data,f={},g=d["class"],h=!1;d.id&&(f.elementId=d.id,h=!0),g&&(g=g.split(" "),f.classNames=g,h=!0),d.classBinding&&(f.classNameBindings=d.classBinding.split(" "),h=!0),d.classNameBindings&&(f.classNameBindings=d.classNameBindings.split(" "),h=!0),d.attributeBindings&&(f.attributeBindings=null,h=!0),h&&(d=Ember.$.extend({},d),delete d.id,delete d["class"],delete d.classBinding);var i,j;for(var k in d){if(!d.hasOwnProperty(k))continue;Ember.IS_BINDING.test(k)&&(i=d[k],j=Ember.Handlebars.normalizePath(null,i,e),j.isKeyword?d[k]="templateData.keywords."+i:Ember.isGlobalPath(i)||(i==="this"?d[k]="bindingContext":d[k]="bindingContext."+i))}return f.bindingContext=c,a.extend(d,f)},helper:function(a,b,c){var d=c.inverse,f=c.data,g=f.view,h=c.fn,i=c.hash,j;"string"==typeof b?j=e.getPath(a,b,c):j=b,j=this.viewClassFromHTMLOptions(j,c,a);var k=f.view,l={templateData:c.data};h&&(l.template=h),k.appendChild(j,l)}}),e.registerHelper("view",function(a,b){return a&&a.data&&a.data.isRenderData&&(b=a,a="Ember.View"),e.ViewHelper.helper(this,a,b)})}(),function(){var a=Ember.get,b=Ember.Handlebars.getPath,c=Ember.String.fmt;Ember.Handlebars.registerHelper("collection",function(c,d){c&&c.data&&c.data.isRenderData&&(d=c,c=undefined);var e=d.fn,f=d.data,g=d.inverse,h;h=c?b(this,c,d):Ember.CollectionView;var i=d.hash,j={},k,l,m=i.itemViewClass,n=h.proto();delete i.itemViewClass,l=m?b(n,m,d):n.itemViewClass;for(var o in i)i.hasOwnProperty(o)&&(k=o.match(/^item(.)(.*)$/),k&&(j[k[1].toLowerCase()+k[2]]=i[o],delete i[o]));var p=i.tagName||n.tagName;e&&(j.template=e,delete d.fn);if(g&&g!==Handlebars.VM.noop){var q=a(n,"emptyViewClass");i.emptyView=q.extend({template:g,tagName:j.tagName})}return i.eachHelper==="each"&&(j._templateContext=Ember.computed(function(){return a(this,"content")}).property("content"),delete i.eachHelper),i.itemViewClass=Ember.Handlebars.ViewHelper.viewClassFromHTMLOptions(l,{data:f,hash:j},this),Ember.Handlebars.helpers.view.call(this,h,d)})}(),function(){var a=Ember.Handlebars.getPath;Ember.Handlebars.registerHelper("unbound",function(b,c){var d=c.contexts&&c.contexts[0]||this;return a(d,b,c)})}(),function(){var a=Ember.getPath;Ember.Handlebars.registerHelper("log",function(b,c){var d=c.contexts&&c.contexts[0]||this;Ember.Logger.log(a(d,b))}),Ember.Handlebars.registerHelper("debugger",function(){debugger})}(),function(){var a=Ember.get,b=Ember.set;Ember.Handlebars.EachView=Ember.CollectionView.extend(Ember._Metamorph,{itemViewClass:Ember._MetamorphView,emptyViewClass:Ember._MetamorphView,createChildView:function(c,d){c=this._super(c,d);var e=a(this,"keyword");if(e){var f=a(c,"templateData");f=Ember.copy(f),f.keywords=c.cloneKeywords(),b(c,"templateData",f);var g=a(c,"content");f.keywords[e]=g}return c}}),Ember.Handlebars.registerHelper("each",function(a,b){if(arguments.length===4){var c=arguments[0];b=arguments[3],a=arguments[2],b.hash.keyword=c}else b.hash.eachHelper="each";return b.hash.contentBinding=a,Ember.Handlebars.helpers.collection.call(this,"Ember.Handlebars.EachView",b)})}(),function(){Ember.Handlebars.registerHelper("template",function(a,b){var c=Ember.TEMPLATES[a];Ember.TEMPLATES[a](this,{data:b.data})})}(),function(){var a=Ember.Handlebars,b=a.getPath,c=Ember.get,d=a.ActionHelper={registeredActions:{}};d.registerAction=function(a,b,c,e,f){var g=(++Ember.$.uuid).toString();return d.registeredActions[g]={eventName:b,handler:function(b){return b.view=e,b.context=f,c.isState&&typeof c.send=="function"?c.send(a,b):c[a].call(c,b)}},e.on("willRerender",function(){delete d.registeredActions[g]}),g},a.registerHelper("action",function(e,f){var g=f.hash||{},h=g.on||"click",i=f.data.view,j,k,l;i.isVirtual&&(i=i.get("parentView"));if(g.target)j=b(this,g.target,f);else if(l=f.data.keywords.controller)j=c(l,"target");j=j||i,k=g.context?b(this,g.context,f):f.contexts[0];var m=d.registerAction(e,h,j,i,k);return new a.SafeString('data-ember-action="'+m+'"')})}(),function(){var a=Ember.get,b=Ember.set;Ember.Handlebars.registerHelper("yield",function(b){var c=b.data.view,d;while(c&&!a(c,"layout"))c=a(c,"parentView");d=a(c,"template"),d&&d(this,b)})}(),function(){}(),function(){}(),function(){var a=Ember.set,b=Ember.get;Ember.Checkbox=Ember.View.extend({classNames:["ember-checkbox"],tagName:"input",attributeBindings:["type","checked","disabled"],type:"checkbox",checked:!1,disabled:!1,title:null,value:Ember.computed(function(c,d){return d!==undefined?a(this,"checked",d):b(this,"checked")}).property("checked").volatile(),change:function(){Ember.run.once(this,this._updateElementValue)},_updateElementValue:function(){var c=b(this,"title")?this.$("input:checkbox"):this.$();a(this,"checked",c.prop("checked"))},init:function(){if(b(this,"title")||b(this,"titleBinding"))this.tagName=undefined,this.attributeBindings=[],this.defaultTemplate=Ember.Handlebars.template(function(b,c,d,e,f){d=d||Ember.Handlebars.helpers;var g="",h,i,j,k,l,m=this,n="function",o=d.helperMissing,p=void 0,q=this.escapeExpression;return f.buffer.push('<label><input type="checkbox" '),h={},i="checked",h.checked=i,i="disabled",h.disabled=i,i=d.bindAttr||c.bindAttr,l={},l.hash=h,l.contexts=[],l.data=f,typeof i===n?h=i.call(c,l):i===p?h=o.call(c,"bindAttr",l):h=i,f.buffer.push(q(h)+">"),h=c,i="title",j={},k="true",j.escaped=k,k=d._triageMustache||c._triageMustache,l={},l.hash=j,l.contexts=[],l.contexts.push(h),l.data=f,typeof k===n?h=k.call(c,i,l):k===p?h=o.call(c,"_triageMustache",i,l):h=k,f.buffer.push(q(h)+"</label>"),g});this._super()}})}(),function(){var a=Ember.get,b=Ember.set;Ember.TextSupport=Ember.Mixin.create({value:"",attributeBindings:["placeholder","disabled","maxlength"],placeholder:null,disabled:!1,maxlength:null,insertNewline:Ember.K,cancel:Ember.K,focusOut:function(a){this._elementValueDidChange()},change:function(a){this._elementValueDidChange()},keyUp:function(a){this.interpretKeyEvents(a)},interpretKeyEvents:function(a){var b=Ember.TextSupport.KEY_EVENTS,c=b[a.keyCode];this._elementValueDidChange();if(c)return this[c](a)},_elementValueDidChange:function(){b(this,"value",this.$().val())}}),Ember.TextSupport.KEY_EVENTS={13:"insertNewline",27:"cancel"}}(),function(){var a=Ember.get,b=Ember.set;Ember.TextField=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-field"],tagName:"input",attributeBindings:["type","value","size"],value:"",type:"text",size:null})}(),function(){var a=Ember.get,b=Ember.set;Ember.Button=Ember.View.extend(Ember.TargetActionSupport,{classNames:["ember-button"],classNameBindings:["isActive"],tagName:"button",propagateEvents:!1,attributeBindings:["type","disabled","href"],targetObject:Ember.computed(function(){var b=a(this,"target"),c=a(this,"templateContext"),d=a(this,"templateData");return typeof b!="string"?b:Ember.Handlebars.getPath(c,b,{data:d})}).property("target").cacheable(),type:Ember.computed(function(a,b){var c=this.get("tagName");b!==undefined&&(this._type=b);if(this._type!==undefined)return this._type;if(c==="input"||c==="button")return"button"}).property("tagName").cacheable(),disabled:!1,href:Ember.computed(function(){return this.get("tagName")==="a"?"#":null}).property("tagName").cacheable(),mouseDown:function(){return a(this,"disabled")||(b(this,"isActive",!0),this._mouseDown=!0,this._mouseEntered=!0),a(this,"propagateEvents")},mouseLeave:function(){this._mouseDown&&(b(this,"isActive",!1),this._mouseEntered=!1)},mouseEnter:function(){this._mouseDown&&(b(this,"isActive",!0),this._mouseEntered=!0)},mouseUp:function(c){return a(this,"isActive")&&(this.triggerAction(),b(this,"isActive",!1)),this._mouseDown=!1,this._mouseEntered=!1,a(this,"propagateEvents")},keyDown:function(a){(a.keyCode===13||a.keyCode===32)&&this.mouseDown()},keyUp:function(a){(a.keyCode===13||a.keyCode===32)&&this.mouseUp()},touchStart:function(a){return this.mouseDown(a)},touchEnd:function(a){return this.mouseUp(a)},init:function(){this._super()}})}(),function(){var a=Ember.get,b=Ember.set;Ember.TextArea=Ember.View.extend(Ember.TextSupport,{classNames:["ember-text-area"],tagName:"textarea",attributeBindings:["rows","cols"],rows:null,cols:null,_updateElementValue:Ember.observer(function(){this.$().val(a(this,"value"))},"value"),init:function(){this._super(),this.on("didInsertElement",this,this._updateElementValue)}})}(),function(){Ember.TabContainerView=Ember.View.extend()}(),function(){var a=Ember.get,b=Ember.getPath;Ember.TabPaneView=Ember.View.extend({tabsContainer:Ember.computed(function(){return this.nearestInstanceOf(Ember.TabContainerView)}).property().volatile(),isVisible:Ember.computed(function(){return a(this,"viewName")===b(this,"tabsContainer.currentView")}).property("tabsContainer.currentView").volatile()})}(),function(){var a=Ember.get,b=Ember.setPath;Ember.TabView=Ember.View.extend({tabsContainer:Ember.computed(function(){return this.nearestInstanceOf(Ember.TabContainerView)}).property().volatile(),mouseUp:function(){b(this,"tabsContainer.currentView",a(this,"value"))}})}(),function(){}(),function(){var a=Ember.set,b=Ember.get,c=Ember.getPath,d=Ember.ArrayUtils.indexOf,e=Ember.ArrayUtils.indexesOf;Ember.Select=Ember.View.extend({tagName:"select",defaultTemplate:Ember.Handlebars.template(function(b,c,d,e,f){function q(a,b){var c="",e,f,g,h;return b.buffer.push("<option>"),e=a,f="view.prompt",g={},h="true",g.escaped=h,h=d._triageMustache||a._triageMustache,k={},k.hash=g,k.contexts=[],k.contexts.push(e),k.data=b,typeof h===m?e=h.call(a,f,k):h===o?e=n.call(a,"_triageMustache",f,k):e=h,b.buffer.push(p(e)+"</option>"),c}function r(a,b){var c,e,f,g;c=a,e="Ember.SelectOption",f={},g="this",f.contentBinding=g,g=d.view||a.view,k={},k.hash=f,k.contexts=[],k.contexts.push(c),k.data=b,typeof g===m?c=g.call(a,e,k):g===o?c=n.call(a,"view",e,k):c=g,b.buffer.push(p(c))}d=d||Ember.Handlebars.helpers;var g="",h,i,j,k,l=this,m="function",n=d.helperMissing,o=void 0,p=this.escapeExpression;return h=c,i="view.prompt",j=d["if"],k=l.program(1,q,f),k.hash={},k.contexts=[],k.contexts.push(h),k.fn=k,k.inverse=l.noop,k.data=f,h=j.call(c,i,k),(h||h===0)&&f.buffer.push(h),h=c,i="view.content",j=d.each,k=l.program(3,r,f),k.hash={},k.contexts=[],k.contexts.push(h),k.fn=k,k.inverse=l.noop,k.data=f,h=j.call(c,i,k),(h||h===0)&&f.buffer.push(h),g}),attributeBindings:["multiple"],multiple:!1,content:null,selection:null,prompt:null,optionLabelPath:"content",optionValuePath:"content",change:function(){b(this,"multiple")?this._changeMultiple():this._changeSingle()},selectionDidChange:Ember.observer(function(){var c=b(this,"selection"),d=Ember.isArray(c);if(b(this,"multiple")){if(!d){a(this,"selection",Ember.A([c]));return}this._selectionDidChangeMultiple()}else this._selectionDidChangeSingle()},"selection"),_triggerChange:function(){var a=b(this,"selection");a&&this.selectionDidChange(),this.change()},_changeSingle:function(){var c=this.$()[0].selectedIndex,d=b(this,"content"),e=b(this,"prompt");if(!d)return;if(e&&c===0){a(this,"selection",null);return}e&&(c-=1),a(this,"selection",d.objectAt(c))},_changeMultiple:function(){var c=this.$("option:selected"),d=b(this,"prompt"),e=d?1:0,f=b(this,"content");if(!f)return;if(c){var g=c.map(function(){return this.index-e}).toArray();a(this,"selection",f.objectsAt(g))}},_selectionDidChangeSingle:function(){var a=this.$()[0],c=b(this,"content"),e=b(this,"selection"),f=c?d(c,e):-1,g=b(this,"prompt");g&&f>-1&&(f+=1),a&&(a.selectedIndex=f)},_selectionDidChangeMultiple:function(){var a=b(this,"content"),c=b(this,"selection"),f=a?e(a,c):[-1],g=b(this,"prompt"),h=g?1:0,i=this.$("option"),j;i&&i.each(function(){j=this.index>-1?this.index+h:-1,this.selected=d(f,j)>-1})},init:function(){this._super(),this.on("didInsertElement",this,this._triggerChange)}}),Ember.SelectOption=Ember.View.extend({tagName:"option",defaultTemplate:Ember.Handlebars.template(function(b,c,d,e,f){d=d||Ember.Handlebars.helpers;var g,h,i,j,k,l=this,m="function",n=d.helperMissing,o=void 0,p=this.escapeExpression;g=c,h="view.label",i={},j="true",i.escaped=j,j=d._triageMustache||c._triageMustache,k={},k.hash=i,k.contexts=[],k.contexts.push(g),k.data=f,typeof j===m?g=j.call(c,h,k):j===o?g=n.call(c,"_triageMustache",h,k):g=j,f.buffer.push(p(g))}),attributeBindings:["value","selected"],init:function(){this.labelPathDidChange(),this.valuePathDidChange(),this._super()},selected:Ember.computed(function(){var a=b(this,"content"),e=c(this,"parentView.selection");return c(this,"parentView.multiple")?e&&d(e,a)>-1:a==e}).property("content","parentView.selection").volatile(),labelPathDidChange:Ember.observer(function(){var a=c(this,"parentView.optionLabelPath");if(!a)return;Ember.defineProperty(this,"label",Ember.computed(function(){return c(this,a)}).property(a).cacheable())},"parentView.optionLabelPath"),valuePathDidChange:Ember.observer(function(){var a=c(this,"parentView.optionValuePath");if(!a)return;Ember.defineProperty(this,"value",Ember.computed(function(){return c(this,a)}).property(a).cacheable())},"parentView.optionValuePath")})}(),function(){}(),function(){Ember.Handlebars.bootstrap=function(a){var b='script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';Ember.ENV.LEGACY_HANDLEBARS_TAGS&&(b+=', script[type="text/html"]'),Ember.$(b,a).each(function(){var a=Ember.$(this),b=a.attr("type"),c=a.attr("type")==="text/x-raw-handlebars"?Ember.$.proxy(Handlebars.compile,Handlebars):Ember.$.proxy(Ember.Handlebars.compile,Ember.Handlebars),d=a.attr("data-template-name")||a.attr("id"),e=c(a.html()),f,g,h,i,j;if(d)Ember.TEMPLATES[d]=e,a.remove();else{if(a.parents("head").length!==0)throw new Ember.Error("Template found in <head> without a name specified. Please provide a data-template-name attribute.\n"+a.html());g=a.attr("data-view"),f=g?Ember.getPath(g):Ember.View,h=a.attr("data-element-id"),i=a.attr("data-tag-name"),j={template:e},h&&(j.elementId=h),i&&(j.tagName=i),f=f.create(j),f._insertElementLater(function(){a.replaceWith(this.$()),a=null})}})},Ember.$(document).ready(function(){Ember.Handlebars.bootstrap(Ember.$(document))})}(),function(){}();
(function() {

  jQuery(function() {
    try {
      return $('.alert').animate({
        opacity: 0
      }, 5000, function() {
        return $(this).hide();
      });
    } catch (_error) {}
  });

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//






;
