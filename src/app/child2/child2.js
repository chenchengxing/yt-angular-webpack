var app = require("lazy-angular").module("app");
require('../../../vendor/toast.js');
require('lazy-angular-vendor')('toaster');
app.controller("child2Ctrl", function($scope) {
    console.log('child2');
});

// require.ensure(["../toast.js"], function(require) {
//   require('../toast.js');
//   require('lazy-angular-vendor')('toaster');
//   var app = require("lazy-angular").module("app");
//   app.controller("child2Ctrl", function($scope, toaster) {
//       console.log('child2');
//   });
// });