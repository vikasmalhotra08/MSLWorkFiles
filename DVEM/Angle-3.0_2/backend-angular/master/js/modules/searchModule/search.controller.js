/**
 * Created by Vikas on 12-10-2015.
 */
(function() {
    'use strict';

    angular
        .module('app.searchModule')
        .controller('SearchController',SearchController)
        .controller('InsideCtrl', InsideCtrl)
        .controller('SecondModalCtrl', SecondModalCtrl)
        .controller('DialogMainCtrl', DialogMainCtrl);

    SearchController.$inject = ['$http','$scope'];
    function SearchController($http, $scope){
        var vm = this;

        $scope.getById = function (id) {
            alert(id);
        };

        activate();

        function activate(){

        }
    }

    DialogMainCtrl.$inject = ['$scope', '$rootScope', 'ngDialog'];
    // Loads from view
    function DialogMainCtrl($scope, $rootScope, ngDialog) {

        activate();

        ////////////////

        function activate() {
            $rootScope.jsonData = '{"foo": "bar"}';
            $rootScope.theme = 'ngdialog-theme-default';

            $scope.open = function () {
                ngDialog.open({
                    template: 'firstDialogId',
                    controller: 'InsideCtrl',
                    data: {foo: 'some data'} });
            };

        }

    } // DialogMainCtrl

    InsideCtrl.$inject = ['$scope', 'ngDialog'];
    function InsideCtrl($scope, ngDialog) {

        activate();

        ////////////////

        function activate() {
            $scope.dialogModel = {
                message : 'message from passed scope'
            };
            $scope.openSecond = function () {
                ngDialog.open({
                    template: '<p class="lead m0"><a href="" ng-click="closeSecond()">Close all by click here!</a></h3>',
                    plain: true,
                    closeByEscape: false,
                    controller: 'SecondModalCtrl'
                });
            };
        }
    }

    SecondModalCtrl.$inject = ['$scope', 'ngDialog'];
    function SecondModalCtrl($scope, ngDialog) {

        activate();

        ////////////////

        function activate() {
            $scope.closeSecond = function () {
                ngDialog.close();
            };
        }

    }
})