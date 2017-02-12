//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 9D20E5A6-324B-4A9D-8C64-DAAFE76B6C7F file_preprocessor.application.j2se.jsmin.JavascriptMinify


var jsonbroker = jsonbroker || {};

if( console && console.warn ) { console.warn( "deprecated: use 'client/DesktopBridge.js'" )}

jsonbroker.DesktopBridge = function() {
}

jsonbroker.DesktopBridge.prototype.dispatch = function() {

    var args = Array.prototype.slice.call(arguments);
    var json = JSON.stringify(args);
    window.external.dispatch( json );

}


// ^^^ 9D20E5A6-324B-4A9D-8C64-DAAFE76B6C7F file_preprocessor.application.j2se.jsmin.JavascriptMinify
