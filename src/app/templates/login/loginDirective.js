module.exports = function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on("keyup", function (e) {
        if (element.val().length === parseInt(element.attr("maxlength"))) {
          var $nextElement = element.next();
          if ($nextElement.length) {
            $nextElement[0].focus();
          }
        }
        else if (element.val().length < 1) {
          if (element[0].previousElementSibling)
            element[0].previousElementSibling.focus();
        }
      });
    }
  };
};
