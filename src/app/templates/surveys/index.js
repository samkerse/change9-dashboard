var angular = require('angular');
var surveys = require('./surveys');
var surveysModule = 'surveysModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = surveysModule;

angular
    .module(surveysModule, [])
    .component('surveys', surveys)
    .controller('createInitiativeController', createInitiativeController.controller);
