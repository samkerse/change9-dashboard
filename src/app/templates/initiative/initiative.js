module.exports = {
  template: require('./initiative.html'),
  controller: initiativeController
};
var groupHTML = require('../modal/group/group.html');
var viewGroupMembersHTML = require('../modal/viewGroupMembers/viewGroupMembers.html');
var createScheduleHTML = require('../modal/createSchedule/createSchedule.html');
var viewScheduleHTML = require('../modal/viewSchedule/viewSchedule.html');
var editGroupHTML = require('../modal/editGroup/editGroup.html');
var editScheduleHTML = require('../modal/editSchedule/editSchedule.html');
var viewGroupScheduleHTML = require('../modal/viewGroupSchedules/viewGroupSchedules.html');
var viewTrendsHTML = require('../modal/viewTrends/viewTrends.html');
function initiativeController(ngDialog, apiFactory, $stateParams, $log, _, chunk, moment, $state, segment, pageProperties) {
  //  $log.debug(keyword);
  var vm = this;
  vm.emptyData = [
    [56, 25, 48, 72, 60],
    [14, 50, 12, 18, 25],
    [30, 25, 40, 10, 15]
  ];
  vm.filter = false;
  vm.noData = false;
  vm.initData = {};
  vm.filter = {
    "sort": "day",
    "groups": [],
    "schedules": [],
    "range": {}
  };
  vm.filterDefaults = {
    "sort": [],
    "groups": [],
    "schedules": [],
    "range": []
  };
  vm.filterDefaults.sort = [
    { "label": "Days", "value": "day" },
    { "label": "Weeks", "value": "week" },
    { "label": "Months", "value": "month" },
    { "label": "Each Check-in", "value": "checkin" }
  ];
  vm.bubbleCursor = true;
  var pos = [];
  var neg = [];
  var avg = [];
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
  vm.openNgDialogComponent = function openNgDialogComponent() {
    ngDialog.open({
      template: groupHTML,
      plain: true,
      controller: 'groupModalController',
      className: 'ngdialog-theme-default',
      controllerAs: "vm",
      width: '660px',
      resolve: {
        schedules: function () {
          return vm.initData.schedules;
        },
        groups: function () {
          return vm.initData.groups;
        }
      }
    });
  };
  vm.viewGroupMembers = function (users, group) {
    ngDialog.open({
      template: viewGroupMembersHTML,
      plain: true,
      controller: 'viewMemberModalController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      resolve: {
        users: function () {
          return users;
        },
        groupId: function () {
          return group._id;
        }
      },
      width: '660px'
    });
  };
  vm.createSchedule = function () {
    segment.track('View Create Schedule Modal', {
      'type': 'Create Modal'
    });
    ngDialog.open({
      template: createScheduleHTML,
      plain: true,
      controller: 'createScheduleController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      width: '660px'
    });
  };
  vm.viewSchedule = function () {
    ngDialog.open({
      template: viewScheduleHTML,
      plain: true,
      controller: 'viewScheduleController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      width: '660px'
    });
  };
  vm.viewTrends = function () {
    segment.track('Open Trends Modal', {
      'type': 'View Modal'
    });
    ngDialog.open({
      template: viewTrendsHTML,
      plain: true,
      controller: 'viewTrendsController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      width: '660px',
      resolve: {
        trends: function () {
          return vm.initData.trends;
        }
      }
    });
  };
  vm.editGroup = function (group) {
    segment.track('Open Edit Group Modal', {
      'type': 'Edit Modal'
    });
    ngDialog.open({
      template: editGroupHTML,
      plain: true,
      controller: 'editGroupController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      width: '660px',
      resolve: {
        group: function () {
          return group;
        },
        schedules: function () {
          return vm.initData.schedules;
        },
        groups: function () {
          return vm.initData.groups;
        }
      }
    });
  };
  vm.editSchedule = function (schedule) {
    segment.track('Open Edit Schedule Modal', {
      'type': 'Edit Modal'
    });
    ngDialog.open({
      template: editScheduleHTML,
      plain: true,
      controller: 'editScheduleController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      width: '660px',
      resolve: {
        schedule: function () {
          return schedule;
        }
      }
    });
  };
  vm.viewGroupSchedules = function (scheduleId, groups) {
    segment.track('Open Schedule Groups Modal', {
      'type': 'View Modal',
      'location': 'Initiative Schedules'
    });
    ngDialog.open({
      template: viewGroupScheduleHTML,
      plain: true,
      controller: 'viewGroupScheduleController',
      className: 'ngDialog-theme-default',
      controllerAs: 'vm',
      resolve: {
        allGroups: function () {
          return vm.initData.groups;
        },
        scheduleGroups: function () {
          return groups;
        },
        scheduleId: function () {
          return scheduleId;
        }
      },
      width: '660px'
    });
  };

  vm.getOneInitiativeData = function () {
    apiFactory.setKey('pageLoaded', 'false');
    apiFactory.getOneInitiative($stateParams.id).then(function (initiative) {
      apiFactory.setKey('pageLoaded', 'true');
      if (initiative.data.errorMessage) {
        $state.reload();
      }
      vm.initData.responses = initiative.data.responses;
      if (!('questions' in initiative.data)) {
        initiative.data.questions = {};
      }
      vm.initData.initiative = initiative.data.initiative;
      vm.initData.schedules = initiative.data.schedules;
      vm.initData.groups = initiative.data.groups;
      vm.initData.checkins = initiative.data.checkins;
      vm.initData.questions = initiative.data.questions;
      vm.initData.trends = initiative.data.trends;
      // set page properties
      vm.page = pageProperties;
      vm.page.type = "initiative";
      vm.page.initiative = {};
      vm.page.initiative.id = vm.initData.initiative._id.toString();
      vm.page.initiative.name = vm.initData.initiative.name;
      vm.page.initiative.groups = vm.initData.groups;
      $log.debug("groups", vm.page.initiative.groups);
      vm.page.current = vm.initData.initiative.name;
      // Track Page View
      segment.page('Initiative', vm.initData.initiative.name, {
        'name': vm.initData.initiative.name
      });
      if (vm.initData.responses.length !== 0) {
        vm.noResponseData = false;
      }
      else {
        vm.noResponseData = true;
      }
      if (vm.initData.schedules.length !== 0) {
        vm.noSchedules = false;
        vm.initData.schedules.forEach(function (s) {
          vm.filterDefaults.schedules.push({
            "label": s.name,
            "value": s._id
          });
        });
      }
      else {
        vm.noSchedules = true;
      }
      if (vm.initData.groups.length === 0) {
        vm.noGroupData = true;
      }
      else {
        vm.noGroupData = false;
      }
      if (Object.keys(vm.initData.questions).length !== 0) {
        vm.noQuestions = false;
      }
      else {
        vm.noQuestions = true;
      }
      // set date filter start and end date
      if (vm.initData.responses.length !== 0) {
        //        vm.getInitiativeChartData(vm.initData.responses, 'day');
        //        vm.filter.sort = "day";
        vm.filterDefaults.range.start = vm.initData.responses[0].createdAt;
        vm.filterDefaults.range.end = vm.initData.responses[vm.initData.responses.length - 1].createdAt;
        vm.filter.range.start = moment(vm.filterDefaults.range.start).format('MMM D, YYYY');
        vm.filter.range.end = moment(vm.filterDefaults.range.end).format('MMM D, YYYY');
        vm.setGraph();
      }
      vm.initData.groups.map(function (group) {
        vm.filterDefaults.groups.push({
          "label": group.name,
          "value": group._id
        });
        // find all managers in a group
        initiative.data.managers.map(function (m) {
          if (_.includes(m.groups, group._id)) {
            if (!group.managers && !group.managerNames) {
              group.managerNames = '';
              group.managers = [];
              group.managers.push(m);
              group.managerNames += m.name;
            }
            else {
              group.managers.push(m);
              group.managerNames += ',' + (m.name);
            }
          }
        });
        // find all members in a group
        initiative.data.users.map(function (u) {
          if (_.includes(u.groups, group._id)) {
            if (!group.userCount) {
              group.userCount = 0;
              group.userCount++;
            }
            else {
              group.userCount++;
            }
            if (!group.users) {
              group.users = [];
              group.users.push(u);
            }
            else {
              group.users.push(u);
            }
          }
        });
        // find all schedules for a group
        initiative.data.schedules.map(function (s) {
          if (_.includes(s.groups, group._id)) {
            if (!group.schedules) {
              group.schedules = [];
              group.schedules.push(s);
            }
            else {
              group.schedules.push(s);
            }
          }
        });
      });
      $log.debug(vm.initData.groups);
      vm.bubble = {};
      var bubbleCursorVar = false;
      vm.bubbleHover = function (a, b, c, d, e) {
        $log.debug(a, b, c, d, e);
        if (a.length > 0) {
          // $log.debug("true");
          bubbleCursorVar = true;
          $log.debug(vm.bubbleCursor);
        } else {
          bubbleCursorVar = false;
          $log.debug(vm.bubbleCursor);
          // $log.debug("false");
        }
      };
      vm.bubbleCursor = bubbleCursorVar;
      vm.toggleBubbleFilter = false;
      vm.bubble.options = {
        "showAllTooltips": vm.toggleBubbleFilter,
        "chartArea": {
          "backgroundColor": "#dce1e7"
        },
        "responsive": true,
        "onClick": vm.openGroup(),
        "tooltips": {
          "enabled": true,
          "mode": "single",
          "backgroundColor": "#445663",
          "bodyFontFamily": "Open Sans",
          "bodyFontStyle": "100",
          "footerMarginTop": 10,
          "titleMarginBottom": 0,
          "callbacks": {
            "label": function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label + " : " + data.datasets[tooltipItem.datasetIndex].data[0].r / 2 + " members";
              return label;
            }
          }
        },
        "maintainAspectRatio": false,
        "elements": {
          "points": {
            "backgroundColor": "#6fb94c"
          }
        },
        "legend": {
          "display": false,
          "position": "right",
          "labels": {
            "fontColor": "rgba(74, 94, 111, 0.8)",
            "fontFamily": "Open Sans",
            "boxWidth": 20,
            "usePointStyle": true,
            "padding": 20
          }
        },
        "scales": {
          "xAxes": [{
            "display": true,
            "gridLines": {
              "color": "rgba(74, 94, 111, 0.1)",
              "tickMarkLength": 0,
              "zeroLineColor": "rgba(74, 94, 111, 0.4)"
            },
            "scaleLabel": {
              "labelString": "Sentiment",
              "display": true,
              "fontColor": "rgba(74, 94, 111, 0.8)"
            },
            "ticks": {
              "max": 100,
              "min": 0,
              "stepSize": 50,
              "fontFamily": '"Material Icons"',
              "padding": 100,
              "fontSize": 0,
              "fontColor": "rgba(74, 94, 111, 0.8)"
            },
            "afterTickToLabelConversion": function (scale) {
              scale.ticks.forEach(function (tick, i) {
                scale.ticks[i] = '';
              });
            }
          }],
          "yAxes": [{
            "display": true,
            "gridLines": {
              "color": "rgba(74, 94, 111, 0.1)",
              "tickMarkLength": 0,
              "zeroLineColor": "rgba(74, 94, 111, 0.4)"
            },
            "scaleLabel": {
              "labelString": "Response Rate",
              "display": true,
              "fontColor": "rgba(74, 94, 111, 0.8)"
            },
            "ticks": {
              "max": 100,
              "min": 0,
              "stepSize": 50,
              "fontColor": "rgba(74, 94, 111, 0.8)"
            },
            "afterTickToLabelConversion": function (scale) {
              scale.ticks.forEach(function (tick, i) {
                scale.ticks[i] += '%';
              });
            }
          }]
        }
      };
      vm.bubble.dataset = [];
      vm.bubble.data = vm.initData.groups.map(function (group, index) {
        if (_.findLast(vm.initData.responses, { "groupId": group._id }))
          var lastCheckinId = _.findLast(vm.initData.responses, { "groupId": group._id }).checkinId;
        var lastCheckinResponses = _.filter(vm.initData.responses, { "checkinId": lastCheckinId, "groupId": group._id });
        if ('users' in group) {
          group.y = lastCheckinResponses.length / group.users.length * 100;
        } else {
          group.y = 0;
          group.r = 0;
          group.x = 0;
          return [group];
        }
        var sentimentArray = lastCheckinResponses.map(function (response) {
          return response.sentiment;
        });
        var sentiment = 0;
        for (var i = 0; i < sentimentArray.length; i++) {
          sentiment += sentimentArray[i];
        }
        var avg = sentiment / sentimentArray.length;
        group.x = (avg - 1) * (100 / 6);
        group.r = group.userCount * 2;
        var colour = "";
        if (group.x >= 66) {
          colour = "rgba(111, 185, 76, 0.75)";
        } else if (group.x < 33) {
          colour = "rgba(224, 124, 95, 0.75)";
        } else {
          colour = "rgba(253, 181, 21, 0.75)";
        }
        vm.bubble.dataset.push({
          "label": group.name,
          "backgroundColor": colour,
          "borderColor": colour,
          "borderWidth": 1
        });
        return [group];
      });
    });
  };
  vm.openGroup = function (points, evt, element) {
    if (element) {
      var groupId = element._chart.config.data.datasets[element._datasetIndex].data[0]._id;
      segment.track('Clicked Group on Bubble Chart', {
        'name': element._chart.config.data.datasets[element._datasetIndex].data[0].name
      });
      $state.go('app.group', {
        'id': groupId
      });
    }
  };
  vm.toggleSchedule = function (scheduleId, toggleType, index) {
    $log.debug("scheduleId", scheduleId);
    $log.debug("toggleType", toggleType);
    $log.debug("index", index);
    $log.debug(vm.initData.schedules[index]);
    vm.initData.schedules[index].active = "cached";
    apiFactory.toggleSchedule(scheduleId, toggleType).then(function (data) {
      vm.initData.schedules[index].active = toggleType;
      segment.track('Toggled Schedule', {
        'state': vm.initData.schedules[index].active
      });
    }, function (err) { });
  };
  vm.reviewedTrend = function (index) {
    segment.track('Clicked Review Trend', { 'trend': vm.initData.trends[index] });
    $log.debug("switching trend", index);
    $log.debug("this trend", vm.initData.trends[index]);
    //    vm.initData.trends[index].actionTaken = 'You marked this trend as Reviewed';
    vm.initData.trends[index].display = false;
    apiFactory.updateTrend({ "id": vm.initData.trends[index]._id, "action": "You marked this trend as Reviewed" }).then(function (data) {
      segment.track('Reviewed Trend', { 'trend': vm.initData.trends[index] });
      $log.debug("successfully toggled trend", data);
      //      vm.initData.schedules[index].active = toggleType;
    }, function (err) { });
  };
  vm.undoReviewedTrend = function (index) {
    $log.debug("reverting");
    segment.track('Clicked Toggle Trend Modal', {
      'trend': vm.initData.trends[index]
    });
    vm.initData.trends[index].display = true;
    apiFactory.updateTrend({ "id": vm.initData.trends[index]._id, "action": "" }).then(function (data) {
      segment.track('Toggled Trend', { 'trend': vm.initData.trends[index] });
      $log.debug("successfully toggled trend", data);
      //      vm.initData.schedules[index].active = toggleType;
    }, function (err) { });
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
  vm.setGraph = function () {
    segment.track('Clicked Filter Graph', {
      'filters': {
        'schedules': vm.filter.schedules,
        'groups': vm.filter.groups,
        'sort': vm.filter.sort,
        'range': vm.filter.range
      }
    });
    vm.data = [];
    var scheduleToCheckinIds = [];
    // if no schedules selected, set the checkinid array to all
    if (vm.filter.schedules.length === 0) {
      var a = _.map(vm.initData.checkins, function (checkin) {
        scheduleToCheckinIds.push(checkin._id.toString());
      });
    } else {
      // else set checkinid array to only the selected schedules
      var filteredCheckins = _.filter(vm.initData.checkins, function (checkin) {
        return _.includes(vm.filter.schedules, checkin.scheduleId);
      });
      var a = _.map(filteredCheckins, function (checkin) {
        scheduleToCheckinIds.push(checkin._id.toString());
      });
    }
    $log.debug("chained responses", vm.initData.responses);
    // chain filters
    var filterResponses = _
      .chain(vm.initData.responses)
      .filter(function (res) {
        if (vm.filter.groups.length !== 0) {
          return _.includes(vm.filter.groups, res.groupId);
        }
        return true;
      })
      .filter(function (res) {
        if (scheduleToCheckinIds !== 0) {
          return _.includes(scheduleToCheckinIds, res.checkinId);
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
