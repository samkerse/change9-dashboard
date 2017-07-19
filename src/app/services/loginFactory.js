module.exports = function loginService() {
  var loginData = [];
  function pushData(item) {
    loginData.push(item);
  }
  function getData() {
    return loginData;
  }
  return {
    pushData: pushData,
    getData: getData
  };
};
