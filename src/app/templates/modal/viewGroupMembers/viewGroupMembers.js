module.exports = {
  template: require('./viewGroupMembers.html'),
  controller: viewGroupMemberController
};

function viewGroupMemberController($log, users, groupId, apiFactory, ngDialog) {
  var vm = this;
  vm.edit = false;
  vm.users = users;
  $log.debug("This is the group member controller", vm.users);
  vm.addUser = function () {
    vm.users.push({});
  };
  vm.checkValid = function (array) {
    var validUsers = array.filter(function (user, idx) {
      if ((user.email && user.name) && (user.email !== null && user.name !== null)) {
        return user;
      }
    });
    return validUsers;
  };
  vm.editGroupMemebers = function () {
    vm.edit = true;
    var validUsers = vm.checkValid(vm.users);
    $log.debug(validUsers);
    var groupData = {
      'groupId': groupId,
      'users': validUsers,
      'organisation': apiFactory.getKey('org')
    };
    apiFactory.editGroupMembers(groupData).then(function (data) {
      vm.edit = false;
      $log.debug(data);
      ngDialog.close();
    }, function (err) {
      $log.debug(err);
    });
  };
}
