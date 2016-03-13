  'use strict';

  // Модуль реализующий логику основной поисковой страницы.
  var searchModule = angular.module('app.search', ['ngRoute']);

  searchModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {
      templateUrl: 'components/search/search.html',
      controller: 'SearchController'
    });
  }]);

  searchModule.controller('SearchController', ['$location',function($location) {
    this.execute = function(query) {
      $location.path('/result/' + query);
    };
  }]);