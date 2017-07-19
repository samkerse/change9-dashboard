var angular = require('angular');
var addPin = require('./addPin');
var loginDirective = require('../login/loginDirective');

var addPinModule = 'addPinModule';

module.exports = addPinModule;

angular
  .module(addPinModule, [])
  .component('addPin', addPin)
  .directive('moveOnMax', loginDirective);
