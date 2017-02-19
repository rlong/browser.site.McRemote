/**
 * Created by rlong on 13/03/2016.
 */
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../ts/page.ts" />
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', ["$scope", function ($scope) {
        $scope.variable = "hey hey (from angular)";
    }]);
