module.exports = {
  template: require('./viewSentiment.html'),
  controller: viewSentimentController
};

function viewSentimentController($log, lastResponse, lastCheckin, moment, isPrivate) {
  $log.debug("Sentiment modal window");
  var vm = this;
  vm.private = isPrivate;
  vm.lastResponse = lastResponse;
  vm.lastResponse.createdAt = moment(vm.lastResponse.lastResponse.createdAt).format('dddd Do ha');
  vm.lastCheckin = lastCheckin;
  vm.sentimentData = {};
  vm.sentimentData.responses = [];
  vm.lastCheckin.questions.forEach(function (q, id) {
    vm.lastResponse.lastResponse.response.forEach(function (r, idx) {
      if (r.type === q.type && id === idx) {
        vm.sentimentData.responses.push({
          'question': q.question,
          'response': r.response,
          'type': r.type
        });
      }
    });
  });
  $log.debug(vm.sentimentData);
}
