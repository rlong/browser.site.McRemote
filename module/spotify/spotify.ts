// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//

/// <reference path="../../github/lib.json_broker/json_broker.ts" />


module spotify {

    const SERVICE_NAME = "remote_gateway.AppleScriptService:spotify";

    import IRequestHandler = json_broker.IRequestHandler;
    import BrokerMessage = json_broker.BrokerMessage;

    enum PlayerState {
        unknown,
        paused,
        playing,
        stopped
    }

    function lookupPlayerState( player_state: string) {

        switch( player_state) {
            case "kPSp":
                return PlayerState.paused;
            case "kPSP":
                return PlayerState.playing;
            case "kPSS":
                return PlayerState.stopped;
            default:
                return PlayerState.unknown;
        }
    }

    interface IApplicationProperties {

        has_current_track: boolean;
        sound_volume: number;
        _repeating: boolean;
        _shuffling: boolean;
    }

    interface IMediaProperties {

        has_current_track: boolean;
        _id: string;
        player_position: number;
        player_state: PlayerState;
        repeating_enabled: boolean;
        shuffling_enabled: boolean;
    }


    interface ICurrentTrackProperties {

        has_current_track: boolean;
        _album: string;
        album_artist: string;
        _artist: string;
        artwork_url: string;
        disc_number: number;
        _duration: number;
        _id: string;
        _name: string;
        played_count: number;
        _popularity: number;
        spotify_url: string;
        track_number: number;
    }

    export class Proxy {

        adapter: json_broker.IBrokerAdapter;

        $q: angular.IQService;

        constructor(adapter: json_broker.IBrokerAdapter) {

            this.adapter = adapter;
        }

        ///////////////////////////////////////////////////////////////////////
        // TEST
        ///////////////////////////////////////////////////////////////////////

        ping(): angular.IPromise<void> {

            let request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "get_all_enums");
            return this.adapter.dispatch(request).then<void>(
                (promiseValue: BrokerMessage) => {

                    return;
                }
            );
        }

        ///////////////////////////////////////////////////////////////////////
        // META
        ///////////////////////////////////////////////////////////////////////

        meta_get_all_enums(): angular.IPromise<any> {

            let request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, "meta_get_all_enums");
            return this.adapter.dispatch(request).then(
                (promiseValue: BrokerMessage) => {

                    console.info(promiseValue.orderedParameters[0]);
                    return promiseValue.orderedParameters[0];
                }
            );
        }



        ///////////////////////////////////////////////////////////////////////
        // MEDIA
        ///////////////////////////////////////////////////////////////////////


        private dispatchMediaPropertiesRequest( methodName: string ): angular.IPromise<IMediaProperties> {

            let request = BrokerMessage.buildRequestWithOrderedParameters(SERVICE_NAME, methodName );
            return this.adapter.dispatch(request).then(
                (response: BrokerMessage) => {

                    var playbackProperties = response.orderedParameters[0];
                    playbackProperties.player_state = lookupPlayerState( playbackProperties.player_state );
                    return playbackProperties as IMediaProperties;
                }
            );
        }

        media_properties(): angular.IPromise<IMediaProperties> {

            return this.dispatchMediaPropertiesRequest( "media_properties" );
        }

        media_play(): angular.IPromise<IMediaProperties> {

            return this.dispatchMediaPropertiesRequest( "media_play" );
        }

    }

    export class Service {

        proxy: Proxy;

        applicationProperties: IApplicationProperties;
        pendingApplicationChange: angular.IPromise<IApplicationProperties>;

        mediaProperties: IMediaProperties;
        pendingMediaChange: angular.IPromise<IMediaProperties>;

        trackProperties: ICurrentTrackProperties;

        constructor(proxy: Proxy) {

            this.proxy = proxy;
        }

        media_properties() {

            let promise = this.proxy.media_properties();
            promise.then(
                (playbackProperties: IMediaProperties) => {
                    this.setPlaybackProperties( playbackProperties, promise );
                }
            )
        }

        media_play() {

            let promise = this.proxy.media_play();
            this.pendingMediaChange = promise;

            promise.then(
                (playbackProperties: IMediaProperties) => {
                    this.setPlaybackProperties( playbackProperties, promise );
                }
            );

        }

        private setPlaybackProperties(playbackProperties: IMediaProperties, completedPromise: angular.IPromise<IMediaProperties> ) {

            if( this.pendingMediaChange == null ) {
                this.mediaProperties = playbackProperties;
                return;
            }

            if( this.pendingMediaChange === completedPromise ) {
                this.pendingMediaChange = null;
                this.mediaProperties = playbackProperties;
                return;
            }
        }
    }
}