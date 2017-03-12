// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//



/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/utility.ts" />


module dvd_player {

    const SERVICE_NAME = "remote_gateway.AppleScriptService:com.apple.DVDPlayer";
    const VOLUME_MAX: number = 255;
    const VOLUME_MIN: number = 0;

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    // x2/‌x4/‌x8/‌x16/‌x32
    enum ScanRate {
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


    enum State {
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

        available_chapters: number;
        current_chapter: number;
        dvd_menu_active: boolean;
        dvd_state: State;
        elapsed_time: number;
        has_media: boolean;
        title_length: number;
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
            return this.dispatchApplicationPropertiesRequest( "set_audio_volume", audio_volume );
        }


        ///////////////////////////////////////////////////////////////////////
        // MEDIA
        ///////////////////////////////////////////////////////////////////////


        private dispatchMediaPropertiesRequest( methodName: string, ...orderedParamaters: any[] ): angular.IPromise<IMediaProperties> {

            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, methodName, orderedParamaters );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    let answer = promiseValue.orderedParameters[0];

                    let dvd_state = lookupState( answer.dvd_state );
                    answer.dvd_state = dvd_state;
                    return answer as IMediaProperties;
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

    }

    export class MediaService {

        proxy: Proxy;

        mediaProperties: IMediaProperties;
        pendingMediaProperties: angular.IPromise<IMediaProperties>;


        constructor( proxy: Proxy ) {
            this.proxy = proxy;
        }

        media_properties() {

            this.processMediaPropertiesPromise( this.proxy.media_properties() );
        }

        media_play() {

            this.processMediaPropertiesPromise( this.proxy.media_play() );
        }

        private processMediaPropertiesPromise( pendingMediaProperties: angular.IPromise<IMediaProperties> ) {

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
        }

        public hasPendingMediaProperties() {

            if( null == this.pendingMediaProperties ) {
                return false;
            }
            return true;
        }

    }
}