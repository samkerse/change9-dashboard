var angular = require('angular');
var createInitiative = require('./createInitiative');
var createInitiativeModule = 'createInitiativeModule';

module.exports = createInitiativeModule;

angular
  .module(createInitiativeModule, [])
  .component('createInitiative', createInitiative);

