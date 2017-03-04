// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//


/// <reference path="../../ts/page.ts" />
/// <reference path="spotify.ts" />

class ViewController {

    variable = "hey hey (from angular)";

    spotify: spotify.Service;


    constructor( spotify: spotify.Service ) {
        this.spotify = spotify;
        spotify.proxy.get_all_enums();
    }

    playButtonOnClick() {
        this.spotify.playback_play();
    }

}

var mcRemote= page.buildAngularModule();

mcRemote.controller('index', [
    "$http","$q", "$scope",
    function ($http: angular.IHttpService, $q:angular.IQService, $scope) {

        let brokerAdapter = json_broker.buildBrokerAdapter( $http, $q );
        let proxy = new spotify.Proxy(brokerAdapter );
        let service = new spotify.Service( proxy );

        $scope.viewController = new ViewController(service);


}]);

