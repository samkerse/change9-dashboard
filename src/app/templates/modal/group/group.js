module.exports = {
  template: require('./group.html'),
  controller: groupModalController
};

function groupModalController($log, apiFactory, moment, ngDialog, $stateParams, schedules, groups, _, segment) {
  var vm = this;
  vm.createWith = false;
  vm.createWithout = false;
  vm.groupData = {};
  vm.managers = [];
  vm.users = [];
  vm.questions = [];
  vm.scheduleData = {};
  vm.days = {};
  //  vm.scheduleData.time = "12:00";
  //  vm.managers[0] = {};
  //  vm.users[0] = {};
  //  vm.questions[0] = {
  //    'type': 'slider'
  //  };
  vm.schedules = schedules;
  vm.scheduleOptions = [{
    'id': 0,
    'name': 'Create a new schedule'
  }];
  vm.schedules.map(function (obj) {
    vm.scheduleOptions.push({
      'id': obj._id,
      'name': obj.name
    });
  });
  $log.debug(vm.scheduleOptions);
  vm.addManager = function () {
    vm.managers.push({});
  };
  vm.addUser = function () {
    vm.users.push({});
  };
  vm.addQuestion = function () {
    vm.questions.push({
      'question': '',
      'type': 'slider'
    });
  };
  // Paste from excel
  vm.pasteExcel = function (text, array) {
    if (array[0].permission) {
      var type = "manager";
    }
    var count = array.length - 1;
    $log.debug(count);
    var rows = text.name.split("\n");
    rows.forEach(function (r, i) {
      var user = r.split("\t");
      if (type === "manager") {
        array[count] = {
          'name': user[0],
          'email': user[1],
          'permission': 'view'
        };
      }
      else {
        array[count] = {
          'name': user[0],
          'email': user[1]
        };
      }
      count++;
    });
  };
  // Remove Managers/Users
  vm.removeFromArray = function (array, idx) {
    array.splice(idx, 1);
    $log.debug(array);
  };
  vm.checkValid = function (array) {
    var validUsers = array.filter(function (user, idx) {
      if ((user.email && user.name) && (user.email !== null && user.name !== null)) {
        return user;
      }
    });
    return validUsers;
  };
  vm.checkValidQuestions = function (array) {
    var validQuestions = array.filter(function (user, idx) {
      if (!_.isEmpty(user)) {
        if ((user.question && user.type) && (user.question !== null && user.type !== null)) {
          return user;
        }
      }
    });
    return validQuestions;
  };
  vm.createGroupWithSchedule = function () {
    vm.createWith = true;
    var details = JSON.parse(apiFactory.getKey('details'));
    segment.track(details.name + " creates group with existing schedule");
    var orgName = apiFactory.getKey('org');
    var orgId = JSON.parse(apiFactory.getKey('details'));
    var validUsers = vm.checkValid(vm.users);
    var validManagers = vm.checkValid(vm.managers);
    var groupData = {
      'groupName': vm.groupData.groupName,
      'initiativeId': $stateParams.id,
      'managers': validManagers,
      'users': validUsers,
      'organisation': orgName,
      'organisationId': orgId.organisationId
    };
    $log.debug(groupData, vm.groupData.schedule);
    var allGroups = groups.filter(function (group) {
      if (group.schedule)
        return group.schedule._id === vm.groupData.schedule;
    });
    var groupIds = allGroups.map(function (group) {
      return group._id;
    });
    apiFactory.createGroup(groupData).then(function (data) {
      $log.debug("created group", data);
      // Call Scheduler either with id or create a new one
      groupIds.push(data.data._id);
      $log.debug(groupIds);
      apiFactory.updateScheduleGroups(vm.groupData.schedule, groupIds).then(function (data) {
        vm.createWith = false;
        $log.debug(data);
        ngDialog.close();
      }, function (err) {
        $log.debug("Schedule error", err);
      });
    }, function (err) {
      vm.message = err.message;
    });
  };
  vm.createGroupWithoutSchedule = function () {
    vm.createWithout = true;
    var orgName = apiFactory.getKey('org');
    var orgId = JSON.parse(apiFactory.getKey('details'));
    segment.track(orgId.name + " creates group with a new schedule");
    var validUsers = vm.checkValid(vm.users);
    var validManagers = vm.checkValid(vm.managers);
    vm.questions = vm.checkValidQuestions(vm.questions);
    var groupData = {
      'groupName': vm.groupData.groupName,
      'initiativeId': $stateParams.id,
      'managers': validManagers,
      'users': validUsers,
      'organisation': orgName,
      'organisationId': orgId.organisationId
    };
    apiFactory.createGroup(groupData).then(function (data) {
      $log.debug("created group", data);
      // Call Scheduler either with id or create a new one
      var groups = [];
      groups.push(data.data._id);
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
          $log.debug(scheduleData);
          apiFactory.createSchedule(scheduleData).then(function (data) {
            vm.createWithout = false;
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
            vm.createWithout = false;
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
            vm.createWithout = false;
            ngDialog.close();
            $log.debug(data);
          }, function (err) {
            ngDialog.close();
            vm.message = "Error in scheduling";
          });
          break;
        }
        case "touchpoint": {
          var time = moment(vm.scheduleData.time).format("HH:mm:ss") + moment().format("Z");
          var requestDate = vm.scheduleData.day + "T" + time;
          var scheduleData = {
            'name': vm.scheduleData.scheduleName,
            'type': vm.scheduleData.type,
            'detail': {
              'date': requestDate,
              'questions': vm.questions
            },
            'groups': groups,
            'initiativeId': $stateParams.id
          };
          $log.debug(scheduleData);
          apiFactory.createSchedule(scheduleData).then(function (data) {
            vm.createWithout = false;
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
    }, function (err) {
      vm.message = err.message;
    });
  };
}
