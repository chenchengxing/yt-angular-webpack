module.exports = function (moduleName, path) {
  // require(path);
  var app = require("lazy-angular").module("app");
  var providers = app.providers;
  var module = require("lazy-angular").module(moduleName);
  var invokeQueue = module._invokeQueue;
  angular.forEach(invokeQueue, function(invokeItem) {
    var provider = providers[invokeItem[0]];

    provider[invokeItem[1]].apply(provider, invokeItem[2]);
  });
}