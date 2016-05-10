// TODOS:
// use this rather than var
// keep array passed by google api as model rather than creating object model??
// allow scrolling with arrow keypress
// exit lightbox with esc keypress
// ui niceties

'use strict';

(function() {
  var imgModels  = {};
  var activeLightboxImage;
  var lightboxImgEl;
  var lightboxContainerEl;
  var lightboxTitleEl;
  var lightboxExit;
  var lastImg;
  var lightboxVisibleClass = 'lightbox-visible';
  var containerEl;

  // dom querying after window has loaded
  window.onload = function() {
    containerEl         = document.getElementById('js-imgs-container');
    var chevronLeft     = document.getElementById('js-lightbox-chevron-left');
    var chevronRight    = document.getElementById('js-lightbox-chevron-right');
    var spinner         = document.getElementById('js-spinner');
    var searchButton    = document.getElementById('js-search-button');
    var searchInput     = document.getElementById('js-search-input');
    lightboxContainerEl = document.getElementById('js-lightbox-container');
    lightboxTitleEl     = document.getElementById('js-lightbox-title');
    lightboxImgEl       = document.getElementById('js-lightbox-current-image');
    lightboxExit        = document.getElementById('js-lightbox-exit');

    // executed when clicking right or left chevron (dir)
    var chevronAction = function chevronAction(dir) {
      var splitId = activeLightboxImage.split('imgItem');
      var targetActiveLightboxImage;
      var dirIsRight = dir === 'right';

      if (dirIsRight) {
        targetActiveLightboxImage = 'imgItem' + (parseFloat(splitId[splitId.length - 1]) + 1);
      } else {
        targetActiveLightboxImage = 'imgItem' + (parseFloat(splitId[splitId.length - 1]) - 1);
      }

      lightboxImgEl.classList.add('lightbox-img-transition');
      spinner.classList.add('show-spinner');

      if (!imgModels[targetActiveLightboxImage]) {
        if (dirIsRight) {
          targetActiveLightboxImage = 'imgItem0';
        } else {
          targetActiveLightboxImage = lastImg;
        }
      }

      activeLightboxImage = targetActiveLightboxImage;
      lightboxImgEl.src = imgModels[activeLightboxImage].src;
      lightboxTitleEl.innerHTML = imgModels[activeLightboxImage].title;
    };

    chevronLeft.onclick = function() {
      chevronAction('left');
    };

    chevronRight.onclick = function() {
      chevronAction('right');
    };

    lightboxExit.onclick = function() {
      lightboxContainerEl.classList.remove(lightboxVisibleClass);
    };

    // for new searches
    searchButton.onclick = function(event) {
      event.preventDefault();
      var queryValue = searchInput.value;
      if (queryValue) {
        searchImages(queryValue);
      }
    };

    // on successful load of image remove transition class and spinner
    lightboxImgEl.onload = function () {
      lightboxImgEl.classList.remove('lightbox-img-transition');
      spinner.classList.remove('show-spinner');
    };

  }

  // ajax response parsing
  var parseResponse = function parseResponse(json) {
    if (json.items) {
      containerEl.innerHTML = '';
      var imgObjects = json.items;

      lastImg = 'imgItem' + (imgObjects.length - 1);

      imgObjects.forEach(function(imgObj, index) {
        var imgEl    = document.createElement('div');
        var imgThumb = imgObj.image.thumbnailLink;
        var imgId    = 'imgItem' + index;
        imgModels[imgId] = {src: imgObj.link, width: imgObj.height, height: imgObj.height, title: imgObj.title};
        imgEl.id = imgId;
        imgEl.classList.add('img-item');
        imgEl.innerHTML = '<img src="' + imgThumb + '">';
        containerEl.appendChild(imgEl);

        imgEl.onclick = function() {
          lightboxContainerEl.classList.add(lightboxVisibleClass);
          lightboxImgEl.src         = imgModels[this.id].src;
          lightboxTitleEl.innerHTML = imgModels[this.id].title;
          activeLightboxImage       = this.id;
        }
      });


    } else {
      console.log('error parsing response');
    }
  };

  // ajax request
  var searchImages = function searchImages(query) {
    imgModels = {};

    // image search endpoint
    query  = query || 'cat';
    var googleSearchBaseUrl = 'https://www.googleapis.com/customsearch/v1?';
    var apiKey = '5da789639b22c37d65c515690ff1242d';
    var cx     = '008551058298757543433%3A-pvpymqftmu'; // custom search engine id
    var key    = 'AIzaSyC1lkGiYxLZI83VLf4K09G9UzC742GZldc';
    var searchUrl = googleSearchBaseUrl + 'q=' + query + '&cx=' + cx + '&searchType=image&key=' + key;
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
  };

  searchImages();

})();
