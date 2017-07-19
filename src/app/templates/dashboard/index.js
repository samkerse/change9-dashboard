var angular = require('angular');
var dashboard = require('./dashboard');
var dashboardModule = 'dashboardModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = dashboardModule;

angular
    .module(dashboardModule, [])
    .component('dashboard', dashboard)
    .controller('createInitiativeController', createInitiativeController.controller);
