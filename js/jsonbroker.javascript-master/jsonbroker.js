//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv D4FA3825-997D-4E5F-B1E9-28A680A81362 file_preprocessor.application.j2se.jsmin.JavascriptMinify


var jsonbroker = jsonbroker || {};


if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.client.js' and (possibly) 'jsonbroker.lifecycle.js'" )}


jsonbroker.buildBridge = function() {

    if( 0 === location.protocol.indexOf("http") ) {
        return new jsonbroker.BrowserBridge();
    }

    if( jsonbroker.MobileBridge ) {
        return new jsonbroker.MobileBridge();
    }

    if( jsonbroker.DesktopBridge ) {
        return new jsonbroker.DesktopBridge();
    }

    throw "Could not Find Appropriate Bridge";

};

jsonbroker.onPause = function () {};
jsonbroker.onResume = function () {};
jsonbroker.onFault = function () {if( console && console.error ) { console.error(arguments) } };
jsonbroker.onResponse = function () {};

jsonbroker.proxies = {};

jsonbroker.registerProxy = function(proxyName,proxy) {

    jsonbroker.proxies[proxyName] = proxy;
};


jsonbroker.forwardFault = function() {

    var proxy = jsonbroker.proxies[arguments[2]];

    if( proxy ) {

        arguments[2] = proxy;

        var method = proxy[arguments[5]];

        if( method ) {

            arguments[5] = method;

            var methodOnFault = method.onFault;
            if(  methodOnFault  ) {
                methodOnFault.apply(methodOnFault,arguments);
                return;
            }
        }

        var proxyOnFault = proxy.onFault;
        if( proxyOnFault  ) {
            proxyOnFault.apply(proxyOnFault,arguments);
            return;
        }
    }

    this.onFault.apply(this.onFault,arguments);

};

jsonbroker.forwardResponse = function() {

    var proxy = jsonbroker.proxies[arguments[2]];
    if( proxy  ) {

        arguments[2] = proxy;

        var method = proxy[arguments[5]];

        if( method  ) {

            arguments[5] = method;

            var methodOnResponse = method.onResponse;
            if(  methodOnResponse ) {
                methodOnResponse.apply(methodOnResponse,arguments);
                return;
            }
        }

        var proxyOnResponse = proxy.onResponse;
        if( proxyOnResponse ) {
            proxyOnResponse.apply(proxyOnResponse,arguments);
            return;
        }
    }

    this.onResponse.apply(this.onResponse,arguments);
};



// ^^^ D4FA3825-997D-4E5F-B1E9-28A680A81362 file_preprocessor.application.j2se.jsmin.JavascriptMinify
