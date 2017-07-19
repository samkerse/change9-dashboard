var angular = require('angular');
var login = require('./login');
var loginDirective = require('./loginDirective');

var loginModule = 'loginModule';

module.exports = loginModule;

angular
    .module(loginModule, [])
    .component('login', login)
    .directive('moveOnMax', loginDirective);
