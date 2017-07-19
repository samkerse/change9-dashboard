var angular = require('angular');
var initiatives = require('./initiatives');
var initiativesModule = 'initiativesModule';

var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = initiativesModule;

angular
  .module(initiativesModule, [])
  .component('initiatives', initiatives)
  .controller('createInitiativeController', createInitiativeController.controller);

