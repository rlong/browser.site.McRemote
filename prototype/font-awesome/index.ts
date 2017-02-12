/**
 */

/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../../ts/jsonbroker/jsonbroker.ts" />


class Controller {

    $scope: any = null;

    constructor( $scope: any, $http: angular.IHttpService ) {

        this.$scope = $scope;
    }
}

var mcRemote= angular.module('mc-remote', []);

mcRemote.controller('index', ["$scope", "$http", function ($scope,$http) {

    $scope.variable = "hey hey (from angular)";
    $scope.controller = new Controller( $scope, $http );


}]);


