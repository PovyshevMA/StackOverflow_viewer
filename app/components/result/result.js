  'use strict';

  // Модуль отвечающий за отрисовку страницы со списками вопросов.
  var resultModule = angular.module('app.result', ['ngRoute']);

  resultModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/result/:query', {
      templateUrl: 'components/result/result.html',
      controller: 'ResultController'
    });
  }]);

  resultModule.controller('ResultController', ['$routeParams', '$scope','$location', '$http','$q', function($routeParams, $scope, $location, $http, $q) {
    var me = this;

    $scope.$on("$routeChangeSuccess", function () {
      var query = $routeParams['query'];

      if(!query)
        $location.path('/search');

      me.executeSearch(query).then(function(data) {
        me.searchResult = { title: query, isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: 1};
      }, function(message) {
        me.searchResult = { title: query, isSuccess: false, message: message.error_message || message};
      });
    });

    // Пейджинг результатов поиска. Т.к. на странице у нас 2 одинаковые компоненты в параметрах передаем предыдущие результаты поиска.
    // После получения новых результатов свойства объекта обновляются и рендерится нужный блок страницы.
    me.getResultByPageNumber = function(pageNumber, searchResult) {
      me.executeSearch(searchResult.title,"", "", pageNumber).then(function(data) {
        searchResult.isSuccess = true;
        searchResult.entrys = data.items;
        searchResult.isLastPage = !data.has_more;
        searchResult.currentPage = pageNumber;
      }, function(message) {
        searchResult.isSuccess = false;
        searchResult.message = message.error_message || message;
      });
    };

    // Сортировка результатов. Т.к. результатов может быть очень много после сортировки возможны ситуации,
    // когда на предыдущих страницах окажутся результаты которых пользователь еще не видел.
    // Чтобы пользователь ничего не упустил переходим каждый раз на 1 страницу.
    me.sortResults = function(order, sortDirection, searchResult) {
      me.executeSearch(searchResult.title,"", "", 1, sortDirection, order).then(function(data) {
        searchResult.isSuccess = true;
        searchResult.entrys = data.items;
        searchResult.isLastPage = !data.has_more;
        searchResult.currentPage = 1;
      }, function(message) {
        searchResult.isSuccess = false;
        searchResult.message = message.error_message || message;
      });
    };

    // Подгрузка в панель быстрого отображения вопросов пользователя.
    me.detailsByAuthor = function(author) {
      var title = author.display_name;

      me.executeSearch("", "", author.user_id).then(function(data) {
        me.additionalResult = { title: title, isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: 1};
      }, function(message) {
        me.additionalResult = { title: title, isSuccess: false, message: message.error_message || message};
      });
    };

    // Подгрузка в панель быстрого отображения вопросов с указанным тегом.
    me.detailsByTag = function(tag) {
      var title = tag;

      me.executeSearch("", tag).then(function(data) {
        me.additionalResult = { title: title, isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: 1};
      }, function(message) {
        me.additionalResult = { title: title,  isSuccess: false, message: message.error_message || message};
      });
    };

    // Переход на страницу детализации вопроса.
    me.redirectToQuestion = function(questionId) {
      $location.path('/answers/' + questionId);
    };

    // Выполнение поиска.
    me.executeSearch = function (query, tag, user, pageNumber, sortDirection, sortBy) {
      var deferred = $q.defer();
      var params = {
        page: pageNumber || 1,
        pagesize: 10,
        order: sortDirection || 'desc',
        sort: sortBy || 'relevance',
        site: 'stackoverflow'
        };

      if (query)
        params.q = query;

      if (user)
        params.user = user;

      if (tag)
        params.tagged = tag;

      $http.get('http://api.stackexchange.com/2.2/search/advanced', {params : params}).success(function(data) {
          deferred.resolve(data);
        }).error(function(message){
          deferred.reject(message);
        });

/*      $http.get('data/questions.json').success(function(data) {
        deferred.resolve(data);
      }).error(function(message){
        deferred.reject(message);
      }); */

      return deferred.promise;
    };
  }]);