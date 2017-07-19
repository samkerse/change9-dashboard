module.exports = {
  template: require('./createSchedule.html'),
  controller: createScheduleController
};

function createScheduleController($log, moment, $stateParams, apiFactory, ngDialog, _, segment) {
  var vm = this;
  vm.create = false;
  $log.debug("Create your schedule");
  vm.questions = [];
  vm.scheduleData = {};
  vm.days = {};
  vm.addQuestion = function () {
    vm.questions.push({
      'question': '',
      'type': 'slider'
    });
  };
  vm.checkValid = function (array) {
    var validQuestions = array.filter(function (user, idx) {
      if ((user.question && user.type) && (user.question !== null && user.type !== null)) {
        return user;
      }
    });
    return validQuestions;
  };
  vm.createGroupWithSchedule = function () {
    vm.create = true;
    segment.track("Created new schedule");
    vm.questions = vm.checkValid(vm.questions);
    $log.debug(vm.questions);
    // Call Scheduler either with id or create a new one
    var groups = [];
    switch (vm.scheduleData.type) {
      case "daily": {
        if (vm.scheduleData.day === 'weekday') {
          var days = [1, 2, 3, 4, 5];
        }
        else if (vm.scheduleData.day === 'every') {
          var days = [0, 1, 2, 3, 4, 5, 6];
        }
        var time = moment(vm.scheduleData.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'name': vm.scheduleData.scheduleName,
          'type': vm.scheduleData.type,
          'detail': {
            'days': days,
            'time': time,
            'questions': vm.questions
          },
          'groups': groups,
          'initiativeId': $stateParams.id
        };
        $log.debug("scheduleData", scheduleData);
        apiFactory.createSchedule(scheduleData).then(function (data) {
          vm.create = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          vm.message = "Error in scheduling";
          ngDialog.close();
        });
        break;
      }
      case "weekly": {
        $log.debug("now", moment().format("HH:mm:Z"));
        var days = [];
        for (var key in vm.days) {
          var day = parseInt(key.match(/\d+/)[0]);
          days.push(day);
        }
        days = _.sortBy(days);
        $log.debug("days", days);
        var time = moment(vm.scheduleData.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'name': vm.scheduleData.scheduleName,
          'type': vm.scheduleData.type,
          'detail': {
            'days': days,
            'time': time,
            'questions': vm.questions
          },
          'groups': groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(scheduleData);
        apiFactory.createSchedule(scheduleData).then(function (data) {
          vm.create = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          ngDialog.close();
          vm.message = "Error in scheduling";
        });
        break;
      }
      case "monthly": {
        var time = moment(vm.scheduleData.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'name': vm.scheduleData.scheduleName,
          'type': vm.scheduleData.type,
          'detail': {
            'day': vm.scheduleData.day,
            'time': time,
            'questions': vm.questions
          },
          'groups': groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(scheduleData);
        apiFactory.createSchedule(scheduleData).then(function (data) {
          vm.create = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          ngDialog.close();
          vm.message = "Error in scheduling";
        });
        break;
      }
      default: break;
    }
  };
}
