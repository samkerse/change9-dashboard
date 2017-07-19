module.exports = {
  template: require('./groups.html'),
  controller: groupsController
};

function groupsController($log, apiFactory, segment) {
  $log.debug("Inside groupsController");
  var vm = this;
  segment.page('Groups', 'All Groups');
  vm.getAllGroups = function () {
    apiFactory.setKey('pageLoaded', 'false');
    apiFactory.getAllGroups().then(function (groups) {
      apiFactory.setKey('pageLoaded', 'true');
      vm.allGroups = groups.data;
      if (groups.data.length === 0) {
        vm.noData = true;
      } else {
        vm.noData = false;
      }
    }, function (err) {
      vm.message = "You might have to log back in to see all your groups";
      $log.debug(err);
    });
  };
}
