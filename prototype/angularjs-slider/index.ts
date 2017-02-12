/**
 */

/// <reference path="../../component/popup.ts" />
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../ts/json_broker/lib.json_broker.ts" />
/// <reference path="../../ts/json_broker/angular1.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />



class ViewController {


    $http: angular.IHttpService;
    $uibModal;
    templateVariable = "hey hey (from angular)";

    constructor( $http: angular.IHttpService, $uibModal ) {

        this.$http = $http;
        this.$uibModal = $uibModal;
    }

    popupShow() {
        component.popup.show( this.$uibModal );
    }

}

var mcRemote= angular.module('McRemote', ['ngAnimate', 'ui.bootstrap']);


mcRemote.controller('index', function ($http: angular.IHttpService, $scope, $uibModal) {

    $scope.variable = "hey hey (from angular)";

    $scope.viewController = new ViewController( $http, $uibModal );
    $scope.viewController.popupShow();


});

application.context.setup( mcRemote );
page.context.setup( mcRemote );
