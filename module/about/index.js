/**
 * Created by rlong on 13/03/2016.
 */
/// <reference path="../../ts/page.ts" />
var mcRemote = page.buildAngularModule();
mcRemote.controller('index', ["$scope", function ($scope) {
        $scope.variable = "hey hey (from angular)";
    }]);
// vvv http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available
var ngApp = document.getElementsByClassName("ng-app");
if (ngApp.length > 0) {
    angular.bootstrap(ngApp[0], ["McRemote"]);
}
// ^^^ http://stackoverflow.com/questions/31840800/angularjs-and-requirejs-module-not-available
//# sourceMappingURL=index.js.map