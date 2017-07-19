var angular = require('angular');
var initiative = require('./initiative');
var initiativedModule = 'initiativedModule';
var groupModalController = require('../modal/group/group');
var groupDirective = require('../modal/group/groupDirective');
var viewMemberModalController = require('../modal/viewGroupMembers/viewGroupMembers');
var viewTrendsController = require('../modal/viewTrends/viewTrends');
var viewGroupScheduleController = require('../modal/viewGroupSchedules/viewGroupSchedules');
var createScheduleController = require('../modal/createSchedule/createSchedule');
var viewScheduleController = require('../modal/viewSchedule/viewSchedule');
var editGroupController = require('../modal/editGroup/editGroup');
var editScheduleController = require('../modal/editSchedule/editSchedule');

module.exports = initiativedModule;

angular
    .module(initiativedModule, [])
    .component('initiative', initiative)
    .controller('groupModalController', groupModalController.controller)
    .controller('viewMemberModalController', viewMemberModalController.controller)
    .controller('viewGroupScheduleController', viewGroupScheduleController.controller)
    .controller('createScheduleController', createScheduleController.controller)
    .controller('viewScheduleController', viewScheduleController.controller)
    .controller('viewTrendsController', viewTrendsController.controller)
    .controller('editGroupController', editGroupController.controller)
    .controller('editScheduleController', editScheduleController.controller)
    .directive('divChange', groupDirective);
