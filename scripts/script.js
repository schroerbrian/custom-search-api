// 12:38
'use strict';

(function() {
  // image search endpoint
  var googleSearchBaseUrl = 'https://www.googleapis.com/customsearch/v1?';
  var apiKey = '5da789639b22c37d65c515690ff1242d';
  var query  = 'san+francisco';
  var cx     = '008551058298757543433%3A-pvpymqftmu'; // custom search engine id
  var key    = 'AIzaSyB0x4OunQ_kPmZ-48yf7KlkPUSOZ7dNUaE';
  var searchUrl = googleSearchBaseUrl + 'q=' + query + '&cx=' + cx + '&searchType=image&key=' + key;

  // ajax response parsing
  var parseResponse = function parseResponse(json) {
    if (json.items) {
      var imgObjects = json.items;

      imgObjects.forEach(function(imgObj) {
        console.log(imgObj.image.thumbnailLink);
      })
    } else {
      console.log('error parsing response');
    }
  };

  // ajax request
  var xhr = new XMLHttpRequest();
  xhr.open('GET', searchUrl);
  xhr.send(null);

  xhr.onreadystatechange = function () {
    var DONE = 4;
    var OK   = 200;
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        var parsedJson = JSON.parse(xhr.responseText);
        debugger;
        parseResponse(parsedJson);
      } else {
        console.log('Error: ' + xhr.status);
      }
    }
  };

})();
