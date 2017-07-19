module.exports = function ($log) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.ngModel, function () {
        if (scope.manager.name && scope.manager.email) {
          if (scope.manager.name.length === 0 || scope.manager.email.length === 0) {
            scope.$parent.vm.managers.pop();
          }
        }
      });
    }
  };
};
