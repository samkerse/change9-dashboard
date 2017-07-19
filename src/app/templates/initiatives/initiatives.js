module.exports = {
  template: require('./initiatives.html'),
  controller: initiativesController
};
var createInitiativeHTML = require('../modal/createInitiative/createInitiative.html');
function initiativesController($log, apiFactory, loginFactory, ngDialog, segment) {
  var vm = this;
  segment.page('Initiatives', 'All');
  vm.getAllInitiatives = function () {
    apiFactory.setKey('pageLoaded', 'false');
    apiFactory.getAllInitiatives().then(function (initiatives) {
      $log.debug('loaded initiatives');
      if (initiatives.data.length === 0) {
        vm.noData = true;
      }
      else {
        vm.noData = false;
        vm.allInitiatives = initiatives.data;
        apiFactory.setKey('pageLoaded', 'true');
      }
    }, function (err) {
      vm.message = "You might have to log back in to see all your initiatives";
      $log.debug(err);
    });
  };
  vm.createInitiative = function () {
    segment.track('Manager decides to create an initiative');
    ngDialog.open({
      template: createInitiativeHTML,
      plain: true,
      controller: 'createInitiativeController',
      controllerAs: 'vm',
    });
  };
}
