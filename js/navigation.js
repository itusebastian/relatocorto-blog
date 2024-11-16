document.addEventListener("DOMContentLoaded", function () {
  // Get the current post URL
  const currentUrl = window.location.pathname;

  // Fetch the posts.json file
  fetch("/articles.json")
    .then((response) => response.json())
    .then((data) => {
      // Get all post URLs from the JSON data
      const postUrls = data.map((post) => post.url);

      // Find the index of the current post
      const currentIndex = postUrls.indexOf(currentUrl);

      // Determine the previous and next URLs
      const nextUrl = currentIndex > 0 ? postUrls[currentIndex - 1] : null;
      const prevUrl =
        currentIndex < postUrls.length - 1 ? postUrls[currentIndex + 1] : null;

      // Update the Previous and Next post links
      const prevPostLink = document.getElementById("prevPost");
      const nextPostLink = document.getElementById("nextPost");

      // Show only the previous link if it's the last post
      if (currentIndex === postUrls.length - 1) {
        // Hide the "Next" link for the last post
        nextPostLink.style.display = "none";
      } else {
        if (nextUrl) {
          nextPostLink.href = nextUrl;
          nextPostLink.style.display = "inline"; // Show if there is a next post
        } else {
          nextPostLink.style.display = "none"; // Hide if no next post
        }
      }

      // Handle the "Previous" link
      if (prevUrl) {
        prevPostLink.href = prevUrl;
        prevPostLink.style.display = "inline"; // Show if there is a previous post
      } else {
        prevPostLink.style.display = "none"; // Hide if no previous post
      }
    })
    .catch((error) => console.error("Error fetching blog posts:", error));

  // Fetch the tags.json file
  fetch("/tags.json")
    .then((response) => response.json())
    .then((data) => {
      // Shuffle tags and select 2 random tags
      const shuffledTags = data.sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, 2);

      // Create HTML for selected tags
      const tagsHtml = selectedTags
        .map((tag) => {
          const name = tag.name;
          const url = tag.url;
          return `<li><a href="${url}" rel="tag">${name}</a></li>`;
        })
        .join("");

      // Inject the tags HTML into the page
      const tagsHolder = document.querySelector("#tag-placeholder");
      if (tagsHolder) {
        tagsHolder.innerHTML = tagsHtml;
      }
    })
    .catch((error) => console.error("Error fetching tags:", error));

  // Inject the HTML for comments and share links
  const postCommentAndShareHtml = `
      <div class="itu_blog_post_cat_holder">
        <span class="itu_blog_comment_holder">
          <a href="${currentUrl}#disqus_thread">Link</a>
        </span>
        <span class="itu_blog_tag_holder hidden-xs">
          <ul class="itu_many_tags">
            <li><i class="fa fa-angle-down"></i>
            <a>Tags</a>
            <ul id="tag-placeholder"> 
            <!-- Tags will be dynamically added here -->
            </ul>
          </ul>
        </span>
      </div>
    `;

  // Inject the HTML into the page
  const shareAndCommentHolder = document.querySelector("#share-placeholder");
  if (shareAndCommentHolder) {
    shareAndCommentHolder.innerHTML = postCommentAndShareHtml;
  }
});

// Use jQuery in noConflict mode
jQuery(document).ready(function ($) {
  $(".itu_share_holder").on("click", ".itu_share_button", function () {
    $(this).siblings(".itu_share_cont").slideToggle(300);
  });
});
