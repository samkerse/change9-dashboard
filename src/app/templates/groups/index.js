var angular = require('angular');
var groups = require('./groups');
var groupsModule = 'groupsModule';

module.exports = groupsModule;

angular
  .module(groupsModule, [])
  .component('groups', groups);

