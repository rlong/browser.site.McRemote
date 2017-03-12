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




export class MediaPropertiesPoller {

    $interval: angular.IIntervalService;
    $q: angular.IQService = null;
    service: dvd_player.Service;

    pendingProperties: angular.IPromise<dvd_player.IMediaProperties> = null;
    pollingInterval = null;

    constructor($interval: angular.IIntervalService, $q: angular.IQService, service: dvd_player.Service) {

        this.$interval = $interval;
        this.$q = $q;
        this.service = service;
    }

    pollingStart() {

        if( null != this.pollingInterval ) {
            console.warn( "null != this.pollingInterval" );
            return;
        }

        this.pollingInterval = this.$interval( () => {


            if( this.service.hasPendingMediaChange() ) {
                return;
            }

            if( this.applicationState.has_media ) {

                console.log( "poll 'media_state'" );

                // still waiting on a polled media state response
                if( null != this.pollingMediaState ) {
                    console.warn( "null != this.pollingMediaState" );
                    return;
                }

                this.pollingMediaState = this.proxy.media_state();
                this.pollingMediaState.then(
                    (result: dvd_player.MediaState) => {

                        this.pollingMediaState = null;
                        if( !result.has_media ) {
                            this.applicationState.has_media = false;
                        }
                    },
                    (reason) => {
                        console.error( "erhmerhgerd" );
                        this.pollingMediaState = null;
                    }
                );

            } else {

                console.log( "poll 'application_state'" );

                // still waiting on a polled media state response
                if( null != this.pollingApplicationState ) {
                    console.warn( "null != this.pollingApplicationState" );
                    return;
                }

                this.pollingApplicationState = this.application_state();

                this.pollingApplicationState.then(
                    () => {
                        this.pollingApplicationState = null;
                    },
                    (reason) => {
                        console.error( "erhmerhgerd" );
                        this.pollingApplicationState = null;
                    }
                );
            }

        }, 1000);


    }
}

export class Model {


    startPollingStatus() {


        this.pollingInterval = this.$interval( () => {

            if( null == this.applicationState ) {
                console.warn( "null == this.applicationState" );
                return;
            }

            if( this.applicationState.has_media ) {

                console.log( "poll 'media_state'" );

                // still waiting on a polled media state response
                if( null != this.pollingMediaState ) {
                    console.warn( "null != this.pollingMediaState" );
                    return;
                }

                this.pollingMediaState = this.proxy.media_state();
                this.pollingMediaState.then(
                    (result: dvd_player.MediaState) => {

                        this.pollingMediaState = null;
                        if( !result.has_media ) {
                            this.applicationState.has_media = false;
                        }
                    },
                    (reason) => {
                        console.error( "erhmerhgerd" );
                        this.pollingMediaState = null;
                    }
                );

            } else {

                console.log( "poll 'application_state'" );

                // still waiting on a polled media state response
                if( null != this.pollingApplicationState ) {
                    console.warn( "null != this.pollingApplicationState" );
                    return;
                }

                this.pollingApplicationState = this.application_state();

                this.pollingApplicationState.then(
                    () => {
                        this.pollingApplicationState = null;
                    },
                    (reason) => {
                        console.error( "erhmerhgerd" );
                        this.pollingApplicationState = null;
                    }
                );
            }

        }, 1000);

    }

    stopPollingStatus() {

        if( null == this.pollingInterval ) {
            console.warn( "null == this.pollingInterval" );
            return;
        }

        this.$interval.cancel( this.pollingInterval );
        this.pollingInterval = null;
    }

}

export class ViewController implements IStateListener {

    $interval: angular.IIntervalService;

    applicationState: dvd_player.ApplicationState = null;
    mediaState: dvd_player.MediaState = null;
    proxy: dvd_player.Proxy = null;
    model: Model = null;
    audioVolumeSliderConfig: any = {};
    elapsedTimeSliderConfig: any = null;



    constructor( $http: angular.IHttpService,
                 $q: angular.IQService, model: Model ) {

        this.model = model;
        this.model.stateListener = this;

        let adapter = json_broker.angular1.buildBrokerAdapter( $http, $q );
        this.proxy = new dvd_player.Proxy(adapter);


        this.proxy.get_all_enums().then(
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

        this.getApplicationState();
        this.getMediaState();

        this.model.startPollingStatus();

    }


    applicationStateOnUpdate( applicationState: dvd_player.ApplicationState ) {

        console.log( "applicationStateOnPolled" );

    }

    mediaStateOnUpdate( mediaState: dvd_player.MediaState ) {

        console.log( "applicationStateOnPolled" );
    }


    ejectOnClick() {

        console.log( "ejectOnClick" );
        this.model.eject_dvd();
    }

    playPauseOnClick() {
        this.model.play_pause_dvd();
    }

    getApplicationState() {
        this.model.application_state().then(
            () => {},
            (reason) => {
                console.error( reason);
            }
        );
    }

    getMediaState() {
        this.model.media_state().then(

            (result: dvd_player.MediaState)=> {

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
        this.model.set_audio_volume( Math.round( updatedVolume ));
    }

}


var mcRemote= page.buildAngularModule();

mcRemote.controller('index',
    function ($http: angular.IHttpService, $q: angular.IQService,
              $interval: angular.IIntervalService, $scope,
              $uibModal, model: Model) {

        $scope.model = model;


        let brokerAdapter = json_broker.buildBrokerAdapter( $http, $q );
        let proxy = new dvd_player.Proxy(brokerAdapter);

        $scope.viewController = new ViewController( $http, $q, model );

});

mcRemote.factory( "model", ["$http", "$interval", "$q", "$window", function($http,$interval:angular.IIntervalService,$q,$window) {

    let answer = new Model( $http, $interval, $q );
    return answer;

}]);


// angular1_nouislider.setup( mcRemote );
application.setup( mcRemote );
session.setup( mcRemote );
page.setup( mcRemote );

