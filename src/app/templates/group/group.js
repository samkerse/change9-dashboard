module.exports = {
  template: require('./group.html'),
  controller: groupController
};
var responseHTML = require('../modal/responses/responses.html');
var groupMemberHTML = require('../modal/addGroupMembers/addGroupMembers.html');
var viewSentimentHTML = require('../modal/viewSentiment/viewSentiment.html');
var editGroupMemberHTML = require('../modal/editGroupMember/editGroupMember.html');
var createCustomCheckinHTML = require('../modal/createCustomCheckin/createCustomCheckin.html');
function groupController($log, ngDialog, $stateParams, apiFactory, _, chunk, moment, segment, pageProperties) {
  var vm = this;
  var pos = [];
  var neg = [];
  var avg = [];
  vm.data = [];
  vm.emptyData = [
    [56, 25, 48, 72, 60],
    [14, 50, 12, 18, 25],
    [30, 25, 40, 10, 15]
  ];
  vm.toggleFilter = false;
  vm.labels = [];
  vm.groupData = {};
  vm.filter = {
    "sort": "checkin",
    "members": [],
    "range": {}
  };
  vm.filterDefaults = {
    "sort": [],
    "members": [],
    "range": []
  };
  vm.filterDefaults.sort = [
    { "label": "Days", "value": "day" },
    { "label": "Weeks", "value": "week" },
    { "label": "Months", "value": "month" },
    { "label": "Each Check-in", "value": "checkin" }
  ];
  $log.debug("Hello initiative");
  vm.options = {
    "defaultFontFamily": "'Open Sans'",
    "defaultFontStyle": "100",
    "legend": {
      "display": true,
      "position": "bottom",
      "fontStyle": 100
    },
    "maintainAspectRatio": false,
    "elements": {
      "line": {
        "tension": 0.3,
        "fill": false
      }
    },
    "scales": {
      "xAxes": [{
        "gridLines": {
          "display": false,
          "color": "rgba(255,255,255,0)",
        },
        "ticks": {
          "maxRotation": 0
        }
      }],
      "yAxes": [{
        "stacked": true,
        "ticks": {
          "max": 100,
          "beginAtZero": true,
          "maxTicksLimit": 2
        },
        "gridLines": {
          "display": false,
          "color": "rgba(255,255,255,0)",
        },
        "position": "left"
      }]
    },
    "animate": false,
    "hover": {
      "mode": "nearest",
      "intersect": false
    },
    "title": {
      "display": false
    },
    "responsive": true
  };
  vm.override = [{
    "pointHoverBorderColor": "#fff",
    "label": "Negative Sentiment",
    "pointHoverBackgroundColor": "rgba(223,124,95,1)",
    "fill": true,
    "borderWidth": 1,
    "pointHoverRadius": 5,
    "pointHoverBorderWidth": 2,
    "borderColor": "#edeff0",
    "backgroundColor": "rgba(233,163,143,1)",
    "pointBackgroundColor": "rgba(223,124,95,1)",
    "pointBorderWidth": 2
  }, {
    "pointHoverBorderColor": "#fff",
    "label": "Neutral Sentiment",
    "pointHoverBackgroundColor": "rgba(252,180,21,1)",
    "fill": true,
    "borderWidth": 1,
    "pointHoverRadius": 5,
    "pointHoverBorderWidth": 2,
    "borderColor": "#edeff0",
    "backgroundColor": "rgba(254,203,91,1)",
    "pointBackgroundColor": "rgba(252,180,21,1)",
    "pointBorderWidth": 2
  }, {
    "pointHoverBorderColor": "#fff",
    "label": "Positive Sentiment",
    "pointHoverBackgroundColor": "rgba(111,184,76,1)",
    "fill": true,
    "borderWidth": 1,
    "pointHoverRadius": 5,
    "pointHoverBorderWidth": 2,
    "borderColor": "#edeff0",
    "backgroundColor": "rgba(154,206,129,1)",
    "pointBackgroundColor": "rgba(111,184,76,1)",
    "pointBorderWidth": 2
  }];

  vm.openResponsesModal = function (responses, questions) {
    segment.track('View All Checkin Responses Modal', {
      'type': 'View Modal'
    });
    ngDialog.open({
      template: responseHTML,
      plain: true,
      controller: 'responseModalController',
      controllerAs: 'vm',
      resolve: {
        responses: function () {
          return responses;
        },
        users: function () {
          return vm.groupData.users;
        },
        questions: function () {
          return questions;
        },
        isPrivate: function () {
          return vm.private;
        }
      }
    });
  };

  vm.addGroupMember = function () {
    ngDialog.open({
      template: groupMemberHTML,
      plain: true,
      controller: 'groupMemberModalController',
      controllerAs: 'vm'
    });
  };
  vm.viewSentiment = function (lastResponse) {
    segment.track('Open individual response modal', {
      'type': 'View Modal'
    });
    ngDialog.open({
      template: viewSentimentHTML,
      plain: true,
      controller: 'viewSentimentController',
      controllerAs: 'vm',
      resolve: {
        lastResponse: function () {
          return lastResponse;
        },
        lastCheckin: function () {
          return vm.groupData.checkins[vm.groupData.checkins.length - 1];
        },
        isPrivate: function () {
          return vm.private;
        }
      }
    });
  };
  vm.editGroupMember = function (user) {
    $log.debug(user);
    ngDialog.open({
      template: editGroupMemberHTML,
      plain: true,
      controller: 'editGroupMemberController',
      controllerAs: 'vm',
      resolve: {
        user: function () {
          return user;
        },
        groupId: function () {
          return $stateParams.id;
        }
      }
    });
  };
  vm.createCustomCheckin = function () {
    ngDialog.open({
      template: createCustomCheckinHTML,
      plain: true,
      controller: 'createCustomCheckinController',
      controllerAs: 'vm'
    });
  };
  vm.getOneGroupData = function () {
    apiFactory.setKey('pageLoaded', 'false');
    apiFactory.getOneGroup($stateParams.id).then(function (group) {
      apiFactory.setKey('pageLoaded', 'true');
      vm.groupData.groupInfo = group.data.groupInfo;
      // set page properties
      vm.page = pageProperties;
      vm.page.type = "group";
      vm.page.current = vm.groupData.groupInfo.name;
      // segment tracker
      segment.page('Group', vm.groupData.groupInfo.name, {
        'name': vm.groupData.groupInfo.name
      });
      var details = JSON.parse(apiFactory.getKey('details'));
      // Give logged in manager edit priviliges if he created init
      details.initiatives.forEach(function (init) {
        if (init === vm.groupData.groupInfo.initiativeId) {
          vm.permission = 'edit';
        }
      });
      var loggedInManager = JSON.parse(apiFactory.getKey('details'))._id;
      vm.groupData.responses = group.data.responses;
      if (vm.groupData.responses.length !== 0)
        vm.setGraph();
      // Check if manager has private priviliges
      vm.groupData.groupInfo.permissions.forEach(function (perm) {
        if (perm.manager === loggedInManager && perm.permission === 'private') {
          $log.debug("Here");
          vm.private = true;
        }
      });
      $log.debug("Secure", vm.private);
      vm.groupData.checkins = group.data.checkins;
      vm.groupData.responses = group.data.responses;
      vm.groupData.users = group.data.users;
      vm.groupInfo = group.data.groupInfo;
      if (vm.groupData.users.length === 0) {
        vm.noUserData = true;
      }
      else {
        vm.noUserData = false;
      }
      if (vm.groupData.responses.length === 0) {
        vm.noResponseData = true;
      }
      else {
        vm.noResponseData = false;
      }
      if (vm.groupData.checkins.length === 0) {
        vm.noCheckinData = true;
      }
      else {
        vm.noCheckinData = false;
      }
      // Data for checkin table
      vm.groupData.checkins.forEach(function (checkin) {
        var sentiment = 0;
        checkin.createdAt = moment(checkin.createdAt).format('Do MMM hA');
        var responses = _.filter(vm.groupData.responses, function (r) {
          return r.checkinId === checkin._id;
        });
        checkin.responses = responses;
        responses.forEach(function (r) {
          sentiment += r.sentiment;
        });
        checkin.sentiment = Math.round((sentiment / responses.length) * 10) / 10;
        $log.debug(checkin.responses);
      });
      // data for users table
      vm.filterDefaults.range.start = vm.groupData.responses[0].createdAt;
      vm.filterDefaults.range.end = vm.groupData.responses[vm.groupData.responses.length - 1].createdAt;
      vm.groupData.users.forEach(function (user) {
        vm.filterDefaults.members.push({
          "label": user.name,
          "value": user._id
        });
        var responses = _.filter(vm.groupData.responses, function (r) {
          return r.userId === user._id;
        });

        user.engagement = Math.round((responses.length / vm.groupData.checkins.length) * 100);
        var lastResponse = responses[responses.length - 1];
        user.lastResponse = lastResponse;
        if (user.lastResponse)
          user.lastResponse.sentiment = Math.round((user.lastResponse.sentiment * 10)) / 10;
      });
    }, function (err) {
      vm.error = "Error opening the group";
    });
  };
  vm.setGraph = function () {
    vm.data = [];
    $log.debug("chained responses", vm.groupData.responses);
    segment.track('Clicked Filter Graph', {
      'filters': {
        'members': vm.filter.members,
        'sort': vm.filter.sort,
        'range': vm.filter.range
      }
    });
    // chain filters
    var filterResponses = _
      .chain(vm.groupData.responses)
      .filter(function (res) {
        if (vm.filter.members.length !== 0) {
          return _.includes(vm.filter.members, res.userId);
        }
        return true;
      })
      .filter(function (res) {
        var date = moment(res.createdAt);
        var start = moment(vm.filter.range.start, "MMM D, YYYY");
        var end = moment(vm.filter.range.end, "MMM D, YYYY");
        return moment(date).isBetween(start, end, 'day', '[]');
      })
      .value();
    //    $log.debug("responses", filterResponses);
    var initialData = {};
    var groupedBy = filterResponses.map(function (response) {
      if (vm.filter.sort === 'day') {
        var dateKey = moment(response.createdAt).format('Do MMM YY');
        if (dateKey in initialData) {
          initialData[dateKey].sentiment.push(Number(response.sentiment.toFixed(2)));
        } else {
          initialData[dateKey] = { 'sentiment': [Number(response.sentiment.toFixed(2))], 'label': dateKey };
        }
      } else if (vm.filter.sort === 'month') {
        var dateKey = moment(response.createdAt).format('MMM YY');
        if (dateKey in initialData) {
          initialData[dateKey].sentiment.push(Number(response.sentiment.toFixed(2)));
        } else {
          initialData[dateKey] = { 'sentiment': [Number(response.sentiment.toFixed(2))], 'label': dateKey };
        }
      } else if (vm.filter.sort === 'week') {
        var dateKey = 'Week ' + moment(response.createdAt).format('w gggg');
        if (dateKey in initialData) {
          initialData[dateKey].sentiment.push(Number(response.sentiment.toFixed(2)));
        } else {
          initialData[dateKey] = { 'sentiment': [Number(response.sentiment.toFixed(2))], 'label': dateKey };
        }
      } else if (vm.filter.sort === 'checkin') {
        var dateKey = moment(response.createdAt).format('Do MMM YY');
        var checkinid = response.checkinId.toString();
        if (checkinid in initialData) {
          initialData[checkinid].sentiment.push(Number(response.sentiment.toFixed(2)));
        } else {
          initialData[checkinid] = { 'sentiment': [Number(response.sentiment.toFixed(2))], 'label': dateKey };
        }
      }
    });
    $log.debug("toggle", vm.toggleFilter);
    //    $log.debug("initialData", initialData);
    var pos = [];
    var neg = [];
    var neu = [];
    var labels = [];
    var graphData = _.mapValues(initialData, function (value) {
      labels.push(value.label);
      var totalLength = value.sentiment.length;
      // positive percent
      var posArr = value.sentiment;
      var posLength = _.remove(posArr, function (value) {
        return value >= 5;
      }).length;
      pos.push(Math.round(posLength / totalLength * 100));
      // neutral percent
      var neuArr = value.sentiment;
      var neuLength = _.remove(neuArr, function (value) {
        return value < 5 && value > 3;
      }).length;
      neu.push(Math.round(neuLength / totalLength * 100));
      // negative percent
      var negArr = value.sentiment;
      var negLength = _.remove(negArr, function (value) {
        return value <= 3;
      }).length;
      neg.push(Math.round(negLength / totalLength * 100));
    });
    vm.labels = labels;
    vm.data.push(neg, neu, pos);
    vm.toggleFilter = false;
  };
}
