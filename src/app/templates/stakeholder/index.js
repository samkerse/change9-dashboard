var angular = require('angular');
var stakeholder = require('./stakeholder');
var stakeholderModule = 'stakeholderModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = stakeholderModule;

angular
    .module(stakeholderModule, [])
    .component('stakeholder', stakeholder)
    .controller('createInitiativeController', createInitiativeController.controller);
