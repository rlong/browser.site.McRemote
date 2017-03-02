/**
 * Created by local-rlong on 01/03/2017.
 */
var filePicker;
(function (filePicker) {
    var ViewController = (function () {
        function ViewController(brokerAdapter, $uibModal) {
            this.$uibModal = null;
            this.roots = null;
            this.currentRoot = null;
            this.currentFolder = null;
            this.proxy = new finder.Proxy(brokerAdapter);
            this.setupRootsAndCurrentFolder();
        }
        ViewController.prototype.setupRootsAndCurrentFolder = function () {
            var _this = this;
            this.proxy.list_roots().then(function (roots) {
                console.log(roots);
                _this.roots = roots;
                _this.currentRoot = roots.places[0];
                return _this.proxy.list_path(_this.currentRoot._path);
            }, function (reason) {
                console.error(reason);
            }).then(function (folder) {
                console.log(folder);
                _this.currentFolder = folder;
            });
        };
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
        ViewController.prototype.openFolderItem = function (folderItem) {
            var _this = this;
            this.proxy.list(this.currentFolder, folderItem).then(function (folder) {
                _this.currentFolder = folder;
            }, function (reason) {
                console.error(reason);
            });
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
        ViewController.prototype.folderOnClick = function (folder) {
            console.log(folder);
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
        ViewController.prototype.rootLocationOnSelect = function (rootLocation) {
            console.log(rootLocation);
            // this.roots.current = rootLocation;
            // this.currentFolder.openFolderPath( rootLocation._path );
        };
        return ViewController;
    }());
    function setup(module) {
        module.component('filePicker', {
            templateUrl: 'filePicker.html',
            controller: ["$http", "$q", "$scope", "$stateParams", "$uibModal",
                function ($http, $q, $scope, $stateParams, $uibModal) {
                    var brokerAdapter = json_broker.buildBrokerAdapter($http, $q);
                    $scope.viewController = new ViewController(brokerAdapter, $uibModal);
                    console.log($stateParams);
                    this.path = $stateParams.path;
                }]
        });
    }
    filePicker.setup = setup;
})(filePicker || (filePicker = {}));
//# sourceMappingURL=filePicker.js.map