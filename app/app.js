  'use strict';
  require("components/search/search");
  require("components/result/result");
  require("components/answers/answers");
  require("components/result/resultEntryList/resultEntryList");
  require("components/result/resultEntryList/resultEntry/resultEntry");

  angular.module('app', [
    'ngRoute',
    'ngAnimate',
    'app.search',
    'app.result',
    'app.answers'
  ])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/search'});
  }]);
