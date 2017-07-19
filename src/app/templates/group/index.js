var angular = require('angular');
var group = require('./group');
var responseController = require('../modal/responses/responses');
var groupMemberController = require('../modal/addGroupMembers/addGroupMembers');
var editGroupMemberController = require('../modal/editGroupMember/editGroupMember');
var viewSentimentController = require('../modal/viewSentiment/viewSentiment');
var createCustomCheckinController = require('../modal/createCustomCheckin/createCustomCheckin');
var groupModule = 'groupModule';

module.exports = groupModule;

angular
    .module(groupModule, [])
    .component('group', group)
    .controller('responseModalController', responseController.controller)
    .controller('groupMemberModalController', groupMemberController.controller)
    .controller('editGroupMemberController', editGroupMemberController.controller)
    .controller('viewSentimentController', viewSentimentController.controller)
    .controller('createCustomCheckinController', createCustomCheckinController.controller);

