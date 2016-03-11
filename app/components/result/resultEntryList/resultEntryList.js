  'use strict';

  function ResultEntryListController($scope) {
    var me = this;

    $scope.sortOrder = 'relevance';
    $scope.sortDirection = 'desc';

    me.sortOrderItems= [
      {name: "По рейтингу", value: 'relevance'},
      {name: 'По количеству голосов', value: 'voice'},
      {name: 'По дате создания', value: 'creation'},
      {name: 'По количеству голосов', value: 'activity'}
    ];

    me.sortDirectionItems= [
      {name: "По возрастанию", value: 'asc'},
      {name: 'По убыванию', value: 'desc'}
    ];
  }

  angular.module('app.result').component('resultEntryList', {
    templateUrl: 'components/result/resultEntryList/resultEntryList.html',
    controller: ResultEntryListController,
    bindings: {
      searchResult: '<',
      clickByAuthor: '<',
      clickByTag: '<',
      redirectToQuestion: '<',
      getResultByPageNumber: '<',
      sortResults: '<'
    }
  });

