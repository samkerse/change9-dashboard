module.exports = function apiFactory($http, $window, $log) {
  var url = 'https://aw661ekh99.execute-api.ap-southeast-2.amazonaws.com/dev';
  // Login API
  function login(identity) {
    return $http.post(url + '/login/', identity);
  }
  // Register API
  function register(managerData) {
    return $http.post(url + '/manager/', managerData);
  }
  // Update Manager Pin
  function updatePin(managerData) {
    return $http.put(url + '/manager', managerData);
  }
  // Get All Initiatives API
  function getAllInitiatives() {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/initiatives',
      'headers': {
        'Auth': token
      }
    });
  }

  // Get All Groups API
  function getAllGroups() {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/groups',
      'headers': {
        'Auth': token
      }
    });
  }
  // Get one initiative data
  function getOneInitiative(id) {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/initiative/' + id,
      'headers': {
        'Auth': token
      }
    });
  }
  // Create a group
  function createGroup(groupData) {
    return $http({
      'method': 'POST',
      'url': url + '/group',
      'data': groupData
    });
  }
  // Update Groups
  function updateGroup(groupData) {
    return $http.put(url + '/group', groupData);
  }
  // Update a trend
  function updateTrend(trendData) {
    return $http.put(url + '/trend', trendData);
  }
  // Add a member to a group
  function addMember(memberInfo) {
    return $http({
      'method': 'POST',
      'url': url + '/group/member',
      'data': memberInfo,
    });
  }
  // Create a schedule
  function createSchedule(scheduleData) {
    var token = getKey('token');
    return $http({
      'method': 'POST',
      'url': url + '/group/schedule',
      'data': scheduleData,
      'headers': {
        'Auth': token
      }
    });
  }
  function updateSchedule(scheduleInfo) {
    return $http.put(url + '/schedule', scheduleInfo);
  }
  // create an initiative
  function createInitiative(initiativeData) {
    var token = getKey('token');
    return $http({
      'method': 'POST',
      'url': url + '/initiative',
      'data': initiativeData,
      'headers': {
        'Auth': token
      }
    });
  }
  // Get one group data
  function getOneGroup(id) {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/group/' + id,
      'headers': {
        'Auth': token
      }
    });
  }
  // Add/Edit members in a group
  function editGroupMembers(groupData) {
    return $http.put(url + '/group/members', groupData);
  }
  // toggle Schedule
  function toggleSchedule(scheduleId, toggleType) {
    return $http.put(url + '/schedule/toggle', {
      "id": scheduleId,
      "toggleType": toggleType
    });
  }
  function updateScheduleGroups(scheduleId, groups) {
    return $http.put(url + '/schedule/groups', {
      "id": scheduleId,
      "groups": groups
    });
  }
  // Get Dashboard Info
  function getDashboardInfo() {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/dashboard',
      'headers': {
        'Auth': token
      }
    });
  }
  // Get Dashboard metrics
  function getDashboardMetrics() {
    var token = getKey('token');
    return $http({
      'method': 'GET',
      'url': url + '/dashboard/metrics',
      'headers': {
        'Auth': token
      }
    });
  }
  function getKey(key) {
    return $window.sessionStorage && $window.localStorage.getItem(key);
  }
  function setKey(key, val) {
    return $window.sessionStorage && $window.localStorage.setItem(key, val);
  }
  return {
    login: login,
    register: register,
    getKey: getKey,
    setKey: setKey,
    getAllInitiatives: getAllInitiatives,
    getOneInitiative: getOneInitiative,
    getOneGroup: getOneGroup,
    getAllGroups: getAllGroups,
    createGroup: createGroup,
    updateGroup: updateGroup,
    addMember: addMember,
    createSchedule: createSchedule,
    createInitiative: createInitiative,
    updateScheduleGroups: updateScheduleGroups,
    getDashboardMetrics: getDashboardMetrics,
    getDashboardInfo: getDashboardInfo,
    toggleSchedule: toggleSchedule,
    editGroupMembers: editGroupMembers,
    updatePin: updatePin,
    updateSchedule: updateSchedule,
    updateTrend: updateTrend
  };
};
