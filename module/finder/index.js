/**
 * Created by rlong on 19/03/2016.
 */
/// <reference path="../../component/popup.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
var mcRemote = page.buildAngularModule();
application.setup(mcRemote);
session.setup(mcRemote);
page.setup(mcRemote);
filePicker.setup(mcRemote);
mcRemote.controller('index', [
    "$http", "$q", "$scope", "$uibModal",
    function ($http, $q, $scope, $uibModal) {
        $scope.hey = "hey hey (from index)";
    }]);
mcRemote.config(function ($stateProvider) {
    var state = {
        name: 'filePicker',
        url: 'filePicker/{path}',
        component: 'filePicker'
    };
    $stateProvider.state(state);
});
