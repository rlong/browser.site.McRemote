/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/lib.json_broker/angular1.ts" />
/// <reference path="../../github/angular1_nouislider/angular1_nouislider.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="../../component/popup.ts" />
/// <reference path="com.apple.DVDPlayer.ts" />
var com;
(function (com) {
    var apple;
    (function (apple) {
        var DVDPlayer;
        (function (DVDPlayer) {
            var index;
            (function (index) {
                var consoleProxy = null;
                var PendingApplicationChange = (function () {
                    function PendingApplicationChange() {
                        this.promise = null;
                        this.audio_volume = null;
                    }
                    PendingApplicationChange.prototype.setPromise = function (promise) {
                        if (null == promise) {
                            this.promise = null;
                            this.audio_volume = null;
                        }
                    };
                    PendingApplicationChange.prototype.reset = function () {
                        this.promise = null;
                        this.audio_volume = null;
                    };
                    return PendingApplicationChange;
                }());
                var PendingMediaState = (function () {
                    function PendingMediaState(promise) {
                        this.promise = null;
                        this.promise = promise;
                    }
                    return PendingMediaState;
                }());
                var Model = (function () {
                    function Model($http, $interval, $q) {
                        this.$q = null;
                        this.applicationState = null;
                        this.mediaState = null;
                        this.proxy = null;
                        this.pendingApplicationChange = null;
                        this.pollingApplicationState = null;
                        this.pollingInterval = null;
                        this.pollingMediaState = null;
                        this.stateListener = null;
                        this.$interval = $interval;
                        this.$q = $q;
                        var requestHandler = json_broker.angular1.buildRequestHandler($http, $q);
                        this.proxy = new com.apple.DVDPlayer.Proxy(requestHandler);
                        this.proxy.get_all_enums().then(function (result) {
                            console.log(result);
                        });
                        this.pendingApplicationChange = new PendingApplicationChange();
                        this.application_state();
                        this.media_state();
                    }
                    Model.prototype.consoleLog = function (msg) {
                        console.log(msg);
                    };
                    Model.prototype.application_state = function () {
                        var promise = this.proxy.application_state();
                        return this.handleApplicationStatePromise(promise);
                    };
                    Model.prototype.eject_dvd = function () {
                        return this.proxy.eject_dvd();
                    };
                    Model.prototype.media_state = function () {
                        var promise = this.proxy.media_state();
                        return this.handleMediaStatePromise(promise);
                    };
                    Model.prototype.play_pause_dvd = function () {
                        var promise = this.proxy.play_pause_dvd();
                        return this.handleMediaStatePromise(promise);
                    };
                    Model.prototype.set_audio_volume = function (audio_volume) {
                        var promise = this.proxy.set_audio_volume(audio_volume);
                        this.pendingApplicationChange.promise = promise;
                        this.pendingApplicationChange.audio_volume = audio_volume;
                        return this.pendingApplicationChange.promise;
                    };
                    Model.prototype.setMediaState = function (mediaState) {
                        this.mediaState = mediaState;
                        if (null != this.stateListener) {
                            this.stateListener.mediaStateOnUpdate(mediaState);
                        }
                    };
                    Model.prototype.setApplicationState = function (applicationState) {
                        this.applicationState = applicationState;
                        // pending audio volume change
                        if (null != this.pendingApplicationChange.audio_volume) {
                            applicationState.audio_volume = this.pendingApplicationChange.audio_volume;
                        }
                        if (null != this.stateListener) {
                            this.stateListener.applicationStateOnUpdate(applicationState);
                        }
                    };
                    Model.prototype.handleMediaStatePromise = function (promise) {
                        var _this = this;
                        return promise.then(function (result) {
                            _this.mediaState = result;
                            return _this.$q.resolve(result);
                        }, function (reason) {
                            console.error("ehrmehrgerd");
                            return _this.$q.reject(reason);
                        });
                    };
                    Model.prototype.handleApplicationStatePromise = function (promise) {
                        var _this = this;
                        return promise.then(function (result) {
                            _this.setApplicationState(result);
                            if (null != _this.pendingApplicationChange) {
                                // pending change has completed
                                if (promise === _this.pendingApplicationChange.promise) {
                                    _this.pendingApplicationChange = null;
                                }
                                else {
                                    // we are still waiting for a response for our change
                                    if (null != _this.pendingApplicationChange.audio_volume) {
                                        // we update the retrieved ApplicationState with what the volume *will* be
                                        _this.applicationState.audio_volume = _this.pendingApplicationChange.audio_volume;
                                    }
                                    else {
                                        console.warn("unexpected path");
                                    }
                                }
                            }
                            return _this.$q.resolve(result);
                        }, function (reason) {
                            console.error("ehrmehrgerd");
                            // pending modifier has failed
                            if (promise === _this.pendingApplicationChange.promise) {
                                _this.pendingApplicationChange = null;
                            }
                            return _this.$q.reject(reason);
                        });
                    };
                    Model.prototype.startPollingStatus = function () {
                        var _this = this;
                        if (null != this.pollingInterval) {
                            console.warn("null != this.pollingInterval");
                            return;
                        }
                        this.pollingInterval = this.$interval(function () {
                            if (null == _this.applicationState) {
                                console.warn("null == this.applicationState");
                                return;
                            }
                            if (_this.applicationState.has_media) {
                                console.log("poll 'media_state'");
                                // still waiting on a polled media state response
                                if (null != _this.pollingMediaState) {
                                    console.warn("null != this.pollingMediaState");
                                    return;
                                }
                                _this.pollingMediaState = _this.proxy.media_state();
                                _this.pollingMediaState.then(function (result) {
                                    _this.pollingMediaState = null;
                                    if (!result.has_media) {
                                        _this.applicationState.has_media = false;
                                    }
                                }, function (reason) {
                                    console.error("erhmerhgerd");
                                    _this.pollingMediaState = null;
                                });
                            }
                            else {
                                console.log("poll 'application_state'");
                                // still waiting on a polled media state response
                                if (null != _this.pollingApplicationState) {
                                    console.warn("null != this.pollingApplicationState");
                                    return;
                                }
                                _this.pollingApplicationState = _this.application_state();
                                _this.pollingApplicationState.then(function () {
                                    _this.pollingApplicationState = null;
                                }, function (reason) {
                                    console.error("erhmerhgerd");
                                    _this.pollingApplicationState = null;
                                });
                            }
                        }, 1000);
                    };
                    Model.prototype.stopPollingStatus = function () {
                        if (null == this.pollingInterval) {
                            console.warn("null == this.pollingInterval");
                            return;
                        }
                        this.$interval.cancel(this.pollingInterval);
                        this.pollingInterval = null;
                    };
                    return Model;
                }());
                index.Model = Model;
                var ViewController = (function () {
                    function ViewController($http, $q, model) {
                        this.applicationState = null;
                        this.mediaState = null;
                        this.proxy = null;
                        this.model = null;
                        this.audioVolumeSliderConfig = {};
                        this.elapsedTimeSliderConfig = null;
                        var requestHandler = json_broker.angular1.buildRequestHandler($http, $q);
                        this.model = model;
                        this.model.stateListener = this;
                        this.proxy = new com.apple.DVDPlayer.Proxy(requestHandler);
                        consoleProxy = this.proxy;
                        this.proxy.get_all_enums().then(function (result) {
                            console.log(result);
                        });
                        this.audioVolumeSliderConfig = {
                            animate: true,
                            // start: [50],
                            connect: 'lower',
                            // connect: true,
                            range: {
                                'min': 0,
                                'max': 255
                            }
                        };
                        this.getApplicationState();
                        this.getMediaState();
                        this.model.startPollingStatus();
                    }
                    ViewController.prototype.applicationStateOnUpdate = function (applicationState) {
                        console.log("applicationStateOnPolled");
                    };
                    ViewController.prototype.mediaStateOnUpdate = function (mediaState) {
                        console.log("applicationStateOnPolled");
                    };
                    ViewController.prototype.ejectOnClick = function () {
                        console.log("ejectOnClick");
                        this.model.eject_dvd();
                    };
                    ViewController.prototype.playPauseOnClick = function () {
                        this.model.play_pause_dvd();
                    };
                    ViewController.prototype.getApplicationState = function () {
                        this.model.application_state().then(function () { }, function (reason) {
                            console.error(reason);
                        });
                    };
                    ViewController.prototype.getMediaState = function () {
                        var _this = this;
                        this.model.media_state().then(function (result) {
                            console.log("got media state");
                            _this.elapsedTimeSliderConfig = {
                                animate: true,
                                // start: [50],
                                connect: 'lower',
                                // connect: true,
                                range: {
                                    'min': 0,
                                    'max': result.title_length
                                }
                            };
                        }, function (reason) {
                            console.error(reason);
                        });
                    };
                    ViewController.prototype.audioVolumeOnChange = function (updatedVolume) {
                        console.log("updatedVolume: " + updatedVolume);
                        this.model.set_audio_volume(Math.round(updatedVolume));
                    };
                    return ViewController;
                }());
                index.ViewController = ViewController;
            })(index = DVDPlayer.index || (DVDPlayer.index = {}));
        })(DVDPlayer = apple.DVDPlayer || (apple.DVDPlayer = {}));
    })(apple = com.apple || (com.apple = {}));
})(com || (com = {}));
// 'ngAnimate',
var mcRemote = angular.module('mc-remote', ['ui.bootstrap']);
mcRemote.controller('index', function ($http, $q, $interval, $scope, $uibModal, model) {
    $scope.model = model;
    $scope.viewController = new com.apple.DVDPlayer.index.ViewController($http, $q, model);
});
mcRemote.factory("model", ["$http", "$interval", "$q", "$window", function ($http, $interval, $q, $window) {
        var answer = new com.apple.DVDPlayer.index.Model($http, $interval, $q);
        return answer;
    }]);
angular1_nouislider.setup(mcRemote);
application.context.setup(mcRemote);
session.context.setup(mcRemote);
page.context.setup(mcRemote);
//# sourceMappingURL=index.js.map