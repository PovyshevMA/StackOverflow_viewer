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

  .factory('searchService', ['$http', '$q', function($http, $q){
    var _executeSearch = function (query, tag, user, pageNumber, sortDirection, sortBy) {
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
      });*/

      return deferred.promise;
    };

    return {
      searchByAuthor: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch("", "", searchString, pageNumber, sortDirection, sortBy);
      },

      searchByTag: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch("", searchString, "", pageNumber, sortDirection, sortBy);
      },

      searchByQuery: function (searchString, pageNumber, sortDirection, sortBy){
        return _executeSearch(searchString, "", "", pageNumber, sortDirection, sortBy);
      }
    };
  }]);
