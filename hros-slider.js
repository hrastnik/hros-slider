var hros = hros || {};
hros.Slider = function() {
  var defaultParams = {
    classPrefix: "hros-slider",
    activeClass: "active",
    inactiveClass: "inactive",
    slideSufix: "slide",
    gotoSufix: "goto",
    arrowLeftSufix: "arrow-left",
    arrowRightSufix: "arrow-right"
  };

  function defaultEnterAnimation(element) {
    element.style.display = "initial";
  }

  function defaultExitAnimation(element) {
    element.style.display = "none";
  }

  Slider.prototype.setActiveSlideIndex = function(index) {
    if (this.activeSlideIndex === index) return;

    this.activeSlideIndex = index;

    this.updateUI();
  };

  Slider.prototype.updateUI = function() {
    for (var i = 0; i < this.slides.length; i++) {
      var slide = this.slides[i];

      if (this.activeSlideIndex === i) {
        slide.element.classList.add(this.params.activeClass);
        slide.element.classList.remove(this.params.inactiveClass);
        slide.enterAnim(slide.element);
      } else {
        slide.element.classList.add(this.params.inactiveClass);
        slide.element.classList.remove(this.params.activeClass);
        slide.exitAnim(slide.element);
      }
    }
  };

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

      var enterAnim = element.getAttribute("data-enter");
      if (enterAnim != null && window[enterAnim] != null) {
        enterAnim = window[enterAnim];
      } else {
        enterAnim = defaultEnterAnimation;
      }

      var exitAnim = element.getAttribute("data-exit");
      if (exitAnim != null && window[exitAnim] != null)
        exitAnim = window[exitAnim];
      else exitAnim = defaultExitAnimation;

      slides.push({
        element: element,
        enterAnim: enterAnim,
        exitAnim: exitAnim
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
