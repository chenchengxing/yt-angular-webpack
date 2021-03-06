webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div class=\"child1\"> child 1 stuff <counter start=\"1\"></counter></div>";

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var app = __webpack_require__(1).module("app");
	__webpack_require__(8);
	__webpack_require__(9)('toaster');
	app.directive("counter", function($interval) {
	    return {
	        restrict: "E",
	        scope: { start: "@" },
	        template: "<span>{{ curr }}</span>",
	        link: function(scope) {
	            scope.curr = parseInt(scope.start, 10);

	            $interval(function() {
	                scope.curr += 1;
	            }, 1000);
	        }
	    }
	});

	var style = __webpack_require__(10);

	app.controller("child1Ctrl", function($scope, toaster) {
	    style.use();
	    toaster.pop('success', 'sdfsdf');
	    $scope.$on("$destroy", function() {
	        style.unuse();
	    })
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * AngularJS Toaster
	 * Version: 0.4.6
	 *
	 * Copyright 2013 Jiri Kavulak.  
	 * All Rights Reserved.  
	 * Use, reproduction, distribution, and modification of this code is subject to the terms and 
	 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
	 *
	 * Author: Jiri Kavulak
	 * Related to project of John Papa and Hans Fjällemark
	 */

	angular.module('toaster', ['ngAnimate'])
	.service('toaster', ['$rootScope', function ($rootScope) {
	    this.pop = function (type, title, body, timeout, bodyOutputType, clickHandler) {
	        this.toast = {
	            type: type,
	            title: title,
	            body: body,
	            timeout: timeout,
	            bodyOutputType: bodyOutputType,
	            clickHandler: clickHandler
	        };
	        $rootScope.$broadcast('toaster-newToast');
	    };

	    this.clear = function () {
	        $rootScope.$broadcast('toaster-clearToasts');
	    };
	}])
	.constant('toasterConfig', {
	    'limit': 0,                   // limits max number of toasts 
	    'tap-to-dismiss': true,
	    'close-button': false,
	    'newest-on-top': true,
	    //'fade-in': 1000,            // done in css
	    //'on-fade-in': undefined,    // not implemented
	    //'fade-out': 1000,           // done in css
	    // 'on-fade-out': undefined,  // not implemented
	    //'extended-time-out': 1000,    // not implemented
	    'time-out': 5000, // Set timeOut and extendedTimeout to 0 to make it sticky
	    'icon-classes': {
	        error: 'toast-error',
	        info: 'toast-info',
	        wait: 'toast-wait',
	        success: 'toast-success',
	        warning: 'toast-warning'
	    },
	    'body-output-type': '', // Options: '', 'trustedHtml', 'template'
	    'body-template': 'toasterBodyTmpl.html',
	    'icon-class': 'toast-info',
	    'position-class': 'toast-top-right',
	    'title-class': 'toast-title',
	    'message-class': 'toast-message'
	})
	angular.module('toaster').directive('toasterContainer', ['$compile', '$timeout', '$sce', 'toasterConfig', 'toaster',
	function ($compile, $timeout, $sce, toasterConfig, toaster) {
	    return {
	        replace: true,
	        restrict: 'EA',
	        scope: true, // creates an internal scope for this directive
	        link: function (scope, elm, attrs) {

	            var id = 0,
	                mergedConfig;

	            mergedConfig = angular.extend({}, toasterConfig, scope.$eval(attrs.toasterOptions));

	            scope.config = {
	                position: mergedConfig['position-class'],
	                title: mergedConfig['title-class'],
	                message: mergedConfig['message-class'],
	                tap: mergedConfig['tap-to-dismiss'],
	                closeButton: mergedConfig['close-button']
	            };

	            scope.configureTimer = function configureTimer(toast) {
	                var timeout = typeof (toast.timeout) == "number" ? toast.timeout : mergedConfig['time-out'];
	                if (timeout > 0)
	                    setTimeout(toast, timeout);
	            };

	            function addToast(toast) {
	                toast.type = mergedConfig['icon-classes'][toast.type];
	                if (!toast.type)
	                    toast.type = mergedConfig['icon-class'];

	                id++;
	                angular.extend(toast, { id: id });

	                // Set the toast.bodyOutputType to the default if it isn't set
	                toast.bodyOutputType = toast.bodyOutputType || mergedConfig['body-output-type'];
	                switch (toast.bodyOutputType) {
	                    case 'trustedHtml':
	                        toast.html = $sce.trustAsHtml(toast.body);
	                        break;
	                    case 'template':
	                        toast.bodyTemplate = toast.body || mergedConfig['body-template'];
	                        break;
	                }

	                scope.configureTimer(toast);

	                if (mergedConfig['newest-on-top'] === true) {
	                    scope.toasters.unshift(toast);
	                    if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
	                        scope.toasters.pop();
	                    }
	                } else {
	                    scope.toasters.push(toast);
	                    if (mergedConfig['limit'] > 0 && scope.toasters.length > mergedConfig['limit']) {
	                        scope.toasters.shift();
	                    }
	                }
	            }

	            function setTimeout(toast, time) {
	                toast.timeout = $timeout(function () {
	                    scope.removeToast(toast.id);
	                }, time);
	            }

	            scope.toasters = [];
	            scope.$on('toaster-newToast', function () {
	                addToast(toaster.toast);
	            });

	            scope.$on('toaster-clearToasts', function () {
	                scope.toasters.splice(0, scope.toasters.length);
	            });
	        },
	        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

	            $scope.stopTimer = function (toast) {
	                if (toast.timeout) {
	                    $timeout.cancel(toast.timeout);
	                    toast.timeout = null;
	                }
	            };

	            $scope.restartTimer = function (toast) {
	                if (!toast.timeout)
	                    $scope.configureTimer(toast);
	            };

	            $scope.removeToast = function (id) {
	                var i = 0;
	                for (i; i < $scope.toasters.length; i++) {
	                    if ($scope.toasters[i].id === id)
	                        break;
	                }
	                $scope.toasters.splice(i, 1);
	            };

	            $scope.click = function (toaster) {
	                if ($scope.config.tap === true) {
	                    if (toaster.clickHandler && angular.isFunction($scope.$parent.$eval(toaster.clickHandler))) {
	                        var result = $scope.$parent.$eval(toaster.clickHandler)(toaster);
	                        if (result === true)
	                            $scope.removeToast(toaster.id);
	                    } else {
	                        if (angular.isString(toaster.clickHandler))
	                            console.log("TOAST-NOTE: Your click handler is not inside a parent scope of toaster-container.");
	                        $scope.removeToast(toaster.id);
	                    }
	                }
	            };
	        }],
	        template:
	        '<div  id="toast-container" ng-class="config.position">' +
	            '<div ng-repeat="toaster in toasters" class="toast" ng-class="toaster.type" ng-click="click(toaster)" ng-mouseover="stopTimer(toaster)"  ng-mouseout="restartTimer(toaster)">' +
	              '<button class="toast-close-button" ng-show="config.closeButton">&times;</button>' +
	              '<div ng-class="config.title">{{toaster.title}}</div>' +
	              '<div ng-class="config.message" ng-switch on="toaster.bodyOutputType">' +
	                '<div ng-switch-when="trustedHtml" ng-bind-html="toaster.html"></div>' +
	                '<div ng-switch-when="template"><div ng-include="toaster.bodyTemplate"></div></div>' +
	                '<div ng-switch-default >{{toaster.body}}</div>' +
	              '</div>' +
	            '</div>' +
	        '</div>'
	    };
	}]);


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (moduleName, path) {
	  // require(path);
	  var app = __webpack_require__(1).module("app");
	  var providers = app.providers;
	  var module = __webpack_require__(1).module(moduleName);
	  var invokeQueue = module._invokeQueue;
	  angular.forEach(invokeQueue, function(invokeItem) {
	    var provider = providers[invokeItem[0]];

	    provider[invokeItem[1]].apply(provider, invokeItem[2]);
	  });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var refs = 0;
	var dispose;
	exports.use = exports.ref = function() {
		if(!(refs++)) {
			var content = __webpack_require__(11)
			if(typeof content === 'string') content = [[module.id, content, '']];
			dispose = __webpack_require__(5)(content);
		}
		return exports
	};
	exports.unuse = exports.unref = function() {
		if(!(--refs)) {
			dispose();
			dispose = null;
		}
	};
	if(false) {
		refs = module.hot.data && module.hot.data.refs || 0;
		if(refs) {
			refs--;
			exports.ref();
		}
		module.hot.accept();
		module.hot.dispose(function(data) {
			data.refs = refs;
			if(dispose) {
				dispose();
			}
		});
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	exports.push([module.id, ".child1 {\n  font-size: 50px;\n}\n", ""]);

/***/ }
]);