


var server = server || {};

server.ServiceHelper =  server.ServiceHelper || {};


/**
 *
 * @param {Object} service associated with the request
 * @param {Object} request, a 'BrokerMessage' object from a client
 * @return {Object} a 'BrokerMessage' fault object
 */
server.ServiceHelper.methodNotFound = function( service, request ) {

    var fault = request.buildFault();

    var ap = fault.associativeParamaters;
    ap["errorDomain"] =  "jsonbroker.ServiceHelper.METHOD_NOT_FOUND";
    ap["faultCode"] =  0x4e554c4c; // 'NULL'
    ap["faultContext"] = {"serviceName":request.serviceName,"methodName":request.methodName};
    ap["faultMessage"] = "Unknown methodName; methodName = '"+request.methodName+"'";
    ap["originator"] = "ServiceHelper.js: ServiceHelper.methodNotFound";
    ap["stackTrace"] = [];
    ap["underlyingFaultMessage"] =  null;


    return fault;


}
