/**
 * Created by rlong on 23/05/2016.
 */


/// <reference path="../typings/index.d.ts" />

namespace component.popup {


    export class ViewController {

        $uibModalInstance: any;
        public title: string =  "Title";
        public body: string = "Body";

        constructor( $uibModalInstance: any, title: string, body: string ) {
            this.$uibModalInstance = $uibModalInstance;
            this.title = title;
            this.body = body;

        }

        okButtonOnClick() {

            console.log( "okButtonOnClick" );
            this.$uibModalInstance.close();

        }

    }




    export function show($uibModal, title: string = "Title", body: string = "Body" ) {

        $uibModal.open({
            templateUrl: '/component/popup.html',
            controller: 'component.popup.ViewController',
            resolve: {
                title: function () {
                    return title;
                },
                body: function () {
                    return body;
                },
            }
        });
    }

    export function showHttpPromiseError( $uibModal, reason: any ) {

        console.error( reason );
        let status: number = reason.status;
        let body: string = reason.statusText;
        if( 0 == body.length  ) {
            body = "status:" + status;
        } else {
            body +=  " (" + status + ")";
        }

        show( $uibModal, "HTTP Error", body );

    }

    export function setup( module: angular.IModule ) {

        module.controller('component.popup.ViewController', function ($scope, $uibModalInstance, title, body) {

            $scope.viewController = new ViewController($uibModalInstance, title, body);

        });
    }


}
