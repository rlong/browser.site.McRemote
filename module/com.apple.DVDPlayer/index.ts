
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.angular1.ts" />
/// <reference path="../../github/angular1_nouislider/angular1_nouislider.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="../../component/popup.ts" />



class PendingApplicationChange {

    promise: angular.IPromise<dvd_player.ApplicationState> = null;
    audio_volume: number = null;

    constructor(  ) {
    }

    setPromise( promise: angular.IPromise<dvd_player.ApplicationState>) {
        if( null == promise ) {
            this.promise = null;
            this.audio_volume = null;
        }
    }

    reset() {
        this.promise = null;
        this.audio_volume = null;
    }


}

class PendingMediaState {

    promise: angular.IPromise<dvd_player.MediaState> = null;

    constructor( promise: angular.IPromise<dvd_player.MediaState> ) {
        this.promise = promise;
    }
}


interface IStateListener {

    applicationStateOnUpdate(applicationState: dvd_player.ApplicationState);
    mediaStateOnUpdate(mediaState: dvd_player.MediaState);
}



export class Model {

    $q: angular.IQService = null;
    $interval: angular.IIntervalService;

    applicationState: dvd_player.ApplicationState = null;
    mediaState: dvd_player.MediaState = null;
    proxy: dvd_player.Proxy = null;

    pendingApplicationChange: PendingApplicationChange = null;

    pollingApplicationState: angular.IPromise<dvd_player.ApplicationState> = null;
    pollingInterval = null;
    pollingMediaState: angular.IPromise<dvd_player.MediaState> = null;

    stateListener: IStateListener = null;

    constructor($http: angular.IHttpService, $interval: angular.IIntervalService, $q: angular.IQService) {

        this.$interval = $interval;
        this.$q = $q;

        let adapter = json_broker.angular1.buildBrokerAdapter( $http, $q );
        this.proxy = new dvd_player.Proxy(adapter);

        this.proxy.get_all_enums().then(
            (result: json_broker.BrokerMessage) => {
                console.log( result );
            }
        )

        this.pendingApplicationChange = new PendingApplicationChange();

        this.application_state();
        this.media_state();
    }



    consoleLog( msg: string ) {
        console.log( msg );
    }


    application_state(): angular.IPromise<dvd_player.ApplicationState> {

        let promise: angular.IPromise<dvd_player.ApplicationState> = this.proxy.application_state();
        return this.handleApplicationStatePromise( promise );
    }

    eject_dvd() : angular.IPromise<dvd_player.ApplicationState> {

        return this.proxy.eject_dvd();
    }

    media_state(): angular.IPromise<dvd_player.MediaState> {

        let promise: angular.IPromise<dvd_player.MediaState> = this.proxy.media_state();
        return this.handleMediaStatePromise( promise );
    }

    play_pause_dvd(): angular.IPromise<dvd_player.MediaState> {

        let promise: angular.IPromise<dvd_player.MediaState> = this.proxy.play_pause_dvd();
        return this.handleMediaStatePromise( promise);
    }

    set_audio_volume( audio_volume: number ): angular.IPromise<dvd_player.ApplicationState> {

        let promise: angular.IPromise<dvd_player.ApplicationState> = this.proxy.set_audio_volume( audio_volume );
        this.pendingApplicationChange.promise = promise;
        this.pendingApplicationChange.audio_volume = audio_volume;
        return this.pendingApplicationChange.promise;
    }

    setMediaState( mediaState: dvd_player.MediaState ) {

        this.mediaState = mediaState;

        if( null != this.stateListener ) {

            this.stateListener.mediaStateOnUpdate( mediaState );
        }
    }

    setApplicationState( applicationState: dvd_player.ApplicationState ) {

        this.applicationState = applicationState;

        // pending audio volume change
        if( null != this.pendingApplicationChange.audio_volume ) {
            applicationState.audio_volume = this.pendingApplicationChange.audio_volume;
        }

        if( null != this.stateListener ) {
            this.stateListener.applicationStateOnUpdate( applicationState );
        }
    }


    handleMediaStatePromise( promise: angular.IPromise<dvd_player.MediaState> ): angular.IPromise<dvd_player.MediaState> {

        return promise.then(
            (result: dvd_player.MediaState ) => {

                this.mediaState = result;
                return this.$q.resolve( result );
            },
            (reason) => {
                console.error( "ehrmehrgerd" );
                return this.$q.reject( reason );
            }
        )
    }

    handleApplicationStatePromise( promise: angular.IPromise<dvd_player.ApplicationState> )
    : angular.IPromise<dvd_player.ApplicationState> {

        return promise.then(
            ( result: dvd_player.ApplicationState) => {

                this.setApplicationState( result );

                if( null != this.pendingApplicationChange ) {

                    // pending change has completed
                    if( promise === this.pendingApplicationChange.promise ) {
                        this.pendingApplicationChange = null;

                    } else {

                        // we are still waiting for a response for our change
                        if( null != this.pendingApplicationChange.audio_volume ) {

                            // we update the retrieved dvd_player.ApplicationState with what the volume *will* be
                            this.applicationState.audio_volume = this.pendingApplicationChange.audio_volume;
                        } else {

                            console.warn( "unexpected path" );
                        }
                    }
                }
                return this.$q.resolve( result );
            },
            (reason) => {

                console.error( "ehrmehrgerd" );

                // pending modifier has failed
                if( promise === this.pendingApplicationChange.promise ) {
                    this.pendingApplicationChange = null;
                }

                return this.$q.reject( reason );
            }
        )
    }


    startPollingStatus() {

        if( null != this.pollingInterval ) {
            console.warn( "null != this.pollingInterval" );
            return;
        }

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




// 'ngAnimate',

var mcRemote= angular.module('mc-remote', [ 'ui.bootstrap']);

mcRemote.controller('index',
    function ($http: angular.IHttpService, $q: angular.IQService, $interval: angular.IIntervalService, $scope,
              $uibModal, model: Model) {

        $scope.model = model;
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

