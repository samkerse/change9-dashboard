var angular = require('angular');
var group = require('./group/group');
var responses = require('./responses/responses');
var addGroupMembers = require('./addGroupMembers/addGroupMembers');
var viewGroupMembers = require('./viewGroupMembers/viewGroupMembers');
var createSchedule = require('./createSchedule/createSchedule');
var viewSchedule = require('./viewSchedule/viewSchedule');
var viewGroupSchedule = require('./viewGroupSchedules/viewGroupSchedules');
var editGroup = require('./editGroup/editGroup');
var editSchedule = require('./editSchedule/editSchedule');
var viewSentiment = require('./viewSentiment/viewSentiment');
var viewTrends = require('./viewTrends/viewTrends');
var createCustomCheckin = require('./createCustomCheckin/createCustomCheckin');
var createInitiative = require('./createInitiative/createInitiative');
var editGroupMember = require('./editGroupMember/editGroupMember');
var modalModule = 'modalModule';
module.exports = modalModule;

angular
    .module(modalModule, [])
    .component('group-modal', group)
    .component('responses-modal', responses)
    .component('group-members', addGroupMembers)
    .component('view-group-members', viewGroupMembers)
    .component('view-group-schedule', viewGroupSchedule)
    .component('create-schedule', createSchedule)
    .component('view-schedule', viewSchedule)
    .component('edit-group', editGroup)
    .component('edit-schedule', editSchedule)
    .component('view-sentiment', viewSentiment)
    .component('create-custom-checkin', createCustomCheckin)
    .component('create-initiative', createInitiative)
    .component('edit-group-member', editGroupMember)
    .component('view-trends', editGroupMember);
