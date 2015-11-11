/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.tables')
        .controller('DataTableController', DataTableController);

    DataTableController.$inject = ['$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder','$http'];
    function DataTableController($resource, DTOptionsBuilder, DTColumnDefBuilder, $http) {
        var vm = this;

        activate();

        ////////////////

        function activate() {


            // Changing data

          vm.heroes = [{
              'id': 860,
              'firstName': 'Superman',
              'lastName': 'Yoda'
            }, {
              'id': 870,
              'firstName': 'Ace',
              'lastName': 'Ventura'
            }, {
              'id': 590,
              'firstName': 'Flash',
              'lastName': 'Gordon'
            }, {
              'id': 803,
              'firstName': 'Luke',
              'lastName': 'Skywalker'
            }
          ];

            vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');

            vm.dtColumnDefs = [
                DTColumnDefBuilder.newColumnDef(0),
                DTColumnDefBuilder.newColumnDef(1),
                DTColumnDefBuilder.newColumnDef(2),
                DTColumnDefBuilder.newColumnDef(3),
                DTColumnDefBuilder.newColumnDef(4),
                DTColumnDefBuilder.newColumnDef(5),
                DTColumnDefBuilder.newColumnDef(6),
                DTColumnDefBuilder.newColumnDef(7),
                DTColumnDefBuilder.newColumnDef(8),
                DTColumnDefBuilder.newColumnDef(9),
                DTColumnDefBuilder.newColumnDef(10),
                DTColumnDefBuilder.newColumnDef(11),
                DTColumnDefBuilder.newColumnDef(12),
                DTColumnDefBuilder.newColumnDef(13),
                DTColumnDefBuilder.newColumnDef(14),
                DTColumnDefBuilder.newColumnDef(15),
                DTColumnDefBuilder.newColumnDef(16),
                DTColumnDefBuilder.newColumnDef(17),
                DTColumnDefBuilder.newColumnDef(18),
                DTColumnDefBuilder.newColumnDef(19),
                DTColumnDefBuilder.newColumnDef(20),
                DTColumnDefBuilder.newColumnDef(21),
                DTColumnDefBuilder.newColumnDef(22),
                DTColumnDefBuilder.newColumnDef(23),
                DTColumnDefBuilder.newColumnDef(24),
                DTColumnDefBuilder.newColumnDef(25),
                DTColumnDefBuilder.newColumnDef(26),
                DTColumnDefBuilder.newColumnDef(27),
                DTColumnDefBuilder.newColumnDef(28),
                DTColumnDefBuilder.newColumnDef(29),
                DTColumnDefBuilder.newColumnDef(30),
                DTColumnDefBuilder.newColumnDef(31),
                DTColumnDefBuilder.newColumnDef(32),
                DTColumnDefBuilder.newColumnDef(33),
                DTColumnDefBuilder.newColumnDef(34),
                DTColumnDefBuilder.newColumnDef(35),
                DTColumnDefBuilder.newColumnDef(36),
                DTColumnDefBuilder.newColumnDef(37),
                DTColumnDefBuilder.newColumnDef(38),
                DTColumnDefBuilder.newColumnDef(39)

            ];
          vm.person2Add = _buildPerson2Add(1);
          vm.addPerson = addPerson;
          vm.modifyPerson = modifyPerson;
          vm.removePerson = removePerson;

          function _buildPerson2Add(id) {
              return {
                  id: id,
                  firstName: 'Foo' + id,
                  lastName: 'Bar' + id
              };
          }
          function addPerson() {
              vm.heroes.push(angular.copy(vm.person2Add));
              vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
          }
          function modifyPerson(index) {
              vm.heroes.splice(index, 1, angular.copy(vm.person2Add));
              vm.person2Add = _buildPerson2Add(vm.person2Add.id + 1);
          }
          function removePerson(index) {
              vm.heroes.splice(index, 1);
          }

        }
    }
})();
