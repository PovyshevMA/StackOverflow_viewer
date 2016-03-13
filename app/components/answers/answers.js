  'use strict';

  // Модуль отвечающий за отображения детализированной информации по вопросу.
  var searchModule = angular.module('app.answers', ['ngRoute']);

  searchModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/answers/:questionId', {
      templateUrl: 'components/answers/answers.html',
      controller: 'AnswersController'
    });
  }]);

  searchModule.controller('AnswersController', ['$routeParams', '$scope','$location', '$http','$q','$sce',  function($routeParams, $scope, $location, $http, $q, $sce) {
    var me = this;

    // Рендер страницы при старте.
    $scope.$on("$routeChangeSuccess", function () {
      var questionId = $routeParams['questionId'];

      if(!questionId)
        $location.path('/search');

      me.getQuestionInfo(questionId).then(function(data) {
        me.question = { isSuccess: true, info: data};
      }, function(message) {
        me.question = { isSuccess: false, message: message.error_message || message};
      });

      me.getAnswersByQuestionId(questionId).then(function(data) {
        me.answers = { isSuccess: true, info: data};
      }, function(message) {
        me.answers = { isSuccess: false, message: message.error_message || message};
      });
    });

    // API возвращает rawbody, т.к. мы доверяем API выводим его как есть.
    me.parseHtmlBody = function(rawBody) {
      return $sce.trustAsHtml(rawBody);
    };

    // Загрузка информации по вопросу.
    me.getQuestionInfo = function (questionId) {
      var deferred = $q.defer();

      var params = {
        site: 'stackoverflow',
        filter: '!-*f(6rc.lFba'
      };

/*
      $http.get('http://api.stackexchange.com/2.2/questions/' + questionId, {params : params}).success(function(data) {
        if (data.items.length > 0)
          deferred.resolve(data.items[0]);
        else
          deferred.reject("nnn");
      }).error(function(message){
        deferred.reject(message);
      });
*/
      $http.get('data/question.json').success(function(data) {
        deferred.resolve(data.items[0]);
      }).error(function(message){
        deferred.reject(message);
      });
      return deferred.promise;
    };

    // Загрузка списка ответов.
    me.getAnswersByQuestionId = function (questionId, pageNumber, count, sortDirection, sortBy) {
      var deferred = $q.defer();

      var params = {
        page: pageNumber || 1,
        pagesize: count || 20,
        order: sortDirection || 'desc',
        sort: sortBy || 'votes',
        site: 'stackoverflow',
        filter: '!9YdnSM64y'
      };

/*
      $http.get('http://api.stackexchange.com/2.2/questions/' + questionId + '/answers', {params : params}).success(function(data) {
        deferred.resolve(data);
      }).error(function(message){
        deferred.reject(message);
      });
*/
      $http.get('data/answers.json').success(function(data) {
        deferred.resolve(data);
      }).error(function(message){
        deferred.reject(message);
      });

      return deferred.promise;
    };
  }]);