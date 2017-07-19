module.exports = {
  template: require('./conversations.html'),
  controller: conversationsController
};
var createInitiativeHTML = require('../modal/createInitiative/createInitiative.html');

function conversationsController($log, loginFactory, apiFactory, _, $state, segment, ngDialog, pageProperties, moment) {
  var vm = this;
  vm.page = pageProperties;
  vm.page.type = "Communications";
  $log.debug("Hello dashboard");
  segment.page('Dashboard');
  vm.editorOptions = [['bold', 'italic'], ['link', 'image']];
}
