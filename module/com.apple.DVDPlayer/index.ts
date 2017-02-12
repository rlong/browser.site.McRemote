
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/lib.json_broker/angular1.ts" />
/// <reference path="../../github/angular1_nouislider/angular1_nouislider.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="../../component/popup.ts" />
/// <reference path="com.apple.DVDPlayer.ts" />



namespace com.apple.DVDPlayer.index {

    var consoleProxy: com.apple.DVDPlayer.Proxy = null;

    class PendingApplicationChange {

        promise: Promise<ApplicationState> = null;
        audio_volume: number = null;

        constructor(  ) {
        }

        setPromise( promise: Promise<ApplicationState>) {
            if( null == promise ) {
                this.promise = null;
                this.audio_volume = null;
            }
        }

        reset() {
            this.promise = null;
            this.audio_volume = null;
        }

        // updateApplicationState( applicationState: ApplicationState) {
        //     if( null == this.promise ) {
        //         return;
        //     }
        //
        //     if( null != this.audio_volume ) {
        //         applicationState.audio_volume = this.audio_volume;
        //     } else {
        //         console.error( "unexpected path" );
        //     }
        // }

    }

    class PendingMediaState {

        promise: Promise<MediaState> = null;

        constructor( promise: Promise<MediaState> ) {
            this.promise = promise;
        }
    }


    interface IStateListener {

        applicationStateOnUpdate(applicationState: ApplicationState);
        mediaStateOnUpdate(mediaState: MediaState);
    }



    export class Model {

        $q: angular.IQService = null;
        $interval: angular.IIntervalService;

        applicationState: ApplicationState = null;
        mediaState: MediaState = null;
        proxy: com.apple.DVDPlayer.Proxy = null;

        pendingApplicationChange: PendingApplicationChange = null;

        pollingApplicationState: Promise<ApplicationState> = null;
        pollingInterval = null;
        pollingMediaState: Promise<MediaState> = null;

        stateListener: IStateListener = null;

        constructor($http: angular.IHttpService, $interval: angular.IIntervalService, $q: angular.IQService) {

            this.$interval = $interval;
            this.$q = $q;

            let requestHandler = json_broker.angular1.buildRequestHandler( $http, $q );
            this.proxy = new com.apple.DVDPlayer.Proxy(requestHandler);

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


        application_state(): Promise<ApplicationState> {

            let promise: Promise<ApplicationState> = this.proxy.application_state();
            return this.handleApplicationStatePromise( promise );
        }

        eject_dvd() : Promise<ApplicationState> {

            return this.proxy.eject_dvd();
        }

        media_state(): Promise<MediaState> {

            let promise: Promise<MediaState> = this.proxy.media_state();
            return this.handleMediaStatePromise( promise );
        }

        play_pause_dvd(): Promise<MediaState> {

            let promise: Promise<MediaState> = this.proxy.play_pause_dvd();
            return this.handleMediaStatePromise( promise);
        }

        set_audio_volume( audio_volume: number ): Promise<ApplicationState> {

            let promise: Promise<ApplicationState> = this.proxy.set_audio_volume( audio_volume );
            this.pendingApplicationChange.promise = promise;
            this.pendingApplicationChange.audio_volume = audio_volume;
            return this.pendingApplicationChange.promise;
        }

        setMediaState( mediaState: MediaState ) {

            this.mediaState = mediaState;

            if( null != this.stateListener ) {

                this.stateListener.mediaStateOnUpdate( mediaState );
            }
        }

        setApplicationState( applicationState: ApplicationState ) {

            this.applicationState = applicationState;

            // pending audio volume change
            if( null != this.pendingApplicationChange.audio_volume ) {
                applicationState.audio_volume = this.pendingApplicationChange.audio_volume;
            }

            if( null != this.stateListener ) {
                this.stateListener.applicationStateOnUpdate( applicationState );
            }
        }


        handleMediaStatePromise( promise: Promise<MediaState> ): Promise<MediaState> {

            return promise.then(
                (result: MediaState ) => {

                    this.mediaState = result;
                    return this.$q.resolve( result );
                },
                (reason) => {
                    console.error( "ehrmehrgerd" );
                    return this.$q.reject( reason );
                }
            )
        }

        handleApplicationStatePromise( promise: Promise<ApplicationState> )
        : Promise<ApplicationState> {

            return promise.then(
                ( result: ApplicationState) => {

                    this.setApplicationState( result );

                    if( null != this.pendingApplicationChange ) {

                        // pending change has completed
                        if( promise === this.pendingApplicationChange.promise ) {
                            this.pendingApplicationChange = null;

                        } else {

                            // we are still waiting for a response for our change
                            if( null != this.pendingApplicationChange.audio_volume ) {

                                // we update the retrieved ApplicationState with what the volume *will* be
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
                        (result: MediaState) => {

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

        applicationState: ApplicationState = null;
        mediaState: MediaState = null;
        proxy: com.apple.DVDPlayer.Proxy = null;
        model: com.apple.DVDPlayer.index.Model = null;
        audioVolumeSliderConfig: any = {};
        elapsedTimeSliderConfig: any = null;



        constructor( $http: angular.IHttpService,
                     $q: angular.IQService, model: com.apple.DVDPlayer.index.Model ) {

            let requestHandler = json_broker.angular1.buildRequestHandler( $http, $q );
            this.model = model;
            this.model.stateListener = this;

            this.proxy = new com.apple.DVDPlayer.Proxy(requestHandler);
            consoleProxy = this.proxy;

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


        applicationStateOnUpdate( applicationState: ApplicationState ) {

            console.log( "applicationStateOnPolled" );

        }

        mediaStateOnUpdate( mediaState: MediaState ) {

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

                (result: MediaState)=> {

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

}



// 'ngAnimate',

var mcRemote= angular.module('mc-remote', [ 'ui.bootstrap']);

mcRemote.controller('index',
    function ($http: angular.IHttpService, $q: angular.IQService, $interval: angular.IIntervalService, $scope,
              $uibModal, model: com.apple.DVDPlayer.index.Model) {

        $scope.model = model;
        $scope.viewController = new com.apple.DVDPlayer.index.ViewController( $http, $q, model );

});

mcRemote.factory( "model", ["$http", "$interval", "$q", "$window", function($http,$interval:angular.IIntervalService,$q,$window) {

    let answer = new com.apple.DVDPlayer.index.Model( $http, $interval, $q );
    return answer;

}]);


angular1_nouislider.setup( mcRemote );
application.context.setup( mcRemote );
session.context.setup( mcRemote );
page.context.setup( mcRemote );

