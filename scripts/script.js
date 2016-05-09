// 12:38
// 2:22
// 6:28
// 7:28
// can we use external css, resets, etc
'use strict';

(function() {
  var imgModels  = {};
  var lightboxImgEl;
  var lightboxContainerEl;
  var lightboxExit;
  var lightboxVisibleClass = 'lightbox-visible';

  // dom querying after window has loaded
  window.onload = function() {
    lightboxContainerEl = document.getElementById('js-lightbox-container');
    lightboxImgEl       = document.getElementById('js-lightbox-current-image');
    lightboxExit        = document.getElementById('js-lightbox-exit');

    lightboxExit.onclick = function() {
      lightboxContainerEl.classList.remove(lightboxVisibleClass);
    }
  }

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
      var containerEl = document.getElementById('js-imgs-container');

      imgObjects.forEach(function(imgObj, index) {
        var imgEl  = document.createElement('div');
        var imgThumb = imgObj.image.thumbnailLink;
        var imgId    = 'imgItem' + index;

        imgModels[imgId] = imgObj.link;
        imgEl.id = imgId;
        imgEl.classList.add('img-item');
        imgEl.innerHTML = '<img src="' + imgThumb + '">';
        containerEl.appendChild(imgEl);

        imgEl.onclick = function() {
          lightboxContainerEl.classList.add(lightboxVisibleClass);
          lightboxImgEl.src = imgModels[this.id];
        }
      });
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
        parseResponse(parsedJson);
      } else {
        console.log('Error: ' + xhr.status);
      }
    }
  };

})();
