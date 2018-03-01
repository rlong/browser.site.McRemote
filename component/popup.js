/**
 * Created by rlong on 23/05/2016.
 */
/// <reference path="../typings/index.d.ts" />
var component;
(function (component) {
    var popup;
    (function (popup) {
        var ViewController = /** @class */ (function () {
            function ViewController($uibModalInstance, title, body) {
                this.title = "Title";
                this.body = "Body";
                this.$uibModalInstance = $uibModalInstance;
                this.title = title;
                this.body = body;
            }
            ViewController.prototype.okButtonOnClick = function () {
                console.log("okButtonOnClick");
                this.$uibModalInstance.close();
            };
            return ViewController;
        }());
        popup.ViewController = ViewController;
        function show($uibModal, title, body) {
            if (title === void 0) { title = "Title"; }
            if (body === void 0) { body = "Body"; }
            $uibModal.open({
                templateUrl: '/component/popup.html',
                controller: 'component.popup.ViewController',
                resolve: {
                    title: function () {
                        return title;
                    },
                    body: function () {
                        return body;
                    }
                }
            });
        }
        popup.show = show;
        function showHttpPromiseError($uibModal, reason) {
            console.error(reason);
            var status = reason.status;
            var body = reason.statusText;
            if (0 == body.length) {
                body = "status:" + status;
            }
            else {
                body += " (" + status + ")";
            }
            show($uibModal, "HTTP Error", body);
        }
        popup.showHttpPromiseError = showHttpPromiseError;
        function setup(module) {
            module.controller('component.popup.ViewController', function ($scope, $uibModalInstance, title, body) {
                $scope.viewController = new ViewController($uibModalInstance, title, body);
            });
        }
        popup.setup = setup;
    })(popup = component.popup || (component.popup = {}));
})(component || (component = {}));
//# sourceMappingURL=popup.js.map