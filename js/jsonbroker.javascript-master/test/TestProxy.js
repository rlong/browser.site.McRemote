//  Copyright (c) 2014 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//


var test = test || {};



test.TestProxy = function(bridge) {

    this._bridge = bridge;

    this._metaInformation = {};
    this._serviceName = "jsonbroker.TestService";
    this._majorVersion = 1;
    this._minorVersion = 0;

    this._metaInformation = bridge.registerProxy(this._serviceName,this);

}


test.TestProxy.prototype.ping = function() {

    this._bridge.dispatch( "request", this._metaInformation, this._serviceName, this._majorVersion, this._minorVersion, "ping",  {});
}

test.TestProxy.prototype.ping_oneway = function() {

    this._bridge.dispatch( "oneway", this._metaInformation, this._serviceName, this._majorVersion, this._minorVersion, "ping", {});
}

test.TestProxy.prototype.raise_error = function() {

    this._bridge.dispatch( "request", this._metaInformation, this._serviceName, this._majorVersion, this._minorVersion, "raise_error", {});

}

