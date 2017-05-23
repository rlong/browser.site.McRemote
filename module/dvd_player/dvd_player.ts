// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//



/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/utility.ts" />


module dvd_player {

    const SERVICE_NAME = "remote_gateway.AppleScriptService:dvd_player";
    export const VOLUME_MAX: number = 255;
    const VOLUME_MIN: number = 0;

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    // x2/‌x4/‌x8/‌x16/‌x32
    export enum ScanRate {
        unknown,
        x2 = 2,
        x4 = 4,
        x8 = 8,
        x16 = 16,
        x32 = 32
    }


    function lookupScanRate( dvd_scan_rate: string) {

        switch( dvd_scan_rate) {
            case "es2x":
                return ScanRate.x2;
            case "es4x":
                return ScanRate.x4;
            case "es8x":
                return ScanRate.x8;
            case "es16":
                return ScanRate.x16;
            case "es32":
                return ScanRate.x32;
            default:
                return ScanRate.unknown;
        }
    }


    export enum State {
        unknown,
        playing,
        playing_still,
        paused,
        stopped,
        scanning,
        idle
    }

    function lookupState( dvd_state: string ) {

        switch( dvd_state) {
            case "esid":
                return State.idle;
            case "espa":
                return State.paused;
            case "espl":
                return State.playing;
            case "esps":
                return State.playing_still;
            case "essc":
                return State.scanning;
            case "esst":
                return State.stopped;
            default:
                return State.unknown;
        }

    }

    export interface IApplicationProperties {

        app_initializing: boolean;
        audio_volume: number;
        closed_captioning: boolean;
        displaying_subtitle: boolean;
        dvd_scan_rate: ScanRate;
        has_media: boolean;
        viewer_full_screen: boolean;
    }

    export interface IMediaProperties {

        audio_volume: number;
        available_chapters: number;
        current_chapter: number;
        dvd_menu_active: boolean;
        dvd_state: State;
        elapsed_time: number;
        has_media: boolean;
        title_length: number;
        remaing_time: number;
    }

    export class Proxy {

        adapter: json_broker.IBrokerAdapter;


        constructor(adapter: json_broker.IBrokerAdapter) {

            this.adapter = adapter;
        }


        ///////////////////////////////////////////////////////////////////////
        // TEST
        ///////////////////////////////////////////////////////////////////////

        ping(): angular.IPromise<BrokerMessage> {

            let request = BrokerMessage.buildRequest( SERVICE_NAME, "ping" );
            return this.adapter.dispatch( request );
        }


        ///////////////////////////////////////////////////////////////////////
        // META
        ///////////////////////////////////////////////////////////////////////


        meta_get_all_enums(): angular.IPromise<BrokerMessage> {
            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, "meta_get_all_enums" );
            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    let answer = promiseValue.orderedParameters[0];
                    console.log( answer );

