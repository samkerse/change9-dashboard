var angular = require('angular');
require('angular-ui-router');
require('angular-ladda');
require('angular-chart.js');
require('ng-dialog');
require('lodash');
var chunk = require('chunk-date-range');
var moment = require('moment');
var seedrandom = require('seedrandom');
require('ng-content-editable');
require('angular-loading-bar');
require('angular-segment-analytics');
require('angular-tooltips');
require('angular-selector');
require('quill');
require('ng-quill');
require('angular-truncate-2');
require('angularjs-datepicker');
require('angularjs-scroll-glue');
// Internal Dependencies
var loginModule = require('./app/templates/login/index');
var inputModule = require('./app/templates/input/index');
var errorModule = require('./app/templates/global/error/index');
var registerModule = require('./app/templates/register/index');
var dashboardModule = require('./app/templates/dashboard/index');
var stakeholderModule = require('./app/templates/stakeholder/index');
var surveysModule = require('./app/templates/surveys/index');
var newSurveyModule = require('./app/templates/newSurvey/index');
var surveyModule = require('./app/templates/survey/index');
var conversationsModule = require('./app/templates/conversations/index');
var initiativeModule = require('./app/templates/initiative/index');
var groupModule = require('./app/templates/group/index');
var modalModule = require('./app/templates/modal/index');
var initiativesModule = require('./app/templates/initiatives/index');
var groupsModule = require('./app/templates/groups/index');
var addPinModule = require('./app/templates/addPin/index');
// Factories
var apiFactory = require('./app/services/apis');
var loginFactory = require('./app/services/loginFactory');
var pageProperties = require('./app/services/pageProperties');
var routesConfig = require('./routes');
// Components
var main = require('./app/templates/global/main/main');
var banner = require('./app/templates/global/banner/banner');
var sidebar = require('./app/templates/sidebar/sidebar');
var logo = require('./app/templates/global/logo/logo');
var header = require('./app/templates/global/header/header');
// Directives
var setFocus = require('./app/templates/modal/group/focusDirective.js');
require('./index.css');
var prod;

angular
  .module('app', [loginModule, registerModule, errorModule, dashboardModule, stakeholderModule, surveysModule, conversationsModule, surveyModule, newSurveyModule, initiativeModule, groupModule, initiativesModule, groupsModule, modalModule, addPinModule, inputModule, 'ui.router', 'angular-ladda', 'ngQuill', 'chart.js', 'ngDialog', 'content-editable', 'angular-loading-bar', 'luegg.directives', 'ngSegment', '720kb.tooltips', '720kb.datepicker', 'selector', 'truncate'])
  .constant('_', window._)
  .constant('chunk', chunk)
  .constant('moment', moment)
  .constant('seedrandom', seedrandom)
  .config(function (segmentProvider, $windowProvider) {
    // var $window = $windowProvider.$get();
    // if ($window.location.hostname !== 'localhost') {
    //   segmentProvider
    //     .setKey('uK4JcapwgPT01nq5Wmr1rOW3D24BzRKP')
    //     .setDebug(true);
    // }
  })
  .config(routesConfig)
  .config(function ($logProvider) {
    $logProvider.debugEnabled(true);
  })
  .component('app', main)
  .component('banner', banner)
  .component('sidebar', sidebar)
  .component('logo', logo)
  .component('header', header)
  .service('pageProperties', pageProperties)
  .factory('apiFactory', apiFactory)
  .factory('loginFactory', loginFactory)
  .directive('setFocus', setFocus)
  .config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.spinnerTemplate = '<div class="container light" style="height: 100%;position: absolute;"><div class="loader"><span>Loading...</span><ul class="clouds"><li class="cloud"></li><li class="cloud"></li><li class="cloud"></li><li class="cloud"></li><li class="cloud"></li><li class="cloud"></li><li class="cloud"></li></ul></div></div>';
  })
  .config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
    var toolbarModules = {
      toolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }], // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
        // [{ 'direction': 'rtl' }], // text direction
        // [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
        // [{ 'font': [] }],
        [{ 'align': [] }],
        // ['clean'], // remove formatting button
        ['link', 'image', 'video']                         // link and image, video
      ]
    };
    ngQuillConfigProvider.set({
      modules: toolbarModules
    });
  }])
  .run(function ($transitions, $log, apiFactory, moment, $state) {
    $transitions.onSuccess({
      to: function (state) {
        return state.data !== null;
      }
    }, function (trans) {
      // var halfHourLate = moment(apiFactory.getKey('loggedIn')).add(30, 'm');
      // var now = moment();
      // if (halfHourLate.isSameOrBefore(now, 'minute')) {
      //   apiFactory.setKey('token', '');
      //   apiFactory.setKey('loggedIn', '');
      //   $state.go('login.default');
      // }
      // else {
      //   $log.debug("Boohoo");
      //   $log.debug("state", $state);
      // }
    });
  })
  .run(function ($transitions, $rootScope, segment, segmentLoader, apiFactory, $log, $window) {
    $transitions.onStart({}, function (trans) {
      // var userDetails = JSON.parse(apiFactory.getKey('details'));
      // if ($window.location.hostname !== 'localhost') {
      //   if (userDetails) {
      //     segment.identify(userDetails._id, userDetails);
      //   }
      // }
    });
  });
