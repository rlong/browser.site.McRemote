/**
 */

/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../github/lib.json_broker/angular1.ts" />
/// <reference path="clipboard.ts" />



class ViewController {

    proxy: clipboard.ClipBoardProxy;

    constructor( $http: angular.IHttpService, $q:angular.IQService ) {


        let requestHandler = json_broker.angular1.buildRequestHandler( $http, $q );

        this.proxy = new clipboard.ClipBoardProxy(requestHandler);

    }

    clipboardAsText: string = "";

    copyButtonOnClick() {

        this.get_clipboard();
    }

    get_clipboard() {

        let self = this;
        this.proxy.get_clipboard().then(
            (promiseValue:string) => {

                console.log( promiseValue );
                self.clipboardAsText = promiseValue;

            },
            (reason) => {
                console.error( reason );
            }
        )
    }

    pasteButtonOnClick() {

        this.proxy.set_clipboard( this.clipboardAsText).then(
            () => {
                console.log( "entered");
            },
            (reason) => {
                console.error( reason );
            }
        )
    }

}

var mcRemote= angular.module('McRemote', []);
mcRemote.controller('index', ["$http", "$q", "$scope", function ( $http: angular.IHttpService, $q: angular.IQService, $scope) {


    $scope.viewController = new ViewController( $http, $q );
    $scope.viewController.get_clipboard();


}]);


