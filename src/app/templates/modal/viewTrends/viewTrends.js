module.exports = {
  template: require('./viewTrends.html'),
  controller: viewTrendsController
};

function viewTrendsController($log, moment, trends) {
  $log.debug("Trends modal window");
  var vm = this;
  vm.trends = trends;
  $log.debug(vm.trends);
  vm.trends.forEach(function (trend) {
    trend.createdAt = moment(trend.createdAt).format("dddd, MMMM Do");
  });
}
