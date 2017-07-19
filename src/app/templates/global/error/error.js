module.exports = {
  template: require('./error.html'),
  bindings: {
    message: '@'
  },
  controller: errorController
};

function errorController($log) {
  var vm = this;
  vm.$log = $log;
  vm.$log.debug("here");
}
