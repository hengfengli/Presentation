function main() {
  // Since we don't have the fallback of attachEvent and
  // other IE only stuff we won't try to run JS for IE.
  // It will run though when using Google Chrome Frame
  if (document.all) { return; }
  // the document.all is for IE, if the script detects
  // that the browser is IE, then return. 
  // this content is not designed for IE browser.

  var currentSlideNo;  // current silde no
  var notesOn = false; // whether display notes 
  var slides = document.getElementsByClassName('slide'); // get all the slides
  var touchStartX = 0;  // the start x of touch begining
  var spaces = /\s+/, a1 = [""]; // use to split string
  var tocOpened = false; // whether displays table of content 
  var helpOpened = false; // whether displays help

  // transform a string to array
  var str2array = function(s) {
    if (typeof s == "string" || s instanceof String) {
	  // check the type of s 
      if (s.indexOf(" ") < 0) {
	    // if there is no space
        a1[0] = s;
        // return the array which contains one string
        return a1;
      } else {
	    // return the array that the string is splited by space
        return s.split(spaces);
      }
    }
    return s;
  };

  var trim = function(str) {
	// trims the head and back spaces
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };

  // add the new class to node
  var addClass = function(node, classStr) {
	// get the array of classes
    classStr = str2array(classStr);
    var cls = " " + node.className + " ";
    for (var i = 0, len = classStr.length, c; i < len; ++i) {
	  // get each string of class 
      c = classStr[i];
      if (c && cls.indexOf(" " + c + " ") < 0) {
	    // if it is not null, and 
	    // there is no the same class in
	    // the node, then append the 
	    // new class to the node
        cls += c + " ";
      }
    }
    // trim the spaces
    node.className = trim(cls);
  };

  // remvoe the specific class from the node
  var removeClass = function(node, classStr) {
    var cls;
    if (classStr !== undefined) {
	  // the class must be defined 
	
      classStr = str2array(classStr);
      cls = " " + node.className + " ";
      for (var i = 0, len = classStr.length; i < len; ++i) {
	    // replace the existing class to space
        cls = cls.replace(" " + classStr[i] + " ", " ");
      }
      // trim the spaces
      cls = trim(cls);
    } else {
	  // the type of classStr is not defined
      cls = "";
    }
    if (node.className != cls) {
	  // if they are different, then
	  // change the className of node
      node.className = cls;
    }
  };

  // get the slide element
  var getSlideEl = function(slideNo) {
    if (slideNo > 0) {
      return slides[slideNo - 1];
    } else {
      return null;
    }
  };

  // get the title of the slide
  var getSlideTitle = function(slideNo) {
    var el = getSlideEl(slideNo);
    if (el) {
	  // get the content of the header
      var headers = el.getElementsByTagName('header');
      if (headers.length > 0) {
	    // if not empty, then return the innerText of headers
        return el.getElementsByTagName('header')[0].innerText;
      }
    }
    return null;
  };

  // modify the class of slide element   
  var changeSlideElClass = function(slideNo, className) {
    var el = getSlideEl(slideNo);
    if (el) {
      removeClass(el, 'far-past past current future far-future');
      addClass(el, className);
    }
  };

  // update the classes of slides
  var updateSlideClasses = function() {
	// set the url hash, "#slide1", "#slide2", ...
    window.location.hash = "slide" + currentSlideNo;

    for (var i=1; i<currentSlideNo-1; i++) {
	  // change all the slides before the past slide
      changeSlideElClass(i, 'far-past');
    }

    // change the class of past slide
    changeSlideElClass(currentSlideNo - 1, 'past');
    // change the class of current slide
    changeSlideElClass(currentSlideNo, 'current');
    // change the class of future slide
    changeSlideElClass(currentSlideNo + 1, 'future');

    // change all the slides after the future slide
    for (var i=currentSlideNo+2; i<slides.length+1; i++) {
      changeSlideElClass(i, 'far-future');
    }

    // highlight the link of the current slide in toc
    highlightCurrentTocLink();
    // add the header of slide to title of browser
    document.getElementsByTagName('title')[0].innerText = getSlideTitle(currentSlideNo);
  };
 
  // hightlight the current slide in the table of content
  var highlightCurrentTocLink = function() {
	// get all the rows in toc
    var tocRows = document.getElementById('toc').getElementsByTagName('tr');
    for (var i=0; i<tocRows.length; i++) {
	  // remove the past active one
      removeClass(tocRows.item(i), 'active');
    }
    // add the "active" class to the current slide
    var currentTocRow = document.getElementById('toc-row-' + currentSlideNo);
    if (currentTocRow) {
      addClass(currentTocRow, 'active');
    }
  }

  // move the current one to the next slide 
  var nextSlide = function() {
    if (currentSlideNo < slides.length) {
      currentSlideNo++;
    }
    updateSlideClasses();
  };

  // move the current one to the previous slide
  var prevSlide = function() {
    if (currentSlideNo > 1) {
      currentSlideNo--;
    }
    updateSlideClasses();
  };

  // displays the notes
  var showNotes = function() {
	// get the notes of the current slide
    var notes = getSlideEl(currentSlideNo).getElementsByClassName('notes');
    
    // change all the notes to display or block
    for (var i = 0, len = notes.length; i < len; i++) {	  
      notes.item(i).style.display = (notesOn) ? 'none':'block';
    }
    // toggle the note function
    notesOn = (notesOn) ? false : true;
  };

  // display the number of slides
  var showSlideNumbers = function() {
	// get all the elements of page number
    var asides = document.getElementsByClassName('page_number');
    // check the first one is whether block or none,
    // if the element are all blocked, then 
    // the boolean "hidden" is set to false.
    // if all are none, then will be set to true.
    var hidden = asides[0].style.display != 'block';
    for (var i = 0; i < asides.length; i++) {
	  // toggle the display way of slide number
      asides.item(i).style.display = hidden ? 'block' : 'none';
    }
  };

  // display the source, princile is same to above one
  var showSlideSources = function() {
    var asides = document.getElementsByClassName('source');
    var hidden = asides[0].style.display != 'block';
    for (var i = 0; i < asides.length; i++) {
      asides.item(i).style.display = hidden ? 'block' : 'none';
    }
  };

  // display the table of content
  var showToc = function() {
    if (helpOpened) {
	    // if the help has opened,
	    // then toggle it.
        showHelp();
    }

    // get the toc
    var toc = document.getElementById('toc');

    // change the marginLeft of toc, 
    // true => -400px
    // false => 0px
    // tocOpened stands for the current state of toc
    // true for toc opening now
    // false for toc closing now. 
    toc.style.marginLeft = tocOpened ? '-400px' : '0px';
 
    // toggle toc 
    tocOpened = !tocOpened;
  };
  
  // same to showToc
  var showHelp = function() {
    var help = document.getElementById('help');

    help.style.marginLeft = helpOpened ? '-400px' : '0px';

    helpOpened = !helpOpened;
  };

  // swtich to 3D mode
  var switch3D = function() {
    if (document.body.className.indexOf('three-d') == -1) {
	  // if the "three-d" class of body doesnt exsit
	  // get the presentation element and set its webkit perspective to 1000px
      document.getElementsByClassName('presentation')[0].style.webkitPerspective = '1000px';
      // add the "three-d" to body
      document.body.className += ' three-d';
    } else {
	  // if the "three-d" class has been tiggered
      window.setTimeout("document.getElementsByClassName('presentation')[0].style.webkitPerspective = '0';", 2000);
      // remove the "three-d" class
      document.body.className = document.body.className.replace(/three-d/, '');
    }
  };

  // handle key events
  var handleBodyKeyDown = function(event) {
    switch (event.keyCode) {
      case 37: // left arrow
        prevSlide();
        break;
      case 39: // right arrow
      case 32: // space
        nextSlide();
        break;
      case 50: // 2
        showNotes();
        break;
      case 51: // 3
        switch3D();
        break;
      case 72: // h
        showHelp();
        break;
      case 78: // n
        showSlideNumbers();
        break;
      case 83: // s
        showSlideSources();
        break;
      case 84: // t
        showToc();
        break;
    }
  };

  // handle the mouse wheel
  // delta is the wheel rotating degree
  // delta > 0 means forwarding 
  // delta < 0 means backwarding
  var handleWheel = function(event) {
    if (tocOpened || helpOpened) {
	  // if toc or help opened, then return
      return;
    }

    var delta = 0;

    if (!event) {
	  // for IE
      event = window.event;
    }

    if (event.wheelDelta) {
	  // IE/Opera
      delta = event.wheelDelta/120;
      // In Opera 9, delta differs in sign as compared to IE.
      if (window.opera) delta = -delta;
    } else if (event.detail) {
	  // Mozilla case. 
      delta = -event.detail/3;
    }

    if (delta && delta <0) {
	  // delta < 0, move to next one
      nextSlide();
    } else if (delta) {
	  // move to previous one
      prevSlide();
    }
  };

  var addTouchListeners = function() {
	// the third parameter means which stage you want 
	// the passing func to be invoked,
	// true  => capture
	// false => after happening
	// 
	// 4 touch events:
	// touchstart - triggered when a touch is initiated. - mouseDown
	// touchmove - triggered when a touch moves. - mouseMove
	// touchend - triggered when a touch ends. - mouseUp
	// touchcancel - bit of a mystery
	// 
	// touches - contains touch information upon touchStart and touchMove
	//             not touchEnd events
	// changedTouches - contains touch information upon all touch events
    document.addEventListener('touchstart', function(e) {
	  // 'touches' array is Apples way of handling multi-touch events 
      touchStartX = e.touches[0].pageX;
    }, false);
    document.addEventListener('touchend', function(e) {
	  // The touchEnd event removes the current touch from
	  // the 'event.touches' array. Instead, we have to
	  // look inside the 'event.changedTouches' array.
      var pixelsMoved = touchStartX - e.changedTouches[0].pageX;
      var SWIPE_SIZE = 150;
      if (pixelsMoved > SWIPE_SIZE) {
        nextSlide();
      }
      else if (pixelsMoved < -SWIPE_SIZE) {
        prevSlide();
      }
    }, false);
  };

  // toc links
  var addTocLinksListeners = function() {
	// get all links in toc
    var tocLinks = document.getElementById('toc').getElementsByTagName('a');
    for (var i=0; i < tocLinks.length; i++) {
      tocLinks.item(i).addEventListener('click', function(e) {
	    // add click event
	    // change the current slide no, when click the link
        currentSlideNo = Number(this.attributes['href'].value.replace('#slide', ''));
        // updates
        updateSlideClasses();
        return false;
      }, true); // use capture
    }
  };

  // initialize

  (function() {
    if (window.location.hash != "") {
	  // there is a "#silde1", "#silde2",... in url 
      currentSlideNo = Number(window.location.hash.replace('#slide', ''));
    } else {
	  // if there is no hash, then begins from slide 1
      currentSlideNo = 1;
    }
    
    // add the key event listener 
    document.addEventListener('keydown', handleBodyKeyDown, false);
    // add mouse scroll event listner 
    document.addEventListener('DOMMouseScroll', handleWheel, false);
    // window is browser, document is html
    window.onmousewheel = document.onmousewheel = handleWheel

    // initiate the "slide" class
    var els = slides;
    for (var i = 0, el; el = els[i]; i++) {
      addClass(el, 'slide far-future');
    }
    // updates classes
    updateSlideClasses();

    // add support for finger events (filter it by property detection?)
    addTouchListeners();
    // add toc links 
    addTocLinksListeners();
  })();
};
