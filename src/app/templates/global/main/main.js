module.exports = {
  template: require('./main.html'),
  controller: mainController
};

function mainController($state, $log, apiFactory, $transitions, pageProperties) {
  var vm = this;
  if ($state.current.name.indexOf('login') !== -1) {
    $log.debug($state.current.name);
    vm.isLogin = true;
  }
  vm.pageProperties = pageProperties;
//  $log.debug("pageProperties.properties");
  vm.pageLoaded = function () {
    return apiFactory.getKey('pageLoaded');
  };
  vm.orgName = apiFactory.getKey('org');
  vm.managerName = apiFactory.getKey('name');
  $log.debug("state thingy");
  vm.getState = function () {
    if ($state.includes('app')) {
      return 'light';
    }
    return 'login';
  };
  $transitions.onStart({}, function (trans) {
    vm.prev = trans.from();
    vm.next = trans.to();
  });
  vm.logout = function () {
    $state.go('login.default');
    apiFactory.setKey('token', '');
  };
}

