//  Copyright (c) 2014 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//




// requires:
// * jsonbroker.javascript/client/ClientBroker.js
// * jsonbroker.javascript/common/BrokerMessage.js


var server = server || {};


/**
 * can function as a bridge object (same methods as client.BrowserBridge, client.DesktopBridge,  client.MobileBridge)
 * @constructor
 */
server.ServerBroker = function() {


    this._servicesRegistery = {};


}

server.ServerBroker.prototype.addService = function( describedService ) {

    this._servicesRegistery[ describedService.getServiceName() ] = describedService;

}



server.ServerBroker.prototype.process = function() {

    var request = new common.BrokerMessage( arguments );

    var service = this._servicesRegistery[request.serviceName];

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

        return fault.toJsonArray();

    }

    var reply = service.process( request );
    return reply.toJsonArray();

}




//server.ServerBroker.prototype.registerProxy = function(proxyName,proxy) {
//
//    return client.ClientBroker.registerProxy(proxyName,proxy);
//
//}
//
//
//server.ServerBroker.prototype.dispatch = function() {
//
//    var reply = this.process.apply( this, arguments );
//
//
//    if( "response" === reply[0]) {
//
//        client.ClientBroker.forwardResponse( reply );
//
//    } else if( "fault" === reply[0]) {
//
//        client.ClientBroker.forwardFault( reply );
//
//    }
//
//    // else 'throw it on the ground' ... 'can't trust the system !!!'
//
//
//
//}



// default services broker ...
server._defaultServerBroker = new server.ServerBroker();
