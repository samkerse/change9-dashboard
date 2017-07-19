module.exports = function ($log) {
  return {
    scope: {
      setFocus: '='
    },
    link: function (scope, element) {
      if (scope.setFocus) {
        element[0].children[0].children[0].focus();
      }
    }
  };
};
