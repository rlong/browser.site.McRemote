// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
var TestComponent = /** @class */ (function () {
    function TestComponent($interval, mediaService) {
        this.mediaService = mediaService;
        this.mediaStatePoller = new dvd_player.MediaStatePoller($interval, mediaService);
    }
    TestComponent.prototype.togglePollingButtonOnClick = function () {
        if (this.mediaStatePoller.isPolling()) {
            console.log("stopPolling");
            this.mediaStatePoller.stopPolling();
        }
        else {
            console.log("startPolling");
            this.mediaStatePoller.startPolling();
        }
    };
    TestComponent.setup = function (module) {
        module.component('testComponent', {
            templateUrl: 'TestComponent.html',
            controller: ["$interval",
                "mediaService",
                function ($interval, mediaService) {
                    return new TestComponent($interval, mediaService);
                }],
            bindings: {}
        });
    };
    return TestComponent;
}());
//# sourceMappingURL=TestComponent.js.map