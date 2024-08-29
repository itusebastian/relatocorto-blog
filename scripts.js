jQuery.noConflict();
jQuery(document).ready(function ($) {
  // Handle search and social menu
  $(".gr-search").on("click", function () {
    $("#itu_box_search.itu_box_overlay").addClass("itu_box_open_s");
    $(".itu_site_holder").addClass("itu_box_open");
  });

  $("#itu_box_search .itu_close, #itu_box_search .itu_close_over").on(
    "click",
    function () {
      $(".itu_box_overlay").removeClass("itu_box_open_s");
      $(".itu_site_holder").removeClass("itu_box_open");
    }
  );

  $(".gr-social").on("click", function () {
    $("#itu_box_social.itu_box_overlay").addClass("itu_box_open_s");
    $(".itu_site_holder").addClass("itu_box_open");
  });

  $("#itu_box_social .itu_close, #itu_box_social .itu_close_over").on(
    "click",
    function () {
      $("#itu_box_social.itu_box_overlay").removeClass("itu_box_open_s");
      $(".itu_site_holder").removeClass("itu_box_open");
    }
  );

  // Initialize Owl Carousel
  function initializeOwlCarousel() {
    var owl = $(".owl-carousel");
    owl.owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      nav: false,
      dots: false,
      margin: 2,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        800: { items: 3 },
        1200: { items: 3 },
      },
    });
  }

  // Initialize Owl Carousel
  initializeOwlCarousel();

  // Load and initialize Owl Carousel from external file
  $("#carousel-placeholder").load("carousel.html", function () {
    initializeOwlCarousel();
  });

  // Initialize FlexSlider
  $(".flexslider").flexslider({ animation: "slide" });

  // Initialize Lightbox
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
  });

  // Initialize Dropdown Menus
  $(".dropdown-toggle").dropdown();

  // Function to adjust the width of the menu holder
  function adjustMenuHolder() {
    var ww = $(".itu_menu_holder").outerWidth() / 2;
    $(".itu_menu_holder").css({ marginLeft: -ww, width: ww * 2 });
    return ww;
  }

  var ww = adjustMenuHolder();

  // Handle menu button interactions
  $(".itu_menu_holder").on("click", ".itu_menu_button.itu_active", function () {
    $(".itu_header_menu li").removeClass("itu_open_ul one_click");
    $(this).text("Menu");
    $(".itu_header_menu").slideToggle(300);
    $(this).removeClass("itu_active");
    $(".itu_menu_holder").animate(
      { marginLeft: -ww, width: ww * 2 },
      300,
      function () {
        $(".itu_header_menu li a").css("opacity", 0);
      }
    );
  });

  $(".itu_menu_holder").on(
    "click",
    ".itu_menu_button:not(.itu_active)",
    function () {
      $(this).text("Cerrar");
      $(this).addClass("itu_active");
      $(".itu_menu_holder ul").show(0);

      var maxWidth = Math.max.apply(
        null,
        $(".itu_header_menu li a")
          .map(function () {
            return $(this).outerWidth(true);
          })
          .get()
      );

      maxWidth += 150;

      $(".itu_menu_holder ul").hide(0);
      $(".itu_header_menu").slideToggle(300);

      $(".itu_menu_holder").animate(
        { marginLeft: -maxWidth / 2, width: maxWidth },
        300
      );

      $(".itu_header_menu li a").each(function (index) {
        setTimeout(
          function (el) {
            el.css("opacity", 1);
          },
          index * 30,
          $(this)
        );
      });
    }
  );

  $(".itu_header_menu > li").on("click", "a", function (e) {
    if (
      $(this).parent().has("ul").length > 0 &&
      !$(this).parent().hasClass("one_click")
    ) {
      $(this).parent().children("ul").slideToggle(300);
      $(this).parent().toggleClass("itu_open_ul");
      if ($(this).attr("href") != "#") {
        $(this).parent().toggleClass("one_click");
      }
      e.preventDefault();
      return false;
    }
  });

  const postsPerPage = 10; // Number of posts per page

  // Initialize Blog Feed with pagination
  function initializeBlogFeed() {
    $.get("blog_posts.html", function (data) {
      // Create a temporary DOM element to parse the HTML
      const $tempDiv = $("<div>").html(data);

      // Select all blog post items
      const $allPosts = $tempDiv.find(".col-md-12.item");

      if ($allPosts.length > 0) {
        const totalPosts = $allPosts.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        // Render the first page of posts
        renderPosts($allPosts, 1);

        // Generate pagination
        generatePagination(totalPages);

        // Handle pagination clicks
        $("#pagination").on("click", ".page-numbers", function (e) {
          e.preventDefault();
          const pageNumber = $(this).text();
          renderPosts($allPosts, pageNumber);

          // Smooth scroll to the top of the blog section
          $("html, body").animate(
            {
              scrollTop: $("#blog-feed").offset().top,
            },
            600
          ); // Adjust the duration (600ms) as needed
        });
      }
    }).fail(function () {
      // Error handling
    });
  }

  // Function to render posts for a specific page
  function renderPosts(posts, pageNumber) {
    const start = (pageNumber - 1) * postsPerPage;
    const end = start + postsPerPage;
    const $postsToShow = posts.slice(start, end);

    $("#blog-feed").empty();
    $("#blog-feed").append($postsToShow);
  }

  // Function to generate pagination controls
  function generatePagination(totalPages) {
    let paginationHtml = '<div class="pagination-container">';
    paginationHtml += '<span class="itu_counts">';
    paginationHtml += `<span id="itu_masorny_posts_per_page">${postsPerPage}</span> / `;
    paginationHtml += `<span id="itu_max_masorny_posts">${
      totalPages * postsPerPage
    }</span>`;
    paginationHtml += "</span>";
    paginationHtml += '<div class="itu_pg">';

    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<a class="page-numbers" href="/?paged=${i}">${i}</a>`;
      if (i < totalPages) {
        paginationHtml += " ";
      }
    }

    paginationHtml += '<a class="next page-numbers" href="/?paged=2">Next</a>';
    paginationHtml += "</div>";
    paginationHtml += "</div>";

    $("#pagination").html(paginationHtml);
  }

  // Load the sidebar HTML content and insert it into the sidebar placeholder
  function loadSidebar() {
    $("#sidebar-placeholder").load("sidebar.html");
  }

  // Load the widgets HTML content and insert it into the widgets placeholder
  function loadWidgets() {
    $("#widgets-placeholder").load("widgets.html");
  }

  // Call the functions to initialize the blog feed, load the sidebar, and load the widgets
  initializeBlogFeed();
  loadSidebar();
  loadWidgets();
});
