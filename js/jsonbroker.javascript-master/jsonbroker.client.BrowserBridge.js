//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 9A0B9AF7-4515-4390-922E-D138C1090039 file_preprocessor.application.j2se.jsmin.JavascriptMinify




if( console && console.warn ) { console.warn( "deprecated: use 'client/BrowserBridge.js'" )}

var jsonbroker = jsonbroker || {};
jsonbroker.client = jsonbroker.client || {};

/**
 *
 * @param {String} [url]
 * @constructor
 */
jsonbroker.client.BrowserBridge = function( url ) {

    if( url ) {

        this._url = url;

    } else {

        this._url = "/_dynamic_/open/services";

    }

}


jsonbroker.client.BrowserBridge.prototype.dispatch = function() {

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

                jsonbroker.client.forwardResponse.apply(jsonbroker, brokerMessage );
                return;
            } else if( "fault" === brokerMessage[0]) {
                jsonbroker.client.forwardFault.apply( jsonbroker, brokerMessage );
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

        jsonbroker.client.forwardFault.apply( jsonbroker, args );


    };

    xmlhttp.open( "POST", this._url); // implicitely async
    //xmlhttp.open( "POST", "/_dynamic_/open/synchronous_service", false); // explicitly sync
    xmlhttp.send(call); //send request


}

// ^^^ 9A0B9AF7-4515-4390-922E-D138C1090039 file_preprocessor.application.j2se.jsmin.JavascriptMinify
