var angular = require('angular');
var error = require('./error');

var errorModule = 'erroModule';

module.exports = errorModule;

angular
    .module(errorModule, [])
    .component('error', error);
