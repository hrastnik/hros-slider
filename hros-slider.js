function handleDocumentReady() {
  function switchPages($curr_page, $next_page) {
    // Get the next page ready
    $next_page.css({ top: "100%", display: "block" });

    // Animate next page into the screen
    $next_page.animate({ top: "0px" });

    // Animate current page offscreen then hide it
    $curr_page.animate({ top: "-100%" }, function() {
      $curr_page.css({ display: "none", top: "0px", left: "0px" });
    });
  }

  $slider_containers = $(".hros-slider");
  $slider_containers.each(function(i, container) {
    $container = $(container);

    $pages = $container.find(".hros-slider-page");

    if ($pages.length < 1) return;

    // Find active page
    const active_page_num =
      (function($pages) {
        for (let i = 0; i < $pages.length; i++) {
          if ($pages.eq(i).hasClass("hros-slider-active-page")) {
            return i;
          }
        }
      })($pages) || 0;

    $container.data({
      "num-pages": $pages.length,
      "active-page": active_page_num // Set to last element as we instantly call intervalHandler and change to 1st
    });

    $pages.not($pages.eq(active_page_num)).css({
      display: "none"
    });

    // Setup buttons
    const $buttons = $container.find(".hros-slider-goto-button");
    $buttons.each(function(index) {
      const $button = $buttons.eq(index);
      const next_page_num = $button.data("goto");

      $button.click(function() {
        const active_page_num = $container.data("active-page");

        if (active_page_num === next_page_num) return;

        const num_pages = $container.data("num-pages");

        const $curr_page = $pages.eq(active_page_num);
        const $next_page = $pages.eq(next_page_num);
        $container.data("active-page", next_page_num);

        const customSwitchFunction = $next_page.data("switch-function");
        if (window[customSwitchFunction] != null) {
          console.log("Custom switch:\n", customSwitchFunction);
          window[customSwitchFunction]($curr_page, $next_page);
        } else {
          switchPages($curr_page, $next_page);
        }
      });
    });
  });
}

$(handleDocumentReady);
