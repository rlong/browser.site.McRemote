//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

// requires:
// * jsonbroker.javascript/common/BrokerMessage.js

var server = server || {};

server.ServicesRegistery = function() {

    this._services = {};
}

/**
 *
 * @param {Object} an array that represents a 'BrokerMessage' request
 * @return {Object} a 'BrokerMessage' response
 */
server.ServicesRegistery.prototype.process = function( request ) {

    var service = this._services[request.serviceName];

    if( !service ) {

        var fault = request.buildFault();

        var ap = fault.associativeParamaters;
        ap["errorDomain"] =  "jsonbroker.ServicesRegistery.SERVICE_NOT_FOUND";
        ap["faultCode"] =  0x4e554c4c; // 'NULL'
        ap["faultContext"] = {"serviceName":request.serviceName,"methodName":request.methodName,"this._registeryName":this._registeryName};
        ap["faultMessage"] = "!service; serviceName = '"+request.serviceName+"'";
        ap["originator"] = "ServicesRegistery.js: ServicesRegistery.prototype.process";
        ap["stackTrace"] = [];
        ap["underlyingFaultMessage"] =  null;


        return fault;

    }

    return service.process(request);

}


server.ServicesRegistery.prototype.addService = function( describedService ) {

    this._services[ describedService.getServiceName() ] = describedService;

}


