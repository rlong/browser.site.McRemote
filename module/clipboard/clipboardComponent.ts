// Copyright (c) 2017 Richard Long
//
// Released under the MIT license ( http://opensource.org/licenses/MIT )
//



class ClipboardComponent {


    clipboardAsText: string = "";
    proxy: clipboard.ClipBoardProxy;

    constructor( $http: angular.IHttpService, $q:angular.IQService ) {


        let brokerAdapter = json_broker.buildBrokerAdapter( $http, $q );
        this.proxy = new clipboard.ClipBoardProxy(brokerAdapter );
    }

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

    static setup( module: angular.IModule ) {

        module.component('clipboardComponent', {

            templateUrl: 'ClipboardComponent.html',
            controller: [ "$http","$q", ($http: angular.IHttpService, $q:angular.IQService) => {

                let answer = new ClipboardComponent($http,$q);
                answer.get_clipboard();
                return answer;
            }],
            bindings: {
                // hero: '='
            }
        });
    }

}