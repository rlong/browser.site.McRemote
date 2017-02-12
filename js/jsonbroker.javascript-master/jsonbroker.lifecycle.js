//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv B8BE7BF3-E390-44AC-8429-09407B12BD70 file_preprocessor.application.j2se.jsmin.JavascriptMinify

var jsonbroker = jsonbroker || {};
jsonbroker.lifecycle = jsonbroker.lifecycle || {};

jsonbroker.lifecycle.onPause = function () {};
jsonbroker.lifecycle.onResume = function () {};


// vvv for legacy support ...
jsonbroker.common = jsonbroker.common || {};


jsonbroker.common.onPause = function () {
    jsonbroker.lifecycle.onPause();
};

jsonbroker.common.onResume = function () {
    jsonbroker.lifecycle.onResume();
};

// ^^^ for legacy support ...



// ^^^ B8BE7BF3-E390-44AC-8429-09407B12BD70 file_preprocessor.application.j2se.jsmin.JavascriptMinify
