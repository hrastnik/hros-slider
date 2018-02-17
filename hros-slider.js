var hros = hros || {};
hros.Slider = function() {
  var defaultParams = {
    classPrefix: "hros-slider",
    activeClass: "active",
    inactiveClass: "inactive",
    prevClass: "prev",
    nextClass: "next",
    slideSufix: "slide",
    gotoSufix: "goto",
    arrowLeftSufix: "arrow-left",
    arrowRightSufix: "arrow-right"
  };

  function doNothing() {}

  Slider.prototype.setActiveSlideIndex = function(index) {
    if (this.activeSlideIndex === index) return;

    this.activeSlideIndex = index;

    this.updateUI();
  };

  Slider.prototype.updateUI = function() {
    var clsPrev = this.params.prevClass;
    var clsNext = this.params.nextClass;
    var clsActive = this.params.activeClass;
    var clsInactive = this.params.inactiveClass;

    this.container.setAttribute(
      "data-active-slide",
      this.activeSlideIndex.toString()
    );

    var possibleClasses = [clsPrev, clsNext, clsActive, clsInactive];
    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];
      var el = slide.element;

      var classes = []; // List of classes element should end up with
      if (i < this.activeSlideIndex) classes = [clsPrev, clsInactive];
      else if (i === this.activeSlideIndex) classes = [clsActive];
      else classes = [clsNext, clsInactive];

      if (el.classList.contains(clsPrev) && classes.indexOf(clsActive) !== -1)
        slide.prevToActiveAnim(el);
      else if (
        el.classList.contains(clsActive) &&
        classes.indexOf(clsNext) !== -1
      )
        slide.activeToNextAnim(el);
      else if (
        el.classList.contains(clsNext) &&
        classes.indexOf(clsActive) !== -1
      )
        slide.nextToActiveAnim(el);
      else if (
        el.classList.contains(clsActive) &&
        classes.indexOf(clsPrev) !== -1
      )
        slide.activeToPrevAnim(el);
      else if (
        el.classList.contains(clsPrev) &&
        classes.indexOf(clsNext) !== -1
      )
        slide.prevToNextAnim(el);
      else if (
        el.classList.contains(clsNext) &&
        classes.indexOf(clsPrev) !== -1
      )
        slide.nextToPrevAnim(el);
      else if (classes.indexOf(clsActive) !== -1) slide.prevToActiveAnim(el);
      else if (classes.indexOf(clsPrev) !== -1) slide.activeToPrevAnim(el);
      else if (classes.indexOf(clsNext) !== -1) slide.activeToNextAnim(el);

      var currSlideGotoButtons = this.container.querySelectorAll(
        this.gotoClass + "[data-goto='" + i + "']"
      );
      possibleClasses.forEach(function(c) {
        if (classes.indexOf(c) !== -1) {
          el.classList.add(c);
          for (var j = 0; j < currSlideGotoButtons.length; j++) {
            currSlideGotoButtons[j].classList.add(c);
          }
        } else {
          el.classList.remove(c);
          for (var j = 0; j < currSlideGotoButtons.length; j++) {
            currSlideGotoButtons[j].classList.remove(c);
          }
        }
      });
    }
  };

  function getFunctionFromAttrib(element, attrib) {
    var functionName = element.getAttribute(attrib);
    if (functionName != null && window[functionName] != null)
      return window[functionName];
    else return doNothing;
  }

  function Slider(params) {
    if (params == null) params = {};
    for (var key in defaultParams) {
      if (params[key] == null) params[key] = defaultParams[key];
    }

    this.params = params;

    this.containerSelector = "." + params.classPrefix;
    this.containerClass = this.containerSelector;
    this.slidesClass = this.containerSelector + "-" + this.params.slideSufix;
    this.gotoClass = this.containerSelector + "-" + this.params.gotoSufix;
    this.arrowLeftClass =
      this.containerSelector + "-" + this.params.arrowLeftSufix;
    this.arrowRightClass =
      this.containerSelector + "-" + this.params.arrowRightSufix;

    var container = (this.container = document.querySelector(
      this.containerClass
    ));
    if (container == null) return;

    var activeSlideIndex = (this.activeSlideIndex = 0);
    var slides = (this.slides = []);

    var slideElements = container.querySelectorAll(this.slidesClass);
    for (var i = 0; i < slideElements.length; i++) {
      var element = slideElements[i];

      var prevToActiveAnim = getFunctionFromAttrib(
        element,
        "data-prev-to-active"
      );
      var activeToNextAnim = getFunctionFromAttrib(
        element,
        "data-active-to-next"
      );
      var nextToActiveAnim = getFunctionFromAttrib(
        element,
        "data-next-to-active"
      );
      var activeToPrevAnim = getFunctionFromAttrib(
        element,
        "data-active-to-prev"
      );

      var prevToNextAnim = getFunctionFromAttrib(element, "data-prev-to-next");
      var nextToPrevAnim = getFunctionFromAttrib(element, "data-next-to-prev");

      slides.push({
        element: element,
        prevToActiveAnim: prevToActiveAnim,
        activeToNextAnim: activeToNextAnim,
        nextToActiveAnim: nextToActiveAnim,
        activeToPrevAnim: activeToPrevAnim,
        prevToNextAnim: prevToNextAnim,
        nextToPrevAnim: nextToPrevAnim
      });
    }

    // init goto buttons
    var gotoButtons = container.querySelectorAll(this.gotoClass);
    for (var i = 0; i < gotoButtons.length; i++) {
      var button = gotoButtons[i];
      button.addEventListener(
        "click",
        function(button) {
          var slideIndex = parseInt(button.getAttribute("data-goto"));
          this.setActiveSlideIndex(slideIndex);
        }.bind(this, button)
      );
    }

    // init arrows
    var arrowLeft = container.querySelectorAll(this.arrowLeftClass);
    for (var i = 0; i < arrowLeft.length; i++) {
      arrowLeft[i].addEventListener(
        "click",
        this.handleArrowLeftClick.bind(this)
      );
    }

    var arrowRight = container.querySelectorAll(this.arrowRightClass);
    for (var i = 0; i < arrowRight.length; i++) {
      arrowRight[i].addEventListener(
        "click",
        this.handleArrowRightClick.bind(this)
      );
    }

    this.slides.forEach(function(slide, i) {
      if (i === 0) slide.element.classList.add("active");
      else slide.element.classList.add("next");
    });
    this.updateUI();
  }

  Slider.prototype.handleArrowLeftClick = function() {
    var newSlideIndex = Math.max(0, this.activeSlideIndex - 1);
    this.setActiveSlideIndex(newSlideIndex);
  };

  Slider.prototype.handleArrowRightClick = function() {
    var index = Math.min(this.slides.length - 1, this.activeSlideIndex + 1);
    this.setActiveSlideIndex(index);
  };

  return Slider;
}.call(this);
