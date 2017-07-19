var angular = require('angular');
var input = require('./input');
var inputDirective = require('./inputDirective');

var inputModule = 'inputModule';

module.exports = inputModule;

angular
  .module(inputModule, [])
  .component('input2', input)
  .directive('moveOnMax', inputDirective);
