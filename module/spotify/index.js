// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//
/// <reference path="../../ts/page.ts" />
/// <reference path="spotify.ts" />
var ViewController = (function () {
    function ViewController(spotify) {
        this.variable = "hey hey (from angular)";
        this.spotify = spotify;
        spotify.proxy.get_all_enums();
    }
    ViewController.prototype.playButtonOnClick = function () {
        this.spotify.playback_play();
    };
    return ViewController;
}());
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', [
    "$http", "$q", "$scope",
    function ($http, $q, $scope) {
        var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
        var proxy = new spotify.Proxy(brokerAdapter);
        var service = new spotify.Service(proxy);
        $scope.viewController = new ViewController(service);
    }]);
