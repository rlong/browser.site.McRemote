/**
 */
/// <reference path="../../component/popup.ts" />
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../ts/json_broker/lib.json_broker.ts" />
/// <reference path="../../ts/json_broker/angular1.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
var ViewController = (function () {
    function ViewController($http, $uibModal) {
        this.templateVariable = "hey hey (from angular)";
        this.$http = $http;
        this.$uibModal = $uibModal;
    }
    ViewController.prototype.popupShow = function () {
        component.popup.show(this.$uibModal);
    };
    return ViewController;
}());
var mcRemote = angular.module('McRemote', ['ngAnimate', 'ui.bootstrap']);
mcRemote.controller('index', function ($http, $scope, $uibModal) {
    $scope.variable = "hey hey (from angular)";
    $scope.viewController = new ViewController($http, $uibModal);
    $scope.viewController.popupShow();
});
application.context.setup(mcRemote);
page.context.setup(mcRemote);
