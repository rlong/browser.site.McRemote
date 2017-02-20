/**
 */

/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/page.ts" />


class ViewController {


    proxy: clipboard.ClipBoardProxy;


    constructor( $http: angular.IHttpService, $q:angular.IQService ) {


        let brokerAdapter = json_broker.buildBrokerAdapter( $http, $q );

        this.proxy = new clipboard.ClipBoardProxy(brokerAdapter );

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
                // window.prompt("clipboard:", promiseValue);

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


var mcRemote= page.buildAngularModule();
mcRemote.controller('index', ["$http", "$q", "$scope",
    ( $http: angular.IHttpService, $q: angular.IQService, $scope) => {

    $scope.viewController = new ViewController( $http, $q );
    $scope.viewController.get_clipboard();

}]);


