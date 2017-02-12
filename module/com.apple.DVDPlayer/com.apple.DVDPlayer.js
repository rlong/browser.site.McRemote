/**
 * Created by local-rlong on 06/06/2016.
 */
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
// com.apple.DVDPlayer
var com;
(function (com) {
    var apple;
    (function (apple) {
        var DVDPlayer;
        (function (DVDPlayer) {
            var SERVICE_NAME = "remote_gateway.AppleScriptService:com.apple.DVDPlayer";
            var VOLUME_MAX = 255;
            var VOLUME_MIN = 0;
            var BrokerMessage = json_broker.BrokerMessage;
            // x2/‌x4/‌x8/‌x16/‌x32
            var DVDScanRate;
            (function (DVDScanRate) {
                DVDScanRate[DVDScanRate["unknown"] = 0] = "unknown";
                DVDScanRate[DVDScanRate["x2"] = 2] = "x2";
                DVDScanRate[DVDScanRate["x4"] = 4] = "x4";
                DVDScanRate[DVDScanRate["x8"] = 8] = "x8";
                DVDScanRate[DVDScanRate["x16"] = 16] = "x16";
                DVDScanRate[DVDScanRate["x32"] = 32] = "x32";
            })(DVDScanRate || (DVDScanRate = {}));
            var DVDState;
            (function (DVDState) {
                DVDState[DVDState["unknown"] = 0] = "unknown";
                DVDState[DVDState["playing"] = 1] = "playing";
                DVDState[DVDState["playing_still"] = 2] = "playing_still";
                DVDState[DVDState["paused"] = 3] = "paused";
                DVDState[DVDState["stopped"] = 4] = "stopped";
                DVDState[DVDState["scanning"] = 5] = "scanning";
                DVDState[DVDState["idle"] = 6] = "idle";
            })(DVDState || (DVDState = {}));
            // com.apple.DVDPlayer.ApplicationState
            var ApplicationState = (function () {
                function ApplicationState(sourceObject) {
                    this.app_initializing = null;
                    this.audio_volume = null;
                    this.closed_captioning = null;
                    this.displaying_subtitle = null;
                    this.dvd_scan_rate = null;
                    this.has_media = null;
                    this.viewer_full_screen = null;
                    application.utility.copyInto(this, sourceObject);
                    switch (sourceObject.dvd_scan_rate) {
                        case "es2x":
                            this.dvd_scan_rate = DVDScanRate.x2;
                            break;
                        case "es4x":
                            this.dvd_scan_rate = DVDScanRate.x4;
                            break;
                        case "es8x":
                            this.dvd_scan_rate = DVDScanRate.x8;
                            break;
                        case "es16":
                            this.dvd_scan_rate = DVDScanRate.x16;
                            break;
                        case "es32":
                            this.dvd_scan_rate = DVDScanRate.x32;
                            break;
                        default:
                            this.dvd_scan_rate = DVDScanRate.unknown;
                    }
                }
                return ApplicationState;
            }());
            DVDPlayer.ApplicationState = ApplicationState;
            var MediaState = (function () {
                function MediaState(sourceObject) {
                    this.available_chapters = null;
                    this.current_chapter = null;
                    this.dvd_menu_active = null;
                    this.dvd_state = null;
                    this.elapsed_time = null;
                    this.has_media = null;
                    this.title_length = null;
                    application.utility.copyInto(this, sourceObject);
                    switch (sourceObject.dvd_state) {
                        case "esid":
                            this.dvd_state = DVDState.idle;
                            break;
                        case "espa":
                            this.dvd_state = DVDState.paused;
                            break;
                        case "espl":
                            this.dvd_state = DVDState.playing;
                            break;
                        case "esps":
                            this.dvd_state = DVDState.playing_still;
                            break;
                        case "essc":
                            this.dvd_state = DVDState.scanning;
                            break;
                        case "esst":
                            this.dvd_state = DVDState.stopped;
                            break;
                        default:
                            this.dvd_state = DVDState.unknown;
                    }
                }
                return MediaState;
            }());
            DVDPlayer.MediaState = MediaState;
            var Proxy = (function () {
                function Proxy(requestHandler) {
                    this.requestHandler = requestHandler;
                }
                Proxy.prototype.get_all_enums = function () {
                    var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "get_all_enums");
                    return this.requestHandler.dispatch(request).then(function (promiseValue) {
                        console.log(promiseValue.orderedParameters[0]);
                        return promiseValue;
                        // let answer = new ApplicationState( promiseValue.orderedParameters[0] );
                        // return answer;
                    });
                };
                /*
                 ///////////////////////////////////////////////////////////////////////
                 // STATE
                 ///////////////////////////////////////////////////////////////////////
                 */
                Proxy.prototype.application_state = function () {
                    return this.dispatchApplicationStateRequest("application_state");
                };
                Proxy.prototype.media_state = function () {
                    return this.dispatchMediaStateRequest("media_state");
                };
                ///////////////////////////////////////////////////////////////////////
                // APPLICATION CONTROL
                ///////////////////////////////////////////////////////////////////////
                Proxy.prototype.activate_dvd_player = function () {
                    return this.dispatchApplicationStateRequest("activate_dvd_player");
                };
                Proxy.prototype.eject_dvd = function () {
                    return this.dispatchApplicationStateRequest("eject_dvd");
                };
                Proxy.prototype.set_viewer_full_screen = function () {
                    return this.dispatchApplicationStateRequest("set_viewer_full_screen");
                };
                Proxy.prototype.set_audio_volume = function (audio_volume) {
                    return this.dispatchApplicationStateRequest("set_audio_volume", audio_volume);
                };
                ///////////////////////////////////////////////////////////////////////
                // PLAYBACK CONTROL
                ///////////////////////////////////////////////////////////////////////
                Proxy.prototype.play_pause_dvd = function () {
                    return this.dispatchMediaStateRequest("play_pause_dvd");
                };
                ///////////////////////////////////////////////////////////////////////
                // Test / Debugging
                ///////////////////////////////////////////////////////////////////////
                Proxy.prototype.ping = function () {
                    var request = BrokerMessage.buildRequest(SERVICE_NAME, "ping");
                    return this.requestHandler.dispatch(request);
                };
                ///////////////////////////////////////////////////////////////////////
                // private support code
                Proxy.prototype.dispatchMediaStateRequest = function (methodName) {
                    var request = BrokerMessage.buildRequest(SERVICE_NAME, methodName);
                    return this.requestHandler.dispatch(request).then(function (promiseValue) {
                        var answer = new MediaState(promiseValue.orderedParameters[0]);
                        return answer;
                    });
                };
                Proxy.prototype.dispatchApplicationStateMethod = function (methodName) {
                    var request = BrokerMessage.buildRequest(SERVICE_NAME, methodName);
                    return this.requestHandler.dispatch(request).then(function (promiseValue) {
                        console.log(promiseValue);
                        var answer = new ApplicationState(promiseValue.orderedParameters[0]);
                        return answer;
                    });
                };
                Proxy.prototype.dispatchApplicationStateRequest = function (methodName) {
                    var orderedParamaters = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        orderedParamaters[_i - 1] = arguments[_i];
                    }
                    // console.log( orderedParamaters );
                    var request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName, orderedParamaters);
                    return this.requestHandler.dispatch(request).then(function (promiseValue) {
                        // console.log( promiseValue );
                        var answer = new ApplicationState(promiseValue.orderedParameters[0]);
                        return answer;
                    });
                };
                return Proxy;
            }());
            DVDPlayer.Proxy = Proxy;
        })(DVDPlayer = apple.DVDPlayer || (apple.DVDPlayer = {}));
    })(apple = com.apple || (com.apple = {}));
})(com || (com = {}));
//# sourceMappingURL=com.apple.DVDPlayer.js.map