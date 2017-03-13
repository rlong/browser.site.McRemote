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
var ViewController = (function () {
    function ViewController($http, $interval, $q) {
        this.proxy = null;
        this.audioVolumeSliderConfig = {};
        this.elapsedTimeSliderConfig = null;
        var adapter = json_broker.buildBrokerAdapter($http, $q);
        this.proxy = new dvd_player.Proxy(adapter);
        this.applicationService = new dvd_player.ApplicationService(this.proxy);
        this.mediaService = new dvd_player.MediaService(this.proxy);
        this.mediaStatePoller = new dvd_player.MediaStatePoller($interval, this.mediaService);
        this.proxy.meta_get_all_enums().then(function (result) {
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
        this.mediaStatePoller.startPolling();
    }
    ViewController.prototype.ejectOnClick = function () {
        console.log("ejectOnClick");
        this.applicationService.application_eject_dvd();
    };
    ViewController.prototype.playPauseOnClick = function () {
        this.mediaService.media_playpause();
    };
    ViewController.prototype.getMediaState = function () {
        var _this = this;
        this.mediaService.media_properties().then(function (result) {
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
        this.applicationService.application_set_volume(updatedVolume);
    };
    return ViewController;
}());
exports.ViewController = ViewController;
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', function ($http, $q, $interval, $scope, $uibModal) {
    $scope.viewController = new ViewController($http, $interval, $q);
});
// angular1_nouislider.setup( mcRemote );
application.setup(mcRemote);
session.setup(mcRemote);
page.setup(mcRemote);
//# sourceMappingURL=index.js.map