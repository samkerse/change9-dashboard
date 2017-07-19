module.exports = {
  template: require('./register.html'),
  controller: registerController
};

function registerController($log, apiFactory, $state, loginFactory, segment) {
  var vm = this;
  vm.managerData = {
    'email': ''
  };
  vm.pin = {
    'num1': '',
    'num2': '',
    'num3': '',
    'num4': ''
  };
  vm.register = function () {
    vm.message = '';
    vm.managerData.password = vm.pin.num1 + vm.pin.num2 + vm.pin.num3 + vm.pin.num4;
    vm.registerLoading = true;
    $log.debug(vm.managerData);
    if (vm.managerData.email !== '' && (vm.managerData.password !== '' || vm.managerData.password.indexOf('undefined') !== 1)) {
      apiFactory.register(vm.managerData).then(function (res) {
        var postData = {
          'email': vm.managerData.email,
          'password': vm.managerData.password
        };
        apiFactory.login(postData).then(function (data) {
          vm.registerLoading = false;
          var createdAt = new Date();
          vm.message = '';
          loginFactory.pushData(data.data);
          $log.debug(data.data);
          apiFactory.setKey('loggedIn', createdAt.toString());
          apiFactory.setKey('token', data.data.token);
          // segment.identify(data.data.manager._id, {
          //   "email": data.data.manager.email,
          //   "name": data.data.manager.name,
          //   "segments": data.data.manager.groups.length,
          //   "company": data.data.organisationName
          // });
          apiFactory.setKey('org', data.data.organisationName);
          apiFactory.setKey('details', JSON.stringify(data.data.manager));
          apiFactory.setKey('initList', JSON.stringify(data.data.initiatives));
          vm.managerName = data.data.manager.name;
          apiFactory.setKey('name', data.data.manager.name);
          $state.go('app.dashboard');
        }, function (err) {
          vm.message = "Incorrect email or pin";
          vm.registerLoading = false;
          $log.debug(err);
        });
      }, function (err) {
        vm.message = 'You missed some of the entries';
        vm.registerLoading = false;
        $log.debug(err);
      });
    }
    else if (vm.managerData.email === '') {
      vm.noEmail = true;
      vm.registerLoading = false;
    }
    else if (vm.managerData.password !== '' || vm.managerData.password.indexOf('undefined') === 1) {
      vm.noPin = true;
      vm.registerLoading = false;
    }
  };
}
