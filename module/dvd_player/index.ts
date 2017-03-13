// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//

/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/angular1_nouislider/angular1_nouislider.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="../../component/popup.ts" />





export class ViewController {


    proxy: dvd_player.Proxy = null;
    applicationService: dvd_player.ApplicationService;
    mediaService: dvd_player.MediaService;
    mediaStatePoller: dvd_player.MediaStatePoller;

    audioVolumeSliderConfig: any = {};
    elapsedTimeSliderConfig: any = null;


    constructor( $http: angular.IHttpService, $interval: angular.IIntervalService,
                 $q: angular.IQService ) {

        let adapter = json_broker.buildBrokerAdapter( $http, $q );
        this.proxy = new dvd_player.Proxy(adapter);

        this.applicationService = new dvd_player.ApplicationService( this.proxy );
        this.mediaService = new dvd_player.MediaService( this.proxy );
        this.mediaStatePoller = new dvd_player.MediaStatePoller( $interval, this.mediaService );

        this.proxy.meta_get_all_enums().then(
            (result: json_broker.BrokerMessage) => {
                console.log( result );
            }
        )

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


    ejectOnClick() {

        console.log( "ejectOnClick" );
        this.applicationService.application_eject_dvd();
    }

    playPauseOnClick() {

        this.mediaService.media_playpause();
    }


    getMediaState() {

        this.mediaService.media_properties().then(

            (result: dvd_player.IMediaProperties)=> {

                console.log( "got media state" );

                this.elapsedTimeSliderConfig = {

                    animate: true,
                    // start: [50],
                    connect: 'lower',
                    // connect: true,
                    range: {
                        'min': 0,
                        'max': result.title_length
                    }
                }
            },
            (reason) => {
                console.error( reason);
            }
        )
    }


    audioVolumeOnChange( updatedVolume: number ) {

        console.log( "updatedVolume: " + updatedVolume);
        this.applicationService.application_set_volume( updatedVolume );
    }

}


var mcRemote= page.buildAngularModule();

mcRemote.controller('index',
    function ($http: angular.IHttpService, $q: angular.IQService,
              $interval: angular.IIntervalService, $scope,
              $uibModal ) {

        $scope.viewController = new ViewController( $http, $interval, $q );

});



// angular1_nouislider.setup( mcRemote );
application.setup( mcRemote );
session.setup( mcRemote );
page.setup( mcRemote );

