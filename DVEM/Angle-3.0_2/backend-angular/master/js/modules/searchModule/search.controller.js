/**
 * Created by Vikas on 12-10-2015.
 */
(function() {
    'use strict';

    angular
        .module('app.searchModule')
        .controller('SearchController',SearchController)
        .controller('DialogIntroCtrl', DialogIntroCtrl)
        .controller('DialogMainCtrl', DialogMainCtrl)
        .controller('InsideCtrl', InsideCtrl)
        .controller('SecondModalCtrl', SecondModalCtrl)
        .controller('ModalInstanceCtrl', function ($scope, $modalInstance, customer)
        {
            $scope.customer = customer;

        });;

    SearchController.$inject = ['$http','$scope','$resource', '$modal', '$filter'];

    function SearchController($http, $scope,$resource,$modal,$filter){

        var vm = this;

        var orderBy = $filter('orderBy');
        var qTypeOfStudy = "";
        var qTypeOfSpecies = "";
        var qTypeOfSpeciality = "";
        var count = 1;

        $scope.filteredItems = [];
        $scope.groupedItems = [];
        $scope.itemsPerPage = 5;
        $scope.pagedItems = [];
        $scope.currentPage = 0;
        $scope.searchDataValues = [];

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

        // MODAL WINDOW
        $scope.open = function (_customer) {

            var modalInstance = $modal.open({
                controller: "ModalInstanceCtrl",
                templateUrl: 'myModalContent.html',
                resolve: {
                    customer: function()
                    {
                        return _customer;
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
                $scope.searchDataValues = (data.data);
                $scope.totalItems = $scope.searchDataValues.length;
            });




        };

        /*
         $scope.currentPage = 1;
         $scope.numPerPage = 5;

         $scope.numberOfPages=function(){
         return Math.ceil($scope.searchDataValues.length/$scope.numPerPage);
         }


         $scope.paginate = function(value) {
         var begin, end, index;
         begin = ($scope.currentPage - 1) * $scope.numPerPage;
         end = begin + $scope.numPerPage;
         index = $scope.objects.indexOf(value);
         return (begin <= index && index < end);
         };*/


        // pagination controls
        $scope.currentPage = 1;
        $scope.totalItems = $scope.searchDataValues.length;
        $scope.entryLimit = 8; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

        $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

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




    DialogIntroCtrl.$inject = ['$scope', 'ngDialog', 'tpl'];
    // Called from the route state. 'tpl' is resolved before
    function DialogIntroCtrl($scope, ngDialog, tpl) {

        activate();

        ////////////////

        function activate() {
            // share with other controllers
            $scope.tpl = tpl;
            // open dialog window
            ngDialog.open({
                template: tpl.path,
                // plain: true,
                className: 'ngdialog-theme-default'
            });
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

            $scope.directivePreCloseCallback = function (value) {
                if(confirm('Close it? MainCtrl.Directive. (Value = ' + value + ')')) {
                    return true;
                }
                return false;
            };

            $scope.preCloseCallbackOnScope = function (value) {
                if(confirm('Close it? MainCtrl.OnScope (Value = ' + value + ')')) {
                    return true;
                }
                return false;
            };

            $scope.open = function () {
                ngDialog.open({ template: 'firstDialogId', controller: 'InsideCtrl', data: {foo: 'some data'} });
            };

            $scope.openDefault = function () {
                ngDialog.open({
                    template: 'firstDialogId',
                    controller: 'InsideCtrl',
                    className: 'ngdialog-theme-default'
                });
            };

            $scope.openDefaultWithPreCloseCallbackInlined = function () {
                ngDialog.open({
                    template: 'firstDialogId',
                    controller: 'InsideCtrl',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: function(value) {
                        if (confirm('Close it?  (Value = ' + value + ')')) {
                            return true;
                        }
                        return false;
                    }
                });
            };

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

            $scope.openConfirmWithPreCloseCallbackOnScope = function () {
                ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: 'preCloseCallbackOnScope',
                    scope: $scope
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            };

            $scope.openConfirmWithPreCloseCallbackInlinedWithNestedConfirm = function () {
                ngDialog.openConfirm({
                    template: 'dialogWithNestedConfirmDialogId',
                    className: 'ngdialog-theme-default',
                    preCloseCallback: function(/*value*/) {

                        var nestedConfirmDialog = ngDialog.openConfirm({
                            template:
                            '<p>Are you sure you want to close the parent dialog?</p>' +
                            '<div>' +
                            '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No' +
                            '<button type="button" class="btn btn-primary" ng-click="confirm(1)">Yes' +
                            '</button></div>',
                            plain: true,
                            className: 'ngdialog-theme-default'
                        });

                        return nestedConfirmDialog;
                    },
                    scope: $scope
                })
                    .then(function(value){
                        console.log('resolved:' + value);
                        // Perform the save here
                    }, function(value){
                        console.log('rejected:' + value);

                    });
            };

            $scope.openInlineController = function () {
                $rootScope.theme = 'ngdialog-theme-default';

                ngDialog.open({
                    template: 'withInlineController',
                    controller: ['$scope', '$timeout', function ($scope, $timeout) {
                        var counter = 0;
                        var timeout;
                        function count() {
                            $scope.exampleExternalData = 'Counter ' + (counter++);
                            timeout = $timeout(count, 450);
                        }
                        count();
                        $scope.$on('$destroy', function () {
                            $timeout.cancel(timeout);
                        });
                    }],
                    className: 'ngdialog-theme-default'
                });
            };

            $scope.openTemplate = function () {
                $scope.value = true;

                ngDialog.open({
                    template: $scope.tpl.path,
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.openTemplateNoCache = function () {
                $scope.value = true;

                ngDialog.open({
                    template: $scope.tpl.path,
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    cache: false
                });
            };

            $scope.openTimed = function () {
                var dialog = ngDialog.open({
                    template: '<p>Just passing through!</p>',
                    plain: true,
                    closeByDocument: false,
                    closeByEscape: false
                });
                setTimeout(function () {
                    dialog.close();
                }, 2000);
            };

            $scope.openNotify = function () {
                var dialog = ngDialog.open({
                    template:
                    '<p>You can do whatever you want when I close, however that happens.</p>' +
                    '<div><button type="button" class="btn btn-primary" ng-click="closeThisDialog(1)">Close Me</button></div>',
                    plain: true
                });
                dialog.closePromise.then(function (data) {
                    console.log('ngDialog closed' + (data.value === 1 ? ' using the button' : '') + ' and notified by promise: ' + data.id);
                });
            };

            $scope.openWithoutOverlay = function () {
                ngDialog.open({
                    template: '<h2>Notice that there is no overlay!</h2>',
                    className: 'ngdialog-theme-default',
                    plain: true,
                    overlay: false
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

})();

