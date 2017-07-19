module.exports = {
  template: require('./editGroupMember.html'),
  controller: editGroupMemberController
};

function editGroupMemberController($log, user, groupId, apiFactory, ngDialog, segment) {
  var vm = this;
  vm.update = false;
  vm.user = [];
  vm.user.push(user);
  $log.debug(vm.users);
  $log.debug("Edit group member");
  vm.saveGroupMember = function (user) {
    vm.update = true;
    segment.track("Edited group member");
    var data = {
      "groupId": groupId,
      "users": vm.user,
      "organistaion": apiFactory.getKey('org')
    };
    apiFactory.editGroupMembers(data).then(function (data) {
      vm.update = false;
      ngDialog.close();
    }, function (err) {
      if (err) {
        $log.debug(err);
      }
    });
  };
}
