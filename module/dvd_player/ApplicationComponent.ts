// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//


/// <reference path="../../github/lib.json_broker/json_broker.ts" />


class ApplicationComponent {

    applicationService: dvd_player.ApplicationService;

    audioVolumeSliderConfig: any = {};


    constructor( applicationService: dvd_player.ApplicationService ) {

        console.log( "ApplicationComponent.constructor" );

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

    ping() {

        console.log( "ping");
    }

    audioVolumeOnChange( updatedVolume: number ) {

        console.log( "updatedVolume: " + updatedVolume);
        this.applicationService.application_set_volume( updatedVolume );
    }


    ejectOnClick() {

        this.applicationService.application_eject_dvd();
        console.log( "ejectOnClick" );
    }

    static setup( module: angular.IModule ) {

        module.component('applicationComponent', {

            templateUrl: 'ApplicationComponent.html',
            controller: [
                "$http","$q", "applicationService",
                ($http: angular.IHttpService, $q:angular.IQService,
                 applicationService: dvd_player.ApplicationService) => {

                    return new ApplicationComponent(applicationService);
                }],
            bindings: {
                // hero: '='
            }
        });
    }



}