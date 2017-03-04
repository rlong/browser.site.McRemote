// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var spotify;
(function (spotify) {
    var SERVICE_NAME = "remote_gateway.AppleScriptService:spotify";
    var BrokerMessage = json_broker.BrokerMessage;
    var PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["unknown"] = 0] = "unknown";
        PlayerState[PlayerState["paused"] = 1] = "paused";
        PlayerState[PlayerState["playing"] = 2] = "playing";
        PlayerState[PlayerState["stopped"] = 3] = "stopped";
    })(PlayerState || (PlayerState = {}));
    function lookupPlayerState(player_state) {
        switch (player_state) {
            case "kPSp":
                return PlayerState.paused;
            case "kPSP":
                return PlayerState.playing;
            case "kPSS":
                return PlayerState.stopped;
            default:
                return PlayerState.unknown;
        }
    }
    var Proxy = (function () {
        function Proxy(adapter) {
            this.adapter = adapter;
        }
        Proxy.prototype.ping = function () {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "get_all_enums");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                return;
            });
        };
        Proxy.prototype.get_all_enums = function () {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "get_all_enums");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                console.info(promiseValue.orderedParameters[0]);
                return promiseValue.orderedParameters[0];
            });
        };
        Proxy.prototype.dispatch_playback_properties = function (methodName) {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName);
            return this.adapter.dispatch(request).then(function (response) {
                var playbackProperties = response.orderedParameters[0];
                playbackProperties.player_state = lookupPlayerState(playbackProperties.player_state);
                return playbackProperties;
            });
        };
        Proxy.prototype.playback_properties = function () {
            return this.dispatch_playback_properties("playback_properties");
        };
        Proxy.prototype.playback_play = function () {
            return this.dispatch_playback_properties("playback_play");
        };
        return Proxy;
    }());
    spotify.Proxy = Proxy;
    var Service = (function () {
        function Service(proxy) {
            this.proxy = proxy;
        }
        Service.prototype.playback_properties = function () {
            var _this = this;
            this.proxy.playback_properties().then(function (playbackProperties) {
                if (null == _this.pendingplaybackChange) {
                    _this.playbackProperties = playbackProperties;
                }
            });
        };
        Service.prototype.playback_play = function () {
            var _this = this;
            this.pendingplaybackChange = this.proxy.playback_play();
            this.pendingplaybackChange.finally(function () {
                _this.pendingplaybackChange = null;
            });
        };
        return Service;
    }());
    spotify.Service = Service;
})(spotify || (spotify = {}));
