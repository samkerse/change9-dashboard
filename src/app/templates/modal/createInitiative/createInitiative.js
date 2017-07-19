module.exports = {
  template: require('./createInitiative.html'),
  controller: createInitiativeController
};

function createInitiativeController($log, apiFactory, ngDialog, $state, segment) {
  var vm = this;
  vm.create = false;
  vm.initiativeData = {};
  vm.show = false;
  vm.initiativeData.managers = [];
  vm.addInitiativeManager = function () {
    vm.initiativeData.managers.push({});
  };
  vm.createInitiative = function () {
    vm.create = true;
    var allInits = JSON.parse(apiFactory.getKey('initList'));
    var details = JSON.parse(apiFactory.getKey('details'));
    vm.initiativeData.organisation = details.organisationId;
    $log.debug(vm.initiativeData);
    apiFactory.createInitiative(vm.initiativeData).then(function (init) {
      segment.track('Create Initiative', { 'name': vm.initiativeData.name, 'type': 'Create Modal', 'location': 'Initiative Modal' });
      vm.create = false;
      ngDialog.close();
      allInits.push(init);
      apiFactory.setKey('initList', JSON.stringify(allInits));
      $state.go('app.initiative', {
        id: init.data._id
      });
    }, function (err) {
      if (err) {
        vm.message = 'Oops something went wrong';
      }
    });
  };
}
