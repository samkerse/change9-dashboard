module.exports = {
  template: require('./editGroup.html'),
  controller: editGroupController
};

function editGroupController($log, group, $stateParams, apiFactory, schedules, groups, ngDialog, moment, segment, _) {
  $log.debug("Edit Group Controller");
  var vm = this;
  vm.update = false;
  vm.groupData = group;
  $log.debug(vm.groupData.managers);
  vm.questions = [];
  vm.scheduleData = schedules;
  vm.secondaryTable = group.schedules;
  var setDropdownOptions = function () {
    $log.debug("All :", schedules, "Table : ", group.schedules);
    vm.schedulesNotAdded = schedules;
    vm.allUnscheduledSchedules = [];
    if (vm.secondaryTable) {
      vm.allUnscheduledSchedules = vm.secondaryTable.forEach(function (schedule) {
        if (typeof schedule !== 'undefined' || schedule) {
          vm.schedulesNotAdded = _.reject(vm.schedulesNotAdded, { '_id': schedule._id });
        }
      });
      vm.scheduleOptions = [];
      vm.schedulesNotAdded.map(function (obj) {
        vm.scheduleOptions.push({
          'id': obj._id,
          'name': obj.name
        });
      });
    }
    else {
      if (schedules.length === 0) {
        vm.scheduleOptions = [{
          'id': 0,
          'name': 'Create New Schedule'
        }];
      }
      else {
        if (schedules) {
          vm.scheduleOptions = [{
            'id': 0,
            'name': 'Create New Schedule'
          }];
          schedules.forEach(function (s) {
            vm.scheduleOptions.push({
              'id': s._id,
              'name': s.name
            });
          });
          vm.groupData.scheduleModal = vm.scheduleOptions[1].id;
          $log.debug("no schedules", vm.groupData.scheduleModal);
        }
      }
    }
  };
  setDropdownOptions();
  vm.addSchedule = function () {
    if (!vm.secondaryTable)
      vm.secondaryTable = [];
    if (typeof vm.groupData.scheduleModal !== 'undefined')
      vm.secondaryTable.push(_.find(schedules, { '_id': vm.groupData.scheduleModal }));
    $log.debug(vm.secondaryTable);
    setDropdownOptions();
    vm.changed = true;
  };
  // Set Permissions to Manager
  group.permissions.forEach(function (group) {
    vm.groupData.managers.forEach(function (m) {
      if (m._id === group.manager)
        m.permission = group.permission;
    });
  });
  vm.addManager = function () {
    if (!vm.groupData.managers) {
      vm.groupData.managers = [];
    }
    vm.groupData.managers.push({
      'permission': 'view'
    });
  };
  vm.addUser = function () {
    if (!vm.groupData.users) {
      vm.groupData.users = [];
    }
    vm.groupData.users.push({});
  };
  vm.addQuestion = function () {
    vm.questions.push({
      'question': '',
      'type': 'slider'
    });
  };
  if (group) {
    vm.managers = group.managers;
    vm.users = vm.groupData.users;
  }
  $log.debug("group", group);
  vm.checkValid = function (array) {
    if (typeof array === undefined || typeof array === 'undefined') {
      return [];
    }
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
  vm.updateGroupWithExistingSchedule = function () {
    vm.update = true;
    var details = JSON.parse(apiFactory.getKey('details'));
    segment.track(details.name + " updates group with existing schedule");
    var orgName = apiFactory.getKey('org');
    var orgId = JSON.parse(apiFactory.getKey('details'));
    var validUsers = vm.checkValid(vm.groupData.users);
    var validManagers = vm.checkValid(vm.groupData.managers);
    var groupData = {
      'id': vm.groupData._id,
      'name': vm.groupData.name,
      'initiativeId': $stateParams.id,
      'managers': validManagers,
      'users': validUsers,
      'organisation': orgName,
      'organisationId': orgId.organisationId
    };
    $log.debug(groupData, vm.groupData.schedule);
    apiFactory.updateGroup(groupData).then(function (data) {
      $log.debug(data);
      var count = 0;
      vm.secondaryTable.forEach(function (s) {
        count++;
        var groupIds = s.groups;
        groupIds.push(vm.groupData._id.toString());
        apiFactory.updateScheduleGroups(s._id, groupIds).then(function (data) {
          $log.debug(data);
          if (count === vm.secondaryTable.length) {
            vm.update = false;
            ngDialog.close();
          }
        }, function (err) {
          $log.debug("Schedule error", err);
        });
      });
    }, function (err) {
      vm.message = "Error Updating Group";
    });
  };

  vm.updateGroupWithNewSchedule = function () {
    vm.update = true;
    $log.debug(vm.groupData.scheduleModal);
    var details = JSON.parse(apiFactory.getKey('details'));
    var orgName = apiFactory.getKey('org');
    var orgId = JSON.parse(apiFactory.getKey('details'));
    segment.track(details.name + " updates group with a new schedule");
    var validUsers = vm.checkValid(vm.groupData.users);
    var validManagers = vm.checkValid(vm.groupData.managers);
    vm.questions = vm.checkValidQuestions(vm.questions);
    var groupData = {
      'id': vm.groupData._id,
      'name': vm.groupData.name,
      'initiativeId': $stateParams.id,
      'managers': validManagers,
      'users': validUsers,
      'organisation': orgName,
      'organisationId': orgId.organisationId
    };
    $log.debug(groupData, vm.groupData.schedule);
    apiFactory.updateGroup(groupData).then(function (data) {
      $log.debug("created group", data);
      // Call Scheduler either with id or create a new one
      var groups = [];
      groups.push(data.data._id);
      switch (vm.scheduleData.type) {
        case "daily": {
          var time = moment(vm.scheduleData.time).format("HH:mm");
          if (vm.scheduleData.day === 'weekday') {
            var days = [1, 2, 3, 4, 5];
          }
          else if (vm.scheduleData.day === 'every') {
            var days = [0, 1, 2, 3, 4, 5, 6];
          }
          var scheduleData = {
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
            var day = parseInt(key.match(/\d+/)[0]);
            days.push(day);
          }
          var time = moment(vm.scheduleData.time).format("HH:mm");
          var scheduleData = {
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
          var time = moment(vm.scheduleData.time).format("HH:mm");
          var scheduleData = {
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
    }, function (err) {
      vm.message = err.message;
    });
  };
}
