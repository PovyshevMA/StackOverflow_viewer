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
  }])

  // Сервис для работы с API stackoverflow.
  .factory('searchService', ['$http', '$q', function($http, $q){
    // Общая функия для получения данных из сервиса.
    var _executeSearch = function (urlPostfix, query, tag, user, filter, pageNumber, sortDirection, sortBy) {
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

      if (filter)
        params.filter = filter;

      $http.get('http://api.stackexchange.com/2.2/' + urlPostfix, {params : params}).success(function(data) {
        deferred.resolve(data);
      }).error(function(message){
        deferred.reject(message);
      });

      return deferred.promise;
    };

    return {
      // Поиск вопросов по автору.
      searchByAuthor: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch("search/advanced", "", "", searchString, "", pageNumber, sortDirection, sortBy);
      },

      // Поиск вопросов по тегу.
      searchByTag: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch("search/advanced", "", searchString, "","", pageNumber, sortDirection, sortBy);
      },

      // Поиск вопросов по строке поиска.
      searchByQuery: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch("search/advanced", searchString, "", "", "", pageNumber, sortDirection, sortBy);
      },

      // Получение детализации вопроса по ид.
      getQuestionById: function (questionId){
        return _executeSearch('questions/' + questionId, "", "", "", '!-*f(6rc.lFba', 1, 'desc','votes');
      },

      // Получение ответов на вопрос вопрос по ид.
      getAnswersByQuestionId: function (questionId){
        return _executeSearch('questions/' + questionId + '/answers', "", "", "", '!9YdnSM64y', 1, 'desc','votes');
      },

      // Типы сортировки.
      sortOrderItems: [
        {name: "По рейтингу", value: 'relevance'},
        {name: 'По количеству голосов', value: 'votes'},
        {name: 'По дате создания', value: 'creation'},
        {name: 'По количеству просмотров', value: 'activity'}
      ],

      // Направления сортировки.
      sortDirectionItems: [
        {name: "По возрастанию", value: 'asc'},
        {name: 'По убыванию', value: 'desc'}
      ]
    };
  }]);
