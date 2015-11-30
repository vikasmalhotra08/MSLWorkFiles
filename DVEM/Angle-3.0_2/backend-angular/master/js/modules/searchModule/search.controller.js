/**
 * Created by Vikas on 12-10-2015.
 */
(function() {
    'use strict';

    angular
        .module('app.searchModule')
        .controller('SearchController',SearchController)
        .controller('ModalCtrl', function ($scope, $modalInstance, cat) {
            $scope.cat = cat;
        })

    SearchController.$inject = ['$http','$scope','$resource', '$modal', '$filter','ngDialog'];
    function SearchController($http, $scope,$resource,$modal,$filter, ngDialog){
        var vm = this;

        var orderBy = $filter('orderBy');
        var qTypeOfStudy = "";
        var qTypeOfSpecies = "";
        var qTypeOfSpeciality = "";
        var count = 1;

        $scope.reloadPage = function(){window.location.reload();}

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

        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

        $scope.open = function () {
            ngDialog.open({
                template: 'firstDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            });
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

})();

