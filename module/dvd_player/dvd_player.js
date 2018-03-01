// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/utility.ts" />
var dvd_player;
(function (dvd_player) {
    var SERVICE_NAME = "remote_gateway.AppleScriptService:dvd_player";
    dvd_player.VOLUME_MAX = 255;
    var VOLUME_MIN = 0;
    var BrokerMessage = json_broker.BrokerMessage;
    // x2/‌x4/‌x8/‌x16/‌x32
    var ScanRate;
    (function (ScanRate) {
        ScanRate[ScanRate["unknown"] = 0] = "unknown";
        ScanRate[ScanRate["x2"] = 2] = "x2";
        ScanRate[ScanRate["x4"] = 4] = "x4";
        ScanRate[ScanRate["x8"] = 8] = "x8";
        ScanRate[ScanRate["x16"] = 16] = "x16";
        ScanRate[ScanRate["x32"] = 32] = "x32";
    })(ScanRate = dvd_player.ScanRate || (dvd_player.ScanRate = {}));
    function lookupScanRate(dvd_scan_rate) {
        switch (dvd_scan_rate) {
            case "es2x":
                return ScanRate.x2;
            case "es4x":
                return ScanRate.x4;
            case "es8x":
                return ScanRate.x8;
            case "es16":
                return ScanRate.x16;
            case "es32":
                return ScanRate.x32;
            default:
                return ScanRate.unknown;
        }
    }
    var State;
    (function (State) {
        State[State["unknown"] = 0] = "unknown";
        State[State["playing"] = 1] = "playing";
        State[State["playing_still"] = 2] = "playing_still";
        State[State["paused"] = 3] = "paused";
        State[State["stopped"] = 4] = "stopped";
        State[State["scanning"] = 5] = "scanning";
        State[State["idle"] = 6] = "idle";
    })(State = dvd_player.State || (dvd_player.State = {}));
    function lookupState(dvd_state) {
        switch (dvd_state) {
            case "esid":
                return State.idle;
            case "espa":
                return State.paused;
            case "espl":
                return State.playing;
            case "esps":
                return State.playing_still;
            case "essc":
                return State.scanning;
            case "esst":
                return State.stopped;
            default:
                return State.unknown;
        }
    }
    var Proxy = /** @class */ (function () {
        function Proxy(adapter) {
            this.adapter = adapter;
        }
        ///////////////////////////////////////////////////////////////////////
        // TEST
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.ping = function () {
            var request = BrokerMessage.buildRequest(SERVICE_NAME, "ping");
            return this.adapter.dispatch(request);
        };
        ///////////////////////////////////////////////////////////////////////
        // META
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.meta_get_all_enums = function () {
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "meta_get_all_enums");
            return this.adapter.dispatch(request).then(function (promiseValue) {
                var answer = promiseValue.orderedParameters[0];
                console.log(answer);
                return answer;
            });
        };
        ///////////////////////////////////////////////////////////////////////
        // APPLICATION
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.dispatchApplicationPropertiesRequest = function (methodName) {
            var orderedParamaters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                orderedParamaters[_i - 1] = arguments[_i];
            }
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName, orderedParamaters);
            return this.adapter.dispatch(request).then(function (promiseValue) {
                var answer = promiseValue.orderedParameters[0];
                var dvd_scan_rate = lookupScanRate(answer.dvd_scan_rate);
                answer.dvd_scan_rate = dvd_scan_rate;
                return answer;
            });
        };
        Proxy.prototype.application_activate = function () {
            return this.dispatchApplicationPropertiesRequest("application_activate");
        };
        Proxy.prototype.application_properties = function () {
            return this.dispatchApplicationPropertiesRequest("application_properties");
        };
        Proxy.prototype.application_eject_dvd = function () {
            return this.dispatchApplicationPropertiesRequest("application_eject_dvd");
        };
        Proxy.prototype.application_set_viewer_full_screen = function () {
            return this.dispatchApplicationPropertiesRequest("application_set_viewer_full_screen");
        };
        Proxy.prototype.application_set_volume = function (audio_volume) {
            return this.dispatchApplicationPropertiesRequest("application_set_volume", audio_volume);
        };
        ///////////////////////////////////////////////////////////////////////
        // MEDIA
        ///////////////////////////////////////////////////////////////////////
        Proxy.prototype.dispatchMediaPropertiesRequest = function (methodName) {
            var orderedParamaters = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                orderedParamaters[_i - 1] = arguments[_i];
            }
            var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName, orderedParamaters);
            return this.adapter.dispatch(request).then(function (promiseValue) {
                var mediaProperties = promiseValue.orderedParameters[0];
                mediaProperties.dvd_state = lookupState(mediaProperties.dvd_state);
                var answer = mediaProperties;
                if (answer.has_media) {
                    answer.remaing_time = answer.title_length - answer.elapsed_time;
                }
                return answer;
            });
        };
        Proxy.prototype.media_properties = function () {
            return this.dispatchMediaPropertiesRequest("media_properties");
        };
        Proxy.prototype.media_play = function () {
            return this.dispatchMediaPropertiesRequest("media_play");
        };
        Proxy.prototype.media_playpause = function () {
            return this.dispatchMediaPropertiesRequest("media_playpause");
        };
        Proxy.prototype.media_set_elapsed_time = function (elapsed_time) {
            return this.dispatchMediaPropertiesRequest("media_set_elapsed_time", elapsed_time);
        };
        Proxy.prototype.media_set_volume = function (audio_volume) {
            return this.dispatchMediaPropertiesRequest("media_set_volume", audio_volume);
        };
        return Proxy;
    }());
    dvd_player.Proxy = Proxy;
    var ApplicationService = /** @class */ (function () {
        function ApplicationService(proxy) {
            this.proxy = proxy;
        }
        ApplicationService.prototype.application_activate = function () {
            return this.processApplicationPropertiesPromise(this.proxy.application_activate());
        };
        ApplicationService.prototype.application_properties = function () {
            return this.processApplicationPropertiesPromise(this.proxy.application_properties());
        };
        ApplicationService.prototype.application_eject_dvd = function () {
            return this.processApplicationPropertiesPromise(this.proxy.application_eject_dvd());
        };
        ApplicationService.prototype.application_set_volume = function (audio_volume) {
            return this.processApplicationPropertiesPromise(this.proxy.application_set_volume(audio_volume));
        };
        ApplicationService.prototype.processApplicationPropertiesPromise = function (pendingApplicationProperties) {
            var _this = this;
            this.pendingApplicationProperties = pendingApplicationProperties;
            pendingApplicationProperties.then(function (applicationProperties) {
                if (_this.pendingApplicationProperties == pendingApplicationProperties) {
                    _this.applicationProperties = applicationProperties;
                    _this.pendingApplicationProperties = null;
                }
                else {
                    // throw it on the ground
                }
            }, function (reason) {
                console.warn(reason);
                if (_this.pendingApplicationProperties == pendingApplicationProperties) {
                    _this.pendingApplicationProperties = null;
                }
            });
            return pendingApplicationProperties;
        };
        ApplicationService.prototype.hasPendingApplicationProperties = function () {
            if (null == this.pendingApplicationProperties) {
                return false;
            }
            return true;
        };
        ApplicationService.setup = function (module) {
            module.factory('applicationService', [
                "$http", "$q",
                function ($http, $q) {
                    var adapter = json_broker.buildBrokerAdapter($http, $q);
                    var proxy = new dvd_player.Proxy(adapter);
                    return new ApplicationService(proxy);
                }
            ]);
        };
        return ApplicationService;
    }());
    dvd_player.ApplicationService = ApplicationService;
    var MediaService = /** @class */ (function () {
        function MediaService(proxy) {
            this.proxy = proxy;
        }
        MediaService.prototype.media_properties = function () {
            return this.processMediaPropertiesPromise(this.proxy.media_properties());
        };
        MediaService.prototype.media_play = function () {
            return this.processMediaPropertiesPromise(this.proxy.media_play());
        };
        MediaService.prototype.media_playpause = function () {
            return this.processMediaPropertiesPromise(this.proxy.media_playpause());
        };
        MediaService.prototype.media_set_elapsed_time = function (elapsed_time) {
            return this.processMediaPropertiesPromise(this.proxy.media_set_elapsed_time(elapsed_time));
        };
        MediaService.prototype.media_set_volume = function (audio_volume) {
            return this.processMediaPropertiesPromise(this.proxy.media_set_volume(audio_volume));
        };
        MediaService.prototype.processMediaPropertiesPromise = function (pendingMediaProperties) {
            var _this = this;
            this.pendingMediaProperties = pendingMediaProperties;
            pendingMediaProperties.then(function (mediaProperties) {
                if (_this.pendingMediaProperties == pendingMediaProperties) {
                    _this.mediaProperties = mediaProperties;
                    _this.pendingMediaProperties = null;
                }
                else {
                    // throw it on the ground
                }
            }, function (reason) {
                console.warn(reason);
                if (_this.pendingMediaProperties == pendingMediaProperties) {
                    _this.pendingMediaProperties = null;
                }
            });
            return pendingMediaProperties;
        };
        MediaService.prototype.hasPendingMediaProperties = function () {
            if (null == this.pendingMediaProperties) {
                return false;
            }
            return true;
        };
        MediaService.setup = function (module) {
            module.factory('mediaService', [
                "$http", "$q",
                function ($http, $q) {
                    var adapter = json_broker.buildBrokerAdapter($http, $q);
                    var proxy = new dvd_player.Proxy(adapter);
                    return new MediaService(proxy);
                }
            ]);
        };
        return MediaService;
    }());
    dvd_player.MediaService = MediaService;
    var MediaStatePoller = /** @class */ (function () {
        function MediaStatePoller($interval, mediaService) {
            this.pollingInterval = null;
            this.$interval = $interval;
            this.mediaService = mediaService;
        }
        MediaStatePoller.prototype.isPolling = function () {
            if (null == this.pollingInterval) {
                return false;
            }
            return true;
        };
        MediaStatePoller.prototype.startPolling = function () {
            var _this = this;
            if (null != this.pollingInterval) {
                console.warn("null != this.pollingInterval");
                return;
            }
            this.pollingInterval = this.$interval(function () {
                if (_this.mediaService.hasPendingMediaProperties()) {
                    return;
                }
                _this.mediaService.media_properties();
            }, 1000);
        };
        MediaStatePoller.prototype.stopPolling = function () {
            if (null == this.pollingInterval) {
                console.warn("null == this.pollingInterval");
                return;
            }
            this.$interval.cancel(this.pollingInterval);
            this.pollingInterval = null;
        };
        return MediaStatePoller;
    }());
    dvd_player.MediaStatePoller = MediaStatePoller;
})(dvd_player || (dvd_player = {}));
//# sourceMappingURL=dvd_player.js.map