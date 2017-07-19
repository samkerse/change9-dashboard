var angular = require('angular');
var conversations = require('./conversations');
var conversationsModule = 'conversationsModule';
var createInitiativeController = require('../modal/createInitiative/createInitiative');
module.exports = conversationsModule;

angular
    .module(conversationsModule, [])
    .component('conversations', conversations)
    .controller('createInitiativeController', createInitiativeController.controller);
