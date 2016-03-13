  'use strict';

  // Модуль отвечающий за отображения детализированной информации по вопросу.
  var searchModule = angular.module('app.answers', ['ngRoute']);

  searchModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/answers/:questionId', {
      templateUrl: 'components/answers/answers.html',
      controller: 'AnswersController'
    });
  }]);

  searchModule.controller('AnswersController', ['$routeParams', '$scope','$location', '$sce', 'searchService',  function($routeParams, $scope, $location, $sce, searchService) {
    var me = this;

    // Рендер страницы при старте.
    $scope.$on("$routeChangeSuccess", function () {
      var questionId = $routeParams['questionId'];

      if(!questionId)
        $location.path('/search');

      searchService.getQuestionById(questionId).then(function(data) {
        if (data.items.length > 0)
          me.question = { isSuccess: true, info: data.items[0]};
        else
          me.question = { isSuccess: false, message: "question is not found"};
      }, function(message) {
        me.question = { isSuccess: false, message: message.error_message || message};
      });

      searchService.getAnswersByQuestionId(questionId).then(function(data) {
        me.answers = { isSuccess: true, info: data};
      }, function(message) {
        me.answers = { isSuccess: false, message: message.error_message || message};
      });
    });

    // API возвращает rawbody, т.к. мы доверяем API выводим его как есть.
    me.parseHtmlBody = function(rawBody) {
      return $sce.trustAsHtml(rawBody);
    };
  }]);