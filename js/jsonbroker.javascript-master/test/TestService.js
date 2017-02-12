//  Copyright (c) 2014 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//




var test = test || {};

test.TestService = function() {

}


test.TestService.prototype.echo = function(associativeParameters) {

    console.log( "echo(associativeParameters)" );
    return associativeParamaters;

}

test.TestService.prototype.ping = function() {
    console.log( "ping()" );
}


test.TestService.prototype.raiseError = function() {
    throw "fault";
}

test.TestService.prototype.getServiceName = function( ) {
    return "jsonbroker.TestService";
}

/**
 *
 * @param request a 'common.BrokerMessage'
 * @return {object} a 'common.BrokerMessage' response
 */
test.TestService.prototype.process = function( request ) {

    var methodName = request.methodName;

    if( "echo" === methodName ) {

        var ap = request.associativeParamaters;
        ap = this.echo( ap  );
        var answer = request.buildResponse();
        answer.associativeParamaters = ap;
        return answer;
    }

    if( "ping" === methodName ) {
        this.ping();
        return request.buildResponse();
    }

    return server.ServiceHelper.methodNotFound( );

}