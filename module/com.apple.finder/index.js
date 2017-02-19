/**
 * Created by rlong on 19/03/2016.
 */
/// <reference path="../../component/popup.ts" />
/// <reference path="../../github/lib.json_broker/json_broker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
// export namespace model {
//
//
//
//     // export interface IHttpPromiseErrorHandler {
//     //     handleHttpPromiseError( origin:any, callee: any, reason:any);
//     // }
//     //
//     // export class CurrentFolder {
//     //
//     //     $http: angular.IHttpService = null;
//     //
//     //     folderName: string = null;
//     //     folderPath: string = null;
//     //     folderPosixPath: string = null;
//     //     pathComponents: IPathComponent[] = [];
//     //     httpPromiseErrorHandler: IHttpPromiseErrorHandler = null;
//     //
//     //     // filePath: FilePath = null; // new FilePath( "inbox", "scratch:rlong:Movies:inbox");
//     //     files: any[] = [];
//     //     folders: any[] = [];
//     //
//     //     constructor( $http: angular.IHttpService ) {
//     //
//     //         this.$http = $http;
//     //
//     //         // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
//     //         //this.openFolderPath( "64G:Movies" );
//     //         //this.openFolderPath( "64G:Movies" );
//     //
//     //     }
//     //
//     //     public openFolderPath( folderPath: string ): angular.IHttpPromise<CurrentFolder> {
//     //
//     //         this.folderPath = folderPath;
//     //         this.files = [];
//     //         this.folders = [];
//     //
//     //         this.pathComponents = [];
//     //         {
//     //             var path = "";
//     //             var tokens = folderPath.split(":");
//     //             for( let tokenIndex in tokens ) {
//     //
//     //                 let token = tokens[tokenIndex];
//     //                 if( 0 === token.length ) {
//     //                     continue;
//     //                 }
//     //
//     //                 path += token + ":";
//     //                 this.pathComponents.push( {name:token, path:path} );
//     //             }
//     //         }
//     //         console.log( this.pathComponents );
//     //
//     //
//     //         return finder.service.list_path.invoke( this.$http, this.folderPath ).then<CurrentFolder>(
//     //
//     //             ( promiseValue: jsonbroker.BrokerMessage ) =>  { // successCallback
//     //
//     //                 console.log( promiseValue );
//     //
//     //                 let pojo: any = promiseValue.orderedParamaters[0];
//     //                 this.folderName = pojo._name;
//     //                 this.folderPosixPath = pojo._posix_path;
//     //                 this.files = pojo._files;
//     //                 this.folders = pojo._folders;
//     //                 return this;
//     //
//     //             }
//     //             ,(reason: any) => { // errorCallback
//     //
//     //                 if( this.httpPromiseErrorHandler ) {
//     //                     this.httpPromiseErrorHandler.handleHttpPromiseError( this, this.openFolderPath, reason );
//     //                 }
//     //                 return reason;
//     //
//     //             }
//     //         )
//     //
//     //     }
//     //
//     // }
//     //
//     //
//     // export interface IRootLocation {
//     //     _name: string;
//     //     _path: string;
//     //     _iconClass?: string;
//     // }
//     //
//     //
//     //
//     // export class Roots {
//     //
//     //     disks: IRootLocation[] = null;
//     //     places: IRootLocation[] = null;
//     //
//     //     current: IRootLocation = null;
//     //
//     //     $http:angular.IHttpService = null;
//     //
//     //     constructor( $http: angular.IHttpService ) {
//     //
//     //         this.$http = $http;
//     //
//     //
//     //         // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
//     //         //this.openFolderPath( "64G:Movies" );
//     //
//     //
//     //     }
//     //
//     //     public list_roots() {
//     //
//     //         finder.service.list_roots.invoke( this.$http ).then(
//     //
//     //             ( promiseValue: jsonbroker.BrokerMessage ) => { // successCallback
//     //
//     //                 console.log( promiseValue );
//     //                 let pojo: any = promiseValue.orderedParamaters[0];
//     //                 this.disks = pojo._disks;
//     //                 console.log( this.disks );
//     //                 this.places = pojo._places;
//     //                 console.log( this.places );
//     //
//     //                 this.current = this.disks[0];
//     //
//     //             },
//     //             (reason: any) => { // errorCallback
//     //
//     //                 console.error( reason );
//     //
//     //             }
//     //
//     //         );
//     //
//     //     }
//     //
//     // }
//
// }
var ViewController = (function () {
    function ViewController(brokerAdapter, $uibModal) {
        this.currentFolder = null;
        this.roots = null;
        this.$uibModal = null;
        this.proxy = new finder.Proxy(brokerAdapter);
        // this.currentFolder = ;
        // this.currentFolder.httpPromiseErrorHandler = this;
        // this.currentFolder.openFolderPath( "64G:Movies:" );
        //
        // this.roots = new model.Roots( $http );
        // this.roots.list_roots();
        //
        // this.$http = $http;
        // this.$uibModal = $uibModal;
        this.list_roots();
    }
    ViewController.prototype.list_roots = function () {
        var _this = this;
        this.proxy.list_roots().then(function (roots) {
            console.log(roots);
            _this.roots = roots;
        }, function (reason) {
            console.error(reason);
        });
    };
    ViewController.prototype.handleHttpPromiseError = function (origin, callee, reason) {
        console.error(reason);
        component.popup.showHttpPromiseError(this.$uibModal, reason);
    };
    ViewController.prototype.openFolderPath = function (folderPath) {
        console.log(arguments);
        // this.currentFolder.openFolderPath(folderPath).then(
        //     (promiseValue:model.CurrentFolder) => {
        //
        //     },
        //     (reason:any) => {
        //
        //     }
        //
        // )
    };
    ViewController.prototype.openFolder = function (folder) {
        console.log(folder);
        // this.currentFolder.openFolderPath( this.currentFolder.folderPath + folder._name + ":" );
    };
    ViewController.prototype.breadcrumbOnClick = function (pathComponent) {
        console.log(pathComponent);
        // this.currentFolder.openFolderPath( pathComponent.path );
    };
    ViewController.prototype.fileButtonOnClick = function (file) {
        console.log(file);
        // var modalInstance = this.$uibModal.open({
        //     animation: true,
        //     templateUrl: 'myModalContent.html',
        //     controller: 'ModalInstanceCtrl',
        //     //size: size,
        //     resolve: {
        //         file: function () {
        //             return file;
        //         },
        //         parentFolderPosixPath: () => {
        //             return this.currentFolder.folderPosixPath;
        //         }
        //     }
        // });
        //
        // modalInstance.result.then(function (selectedItem) {
        //     this.$scope.selected = selectedItem;
        // }, function () {
        //     console.log( 'Modal dismissed at: ' + new Date());
        // });
    };
    ViewController.prototype.downloadFile = function (path) {
        var location = "/_dynamic_/HLSimpleGetFileRequestHandler/" + path;
        console.log(location);
        window.open(location);
    };
    ViewController.prototype.ping = function () {
        this.proxy.ping().then(function () {
            console.log("pring responded");
        }, function (reason) {
            console.error(reason);
        });
    };
    // public list_roots() {
    //
    //     finder.service.list_roots.invoke( this.$http ).then(
    //
    //         ( response: jsonbroker.BrokerMessage ) => { // successCallback
    //
    //             console.log( response );
    //
    //         },
    //         (reason: any) => { // errorCallback
    //
    //             console.error( reason );
    //
    //         }
    //
    //     );
    // }
    ViewController.prototype.rootLocationOnSelect = function (rootLocation) {
        console.log(rootLocation);
        // this.roots.current = rootLocation;
        // this.currentFolder.openFolderPath( rootLocation._path );
    };
    return ViewController;
}());
var mcRemote = page.buildAngularModule();
application.setup(mcRemote);
session.setup(mcRemote);
page.setup(mcRemote);
mcRemote.controller('index', [
    "$http", "$q", "$scope", "$uibModal",
    function ($http, $q, $scope, $uibModal) {
        $scope.variable = "hey hey (from angular)";
        var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
        $scope.viewController = new ViewController(brokerAdapter, $uibModal);
        $scope.currentFolder = $scope.viewController.currentFolder;
        $scope.roots = $scope.viewController.roots;
    }]);
// mcRemote.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, parentFolderPosixPath, file) {
//
//     $scope.file = file;
//     $scope.fileUrl = "/_dynamic_/HLFileDownloadRequestHandler/" + parentFolderPosixPath + "/" + file._name;
//
//     $scope.ok = function () {
//         $uibModalInstance.close();
//     };
//
//     $scope.cancel = function () {
//         $uibModalInstance.dismiss('cancel');
//     };
// });
//# sourceMappingURL=index.js.map