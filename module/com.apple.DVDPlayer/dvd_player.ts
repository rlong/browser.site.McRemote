/**
 * Created by local-rlong on 06/06/2016.
 */


/// <reference path="../../typings/index.d.ts" />
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
    enum DVDScanRate {
        unknown,
        x2 = 2,
        x4 = 4,
        x8 = 8,
        x16 = 16,
        x32 = 32
    }

    enum DVDState {
        unknown,
        playing,
        playing_still,
        paused,
        stopped,
        scanning,
        idle
    }

    // com.apple.DVDPlayer.ApplicationState
    export class ApplicationState {

        app_initializing: boolean = null;
        audio_volume: number = null;
        closed_captioning: boolean = null;
        displaying_subtitle: boolean = null;
        dvd_scan_rate: DVDScanRate = null;
        has_media: boolean = null;
        viewer_full_screen: boolean = null;

        constructor( sourceObject: any ) {


            utility.copyInto( this, sourceObject );

            switch( sourceObject.dvd_scan_rate) {
                case "es2x":
                    this.dvd_scan_rate = DVDScanRate.x2;
                    break;
                case "es4x":
                    this.dvd_scan_rate = DVDScanRate.x4;
                    break;
                case "es8x":
                    this.dvd_scan_rate = DVDScanRate.x8;
                    break;
                case "es16":
                    this.dvd_scan_rate = DVDScanRate.x16;
                    break;
                case "es32":
                    this.dvd_scan_rate = DVDScanRate.x32;
                    break;
                default:
                    this.dvd_scan_rate = DVDScanRate.unknown;
            }
        }
    }


    export class MediaState {

        available_chapters: number = null;
        current_chapter: number = null;
        dvd_menu_active: boolean = null;
        dvd_state: DVDState = null;
        elapsed_time: number = null;
        has_media: boolean = null;
        title_length: number = null;

        constructor( sourceObject: any ) {

            utility.copyInto( this, sourceObject );

            switch( sourceObject.dvd_state) {
                case "esid":
                    this.dvd_state = DVDState.idle;
                    break;
                case "espa":
                    this.dvd_state = DVDState.paused;
                    break;
                case "espl":
                    this.dvd_state = DVDState.playing;
                    break;
                case "esps":
                    this.dvd_state = DVDState.playing_still;
                    break;
                case "essc":
                    this.dvd_state = DVDState.scanning;
                    break;
                case "esst":
                    this.dvd_state = DVDState.stopped;
                    break;
                default:
                    this.dvd_state = DVDState.unknown;
            }
        }
    }


    export class Proxy {

        adapter: json_broker.IBrokerAdapter;


        constructor(adapter: json_broker.IBrokerAdapter) {

            this.adapter = adapter;
        }


        get_all_enums(): angular.IPromise<BrokerMessage> {
            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, "get_all_enums" );
            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    console.log( promiseValue.orderedParameters[0] );
                    return promiseValue;

                    // let answer = new ApplicationState( promiseValue.orderedParameters[0] );
                    // return answer;
                }
            );
        }

        /*
         ///////////////////////////////////////////////////////////////////////
         // STATE
         ///////////////////////////////////////////////////////////////////////
         */

        application_state(): angular.IPromise<ApplicationState> {

            return this.dispatchApplicationStateRequest( "application_state" );
        }


        media_state(): angular.IPromise<MediaState> {

            return this.dispatchMediaStateRequest( "media_state" );

        }


        ///////////////////////////////////////////////////////////////////////
        // APPLICATION CONTROL
        ///////////////////////////////////////////////////////////////////////


        activate_dvd_player(): angular.IPromise<ApplicationState> {
            return this.dispatchApplicationStateRequest( "activate_dvd_player" );
        }

        eject_dvd(): angular.IPromise<ApplicationState> {
            return this.dispatchApplicationStateRequest( "eject_dvd" );
        }

        set_viewer_full_screen(): angular.IPromise<ApplicationState> {
            return this.dispatchApplicationStateRequest( "set_viewer_full_screen" );
        }

        set_audio_volume( audio_volume: number ): angular.IPromise<ApplicationState> {
            return this.dispatchApplicationStateRequest( "set_audio_volume", audio_volume );
        }


        ///////////////////////////////////////////////////////////////////////
        // PLAYBACK CONTROL
        ///////////////////////////////////////////////////////////////////////

        play_pause_dvd(): angular.IPromise<MediaState> {

            return this.dispatchMediaStateRequest( "play_pause_dvd" );
        }


        ///////////////////////////////////////////////////////////////////////
        // Test / Debugging
        ///////////////////////////////////////////////////////////////////////

        ping(): angular.IPromise<BrokerMessage> {

            let request = BrokerMessage.buildRequest( SERVICE_NAME, "ping" );
            return this.adapter.dispatch( request );
        }

        ///////////////////////////////////////////////////////////////////////
        // private support code

        private dispatchMediaStateRequest( methodName: string  ): angular.IPromise<MediaState> {

            let request = BrokerMessage.buildRequest( SERVICE_NAME, methodName );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    let answer = new MediaState( promiseValue.orderedParameters[0] );
                    return answer;
                }
            );
        }

        private dispatchApplicationStateMethod( methodName: string ): angular.IPromise<ApplicationState> {

            let request = BrokerMessage.buildRequest( SERVICE_NAME, methodName );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    console.log( promiseValue );

                    let answer = new ApplicationState( promiseValue.orderedParameters[0] );
                    return answer;
                }
            );
        }

        private dispatchApplicationStateRequest(methodName: string, ...orderedParamaters: any[] ): angular.IPromise<ApplicationState> {

            // console.log( orderedParamaters );
            let request = BrokerMessage.buildRequestWithOrderedParameters( SERVICE_NAME, methodName, orderedParamaters );

            return this.adapter.dispatch( request ).then(
                (promiseValue:BrokerMessage) => {

                    let answer = new ApplicationState( promiseValue.orderedParameters[0] );
                    return answer;
                }
            );

        }

    }
}