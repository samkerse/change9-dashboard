var angular = require('angular');
var newSurvey = require('./newSurvey');
var newSurveyModule = 'newSurveyModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = newSurveyModule;

angular
    .module(newSurveyModule, [])
    .component('newSurvey', newSurvey)
    .controller('createInitiativeController', createInitiativeController.controller);
