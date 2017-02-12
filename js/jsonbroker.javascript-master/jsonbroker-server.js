//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 9064DBB1-D7CD-44CA-BCFE-3FB089638EC3 file_preprocessor.application.j2se.jsmin.JavascriptMinify


var jsonbroker = jsonbroker || {};

if( console && console.warn ) { console.warn( "deprecated: use 'jsonbroker.server.js'" )}

jsonbroker.services = {};

jsonbroker.registerService = function(serviceName,service) {

    jsonbroker.services[serviceName] = service;
};

jsonbroker.forwardRequest = function(brokerMessage) {
    var serviceName = brokerMessage[2];
    var service = jsonbroker.services[serviceName];
    if( !service ) {
        brokerMessage[0] = "fault";
        var associativeParamaters = brokerMessage[6];
        associativeParamaters["errorDomain"] =  "jsonbroker.Core.SERVICE_NOT_FOUND";
        associativeParamaters["faultCode"] =  0xa370201;
        associativeParamaters["faultContext"] = {"serviceName":serviceName,"methodName":brokerMessage[5]};
        associativeParamaters["faultMessage"] = "!service; serviceName = '"+serviceName+"'";
        associativeParamaters["originator"] = "js:jsonbroker.forwardRequest";
        associativeParamaters["stackTrace"] = [];
        associativeParamaters["underlyingFaultMessage"] =  null;

        return brokerMessage;
    }

    return service.process(brokerMessage);

}


// ^^^ 9064DBB1-D7CD-44CA-BCFE-3FB089638EC3 file_preprocessor.application.j2se.jsmin.JavascriptMinify
