/**
 */
/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../../ts/jsonbroker/jsonbroker.ts" />
var Controller = (function () {
    function Controller($scope, $http) {
        this.$scope = null;
        this.$scope = $scope;
    }
    return Controller;
}());
var mcRemote = angular.module('mc-remote', []);
mcRemote.controller('index', ["$scope", "$http", function ($scope, $http) {
        $scope.variable = "hey hey (from angular)";
        $scope.controller = new Controller($scope, $http);
    }]);
//# sourceMappingURL=index.js.map