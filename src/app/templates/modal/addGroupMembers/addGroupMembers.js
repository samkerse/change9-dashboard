module.exports = {
  template: require('./addGroupMembers.html'),
  controller: groupMemberController
};

function groupMemberController($log, apiFactory, $stateParams, ngDialog) {
  $log.debug("This is to add members to your groups");
  var vm = this;
  vm.add = false;
  vm.memberInfo = {};
  vm.memberInfo.groupId = $stateParams.id;
  vm.memberInfo.users = [];
  vm.addUser = function () {
    vm.memberInfo.users.push({});
  };
  vm.checkValid = function (array) {
    var validUsers = array.filter(function (user, idx) {
      if ((user.email && user.name) && (user.email !== null && user.name !== null)) {
        return user;
      }
    });
    return validUsers;
  };
  vm.addGroupMembers = function () {
    vm.add = true;
    var validUsers = vm.checkValid(vm.memberInfo.users);
    var data = {
      "groupId": $stateParams.id,
      "users": validUsers,
      "organistaion": apiFactory.getKey('org')
    };
    apiFactory.editGroupMembers(data).then(function (data) {
      vm.add = false;
      ngDialog.close();
    }, function (err) {
      if (err) {
        $log.debug(err);
      }
    });
  };
}
