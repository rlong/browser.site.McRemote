/**
 * Created by rlong on 13/03/2016.
 */

/// <reference path="../../typings/index.d.ts" />


module about {

    var mcRemote= angular.module('mc-remote', []);

    mcRemote.controller('index', ["$scope", function ($scope) {

        $scope.variable = "hey hey (from angular)";

    }]);

}

