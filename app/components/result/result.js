  'use strict';

  // Модуль отвечающий за отрисовку страницы со списками вопросов.
  var resultModule = angular.module('app.result', ['ngRoute']);

  resultModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/result/:query', {
      templateUrl: 'components/result/result.html',
      controller: 'ResultController'
    });
  }]);

  resultModule.controller('ResultController', ['$routeParams', '$scope','$location', 'searchService', function($routeParams, $scope, $location, searchService) {
    var me = this;

    $scope.$on("$routeChangeSuccess", function () {
      var query = $routeParams['query'];

      if(!query)
        $location.path('/search');

      searchService.searchByQuery(query).then(function(data) {
        me.searchResult = { searchTarget: { type: 'query', title: query, value: query}, isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: 1};
      }, function(message) {
        me.searchResult = { searchTarget: { type: 'query', title: query, value: query}, isSuccess: false, message: message.error_message || message};
      });
    });

    me.detailsBy = function(type, title, value) {
      var searchFunction = searchService.searchByTag;

      if (type == 'author')
        searchFunction = searchService.searchByAuthor;

      searchFunction(value).then(function(data) {
        me.additionalResult = { searchTarget: { type: type, title: title, value: value}, isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: 1};
      }, function(message) {
        me.additionalResult = { searchTarget: { type: type, title: title, value: value},  isSuccess: false, message: message.error_message || message};
      });
    };
  }]);