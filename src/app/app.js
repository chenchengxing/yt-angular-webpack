
var app = require("lazy-angular").module("app", ["ui.router"]);

require("./common/app.less").use();

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);

    app
        .route("index", {
            url: "/",
            template: "<div>Default Stuff</div>"
        })
        .route("child1", {
            url: "/child1",
            controller: 'child1Ctrl'
        }, function(loadTemplate) {
             require([
                 "./child1/child1.tpl.html",
                 "./child1/child1.js"
             ], function(template) {
                loadTemplate(template);
             });
        })
        .route("child2", {
            url: "/child2",
            controller: 'child2Ctrl'
        }, function(loadTemplate) {
             require([
                 "./child2/child2.tpl.html",
                 "./child2/child2.js"
             ], function(template) {
                loadTemplate(template);
             });
        });

});

angular.bootstrap(document.body, ["app"]);