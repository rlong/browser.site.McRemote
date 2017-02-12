//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//
// vvv 05D207DE-95E2-4F3F-B095-BD2593FE93A3 file_preprocessor.application.j2se.jsmin.JavascriptMinify


var jsonbroker = jsonbroker || {};
jsonbroker.server = jsonbroker.server || {};

jsonbroker.server.services = {};

jsonbroker.server.registerService = function(serviceName,service) {

    jsonbroker.server.services[serviceName] = service;
};

jsonbroker.server.forwardRequest = function(brokerMessage) {

    var serviceName = brokerMessage[2];
    var service = jsonbroker.server.services[serviceName];

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


// ^^^ 05D207DE-95E2-4F3F-B095-BD2593FE93A3 file_preprocessor.application.j2se.jsmin.JavascriptMinify
