module.exports = {
  template: require('./dashboard.html'),
  controller: dashboardController
};
var createInitiativeHTML = require('../modal/createInitiative/createInitiative.html');
function dashboardController($log, loginFactory, apiFactory, _, $state, segment, ngDialog, pageProperties, moment, seedrandom) {
  var vm = this;
  vm.page = pageProperties;
  vm.page.type = "Stakeholders";
  vm.filteredUsers = [];
  $log.debug("Hello dashboard");
  $log.debug(pageProperties);
  segment.page('Dashboard');
  vm.filter = {};
  vm.sort = 'lastResponded';
  vm.sortOrder = 0;
  vm.sortIcon = 'keyboard_arrow_down';
  vm.sortTable = function (itemKey) {
    if (itemKey === vm.sort) {
      if (vm.sortOrder === 0) {
        vm.sortOrder = 1;
        vm.sortIcon = 'keyboard_arrow_up';
      } else {
        vm.sortOrder = 0;
        vm.sortIcon = 'keyboard_arrow_down';
      }
    } else {
      vm.sortOrder = 0;
      vm.sortIcon = 'keyboard_arrow_down';
    }
    vm.sort = itemKey;
  };
  vm.users = [
    {
      "name": "Jill Carson",
      "surveys": 2,
      "priority": 2,
      "sentiment": 4.2,
      "lastResponded": "1 hour ago",
      "responseRate": "29%",
      "firstResponded": "1 month ago",
      "tags": [
        "Employees"
      ],
      "processedTags": "Employees",
      "city": "Auckland"
    },
    {
      "name": "James Morris",
      "surveys": 1,
      "priority": 5,
      "sentiment": 5.9,
      "lastResponded": "2 hours ago",
      "responseRate": "46%",
      "firstResponded": "5 weeks ago",
      "tags": [
        "Senior Leaders"
      ],
      "processedTags": "Senior Leaders",
      "city": "San Francisco"
    },
    {
      "name": "Sarah Normandy",
      "surveys": 1,
      "priority": 2,
      "sentiment": 6.7,
      "lastResponded": "2 hours ago",
      "responseRate": "94%",
      "firstResponded": "3 weeks ago",
      "tags": [
        "Employees"
      ],
      "processedTags": "Employees",
      "city": "San Francisco"
    },
    {
      "name": "Nick Walters",
      "surveys": 2,
      "priority": 4,
      "sentiment": 4.9,
      "lastResponded": "2 days ago",
      "responseRate": "45%",
      "firstResponded": "1 month ago",
      "tags": [
        "Senior Leaders"
      ],
      "processedTags": "Senior Leaders",
      "city": "Los Angeles"
    },
    {
      "name": "Lindsay Copeland",
      "surveys": 2,
      "priority": 1,
      "sentiment": 5.2,
      "lastResponded": "5 days ago",
      "responseRate": "50%",
      "firstResponded": "1 week ago",
      "tags": [
        "Contractors"
      ],
      "processedTags": "Contractors",
      "city": "Wellington"
    },
    {
      "name": "Kimberly Long",
      "surveys": 1,
      "priority": 2,
      "sentiment": 2.9,
      "lastResponded": "5 days ago",
      "responseRate": "86%",
      "firstResponded": "3 weeks ago",
      "tags": [
        "Employees"
      ],
      "processedTags": "Employees",
      "city": "San Francisco"
    },
    {
      "name": "Steven Chambers",
      "surveys": 2,
      "priority": 2,
      "sentiment": 2.3,
      "lastResponded": "32 days ago",
      "responseRate": "21%",
      "firstResponded": "1 month ago",
      "tags": [
        "Employees"
      ],
      "processedTags": "Employees",
      "city": "Auckland"
    },
    {
      "_id": "abc123",
      "name": "Kevin Horton",
      "surveys": 2,
      "priority": 3,
      "sentiment": 4.1,
      "lastResponded": "2 months ago",
      "responseRate": "10%",
      "firstResponded": "1 month ago",
      "tags": [
        "Managers",
        "Employees"
      ],
      "processedTags": "Managers, Employees",
      "city": "Auckland",
      "someValue": "abc123"
    }
  ];
  vm.getInitials = function (name) {
    var seperateWords = name.split(" ");
    var acronym = "";
    var acronymLimit = 2;
    if (seperateWords.length < 2) acronymLimit = 1;
    for (var i = 0; i < acronymLimit; i++) {
      acronym += seperateWords[i].substr(0, 1);
    }
    return acronym;
  };
  vm.sidebarFilters = [];
  vm.setSidebarFilters = function () {
    var userArr = vm.users;
    var filters = [];
    userArr.map(function (userObj) {
      var newFilters = _.mapKeys(userObj, function (value, key) {
        // make some fields into date filters
        if (key === "_id" || key === "processedTags") {
        } else if (key === "firstResponded" || key === "lastResponded" || key === "createdAt") {
          filters.push({"name": key, "type": "date"});
        } else if (!isNaN(value)) {
          filters.push({"name": key, "type": "number"});
        } else {
          filters.push({"name": key, "type": "text"});
        }
      });
    });
    var uniqFilters = _.uniqBy(filters, "name");
    $log.debug("filters1", uniqFilters);
    vm.sidebarFilters = uniqFilters;
  };
  vm.setSidebarFilters();
  vm.tempShowFilters = function () {
    $log.debug("filters", vm.filter);
  };
  vm.setFilter = function () {
    var userList = vm.users;
    var activeFilters = _.pickBy(vm.filter, function (value, key) {
      if (value.active && 'value' in value) {
        return true;
      }
      return false;
    });
    var countActiveFilters = Object.keys(activeFilters).length;
    $log.debug("filters", vm.filter);
    $log.debug("active filters", countActiveFilters);
    if (countActiveFilters === 0) {
      vm.filteredUsers = vm.users;
    } else {
      var filteredUsers = vm.users;
      for (var i = 0; i < countActiveFilters; i++) {
        // active filter: activeFilters[Object.keys(activeFilters)[i]]
        var key = Object.keys(activeFilters)[i];
        var obj = activeFilters[Object.keys(activeFilters)[i]];
        $log.debug("filter", i, key, obj);
        // STILL NEED TO ADD DATE GT/LT/EQ TO CASES BELOW
        switch (obj.type) {
          case "contains":
            filteredUsers = _.filter(filteredUsers, function (o) {
              if (key in o) {
                return o[key].toLowerCase().indexOf(obj.value.toLowerCase()) !== -1;
              }
              return false;
            });
            break;
          case "gt":
            filteredUsers = _.filter(filteredUsers, function (o) {
              if (key in o) {
                return o[key] > obj.value;
              }
              return false;
            });
            break;
          case "lt":
            filteredUsers = _.filter(filteredUsers, function (o) {
              if (key in o) {
                return o[key] < obj.value;
              }
              return false;
            });
            break;
          case "eq":
            filteredUsers = _.filter(filteredUsers, function (o) {
              if (key in o) {
                return o[key] === obj.value;
              }
              return false;
            });
            break;
          default:
            // do nothing
        }
      }
      $log.debug("filtered users", filteredUsers);
      vm.filteredUsers = filteredUsers;
    }
  };
  vm.setColour = function (email) {
    var num = seedrandom(email);
    var str = 'a' + Math.round(num() * 6);
    // $log.debug(email, num(), str);
    return str;
  };
}
