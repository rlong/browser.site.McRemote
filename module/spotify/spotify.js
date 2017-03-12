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
        ///////////////////////////////////////////////////////////////////////
        // TEST
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.ping = function () {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "get_all_enums");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                return;
            });
        };
        ///////////////////////////////////////////////////////////////////////
        // META
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.meta_get_all_enums = function () {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "meta_get_all_enums");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                console.info(promiseValue.orderedParameters[0]);
                return promiseValue.orderedParameters[0];
            });
        };
        ///////////////////////////////////////////////////////////////////////
        // MEDIA
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.dispatchMediaPropertiesRequest = function (methodName) {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName);
            return this.adapter.dispatch(request).then(function (response) {
                var playbackProperties = response.orderedParameters[0];
                playbackProperties.player_state = lookupPlayerState(playbackProperties.player_state);
                return playbackProperties;
            });
        };
        Proxy.prototype.media_properties = function () {
            return this.dispatchMediaPropertiesRequest("media_properties");
        };
        Proxy.prototype.media_play = function () {
            return this.dispatchMediaPropertiesRequest("media_play");
        };
        return Proxy;
    }());
    spotify.Proxy = Proxy;
    var Service = (function () {
        function Service(proxy) {
            this.proxy = proxy;
        }
        Service.prototype.media_properties = function () {
            var _this = this;
            var promise = this.proxy.media_properties();
            promise.then(function (playbackProperties) {
                _this.setPlaybackProperties(playbackProperties, promise);
            });
        };
        Service.prototype.media_play = function () {
            var _this = this;
            var promise = this.proxy.media_play();
            this.pendingMediaChange = promise;
            promise.then(function (playbackProperties) {
                _this.setPlaybackProperties(playbackProperties, promise);
            });
        };
        Service.prototype.setPlaybackProperties = function (playbackProperties, completedPromise) {
            if (this.pendingMediaChange == null) {
                this.mediaProperties = playbackProperties;
                return;
            }
            if (this.pendingMediaChange === completedPromise) {
                this.pendingMediaChange = null;
                this.mediaProperties = playbackProperties;
                return;
            }
        };
        return Service;
    }());
    spotify.Service = Service;
})(spotify || (spotify = {}));
