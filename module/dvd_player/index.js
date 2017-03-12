// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
"use strict";
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/angular1_nouislider/angular1_nouislider.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="../../component/popup.ts" />
var MediaPropertiesPoller = (function () {
    function MediaPropertiesPoller($interval, $q, service) {
        this.$q = null;
        this.pendingProperties = null;
        this.pollingInterval = null;
        this.$interval = $interval;
        this.$q = $q;
        this.service = service;
    }
    MediaPropertiesPoller.prototype.pollingStart = function () {
        var _this = this;
        if (null != this.pollingInterval) {
            console.warn("null != this.pollingInterval");
            return;
        }
        this.pollingInterval = this.$interval(function () {
            if (_this.service.hasPendingMediaChange()) {
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
    return MediaPropertiesPoller;
}());
exports.MediaPropertiesPoller = MediaPropertiesPoller;
var Model = (function () {
    function Model() {
    }
    Model.prototype.startPollingStatus = function () {
        var _this = this;
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
exports.Model = Model;
var ViewController = (function () {
    function ViewController($http, $q, model) {
        this.applicationState = null;
        this.mediaState = null;
        this.proxy = null;
        this.model = null;
        this.audioVolumeSliderConfig = {};
        this.elapsedTimeSliderConfig = null;
        this.model = model;
        this.model.stateListener = this;
        var adapter = json_broker.angular1.buildBrokerAdapter($http, $q);
        this.proxy = new dvd_player.Proxy(adapter);
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
exports.ViewController = ViewController;
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', function ($http, $q, $interval, $scope, $uibModal, model) {
    $scope.model = model;
    var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
    var proxy = new dvd_player.Proxy(brokerAdapter);
    $scope.viewController = new ViewController($http, $q, model);
});
mcRemote.factory("model", ["$http", "$interval", "$q", "$window", function ($http, $interval, $q, $window) {
        var answer = new Model($http, $interval, $q);
        return answer;
    }]);
// angular1_nouislider.setup( mcRemote );
application.setup(mcRemote);
session.setup(mcRemote);
page.setup(mcRemote);
//# sourceMappingURL=index.js.map