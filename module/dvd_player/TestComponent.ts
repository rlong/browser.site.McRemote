// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//



class TestComponent {

    mediaService: dvd_player.MediaService;
    // isPolling: boolean = false;
    mediaStatePoller: dvd_player.MediaStatePoller;


    constructor( $interval: angular.IIntervalService, mediaService: dvd_player.MediaService ) {

        this.mediaService = mediaService;

        this.mediaStatePoller = new dvd_player.MediaStatePoller( $interval, mediaService );
    }

    togglePollingButtonOnClick() {

        if( this.mediaStatePoller.isPolling() ) {

            console.log("stopPolling" );
            this.mediaStatePoller.stopPolling();
        } else {

            console.log("startPolling" );
            this.mediaStatePoller.startPolling();
        }
    }

    static setup( module: angular.IModule ) {

        module.component('testComponent', {

            templateUrl: 'TestComponent.html',
            controller: [ "$interval",
                "mediaService",
                ($interval: angular.IIntervalService,
                 mediaService: dvd_player.MediaService) => {

                    return new TestComponent($interval,mediaService);
                }],
            bindings: {
                // hero: '='
            }
        });
    }
}
