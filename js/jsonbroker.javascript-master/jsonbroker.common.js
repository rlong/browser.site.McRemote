//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 84370416-4E78-42CE-BB96-B47A9E7F5D15 file_preprocessor.application.j2se.jsmin.JavascriptMinify


if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.lifecycle.js'" )}


var jsonbroker = jsonbroker || {};
jsonbroker.common = jsonbroker.common || {};


jsonbroker.common.onPause = function () {
    if( jsonbroker.lifecycle && jsonbroker.lifecycle.onPause ) {
        jsonbroker.lifecycle.onPause();
    }
};

jsonbroker.common.onResume = function () {
    if( jsonbroker.lifecycle && jsonbroker.lifecycle.onResume ) {
        jsonbroker.lifecycle.onResume();
    }

};


// ^^^ 84370416-4E78-42CE-BB96-B47A9E7F5D15 file_preprocessor.application.j2se.jsmin.JavascriptMinify
