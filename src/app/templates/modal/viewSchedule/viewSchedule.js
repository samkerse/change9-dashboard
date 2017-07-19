module.exports = {
  template: require('./viewSchedule.html'),
  controller: viewScheduleController
};

function viewScheduleController($log) {
  $log.debug("View Schedule");
}
