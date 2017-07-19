module.exports = {
  template: require('./sidebar.html'),
  controller: sidebarController
};

function sidebarController($state, apiFactory, loginFactory, $log) {
  var vm = this;
  vm.initials = apiFactory.getKey('initials');
  vm.logout = function () {
    $state.go('login.default');
    apiFactory.setKey('token', '');
  };
  if (apiFactory.getKey('name'))
    vm.managerName = apiFactory.getKey('name');
  if (apiFactory.getKey('initList')) {
    vm.initiativesList = JSON.parse(apiFactory.getKey('initList'));
  }
  $log.debug(vm.initList);
}
