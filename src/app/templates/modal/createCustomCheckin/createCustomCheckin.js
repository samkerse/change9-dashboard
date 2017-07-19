module.exports = {
  template: require('./createCustomCheckin.html'),
  controller: createCustomCheckinController
};

function createCustomCheckinController($log, apiFactory, ngDialog, $stateParams) {
  var vm = this;
  vm.create = false;
  vm.questions = [];
  vm.scheduleData = {};
  vm.addQuestion = function () {
    vm.questions.push({
      'question': '',
      'type': 'slider'
    });
  };
  $log.debug('createCustomCheckinController');
  vm.createCustomCheckin = function () {
    vm.create = true;
    $log.debug("Hey");
    var date = (vm.scheduleData.date);
    var time = vm.scheduleData.time;
    var groups = [];
    groups.push($stateParams.id);
    var touchpointDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()).toISOString();
    var data = {
      type: "touchpoints",
      detail: {
        "touchpoints": [{
          "touchpoint": {
            "questions": vm.questions,
            "date": touchpointDate
          }
        }]
      },
      groups: groups
    };
    apiFactory.createSchedule(data).then(function (data) {
      vm.create = false;
      ngDialog.close();
      $log.debug(data);
    }, function (err) {
      $log.debug(err);
    });
  };
}
