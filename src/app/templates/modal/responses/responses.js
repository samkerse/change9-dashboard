module.exports = {
  template: require('./responses.html'),
  controller: responsesModalController
};

function responsesModalController($log, responses, users, questions, _, isPrivate) {
  var vm = this;
  vm.modalData = [];
  vm.private = isPrivate;
  vm.responses = responses;
  vm.users = users;
  vm.questions = questions;
  vm.getResponses = function () {
    $log.debug("users", vm.responses);
    vm.responses.forEach(function (r) {
      var name = _.filter(vm.users, function (u) {
        return u._id === r.userId;
      });
      $log.debug("name", name);
      r.name = name[0].name;
    });
    vm.questions.forEach(function (q, id) {
      vm.modalData[id] = {
        'question': q.question,
        'responses': []
      };
      vm.responses.forEach(function (r) {
        vm.modalData[id].responses.push({
          'response': r.response[id],
          'name': r.name
        });
      });
    });
    $log.debug(vm.modalData);
  };
}
