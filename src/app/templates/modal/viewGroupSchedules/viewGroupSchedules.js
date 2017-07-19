module.exports = {
  template: require('./viewGroupSchedules.html'),
  controller: viewGroupScheduleController
};

function viewGroupScheduleController($log, allGroups, scheduleGroups, scheduleId, apiFactory, moment, ngDialog, _, segment) {
  var vm = this;
  vm.edit = false;
  vm.changed = false;
  vm.allGroups = allGroups;
  vm.scheduleGroups = scheduleGroups;
  vm.tableGroups = _.map(scheduleGroups, function (groupId) {
    return _.find(allGroups, { '_id': groupId });
  });
  vm.secondaryTable = vm.tableGroups;
  $log.debug('secondaryTable', vm.secondaryTable);
  var setDropdownOptions = function () {
    vm.groupsNotScheduled = vm.allGroups;
    vm.allUnscheduledGroups = [];
    vm.allUnscheduledGroups = vm.secondaryTable.forEach(function (group) {
      if (typeof group !== 'undefined' || group) {
        vm.groupsNotScheduled = _.reject(vm.groupsNotScheduled, { '_id': group._id });
      }
    });
    vm.groupOptions = [];
    vm.groupsNotScheduled.map(function (obj) {
      vm.groupOptions.push({
        'id': obj._id,
        'name': obj.name
      });
    });
  };
  setDropdownOptions();
  vm.removeGroup = function (index) {
    vm.secondaryTable.splice(index, 1);
    setDropdownOptions();
    vm.changed = true;
    segment.track('Removed Group From Schedule');
    $log.debug('secondary table', vm.secondaryTable);
  };
  vm.addGroup = function () {
    vm.secondaryTable.push(_.find(allGroups, { '_id': vm.groupData }));
    segment.track('Added Group To Schedule');
    setDropdownOptions();
    vm.changed = true;
  };
  vm.confirmChanges = function () {
    vm.edit = true;
    var groupIds = _.map(vm.secondaryTable, function (group) {
      return group._id;
    });
    $log.debug("groupIds", groupIds);
    apiFactory.updateScheduleGroups(scheduleId, groupIds).then(function (data) {
      segment.track('Saved Changes To Schedule');
      vm.edit = false;
      ngDialog.close();
    }, function (err) {
      $log.debug(err);
    });
  };
}
