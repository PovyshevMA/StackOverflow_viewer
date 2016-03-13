  'use strict';

  // Компонента реализующая таблицу со списком вопросов.
  angular.module('app.result').component('resultEntryList', {
    templateUrl: 'components/result/resultEntryList/resultEntryList.html',
    controller: ResultEntryListController,
    bindings: {
      searchResult: '<',
      clickBy: '<'
    }
  });

  function ResultEntryListController($scope, searchService) {
    var me = this;

    // Варианты сортировки предоставляемые сервисом.
    me.sortOrderItems= searchService.sortOrderItems;

    // Направления сортировки предоставляемые сервисом.
    me.sortDirectionItems= searchService.sortOrderItems;

    // Пейджинг результатов поиска.
    me.getResultByPageNumber = function(pageNumber) {
      me._setData(pageNumber);
    };

    // Сортировка результатов. Т.к. результатов может быть очень много после сортировки возможны ситуации,
    // когда на предыдущих страницах окажутся результаты которых пользователь еще не видел.
    // Чтобы пользователь ничего не упустил переходим каждый раз на 1 страницу.
    me.sortResults = function() {
      me._setData(1, $scope.sort.order, $scope.sort.direction);
    };

    // Обновление данных в таблице.
    me._setData= function(pageNumber, order, sortDirection) {
      var searchFunction = searchService.searchByQuery;

      switch (me.searchResult.searchTarget.type) {
        case "tag":
          searchFunction = searchService.searchByTag;
          break;
        case "author":
          searchFunction = searchService.searchByAuthor;
      }

      searchFunction(me.searchResult.searchTarget.value, pageNumber, sortDirection, order).then(function(data) {
        me.searchResult = angular.extend(me.searchResult, { isSuccess: true, entrys: data.items, isLastPage: !data.has_more, currentPage: pageNumber});
      }, function(message) {
        me.searchResult = angular.extend(me.searchResult, { isSuccess: false, message: message.error_message || message});
      });
    };
  }