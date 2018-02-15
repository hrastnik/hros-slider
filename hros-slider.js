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
      else if (classes.indexOf(clsActive) !== -1) slide.prevToActiveAnim(el);
      else if (classes.indexOf(clsPrev) !== -1) slide.activeToPrevAnim(el);
      else if (classes.indexOf(clsNext) !== -1) slide.activeToNextAnim(el);

      possibleClasses.forEach(function(c) {
        classes.indexOf(c) !== -1
          ? el.classList.add(c)
          : el.classList.remove(c);
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

    var containerSelector = "." + params.classPrefix;
    var containerClass = containerSelector;
    var slidesClass = containerSelector + "-" + this.params.slideSufix;
    var gotoClass = containerSelector + "-" + this.params.gotoSufix;
    var arrowLeftClass = containerSelector + "-" + this.params.arrowLeftSufix;
    var arrowRightClass = containerSelector + "-" + this.params.arrowRightSufix;

    var container = (this.container = document.querySelector(containerClass));
    if (container == null) return;

    var activeSlideIndex = (this.activeSlideIndex = 0);
    var slides = (this.slides = []);

    var slideElements = container.querySelectorAll(slidesClass);
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

      slides.push({
        element: element,
        prevToActiveAnim: prevToActiveAnim,
        activeToNextAnim: activeToNextAnim,
        nextToActiveAnim: nextToActiveAnim,
        activeToPrevAnim: activeToPrevAnim
      });
    }

    // init goto buttons
    var gotoButtons = container.querySelectorAll(gotoClass);
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
    var arrowLeft = container.querySelectorAll(arrowLeftClass);
    for (var i = 0; i < arrowLeft.length; i++) {
      arrowLeft[i].addEventListener("click", this.handleArrowLeftClick);
    }

    var arrowRight = container.querySelectorAll(arrowRightClass);
    for (var i = 0; i < arrowRight.length; i++) {
      arrowRight[i].addEventListener("click", this.handleArrowRightClick);
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
