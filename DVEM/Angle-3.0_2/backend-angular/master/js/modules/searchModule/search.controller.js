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

    SearchController.$inject = ['$http','$scope','$resource', '$modal', '$filter', 'ngTableParams','ngTableDataService'];
    function SearchController($http, $scope,$resource,$modal,$filter,ngTableParams,ngTableDataService){
        var vm = this;

        var orderBy = $filter('orderBy');
        var qTypeOfStudy = "";
        var qTypeOfSpecies = "";
        var qTypeOfSpeciality = "";
        var count = 1;

        // data is present, we need to define ga variable to push the data into that


        $scope.openModal = function (data) {
            var modalInstance = $modal.open({
                templateUrl: '/partials/submission_mod.html',
                controller: 'ModalCtrl',
                resolve: {
                    cat: function () {
                        return data;
                    }
                }
            });
        };


        $scope.getById = function (id) {
            // I am able to get search text, type of species, type of speciality, type of studies
            // Now pass this in a combined search query to the php file and get back the results.

            /* These variables provide me the query parameters
             alert(id.SearchText);
             alert(id.typeOfStudy);
             alert(id.typeOfSpecies);
             alert(id.typeofspeciality);*/
            // For Study type

            if (id.typeOfStudy){
                $.each(id.typeOfStudy, function() {
                    if (count < id.typeOfStudy.length) {
                        count++;
                        qTypeOfStudy += "'" + this + "',";
                    }
                    else if (count == id.typeOfStudy.length) {
                        qTypeOfStudy += "'" + this + "'";
                    }
                })
            }
            // For Species type
            count = 1;
            if (id.typeOfSpecies){
                $.each(id.typeOfSpecies, function() {
                    if (count < id.typeOfSpecies.length) {
                        count++;
                        qTypeOfSpecies += "'" + this + "',";
                    }
                    else if (count == id.typeOfSpecies.length) {
                        qTypeOfSpecies += "'" + this + "'";
                    }
                })
            }
            // For Speciality type
            count = 1;
            if (id.typeofspeciality){
                $.each(id.typeofspeciality, function() {
                    if (count < id.typeofspeciality.length) {
                        count++;
                        qTypeOfSpeciality += "'" + this + "',";
                    }
                    else if (count == id.typeofspeciality.length) {
                        qTypeOfSpeciality += "'" + this + "'";
                    }
                })
            }

            // Pass the selected variables to Ajax request:

            $http({
                method: 'POST',
                url: 'server/search/searchQuery.php',
                data: {data: 'getData', searchText: id.SearchText , typeOfStudy: qTypeOfStudy , typeOfSpecies: qTypeOfSpecies , typeOfSpeciality: qTypeOfSpeciality },
                headers: {'Content-Type': 'application/json'}
            }).then(function(data) {
                vm.searchDataValues = (data.data);
            });




        };

        $scope.predicate = 'age';
        $scope.reverse = true;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };




        activate();

        $http({
            method: 'POST',
            url: 'server/MiscData/fetchTypeOfStudies.php',
            data: {data: 'getData'},
            headers: {'Content-Type': 'application/json'}
        }).then(function(data) {
            vm.typeOfStudies = data.data;});

        $http({
            method: 'POST',
            url: 'server/MiscData/fetchTypeOfSpecies.php',
            data: {data: 'getData'},
            headers: {'Content-Type': 'application/json'}
        }).then(function(data) {
            vm.typeOfSpecies = data.data;});

        $http({
            method: 'POST',
            url: 'server/MiscData/fetchTypeOfSpeciality.php',
            data: {data: 'getData'},
            headers: {'Content-Type': 'application/json'}
        }).then(function(data) {
            vm.typeofspeciality = data.data;});



        function activate(){
            var States = $resource('server/chosen-states.json', {},  {'query':    {method:'GET', isArray:true} });

            vm.states = States.query();
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