(function() {
    'use strict';

    angular
        .module('app.ngDialogModule')
        .controller('MainController', MainController);
    MainController.$inject = ['$scope', '$rootScope', 'ngDialog', '$timeout','ngDialogModuleProvider'];
    function MainController($scope, $rootScope, ngDialog, $timeout,ngDialogProvider){
        $rootScope.app.config(["ngDialogProvider", function (ngDialogProvider) {
            ngDialogProvider.setDefaults({
                className: "ngdialog-theme-default",
                plain: false,
                showClose: true,
                closeByDocument: true,
                closeByEscape: true,
                appendTo: false,
                preCloseCallback: function () {
                    console.log("default pre-close callback");
                }
            });
        }]);


        $rootScope.jsonData = '{"foo": "bar"}';
        $rootScope.theme = 'ngdialog-theme-default';

        $scope.openConfirm = function () {
            ngDialog.openConfirm({
                template: 'modalDialogId',
                className: 'ngdialog-theme-default'
            }).then(function (value) {
                console.log('Modal promise resolved. Value: ', value);
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        };

        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
            console.log('ngDialog opened: ' + $dialog.attr('id'));
        });

        $rootScope.$on('ngDialog.closed', function (e, $dialog) {
            console.log('ngDialog closed: ' + $dialog.attr('id'));
        });

        $rootScope.$on('ngDialog.closing', function (e, $dialog) {
            console.log('ngDialog closing: ' + $dialog.attr('id'));
        });

        $rootScope.$on('ngDialog.templateLoading', function (e, template) {
            console.log('ngDialog template is loading: ' + template);
        });

        $rootScope.$on('ngDialog.templateLoaded', function (e, template) {
            console.log('ngDialog template loaded: ' + template);
        });

    }

})();