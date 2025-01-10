jQuery.noConflict();
jQuery(document).ready(function ($) {
  let postsPerPage = 10; // Default number of posts per page

  // Function to set the number of posts per page based on screen size
  function setPostsPerPage() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      postsPerPage = 2; // Number of posts per page for mobile version
    } else {
      postsPerPage = 10; // Number of posts per page for other versions
    }
  }

  // Call the function on page load
  setPostsPerPage();

  // Call the function whenever the window is resized
  window.addEventListener("resize", setPostsPerPage);

  // Function to load header
  function loadHeader() {
    return $.Deferred(function (deferred) {
      $("#header-placeholder").load("/header.html", function () {
        deferred.resolve();
      });
    }).promise();
  }

  // Function to load overlays
  function loadOverlays() {
    return $.Deferred(function (deferred) {
      $("#overlays-placeholder").load("/overlays.html", function () {
        deferred.resolve();
      });
    }).promise();
  }

  // Function to load sidebar
  function loadSidebar() {
    return $.Deferred(function (deferred) {
      $("#sidebar-placeholder").load("/sidebar.html", function () {
        deferred.resolve();
      });
    }).promise();
  }

  // Function to load widgets
  function loadWidgets() {
    return $.Deferred(function (deferred) {
      $("#widgets-placeholder").load("/widgets.html", function () {
        deferred.resolve();
      });
    }).promise();
  }

  // Function to load carousel
  function loadCarousel() {
    return $.Deferred(function (deferred) {
      $("#carousel-placeholder").load("/carousel.html", function () {
        if ($("#carousel-placeholder").find(".owl-carousel").length) {
          initializeOwlCarousel();
        }
        deferred.resolve();
      });
    }).promise();
  }

  // Function to initialize Owl Carousel
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
  
  // Function to fetch JSON data
  function fetchJson(url) {
    return $.getJSON(url)
      .done(data => data)
      .fail(() => {
        console.error(`Failed to load JSON from ${url}`);
        return [];
      });
  }

  // Function to initialize the blog feed
  function initializeBlogFeed() {
    return $.Deferred(function (deferred) {
      // Load articles and tags JSON
      $.when(fetchJson("/articles.json"), fetchJson("/tags.json")).done(function (articlesResponse, tagsResponse) {
        const articles = articlesResponse[0]; // Extract the actual articles data
        const tags = tagsResponse[0]; // Extract the actual tags data

        // Check if articles is an array
        if (Array.isArray(articles) && articles.length > 0) {
          const totalPosts = articles.length;
          const totalPages = Math.ceil(totalPosts / postsPerPage);

          renderPosts(articles, tags, 1); // Pass the loaded tags and render posts for the first page
          generatePagination(totalPages); // Generate pagination based on total pages

          // Set up pagination click handler
          $("#pagination").on("click", ".page-numbers", function (e) {
            e.preventDefault();
            const pageNumber = parseInt($(this).text());
            renderPosts(articles, tags, pageNumber); // Render posts for the clicked page
            generatePagination(totalPages, pageNumber); // Regenerate pagination for the current page
            $("html, body").animate(
              { scrollTop: $("#blog-feed").offset().top },
              600
            );
          });

          // Resolve the deferred object
          deferred.resolve();
        } else {
          console.error("Articles data is not available or not an array.");
          deferred.reject();
        }
      }).fail(function (error) {
        console.error("Error fetching data:", error);
        deferred.reject();
      });
    }).promise();
  }


  // Function to render posts for a specific page
  function renderPosts(posts, tags, pageNumber) {
    const start = (pageNumber - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = posts.slice(start, end);

    $("#blog-feed").empty();

    postsToShow.forEach(post => {
      const postTitle = post.title || "No Title";
      const postDate = post.date || "No Date";
      const postCategory = post.category || "No Category";
      const postUrl = post.url || "#";
      const postImage = post.image || "default-image.jpg";
      const postExcerpt = post.excerpt || "No Excerpt";

      // Generate the HTML for the blog post
      const postHtml = `
        <div class="col-md-12 item">
          <div class="itu_post_holder">
            <div class="head">
              <div class="itu_up_title">
                <span class="text-overflow-center">${postTitle}</span>
              </div>
              <div class="itu_blog_post_cat">
                <span class="itu_ddate">${postDate}</span>
                <span class="itu_separate">|</span>
                <span class="itu_category">${postCategory}</span>
              </div>
              <div class="itu_blog_post_title_holder">
                <h3 class="blog_title">
                  <a class="blog_title_a" href="${postUrl}">${postTitle}</a>
                </h3>
              </div>
            </div>
            <div class="itu_media">
              <div class="itu_blog_post_featuder_holder text-center">
                <a href="${postUrl}" title="${postTitle}">
                  <img class="img-responsive" src="${postImage}" alt="${postTitle}" />
                </a>
              </div>
            </div>
            <div class="itu_blog_post_content_holder">
              <div class="text_holder">
                <p>${postExcerpt}</p>
              </div>
              <div class="itu_blog_post_cat_holder">
                <span class="itu_blog_comment_holder">
                  <a href="${postUrl}#disqus_thread">Comentarios</a>
                </span>
                <span class="itu_blog_tag_holder hidden-xs">
                  <ul class="itu_many_tags">
                    <li><i class="fa fa-angle-down"></i><a>Etiquetas</a>
                      <ul>
                        ${tags
                          .map(tag => `<li><a href="${tag.url}" rel="tag">${tag.name}</a></li>`)
                          .join("")}
                      </ul>
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          </div>
        </div>
      `;

      $("#blog-feed").append(postHtml);
    });
  }

  // Call the initializeBlogFeed function and load the Disqus script after completion
  initializeBlogFeed().done(function () {
    // Create and insert the Disqus script tag dynamically after blog feed is ready
    const disqusScript = document.createElement("script");
    disqusScript.id = "dsq-count-scr";
    disqusScript.src = "//relatocorto.disqus.com/count.js";
    disqusScript.async = true;
    document.body.appendChild(disqusScript);
  });

  // Function to generate pagination controls with hidden numbers
  function generatePagination(totalPages, currentPage = 1) {
    let paginationHtml = '<div class="pagination-container">';
    paginationHtml += '<span class="itu_counts">';
    paginationHtml += `<span id="itu_masorny_posts_per_page">${postsPerPage}</span> / `;
    paginationHtml += `<span id="itu_max_masorny_posts">${totalPages * postsPerPage}</span>`;
    paginationHtml += "</span>";
    paginationHtml += '<div class="itu_pg">';

    // Helper function to add page links
    const addPageLink = (pageNum) => {
      return `<a class="page-numbers" href="/?paged=${pageNum}">${pageNum}</a>`;
    };

    // Display first page link
    if (currentPage > 4) {
      paginationHtml += addPageLink(1);
      paginationHtml += ' ... ';  // Ellipsis for skipped pages
    }

    // Display page numbers around the current page (show 3 before and 3 after)
    const startPage = Math.max(1, currentPage - 3); // Start from 3 pages before the current page
    const endPage = Math.min(totalPages - 1, currentPage + 3); // End at 3 pages after the current page

    for (let i = startPage; i <= endPage; i++) {
      if (i === currentPage) {
        paginationHtml += `<span class="current">${i}</span>`; // Highlight current page
      } else {
        paginationHtml += addPageLink(i);
      }
    }

    // Display last page link
    if (currentPage < totalPages - 3) {
      paginationHtml += ' ... ';  // Ellipsis for skipped pages
      paginationHtml += addPageLink(totalPages);
    }

    // Next page link
    paginationHtml += `<a class="next page-numbers" href="/?paged=${currentPage + 1}">Next</a>`;

    paginationHtml += "</div>";
    paginationHtml += "</div>";

    // Update pagination HTML
    $("#pagination").html(paginationHtml);
  }

  // Function to get random tags
  function getRandomTags(tags, count) {
    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, count);
    let tagHtml = "";

    selectedTags.each(function () {
      const tagName = $(this).data("name");
      const tagUrl = $(this).data("url");

      tagHtml += `<li><a href="${tagUrl}" rel="tag">${tagName}</a></li>`;
    });

    return tagHtml;
  }

  // Call the initializeBlogFeed function and load the Disqus script after completion
  initializeBlogFeed().done(function () {
    // Create and insert the Disqus script tag dynamically after blog feed is ready
    const disqusScript = document.createElement("script");
    disqusScript.id = "dsq-count-scr";
    disqusScript.src = "//relatocorto.disqus.com/count.js";
    disqusScript.async = true;
    document.body.appendChild(disqusScript);
  });

  // Function to initialize the menu
  function initializeMenu() {
    var ww = adjustMenuHolder();
    $(".itu_menu_holder").on(
      "click",
      ".itu_menu_button.itu_active",
      function () {
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
      }
    );

    $(".itu_menu_holder").on(
      "click",
      ".itu_menu_button:not(.itu_active)",
      function () {
        $(this).text("Cerrar").addClass("itu_active");
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
      }
    });
  }

  // Function to initialize search and social
  function initializeSearchAndSocial() {
    $(".itu_search").on("click", function () {
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

    $(".itu_social").on("click", function () {
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
  }

  // Adjust the width of the menu holder
  function adjustMenuHolder() {
    var ww = $(".itu_menu_holder").outerWidth() / 2;
    $(".itu_menu_holder").css({ marginLeft: -ww, width: ww * 2 });
    return ww;
  }

  // Load dynamic content and initialize scripts in sequence
  $.when(loadHeader(), loadSidebar(), loadOverlays(), loadWidgets())
    .done(function () {
      // Initialize the menu after all components are loaded
      initializeMenu();

      // Initialize the carousel if present
      loadCarousel()
        .done(function () {
          // Initialize the blog feed if present
          initializeBlogFeed()
            .done()
            .fail(function (error) {
              console.error(
                "An error occurred while initializing the blog feed:",
                error
              );
            });
        })
        .fail(function (error) {
          console.error("An error occurred while loading the carousel:", error);
        });

      // Initialize search and social after overlays are loaded
      initializeSearchAndSocial();
    })
    .fail(function (error) {
      console.error("An error occurred while loading dynamic content:", error);
    });
  // Get the current year
  const currentYear = new Date().getFullYear();
  // Set the year in the span with id 'copyright-year'
  document.getElementById("copyright-year").textContent = currentYear;
});
