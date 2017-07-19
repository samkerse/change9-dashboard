var angular = require('angular');
var register = require('./register');
var pinDirective = require('../login/loginDirective');
var registerModule = 'registerModule';

module.exports = registerModule;

angular
    .module(registerModule, [])
    .component('register', register)
    .directive('moveOnMax', pinDirective);
