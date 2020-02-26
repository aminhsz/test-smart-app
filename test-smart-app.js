(function(window) {
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady() {
      console.log('Ready', arguments);
      ret.resolve();
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();
  }
})(window);
