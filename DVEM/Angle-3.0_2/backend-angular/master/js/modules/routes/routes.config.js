/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/search');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
          })
          .state('app.search', {
              url: '/search',
              title: 'search',
              templateUrl: helper.basepath('search.html'),
              resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'weather-icons')
          })
            .state('app.ngdialog', {
                url: '/search',
                title: 'ngDialog',
                templateUrl: 'app/pages/search.html',
                resolve: angular.extend(helper.resolveFor('ngDialog'),{
                    tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                }),
                controller: 'SearchController'
            })
          .state('app.table-datatable', {
              url: '/table-datatable',
              title: 'Table Datatable',
              templateUrl: helper.basepath('table-datatable.html'),
              resolve: helper.resolveFor('datatables')
          })
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ['$rootScope', function($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.search', {
                url: '/search',
                title: 'search',
                resolve: angular.extend(helper.resolveFor('ngDialog'),{
                    tpl: function() { return { path: helper.basepath('ngdialog-template.html') }; }
                }),
                templateUrl: 'app/pages/search.html'
            })
            .state('page.login', {
                url: '/login',
                title: 'login',
                templateUrl: 'app/pages/login.html'
            })
            .state('page.studydetails', {
                url: '/studydetails',
                title: 'Study Details',
                templateUrl: 'app/pages/studydetails.html'
            })
          ;

    } // routesConfig

})();

