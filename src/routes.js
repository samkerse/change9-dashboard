module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('');
  $urlRouterProvider.otherwise('/app/dashboard');
  $stateProvider
    .state('login', {
      url: '/login',
      component: 'app'
    })
    .state('login.default', {
      url: '/default',
      component: 'login'
    })
    .state('login.input', {
      url: '/input',
      component: 'input2'
    })
    .state('login.register', {
      url: '/register',
      component: 'register'
    })
    .state('login.addPin', {
      url: '/pin?userId&email',
      component: 'addPin'
    })
    .state('app', {
      url: '/app',
      component: 'app',
      ncyBreadcrumb: {
        label: 'Home'
      }
    })
    .state('app.dashboard', {
      url: '/dashboard',
      component: 'dashboard',
      ncyBreadcrumb: {
        label: 'Dashboard'
      }
    })
    .state('app.conversations', {
      url: '/conversations',
      component: 'conversations',
      ncyBreadcrumb: {
        label: 'Conversations'
      }
    })
    .state('app.surveys', {
      url: '/surveys',
      component: 'surveys',
      ncyBreadcrumb: {
        label: 'Surveys'
      }
    })
    .state('app.newSurvey', {
      url: '/survey/new',
      component: 'newSurvey',
      ncyBreadcrumb: {
        label: 'New Survey'
      }
    })
    .state('app.survey', {
      url: '/survey/:id',
      component: 'survey',
      ncyBreadcrumb: {
        label: 'Survey'
      }
    })
    .state('app.initiative', {
      url: '/initiative/:id',
      component: 'initiative',
      ncyBreadcrumb: {
        label: 'Initiative'
      }
    })
    .state('app.stakeholder', {
      url: '/stakeholder/:id',
      component: 'stakeholder',
      ncyBreadcrumb: {
        label: 'Stakeholder'
      }
    })
    .state('app.initiatives', {
      url: '/initiatives',
      component: 'initiatives',
      ncyBreadcrumb: {
        label: 'Initiatives'
      }
    })
    .state('app.group', {
      url: '/group/:id',
      component: 'group',
      ncyBreadcrumb: {
        label: 'Initiative'
      }
    })
    .state('app.groups', {
      url: '/groups',
      component: 'groups',
      ncyBreadcrumb: {
        label: 'Groups'
      }
    });
}
