//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//



var common = common || {};


/**
 *
 * @param  {Array} [params]
 * @constructor
 */
common.BrokerMessage = function( params ) {

    if( params ) {

        console.log( params );

        this.messageType = params[0]; // 'request'/'response'
        this.metaData = params[1];
        this.serviceName = params[2];
        this.majorVersion = params[3];
        this.minorVersion = params[4];
        this.methodName = params[5];
        this.associativeParamaters = params[6];

        if( 7 < params.length ) {
            this.orderedParamaters = params[7];
        } else {
            this.orderedParamaters = null;
        }

    }

}


/**
 *
 * @param {Object} [request] a 'BrokerMessage' request
 */
common.BrokerMessage.prototype.buildFault = function( request ) {

    if( !request ) {
        request = this;
    }

    var answer = new common.BrokerMessage();
    answer.messageType = "fault";
    answer.metaData = request.metaData;
    answer.serviceName = request.serviceName;
    answer.majorVersion = request.majorVersion;
    answer.minorVersion = request.minorVersion;
    answer.methodName = request.methodName;
    answer.associativeParamaters = {};

    return answer;

}


/**
 *
 * @param {Object} [request] a 'BrokerMessage' request
 */
common.BrokerMessage.prototype.buildResponse = function( request ) {

    if( !request ) {
        request = this;
    }

    var answer = new common.BrokerMessage();
    answer.messageType = "response";
    answer.metaData = request.metaData;
    answer.serviceName = request.serviceName;
    answer.majorVersion = request.majorVersion;
    answer.minorVersion = request.minorVersion;
    answer.methodName = request.methodName;
    answer.associativeParamaters = {};

    return answer;

}


common.BrokerMessage.prototype.toJsonArray = function() {

    var answer = new Array();

    answer[0] = this.messageType;
    answer[1] = this.metaData;
    answer[2] = this.serviceName;
    answer[3] = this.majorVersion;
    answer[4] = this.minorVersion;
    answer[5] = this.methodName;
    answer[6] = this.associativeParamaters;

    if( this.orderedParamaters ) {
        answer[7] = this.orderedParamaters;
    }

    return answer;

}