//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 93D6E876-85EA-4E07-BDA0-63972D0DA5CC file_preprocessor.application.j2se.jsmin.JavascriptMinify




var jsonbroker = jsonbroker || {};


if( console && console.warn ) { console.warn( "deprecated: use 'client/BrowserBridge.js'" )}


/**
 *
 * @param {String} [url]
 * @constructor
 */
jsonbroker.BrowserBridge =  function( url ) {

    if( url ) {

        this._url = url;

    } else {

        this._url = "/_dynamic_/open/services";

    }

}

jsonbroker.BrowserBridge.prototype.dispatch = function() {

//    var metaInformation = arguments[1];
//    metaInformation["ChromeCallbackAdapter.href"] = window.location.href;

    var args = Array.prototype.slice.call(arguments);
    var call = JSON.stringify(args);
    //console.debug( call );

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

        if( this.readyState != 4 ) {
            return;
        }
        // 204: No Content
        if( 204 == this.status  ) {
            return;
        }

        if( 200 === this.status  ) {

            var brokerMessage = JSON.parse( this.responseText );

            //console.debug( brokerMessage );

            if( "response" === brokerMessage[0]) {


                if( jsonbroker.forwardResponse ) {

                    if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.client.js' instead of 'jsonbroker.js'" )}
                    jsonbroker.forwardResponse.apply(jsonbroker, brokerMessage );

                } else {

                    jsonbroker.client.forwardResponse.apply(jsonbroker, brokerMessage );

                }

                return;

            } else if( "fault" === brokerMessage[0]) {

                if( jsonbroker.forwardFault ) {

                    if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.client.js' instead of 'jsonbroker.js'" )}
                    jsonbroker.forwardFault.apply( jsonbroker, brokerMessage );

                } else {
                    jsonbroker.client.forwardFault.apply( jsonbroker, brokerMessage );
                }


                return;
            }
            // else drop through ...
        }


        // assume a fault ...

        if( console ) {
            console.warn( xmlhttp );
            console.warn( arguments );
        }

        args[0] = "fault";
        var associativeParamaters = args[6];
        associativeParamaters["errorDomain"] =  "jsonbroker.BrowserBridge.HTTP_STATUS_" + this.status;
        associativeParamaters["faultCode"] =  this.status;
        associativeParamaters["faultContext"] = {"readyState":this.readyState};
        associativeParamaters["faultMessage"] = this.statusText;
        associativeParamaters["originator"] = "jsonbroker.BrowserBridge";
        associativeParamaters["stackTrace"] = [];
        associativeParamaters["underlyingFaultMessage"] =  null;

        if( jsonbroker.forwardFault ) {

            if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.client.js' instead of 'jsonbroker.js'" )}
            jsonbroker.forwardFault.apply( jsonbroker, args );

        } else {
            jsonbroker.client.forwardFault.apply( jsonbroker, args );
        }



    };

    xmlhttp.open( "POST", this._url); // implicitely async
    //xmlhttp.open( "POST", "/_dynamic_/open/synchronous_service", false); // explicitly sync
    xmlhttp.send(call); //send request


}

// ^^^ 93D6E876-85EA-4E07-BDA0-63972D0DA5CC file_preprocessor.application.j2se.jsmin.JavascriptMinify
