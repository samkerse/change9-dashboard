module.exports = {
  template: require('./login.html'),
  controller: loginController
};

/** @ngInject */
function loginController($window, $log, apiFactory, loginFactory, $state, segment) {
  var vm = this;
  vm.email = '';
  vm.pin = {};
  vm.$log = $log; // $log provider for debugging
  if (apiFactory.getKey('name')) {
    vm.managerName = apiFactory.getKey('name');
  }
  // Log in if token still valid
  if (apiFactory.getKey('token')) {
    if (apiFactory.getKey('token').length !== 0) {
      var token = apiFactory.getKey('token');
      apiFactory.getAllInitiatives(token).then(function (data) {
        $state.go('app.dashboard');
      }, function (err) {
        if (err) {
          $state.go('login.default');
          apiFactory.setKey('token', '');
        }
      });
    }
  }
  if (apiFactory.getKey('details')) {
    vm.email = JSON.parse(apiFactory.getKey('details')).email;
  }
  vm.login = function () {
    vm.loginLoading = true; // ladda loading button
    var pinString = vm.pin.num1 + vm.pin.num2 + vm.pin.num3 + vm.pin.num4; // Stringified pin numbers
    var postData = {
      email: vm.email,
      password: pinString
    };
    // Login API Call
    if (vm.email !== '' && pinString.indexOf('undefined') !== 1) {
      vm.noEmail = false;
      vm.noPin = false;
      apiFactory.login(postData).then(function (data) {
        vm.loginLoading = false;
        var createdAt = new Date();
        vm.message = '';
        loginFactory.pushData(data.data);
        $log.debug(data.data);
        // segment.identify(data.data.manager._id, {
        //   "email": data.data.manager.email,
        //   "name": data.data.manager.name,
        //   "segments": data.data.manager.groups.length,
        //   "company": data.data.organisationName
        // });
        apiFactory.setKey('loggedIn', createdAt.toString());
        apiFactory.setKey('org', data.data.organisationName);
        apiFactory.setKey('token', data.data.token);
        apiFactory.setKey('details', JSON.stringify(data.data.manager));
        var ils = data.data.manager.name.match(/\b(\w)/g);
        apiFactory.setKey('initials', ils.join(''));
        apiFactory.setKey('initList', JSON.stringify(data.data.initiatives));
        vm.managerName = data.data.manager.name;
        apiFactory.setKey('name', data.data.manager.name);
        $state.go('app.dashboard');
      }, function (err) {
        vm.message = "Incorrect email or pin";
        vm.loginLoading = false;
        vm.$log.debug(err);
      });
    }
    else {
      if (vm.email === '') {
        vm.noEmail = true;
        vm.loginLoading = false;
      }
      else if (pinString.indexOf('undefined') !== 1) {
        vm.noPin = true;
        vm.loginLoading = false;
        vm.pinMessage = 'You Missed Digits In Your Pin';
      }
    }
  };
}
