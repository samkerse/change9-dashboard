module.exports = {
  template: require('./editSchedule.html'),
  controller: editScheduleController
};

function editScheduleController($log, schedule, apiFactory, ngDialog, moment, $stateParams, segment, _) {
  $log.debug("Edit Schedule Controller", schedule);
  var vm = this;
  vm.update = false;
  vm.days = {
    'day1': '',
    'day2': '',
    'day3': '',
    'day4': '',
    'day5': '',
    'day6': '',
    'day0': '',
  };
  vm.schedule = schedule;
  if (vm.schedule.detail.days) {
    if (vm.schedule.detail.days.length === 5) {
      vm.schedule.detail.day = 'weekday';
    }
    else if (vm.schedule.detail.days.length === 7) {
      vm.schedule.detail.day = 'every';
    }
  }
  if (vm.schedule.detail.time) {
    vm.time = vm.schedule.detail.time.split(":");
    vm.schedule.time = new Date(1970, 0, 1, vm.time[0], vm.time[1], 0);
  }
  if (vm.schedule.detail.date) {
    var splitDate = vm.schedule.detail.date.split("T");
    $log.debug(splitDate);
    vm.schedule.day = splitDate[0];
    vm.time = splitDate[1].split(":");
    vm.schedule.time = new Date(1970, 0, 1, vm.time[0], vm.time[1], 0);
    vm.schedule.questions = vm.schedule.detail.questions;
  }
  if (vm.schedule.detail.days) {
    vm.schedule.detail.days.map(function (day) {
      for (var key in vm.days) {
        if (parseInt(key.replace(/^\D+/g, '')) === day) {
          vm.days[key] = true;
        }
      }
    });
  }
  vm.addQuestion = function () {
    vm.schedule.questions.push({
      'question': '',
      'type': 'slider'
    });
  };
  vm.checkValid = function (array) {
    var validQuestions = array.filter(function (user, idx) {
      if (!_.isEmpty(user)) {
        if ((user.question && user.type) && (user.question !== null && user.type !== null)) {
          return user;
        }
      }
    });
    return validQuestions;
  };
  // Update Schedule
  vm.updateSchedule = function () {
    segment.track("Updated schedule");
    vm.update = true;
    // Call Scheduler either with id or create a new one
    var groups = [];
    vm.schedule.questions = vm.checkValid(vm.schedule.questions);
    switch (vm.schedule.type) {
      case "daily": {
        if (vm.schedule.detail.day === 'weekday') {
          var days = [1, 2, 3, 4, 5];
        }
        else if (vm.schedule.detail.day === 'every') {
          var days = [0, 1, 2, 3, 4, 5, 6];
        }
        var time = moment(vm.schedule.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'id': vm.schedule._id.toString(),
          'type': vm.schedule.type,
          'name': vm.schedule.name,
          'active': vm.schedule.active,
          'detail': {
            'days': days,
            'time': time,
            'questions': vm.schedule.questions
          },
          'groups': vm.schedule.groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(scheduleData);
        apiFactory.updateSchedule(scheduleData).then(function (data) {
          vm.update = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          vm.message = "Error in scheduling";
          ngDialog.close();
        });
        break;
      }
      case "weekly": {
        var days = [];
        for (var key in vm.days) {
          $log.debug(vm.days[key]);
          if (vm.days[key] === true) {
            var day = parseInt(key.match(/\d+/)[0]);
            days.push(day);
          }
        }
        var time = moment(vm.schedule.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'id': vm.schedule._id.toString(),
          'type': vm.schedule.type,
          'name': vm.schedule.name,
          'active': vm.schedule.active,
          'detail': {
            'days': days,
            'time': time,
            'questions': vm.schedule.questions
          },
          'groups': vm.schedule.groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(JSON.stringify(scheduleData));
        apiFactory.updateSchedule(scheduleData).then(function (data) {
          vm.update = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          ngDialog.close();
          vm.message = "Error in scheduling";
        });
        break;
      }
      case "monthly": {
        var time = moment(vm.schedule.time).format("HH:mm") + ":" + moment().format("Z");
        var scheduleData = {
          'id': vm.schedule._id.toString(),
          'type': vm.schedule.type,
          'name': vm.schedule.name,
          'active': vm.schedule.active,
          'detail': {
            'day': vm.schedule.day,
            'time': time,
            'questions': vm.schedule.questions
          },
          'groups': vm.schedule.groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(scheduleData);
        apiFactory.updateSchedule(scheduleData).then(function (data) {
          vm.update = false;
          ngDialog.close();
          $log.debug(data);
        }, function (err) {
          ngDialog.close();
          vm.message = "Error in scheduling";
        });
        break;
      }
      case "touchpoint": {
        var time = moment(vm.schedule.time).format("HH:mm:ss") + moment().format("Z");
        var requestDate = vm.schedule.day + "T" + time;
        $log.debug(requestDate);
        var scheduleData = {
          'id': vm.schedule._id.toString(),
          'type': vm.schedule.type,
          'name': vm.schedule.name,
          'active': vm.schedule.active,
          'detail': {
            'date': requestDate,
            'questions': vm.schedule.questions
          },
          'groups': vm.schedule.groups,
          'initiativeId': $stateParams.id
        };
        $log.debug(scheduleData);
        apiFactory.updateSchedule(scheduleData).then(function (data) {
          vm.update = false;
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
