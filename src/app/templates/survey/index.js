var angular = require('angular');
var survey = require('./survey');
var surveyModule = 'surveyModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = surveyModule;

angular
    .module(surveyModule, [])
    .component('survey', survey)
    .controller('createInitiativeController', createInitiativeController.controller);
