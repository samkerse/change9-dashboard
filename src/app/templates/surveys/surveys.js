module.exports = {
  template: require('./surveys.html'),
  controller: surveysController
};
var createInitiativeHTML = require('../modal/createInitiative/createInitiative.html');
function surveysController($log, loginFactory, apiFactory, _, $state, segment, ngDialog, pageProperties, moment) {
  var vm = this;
  vm.page = pageProperties;
  vm.page.type = "Surveys";
  $log.debug("Hello dashboard");
  segment.page('Dashboard');
  vm.sentimentData = [];
  vm.engagementData = [];
  vm.emptyEngagementData = [100, 90, 70, 63, 67, 85];
  vm.emptySentimentData = [53, 67, 72, 65, 81, 84];
  vm.labels = ["6 Weeks Ago", "5 Weeks Ago", "4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "Last Week"];
  vm.options = {
    "legend": {
      "display": false
    },
    "layout": {
      "padding": 20
    },
    "maintainAspectRatio": false,
    "elements": {
      "line": {
        "tension": 0.3,
        "fill": false
      }
    },
    "tooltips": {
      "enabled": false
    },
    "scales": {
      "xAxes": [{
        "display": false,
        "gridLines": {
          "tickMarkLength": 0
        },
        "ticks": {
          "display": false
        }
      }],
      "yAxes": [{
        "display": false,
        "gridLines": {
          "tickMarkLength": 0
        },
        "ticks": {
          "display": false
        }
      }]
    },
    "animate": false,
    "title": {
      "display": false
    },
    "responsive": true
  };
  vm.pie = {};
  vm.pie.labels = ["Positive", "Neutral", "Negative"];
  vm.pie.options = {
    "legend": {
      "display": true,
      "position": "right",
      "fontStyle": 100
    }
  };
  vm.pie.dataset = {
    "backgroundColor": ["rgba(111, 185, 76, 0.75)", "rgba(253, 181, 21, 0.75)", "rgba(224, 124, 95, 0.75)"],
    "hoverBackgroundColor": ["#6fb94c", "#fdb515", "#e75c34"],
    "hoverBorderColor": ["#6fb94c", "#fdb515", "#e75c34"],
    "borderColor": "#edf0f5",
    "borderWidth": 2,
    "labelColor": "white",
    "labelFontSize": '16'
  };
  var groupLastCheckinIds = {};
  var plotBubbleChart = function (dbInfo) {
    // bubble chart data
    var groupProcessCheckinIds = dbInfo.data.responses.map(function (res) {
      var groupName = _.find(dbInfo.data.groups, ['_id', res.groupId]).name;
      groupLastCheckinIds[res.groupId] = {
        "checkinId": res.checkinId,
        "name": groupName,
        "lastResponse": res.createdAt
      };
    });
    vm.bubble = {};
    vm.bubble.data = [];
    vm.bubble.override = {
      "label": [],
      "backgroundColor": [],
      "borderColor": [],
      "borderWidth": 1
    };
    var processBubbleData = _.mapKeys(groupLastCheckinIds, function (group, groupId) {
      var userCount = _.filter(dbInfo.data.users, function (user) {
        if (user.groups.indexOf(groupId) > -1) {
          return true;
        }
        return false;
      }).length;
      var data = {};
      var responses = _.map((_.filter(dbInfo.data.responses, ['checkinId', group.checkinId])), function (res) {
        return res.sentiment;
      });
      groupLastCheckinIds[groupId].sentiment = Math.round(_.sum(responses) / responses.length);
      data.y = Math.round(responses.length / userCount * 100);
      data.x = ((_.sum(responses) / responses.length) - 1) / 6 * 100;
      data.r = userCount * 2;
      vm.bubble.data.push(data);
      var colour = "";
      if (group.x >= 66) {
        colour = "rgba(111, 185, 76, 0.75)";
        groupLastCheckinIds[groupId].colour = "green-bg";
      } else if (group.x < 33) {
        colour = "rgba(224, 124, 95, 0.75)";
        groupLastCheckinIds[groupId].colour = "red-bg";
      } else {
        colour = "rgba(253, 181, 21, 0.75)";
        groupLastCheckinIds[groupId].colour = "yellow-bg";
      }
      vm.bubble.override.label.push(group.name);
      vm.bubble.override.backgroundColor.push(colour);
      vm.bubble.override.borderColor.push(colour);
    });
    vm.bubble.options = {
      "chartArea": {
        "backgroundColor": "#dce1e7"
      },
      "responsive": true,
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
  };
  vm.line = {};
  vm.line.dataset = [{
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
  vm.line.options = {
    "spanGaps": true,
    "defaultFontFamily": "'Open Sans'",
    "defaultFontStyle": "100",
    "legend": {
      "display": false,
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
          "color": "rgba(255,255,255,0)"
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
          "color": "rgba(255,255,255,0)"
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
  // Get manager information post login
  vm.getManagerInfo = function () {
    vm.managerInfo = loginFactory.getData();
    $log.debug(vm.managerInfo);
  };
//  // Get DB Metrics
//  vm.getDashboardMetrics = function () {
//    apiFactory.getDashboardMetrics().then(function (data) {
//      if (data.data.errorMessage) {
//        $state.reload();
//      }
//      if (_.isEmpty(data.data[0][1])) {
//        vm.noSentiment = true;
//      }
//      if (_.isEmpty(data.data[1])) {
//        vm.noEngagement = true;
//      }
//      else {
//        vm.noSentiment = false;
//        vm.noEngagement = false;
//        $log.debug("db data", data.data);
//        var dbData = data.data[0][1];
//        var resData = data.data[1];
//        // Response Data
//        for (var key in dbData) {
//          var result = Math.round((dbData[key] / 7) * 100);
//          vm.sentimentData.push(result);
//        }
//        // Engagement Data
//        for (var key in resData) {
//          if (resData[key] > 1)
//            resData[key] = 1;
//          if (resData[key])
//            var result = (resData[key]).toFixed(1) * 100;
//          vm.engagementData.push(result);
//        }
//      }
//    }, function (err) {
//      $log.debug(err);
//    });
//  };
  var plotKeywordCharts = function (dbInfo) {
    vm.bar = {};
    vm.bar.series = ["Positive", "Negative"];
    vm.bar.dataset = [
      {
        "backgroundColor": "rgba(111, 185, 76, 0.75)",
        "hoverBackgroundColor": "#6fb94c",
        "hoverBorderColor": "#6fb94c",
        "borderWidth": 0
      },
      {
        "backgroundColor": "rgba(224, 124, 95, 0.75)",
        "hoverBackgroundColor": "#e75c34",
        "hoverBorderColor": "#e75c34",
        "borderWidth": 0
      }
    ];
    vm.bar.options = {
      "maintainAspectRatio": false,
      "responsive": true,
      "scales": {
        "xAxes": [{
          "barPercentage": 1,
          "ticks": {
            "display": false
          },
          "gridLines": {
            "display": false,
            "zeroLineWidth": 0,
            "zeroLineColor": "rgba(0, 0, 0, 0)",
            "drawBorder": false
          }
        }],
        "yAxes": [{
          "barPercentage": 1,
          "gridLines": {
            "display": false,
            "zeroLineWidth": 0,
            "zeroLineColor": "rgba(0, 0, 0, 0)",
            "drawBorder": false
          }
        }]
      }
    };
    var searchTerms = [];
    var labels = _.map(dbInfo.data.keywords, function (keywordObj) {
      searchTerms.push(keywordObj.term);
      return keywordObj.term + " (" + keywordObj.tf + ")";
    });
    vm.bar.labels1 = labels.slice(0, 3);
    vm.bar.labels2 = labels.slice(4);
    vm.bar.data = [
      [45, 50, 80],
      [-20, -35, -5]
    ];
    var commentSentiment = [];
    var processRes = _.map(dbInfo.data.responses, function (res) {
      var processResDetails = _.map(res.response, function (response) {
        if (response.type === "comment") {
          commentSentiment.push({
            "comment": response.response,
            "sentiment": res.sentiment
          });
        }
      });
    });
    var pos1 = [];
    var neg1 = [];
    var pos2 = [];
    var neg2 = [];
    var processSearch1 = _.map(searchTerms.slice(0, 3), function (term) {
      var results = _.filter(commentSentiment, function (c) {
        if (c.comment.indexOf(term) > -1) {
          return true;
        }
        return false;
      });
      $log.debug("results", results);
      var posSentiment = 1;
      posSentiment = _.filter(results, function (o) {
        return o.sentiment >= 5;
      }).length;
      var negSentiment = -1;
      negSentiment = _.filter(results, function (o) {
        return o.sentiment < 3;
      }).length;
      pos1.push(posSentiment / results.length * 100);
      neg1.push(negSentiment / results.length * -100);
    });
    var processSearch2 = _.map(searchTerms.slice(4), function (term) {
      var results = _.filter(commentSentiment, function (c) {
        if (c.comment.indexOf(term) > -1) {
          return true;
        }
        return false;
      });
      $log.debug("results", results);
      var posSentiment = 1;
      posSentiment = _.filter(results, function (o) {
        return o.sentiment >= 5;
      }).length;
      var negSentiment = -1;
      negSentiment = _.filter(results, function (o) {
        return o.sentiment < 3;
      }).length;
      pos2.push(posSentiment / results.length * 100);
      neg2.push(negSentiment / results.length * -100);
    });
    vm.bar.data1 = [pos1, neg1];
    vm.bar.data2 = [pos2, neg2];
    $log.debug("bar", vm.bar, dbInfo.data.keywords, commentSentiment);
  };

//  vm.bar.labels = ["really great (7)", "meetings (4)", "event (2)"];
//  vm.bar.dataset = {
//    "backgroundColor": ["rgba(111, 185, 76, 0.75)", "rgba(224, 124, 95, 0.75)"],
//    "hoverBackgroundColor": ["#6fb94c", "#e75c34"],
//    "hoverBorderColor": ["#6fb94c", "#e75c34"],
//    "borderWidth": 0
//  };
  // Get DB info
  vm.getDashboardInfo = function () {
    apiFactory.getDashboardInfo().then(function (dbInfo) {
      vm.initiativeList = dbInfo.data.initiatives;
      var processInitiative = vm.initiativeList.map(function (initiative, index) {
        var lastResponseObj = _.findLast(dbInfo.data.responses, ['initiativeId', initiative._id]);
        if (lastResponseObj !== undefined) {
          vm.initiativeList[index].lastResponse = moment(lastResponseObj.createdAt).fromNow();
        }
        else vm.initiativeList[index].lastResponse = "Over 6 weeks ago";
      });
      $log.debug("initiatives", vm.initiativeList);
      vm.groupList = dbInfo.data.groups;
      var lastResponseTime = "over 6 weeks ago";
      if (dbInfo.data.responses.length > 0) {
        lastResponseTime = moment(dbInfo.data.responses[dbInfo.data.responses.length - 1].createdAt).fromNow();
      }
      vm.page.timeago = lastResponseTime;
      var stakeholderSentiment = {};
      var peopleSentiment = dbInfo.data.responses.map(function (response) {
        stakeholderSentiment[response.userId] = response.sentiment;
      });
      $log.debug("people sentiment", stakeholderSentiment);
      var pos = 0;
      var neu = 0;
      var neg = 0;
      var peopleLoop = _.mapKeys(stakeholderSentiment, function (value, key) {
        if (value >= 5) {
          pos++;
          return true;
        }
        if (value < 3) {
          neg++;
          return true;
        }
        neu++;
        return true;
      });
      $log.debug("pos/neu/neg", pos, neu, neg);
      vm.pie.data = [pos, neu, neg];
      var weeklyGraph = ['Week ' + moment().format('w gggg'), 'Week ' + moment().subtract(1, 'week').format('w gggg'), 'Week ' + moment().subtract(2, 'week').format('w gggg'), 'Week ' + moment().subtract(3, 'week').format('w gggg'), 'Week ' + moment().subtract(4, 'week').format('w gggg'), 'Week ' + moment().subtract(5, 'week').format('w gggg')].reverse();
      $log.debug("week array", weeklyGraph);
      vm.line.labels = weeklyGraph;
      var lineProcess1 = {};
      var lineProcess2 = weeklyGraph.map(function (label) {
        lineProcess1[label] = [];
        return true;
      });
      $log.debug("lineProcess", lineProcess1);
      var lineResponses = dbInfo.data.responses.map(function (response) {
        var dateKey = 'Week ' + moment(response.createdAt).format('w gggg');
        $log.debug("date", dateKey);
        if (dateKey in lineProcess1) {
          lineProcess1[dateKey].push(Number(response.sentiment.toFixed(2)));
        }
      });
      $log.debug("lineRes", lineProcess1);
      var posRatio = [];
      var neuRatio = [];
      var negRatio = [];
      var graphData = _.mapValues(lineProcess1, function (value) {
        var totalLength = value.length;
        if (totalLength === 0) {
          posRatio.push("null");
          neuRatio.push("null");
          negRatio.push("null");
        } else {
        // positive percent
          var posArr = value;
          var posLength = _.remove(posArr, function (value) {
            return value >= 5;
          }).length;
          posRatio.push(Math.round(posLength / totalLength * 100));
          // neutral percent
          var neuArr = value;
          var neuLength = _.remove(neuArr, function (value) {
            return value < 5 && value > 3;
          }).length;
          neuRatio.push(Math.round(neuLength / totalLength * 100));
          // negative percent
          var negArr = value;
          var negLength = _.remove(negArr, function (value) {
            return value <= 3;
          }).length;
          negRatio.push(Math.round(negLength / totalLength * 100));
        }
      });
      $log.debug("graph data", posRatio, neuRatio, negRatio);
      posRatio = posRatio.map(function (val, index) {
        if (val === "null") {
          if (index > 0) {
            posRatio[index] = posRatio[index - 1];
            return posRatio[index - 1];
          }
          posRatio[index] = 0;
          return 0;
        }
        return val;
      });
      neuRatio = neuRatio.map(function (val, index) {
        if (val === "null") {
          if (index > 0) {
            neuRatio[index] = neuRatio[index - 1];
            return neuRatio[index - 1];
          }
          neuRatio[index] = 0;
          return 0;
        }
        return val;
      });
      negRatio = negRatio.map(function (val, index) {
        if (val === "null") {
          if (index > 0) {
            negRatio[index] = negRatio[index - 1];
            return negRatio[index - 1];
          }
          negRatio[index] = 0;
          return 0;
        }
        return val;
      });
      $log.debug("fixed graph data", posRatio, neuRatio, negRatio);
      vm.line.data = [];
      vm.line.data.push(posRatio, neuRatio, negRatio);
      plotBubbleChart(dbInfo);
      plotKeywordCharts(dbInfo);
      vm.groups = dbInfo.data.groups.map(function (group) {
        var count = _.filter(dbInfo.data.users, function (user) {
          if (user.groups.indexOf(group._id.toString()) > -1) {
            return true;
          }
          return false;
        }).length;
        var sentiment = 0;
        var colour = "";
        var lastResponse = "Over 6 weeks ago";
        if (group._id.toString() in groupLastCheckinIds) {
          sentiment = groupLastCheckinIds[group._id.toString()].sentiment;
          colour = groupLastCheckinIds[group._id.toString()].colour;
          lastResponse = moment(groupLastCheckinIds[group._id.toString()].lastResponse).fromNow();
        }
        var owner = false;
        if (dbInfo.data.user.groups.indexOf(group._id.toString()) > -1) {
          owner = true;
        }
        var initiativeOwner = false;
        var initiative = {};
        if (dbInfo.data.user.initiatives.indexOf(group.initiativeId) > -1) {
          initiativeOwner = true;
          initiative = _.find(dbInfo.data.initiatives, ["_id", group.initiativeId]);
        }
        var groupData = {
          "name": group.name,
          "id": group._id.toString(),
          "count": count,
          "colour": colour,
          "initiative": initiative,
          "initiativeOwner": initiativeOwner,
          "sentiment": sentiment,
          "lastResponse": lastResponse,
          "owner": owner
        };
        return groupData;
      });
      $log.debug("groups", vm.groups);
      $log.debug("dataset", vm.bubble);
    }, function (err) {
      $log.debug("err", err);
    });
  };
  // Create initiative
  vm.createInitiative = function () {
    var name = JSON.parse(apiFactory.getKey('details')).name;
    segment.track('Open Create Initiative Modal', { 'type': 'Create Modal', 'location': 'From Dashboard' });
    ngDialog.open({
      template: createInitiativeHTML,
      plain: true,
      controller: 'createInitiativeController',
      controllerAs: 'vm',
    });
  };
}
