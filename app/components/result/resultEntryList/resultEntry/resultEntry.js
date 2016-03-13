  'use strict';

  // Компонента реализующая отдельный элемент таблицы результатов поиска.
  angular.module('app.result').component('resultEntry', {
    templateUrl: 'components/result/resultEntryList/resultEntry/resultEntry.html',
    controller: ResultEntryController,
    bindings: {
      entry: '<',
      clickBy: '<'
    }
  });

  function ResultEntryController($location) {
    var me = this;

    // Переход на страницу детализации вопроса.
    me.redirectToQuestion = function(questionId) {
      $location.path('/answers/' + questionId);
    };
  }
