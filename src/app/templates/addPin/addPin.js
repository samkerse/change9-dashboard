module.exports = {
  template: require('./addPin.html'),
  controller: addPinController
};

function addPinController($log, apiFactory, $stateParams, loginFactory, segment, $state) {
  $log.debug("Add pin controller", $stateParams);
  var vm = this;
  vm.pin = {};
  vm.managerInfo = {};
  vm.managerInfo.email = $stateParams.email;
  vm.managerInfo.id = $stateParams.userId;
  vm.registerLoading = false;
  vm.login = function () {
    vm.registerLoading = true;
    vm.managerInfo.password = vm.pin.num1 + vm.pin.num2 + vm.pin.num3 + vm.pin.num4;
    apiFactory.updatePin(vm.managerInfo).then(function (data) {
      $log.debug(data);
      var postData = {
        'email': vm.managerInfo.email,
        'password': vm.managerInfo.password
      };
      apiFactory.login(postData).then(function (manager) {
        vm.registerLoading = false;
        var createdAt = new Date();
        vm.message = '';
        loginFactory.pushData(data.data);
        $log.debug(data.data);
        apiFactory.setKey('loggedIn', createdAt.toString());
        apiFactory.setKey('token', manager.data.token);
        segment.identify(manager.data.manager._id, {
          "email": manager.data.manager.email,
          "name": manager.data.manager.name,
          "segments": manager.data.manager.groups.length,
          "company": manager.data.manager.organisationId
        });
        apiFactory.setKey('details', JSON.stringify(manager.data.manager));
        apiFactory.setKey('initList', JSON.stringify(manager.data.initiatives));
        vm.managerName = manager.data.manager.name;
        apiFactory.setKey('name', manager.data.manager.name);
        $state.go('app.dashboard');
      }, function (err) {
        if (err) {
          $log.debug(err);
        }
      });
    });
  };
}