                    return answer;
                }
            );
        }

        ///////////////////////////////////////////////////////////////////////
        // APPLICATION
        ///////////////////////////////////////////////////////////////////////


        private dispatchApplicationPropertiesRequest( methodName: string, ...orderedParamaters: any[] ): angular.IPromise<IApplicationProperties> {

            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, methodName, orderedParamaters );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {


                    let answer = promiseValue.orderedParameters[0];

                    let dvd_scan_rate = lookupScanRate( answer.dvd_scan_rate );
                    answer.dvd_scan_rate = dvd_scan_rate;
                    return answer as IApplicationProperties;
                }
            );
        }


        application_activate(): angular.IPromise<IApplicationProperties> {
            return this.dispatchApplicationPropertiesRequest( "application_activate" );
        }

        application_properties(): angular.IPromise<IApplicationProperties> {

            return this.dispatchApplicationPropertiesRequest( "application_properties" );
        }

        application_eject_dvd(): angular.IPromise<IApplicationProperties> {
            return this.dispatchApplicationPropertiesRequest( "application_eject_dvd" );
        }

        application_set_viewer_full_screen(): angular.IPromise<IApplicationProperties> {
            return this.dispatchApplicationPropertiesRequest( "application_set_viewer_full_screen" );
        }

        application_set_volume( audio_volume: number ): angular.IPromise<IApplicationProperties> {
            return this.dispatchApplicationPropertiesRequest( "application_set_volume", audio_volume );
        }


        ///////////////////////////////////////////////////////////////////////
        // MEDIA
        ///////////////////////////////////////////////////////////////////////


        private dispatchMediaPropertiesRequest( methodName: string, ...orderedParamaters: any[] ): angular.IPromise<IMediaProperties> {

            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, methodName, orderedParamaters );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    let mediaProperties = promiseValue.orderedParameters[0];

                    mediaProperties.dvd_state = lookupState( mediaProperties.dvd_state );
                    let answer = mediaProperties as IMediaProperties;
                    if( answer.has_media ) {
                        answer.remaing_time = answer.title_length - answer.elapsed_time;
                    }
                    return answer;
                }
            );
        }

        media_properties(): angular.IPromise<IMediaProperties> {

            return this.dispatchMediaPropertiesRequest( "media_properties" );
        }

        media_play(): angular.IPromise<IMediaProperties> {

            return this.dispatchMediaPropertiesRequest( "media_play" );
        }

        media_playpause(): angular.IPromise<IMediaProperties> {

            return this.dispatchMediaPropertiesRequest( "media_playpause" );
        }


        media_set_elapsed_time( elapsed_time: number ): angular.IPromise<IMediaProperties> {
            return this.dispatchMediaPropertiesRequest( "media_set_elapsed_time", elapsed_time );
        }

        media_set_volume( audio_volume: number ): angular.IPromise<IMediaProperties> {
            return this.dispatchMediaPropertiesRequest( "media_set_volume", audio_volume );
        }

    }

    export class ApplicationService {

        applicationProperties: IApplicationProperties;
        pendingApplicationProperties: angular.IPromise<IApplicationProperties>;

        proxy: Proxy;

        constructor( proxy: Proxy ) {
            this.proxy = proxy;
        }

        public application_activate() {
            return this.processApplicationPropertiesPromise( this.proxy.application_activate() );
        }

        public application_properties(): angular.IPromise<IApplicationProperties> {

            return this.processApplicationPropertiesPromise( this.proxy.application_properties() );
        }

        public application_eject_dvd() {
            return this.processApplicationPropertiesPromise( this.proxy.application_eject_dvd() );
        }

        public application_set_volume( audio_volume: number ) {
            return this.processApplicationPropertiesPromise(
                this.proxy.application_set_volume( audio_volume ) );
        }

        private processApplicationPropertiesPromise( pendingApplicationProperties: angular.IPromise<IApplicationProperties>)
        :angular.IPromise<IApplicationProperties> {

            this.pendingApplicationProperties = pendingApplicationProperties;

            pendingApplicationProperties.then(
                ( applicationProperties: IApplicationProperties ) => {

                    if( this.pendingApplicationProperties == pendingApplicationProperties ) {
                        this.applicationProperties = applicationProperties;
                        this.pendingApplicationProperties = null;
                    } else {
                        // throw it on the ground
                    }
                },
                (reason) => {

                    console.warn( reason );
                    if( this.pendingApplicationProperties == pendingApplicationProperties ) {
                        this.pendingApplicationProperties = null;
                    }
                }
            );
            return pendingApplicationProperties;
        }


        public hasPendingApplicationProperties(): boolean {

            if( null == this.pendingApplicationProperties ) {
                return false;
            }
            return true;
        }


        static setup( module: angular.IModule ) {

            module.factory('applicationService', [
                "$http","$q",
                ($http: angular.IHttpService, $q:angular.IQService) => {

                    let adapter = json_broker.buildBrokerAdapter( $http, $q );
                    let proxy = new dvd_player.Proxy(adapter);

                    return new ApplicationService(proxy);

                }]);
        }
    }

    export class MediaService {


        mediaProperties: IMediaProperties;
        pendingMediaProperties: angular.IPromise<IMediaProperties>;
        proxy: Proxy;

        constructor( proxy: Proxy ) {
            this.proxy = proxy;
        }

        media_properties():angular.IPromise<IMediaProperties> {

            return this.processMediaPropertiesPromise( this.proxy.media_properties() );
        }

        media_play():angular.IPromise<IMediaProperties> {

            return this.processMediaPropertiesPromise( this.proxy.media_play() );
        }

        media_playpause() {
            return this.processMediaPropertiesPromise( this.proxy.media_playpause() );
        }


        media_set_elapsed_time( elapsed_time: number ) {
            return this.processMediaPropertiesPromise( this.proxy.media_set_elapsed_time( elapsed_time )  );

        }

        media_set_volume( audio_volume: number ): angular.IPromise<IMediaProperties> {
            return this.processMediaPropertiesPromise( this.proxy.media_set_volume( audio_volume )  );
        }

        private processMediaPropertiesPromise( pendingMediaProperties: angular.IPromise<IMediaProperties> )
        :angular.IPromise<IMediaProperties> {

            this.pendingMediaProperties = pendingMediaProperties;

            pendingMediaProperties.then(
                (mediaProperties: IMediaProperties) => {

                    if( this.pendingMediaProperties == pendingMediaProperties ) {
                        this.mediaProperties = mediaProperties;
                        this.pendingMediaProperties = null;
                    } else {
                        // throw it on the ground
                    }
                },
                (reason) => {
                    console.warn( reason );
                    if( this.pendingMediaProperties == pendingMediaProperties ) {
                        this.pendingMediaProperties = null;
                    }
                }
            );

            return pendingMediaProperties;
        }

        public hasPendingMediaProperties(): boolean {

            if( null == this.pendingMediaProperties ) {
                return false;
            }
            return true;
        }

        static setup( module: angular.IModule ) {

            module.factory('mediaService', [
                "$http","$q",
                ($http: angular.IHttpService, $q:angular.IQService) => {

                    let adapter = json_broker.buildBrokerAdapter( $http, $q );
                    let proxy = new dvd_player.Proxy(adapter);

                    return new MediaService(proxy);

                }]);
        }

    }

    export class MediaStatePoller {

        $interval: angular.IIntervalService;
        mediaService: dvd_player.MediaService;

        pollingInterval = null;

        constructor($interval: angular.IIntervalService,
                    mediaService: dvd_player.MediaService ) {

            this.$interval = $interval;
            this.mediaService= mediaService;
        }

        isPolling() {

            if (null == this.pollingInterval) {
                return false;
            }
            return true;
        }

        startPolling() {

            if( null != this.pollingInterval ) {
                console.warn( "null != this.pollingInterval" );
                return;
            }

            this.pollingInterval = this.$interval( () => {

                if( this.mediaService.hasPendingMediaProperties() ) {
                    return;
                }

                this.mediaService.media_properties();

            }, 1000);
        }

        stopPolling() {

            if( null == this.pollingInterval ) {
                console.warn( "null == this.pollingInterval" );
                return;
            }

            this.$interval.cancel( this.pollingInterval );
            this.pollingInterval = null;
        }
    }

}