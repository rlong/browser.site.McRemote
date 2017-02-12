/**
 * Created by rlong on 19/03/2016.
 */
/// <reference path="../../typings/browser.d.ts" />
/// <reference path="../../component/component.popup.ts" />
/// <reference path="../../ts/jsonbroker/jsonbroker.ts" />
/// <reference path="../../ts/application.ts" />
/// <reference path="../../ts/page.ts" />
/// <reference path="../../ts/session.ts" />
/// <reference path="finder.ts" />
var index;
(function (index) {
    var model;
    (function (model) {
        var CurrentFolder = (function () {
            function CurrentFolder($http) {
                this.$http = null;
                this.folderName = null;
                this.folderPath = null;
                this.folderPosixPath = null;
                this.pathComponents = [];
                this.httpPromiseErrorHandler = null;
                // filePath: FilePath = null; // new FilePath( "inbox", "scratch:rlong:Movies:inbox");
                this.files = [];
                this.folders = [];
                this.$http = $http;
                // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
                //this.openFolderPath( "64G:Movies" );
                //this.openFolderPath( "64G:Movies" );
            }
            CurrentFolder.prototype.openFolderPath = function (folderPath) {
                var _this = this;
                this.folderPath = folderPath;
                this.files = [];
                this.folders = [];
                this.pathComponents = [];
                {
                    var path = "";
                    var tokens = folderPath.split(":");
                    for (var tokenIndex in tokens) {
                        var token = tokens[tokenIndex];
                        if (0 === token.length) {
                            continue;
                        }
                        path += token + ":";
                        this.pathComponents.push({ name: token, path: path });
                    }
                }
                console.log(this.pathComponents);
                return finder.service.list_path.invoke(this.$http, this.folderPath).then(function (promiseValue) {
                    console.log(promiseValue);
                    var pojo = promiseValue.orderedParamaters[0];
                    _this.folderName = pojo._name;
                    _this.folderPosixPath = pojo._posix_path;
                    _this.files = pojo._files;
                    _this.folders = pojo._folders;
                    return _this;
                }, function (reason) {
                    if (_this.httpPromiseErrorHandler) {
                        _this.httpPromiseErrorHandler.handleHttpPromiseError(_this, _this.openFolderPath, reason);
                    }
                    return reason;
                });
            };
            return CurrentFolder;
        }());
        model.CurrentFolder = CurrentFolder;
        var Roots = (function () {
            function Roots($http) {
                this.disks = null;
                this.places = null;
                this.current = null;
                this.$http = null;
                this.$http = $http;
                // this.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
                //this.openFolderPath( "64G:Movies" );
            }
            Roots.prototype.list_roots = function () {
                var _this = this;
                finder.service.list_roots.invoke(this.$http).then(function (promiseValue) {
                    console.log(promiseValue);
                    var pojo = promiseValue.orderedParamaters[0];
                    _this.disks = pojo._disks;
                    console.log(_this.disks);
                    _this.places = pojo._places;
                    console.log(_this.places);
                    _this.current = _this.disks[0];
                }, function (reason) {
                    console.error(reason);
                });
            };
            return Roots;
        }());
        model.Roots = Roots;
    })(model = index.model || (index.model = {}));
    var ViewController = (function () {
        function ViewController($scope, $http, $uibModal) {
            this.currentFolder = null;
            this.roots = null;
            this.$http = null;
            this.$uibModal = null;
            this.currentFolder = new model.CurrentFolder($http);
            this.currentFolder.httpPromiseErrorHandler = this;
            this.currentFolder.openFolderPath("64G:Movies:");
            this.roots = new model.Roots($http);
            this.roots.list_roots();
            //console.log( $http );
            this.$http = $http;
            //console.log( this.$http );
            this.$uibModal = $uibModal;
            // this.model.openFolderPath( "scratch:Users:local-rlong:Movies:inbox" );
        }
        // IHttpPromiseErrorHandler.handlehttpPromiseError
        ViewController.prototype.handleHttpPromiseError = function (origin, callee, reason) {
            console.error(reason);
            popup.showHttpPromiseError(this.$uibModal, reason);
            //popup.show( this.$uibModal, "Err-oh!");
        };
        ViewController.prototype.openFolderPath = function (folderPath) {
            this.currentFolder.openFolderPath(folderPath).then(function (promiseValue) {
            }, function (reason) {
            });
        };
        ViewController.prototype.openFolder = function (folder) {
            console.log(folder);
            this.currentFolder.openFolderPath(this.currentFolder.folderPath + folder._name + ":");
        };
        ViewController.prototype.breadcrumbOnClick = function (pathComponent) {
            console.log(pathComponent);
            this.currentFolder.openFolderPath(pathComponent.path);
        };
        ViewController.prototype.fileButtonOnClick = function (file) {
            var _this = this;
            console.log(file);
            var modalInstance = this.$uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                //size: size,
                resolve: {
                    file: function () {
                        return file;
                    },
                    parentFolderPosixPath: function () {
                        return _this.currentFolder.folderPosixPath;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                this.$scope.selected = selectedItem;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        ViewController.prototype.downloadFile = function (path) {
            var location = "/_dynamic_/HLSimpleGetFileRequestHandler/" + path;
            console.log(location);
            window.open(location);
        };
        ViewController.prototype.ping = function () {
            finder.service.ping.invoke(this.$http).then(function (response) {
                console.log(response);
            }, function (reason) {
                console.error(reason);
            });
        };
        ViewController.prototype.list_roots = function () {
            finder.service.list_roots.invoke(this.$http).then(function (response) {
                console.log(response);
            }, function (reason) {
                console.error(reason);
            });
        };
        ViewController.prototype.rootLocationOnSelect = function (rootLocation) {
            console.log(rootLocation);
            this.roots.current = rootLocation;
            this.currentFolder.openFolderPath(rootLocation._path);
        };
        return ViewController;
    }());
    index.ViewController = ViewController;
})(index || (index = {}));
var file_info;
(function (file_info) {
    var Model = (function () {
        function Model() {
        }
        return Model;
    }());
    file_info.Model = Model;
    var ViewController = (function () {
        function ViewController() {
        }
        return ViewController;
    }());
    file_info.ViewController = ViewController;
})(file_info || (file_info = {}));
var mcRemote = angular.module('mc-remote', ['ngAnimate', 'ui.bootstrap']);
application.context.setup(mcRemote);
session.context.setup(mcRemote);
page.context.setup(mcRemote);
mcRemote.controller('index', function ($scope, $http, $uibModal) {
    $scope.variable = "hey hey (from angular)";
    console.log($http);
    $scope.viewController = new index.ViewController($scope, $http, $uibModal);
    $scope.currentFolder = $scope.viewController.currentFolder;
    $scope.roots = $scope.viewController.roots;
    // $scope.controller.ping();
});
mcRemote.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, parentFolderPosixPath, file) {
    $scope.file = file;
    $scope.fileUrl = "/_dynamic_/HLFileDownloadRequestHandler/" + parentFolderPosixPath + "/" + file._name;
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
//# sourceMappingURL=index.js.map