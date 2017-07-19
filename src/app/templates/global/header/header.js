module.exports = {
  template: require('./header.html'),
  controller: headerController
};

function headerController($state, apiFactory, loginFactory, $log, pageProperties) {
  var vm = this;
  vm.page = pageProperties;
  // vm.page.type = "Something";
  $log.debug("page", vm.page);
  // vm.initials = apiFactory.getKey('initials');
  // vm.logout = function () {
  //   $state.go('login.default');
  //   apiFactory.setKey('token', '');
  // };
  // if (apiFactory.getKey('name'))
  //   vm.managerName = apiFactory.getKey('name');
  // if (apiFactory.getKey('initList')) {
  //   vm.initiativesList = JSON.parse(apiFactory.getKey('initList'));
  // }
  // $log.debug(vm.initList);
}
