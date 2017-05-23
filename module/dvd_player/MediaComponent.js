// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
var ONE_PERCENT_VOLUME = dvd_player.VOLUME_MAX * 0.01;
var TEN_PERCENT_VOLUME = dvd_player.VOLUME_MAX * 0.1;
var MediaComponent = (function () {
    function MediaComponent(mediaService) {
        this.audioVolumeSliderConfig = {};
        this.elapsedTimeSliderConfig = null;
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
        this.elapsedTimeSliderConfig = {
            animate: true,
            // start: [50],
            connect: 'lower',
            // connect: true,
            range: {
                min: 0,
                max: 1250
            }
        };
        this.mediaService = mediaService;
        this.mediaService.media_properties();
    }
    MediaComponent.prototype.audioVolumeAdjust = function (percentageDelta) {
        console.log(percentageDelta);
        var audio_volume = this.mediaService.mediaProperties.audio_volume;
        if (0 > percentageDelta) {
            // reached minimum, then no-op ?
            if (0 == audio_volume) {
                return;
            }
            if (-1 == percentageDelta) {
                audio_volume -= ONE_PERCENT_VOLUME;
            }
            else if (-10 == percentageDelta) {
                audio_volume -= TEN_PERCENT_VOLUME;
            }
            if (0 > audio_volume) {
                audio_volume = 0;
            }
            this.mediaService.media_set_volume(audio_volume);
        }
        else {
            // reached maximum, then no-op ?
            if (0 == dvd_player.VOLUME_MAX) {
                return;
            }
            if (1 == percentageDelta) {
                audio_volume += ONE_PERCENT_VOLUME;
            }
            else if (10 == percentageDelta) {
                audio_volume += TEN_PERCENT_VOLUME;
            }
            if (dvd_player.VOLUME_MAX < audio_volume) {
                audio_volume = dvd_player.VOLUME_MAX;
            }
            this.mediaService.media_set_volume(audio_volume);
        }
    };
    MediaComponent.prototype.audioVolumeOnChange = function (updatedVolume) {
        this.mediaService.media_set_volume(updatedVolume);
    };
    MediaComponent.prototype.elapsedTimeAdjust = function (delta) {
        console.log("delta: " + delta);
        var elapsedTime = this.mediaService.mediaProperties.elapsed_time;
        if (0 > delta) {
            // reached minimum, no-op
            if (0 == elapsedTime) {
                return;
            }
            elapsedTime += delta;
            // before the start
            if (0 > elapsedTime) {
                elapsedTime = 0;
            }
            this.mediaService.media_set_elapsed_time(elapsedTime);
        }
        else {
            var titleLength = this.mediaService.mediaProperties.title_length;
            // reached maximum, no-op
            if (titleLength == elapsedTime) {
                return;
            }
            elapsedTime += delta;
            // after the end
            if (titleLength < elapsedTime) {
                elapsedTime = titleLength - 1;
            }
            this.mediaService.media_set_elapsed_time(elapsedTime);
        }
    };
    MediaComponent.prototype.elapsedTimeOnChange = function (updatedElapsedTime) {
        console.log(updatedElapsedTime);
        this.mediaService.media_set_elapsed_time(updatedElapsedTime);
    };
    MediaComponent.prototype.playPauseOnClick = function () {
        if (this.mediaService.mediaProperties.has_media) {
            var dvd_state = this.mediaService.mediaProperties.dvd_state;
            if (dvd_state == dvd_player.State.idle || dvd_state == dvd_player.State.stopped) {
                this.mediaService.media_play();
            }
            else {
                this.mediaService.media_playpause();
            }
        }
        else {
            console.log("no-op");
        }
    };
    MediaComponent.setup = function (module) {
        module.component('mediaComponent', {
            templateUrl: 'MediaComponent.html',
            controller: [
                "$http", "$q", "mediaService",
                function ($http, $q, mediaService) {
                    return new MediaComponent(mediaService);
                }],
            bindings: {}
        });
    };
    return MediaComponent;
}());
//# sourceMappingURL=MediaComponent.js.map