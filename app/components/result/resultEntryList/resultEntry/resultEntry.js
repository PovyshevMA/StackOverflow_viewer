  'use strict';

  angular.module('app.result').component('resultEntry', {
    templateUrl: 'components/result/resultEntryList/resultEntry/resultEntry.html',
    bindings: {
      entry: '<',
      clickByAuthor: '<',
      clickByTag: '<',
      redirectToQuestion: '<'
    }
  });
