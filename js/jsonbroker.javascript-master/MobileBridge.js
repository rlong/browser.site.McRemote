//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license (http://opensource.org/licenses/MIT)
//
// vvv 2F4A0C1A-7700-40D7-9E3A-5E4B26A6B03C file_preprocessor.application.j2se.jsmin.JavascriptMinify


var jsonbroker = jsonbroker || {};


if( console && console.warn ) { console.warn( "deprecated: use 'client/MobileBridge.js'" )}

jsonbroker.MobileBridge = function() {
}

jsonbroker.MobileBridge.prototype.dispatch = function() {

    var args = Array.prototype.slice.call(arguments);
    var jsonArgs = JSON.stringify(args);

    // UIWebView (iOS 5.0) will flip single backslashes to forwardslashes ...
    // 'tab\ttab' becomes 'tab/ttab'
    // 'slash\\slash' becomes 'slash//slash'
    // "quotes\"quotes" becomes "quotes/"quotes"
    // ... by the time [UIWebViewBridge webView:shouldStartLoadWithRequest:navigationType:] is called

    // we 'pre' escape backslash ...
    if( -1 !== jsonArgs.indexOf( '\\' ) ) {

        jsonArgs = jsonArgs.replace( /\\/g, "%5C" );
        //call = "jsonbroker.double-escaped:" + jsonArgs;

    }
    var call = "jsonbroker:" + jsonArgs ;

    // vvv http://blog.techno-barje.fr/post/2010/10/06/UIWebView-secrets-part3-How-to-properly-call-ObjectiveC-from-Javascript

    var iframe = document.createElement("IFRAME");
    iframe.setAttribute( "src", call );
    document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;

    // ^^^ http://blog.techno-barje.fr/post/2010/10/06/UIWebView-secrets-part3-How-to-properly-call-ObjectiveC-from-Javascript

}


// ^^^ 2F4A0C1A-7700-40D7-9E3A-5E4B26A6B03C file_preprocessor.application.j2se.jsmin.JavascriptMinify
