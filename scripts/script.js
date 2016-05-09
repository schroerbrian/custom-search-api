// 12:38
// 2:22
// 6:28
// 7:28
// 11:44
// 1:44
// 3:24

// can we use external css, resets, etc
// todos:
// input box for searching
// img rendering logic
//  check if vert or horiz dimension is larger in proportion and set max-height or width as a dimension
// of window size?
// ask what i should focus on given i only can afford to spend several more hours on this
// load all imgs
// add spiner
'use strict';

(function() {
  var imgModels  = {};
  var activeLightboxImage;
  var lightboxImgEl;
  var lightboxContainerEl;
  var lightboxExit;
  var lastImg;
  var lightboxVisibleClass = 'lightbox-visible';

  // dom querying after window has loaded
  window.onload = function() {
    var chevronLeft     = document.getElementById('js-lightbox-chevron-left');
    var chevronRight    = document.getElementById('js-lightbox-chevron-right');
    var spinner         = document.getElementById('js-spinner');
    lightboxContainerEl = document.getElementById('js-lightbox-container');
    lightboxImgEl       = document.getElementById('js-lightbox-current-image');
    lightboxExit        = document.getElementById('js-lightbox-exit');
    lightboxImgEl.onload = function () {
         lightboxImgEl.classList.remove('lightbox-img-transition-left', 'lightbox-img-transition-right');
         spinner.classList.remove('show-spinner');
     };

    chevronLeft.onclick = function() {
      var splitId = activeLightboxImage.split('imgItem');
      var targetActiveLightboxImage = 'imgItem' + (parseFloat(splitId[splitId.length - 1]) - 1);

      lightboxImgEl.classList.add('lightbox-img-transition-left');
      spinner.classList.add('show-spinner');

      if (!imgModels[targetActiveLightboxImage]) {
        targetActiveLightboxImage = lastImg;
      }

      activeLightboxImage = targetActiveLightboxImage;
      lightboxImgEl.src = imgModels[activeLightboxImage].src;
    };

    chevronRight.onclick = function() {
      var splitId = activeLightboxImage.split('imgItem');
      var targetActiveLightboxImage = 'imgItem' + (parseFloat(splitId[splitId.length - 1]) + 1);

      lightboxImgEl.classList.add('lightbox-img-transition-right');
      spinner.classList.add('show-spinner');

      if (!imgModels[targetActiveLightboxImage]) {
        targetActiveLightboxImage = 'imgItem0';
      }

      activeLightboxImage = targetActiveLightboxImage;
      lightboxImgEl.src = imgModels[activeLightboxImage].src;
    };

    lightboxExit.onclick = function() {
      lightboxContainerEl.classList.remove(lightboxVisibleClass);
    };
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
      lastImg = 'imgItem' + (imgObjects.length - 1);

      imgObjects.forEach(function(imgObj, index) {
        var imgEl    = document.createElement('div');
        var imgThumb = imgObj.image.thumbnailLink;
        var imgId    = 'imgItem' + index;

        imgModels[imgId] = {src: imgObj.link, width: imgObj.height, height: imgObj.height};
        imgEl.id = imgId;
        imgEl.classList.add('img-item');
        imgEl.innerHTML = '<img src="' + imgThumb + '">';
        containerEl.appendChild(imgEl);

        imgEl.onclick = function() {
          lightboxContainerEl.classList.add(lightboxVisibleClass);
          lightboxImgEl.src   = imgModels[this.id].src;
          activeLightboxImage = this.id;
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
