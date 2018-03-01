// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
var ApplicationComponent = /** @class */ (function () {
    function ApplicationComponent(applicationService) {
        this.audioVolumeSliderConfig = {};
        console.log("ApplicationComponent.constructor");
        this.applicationService = applicationService;
        this.applicationService.application_properties();
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
    }
    ApplicationComponent.prototype.ping = function () {
        console.log("ping");
    };
    ApplicationComponent.prototype.audioVolumeOnChange = function (updatedVolume) {
        console.log("updatedVolume: " + updatedVolume);
        this.applicationService.application_set_volume(updatedVolume);
    };
    ApplicationComponent.prototype.ejectOnClick = function () {
        this.applicationService.application_eject_dvd();
        console.log("ejectOnClick");
    };
    ApplicationComponent.setup = function (module) {
        module.component('applicationComponent', {
            templateUrl: 'ApplicationComponent.html',
            controller: [
                "$http", "$q", "applicationService",
                function ($http, $q, applicationService) {
                    return new ApplicationComponent(applicationService);
                }
            ],
            bindings: {}
        });
    };
    return ApplicationComponent;
}());
//# sourceMappingURL=ApplicationComponent.js.map