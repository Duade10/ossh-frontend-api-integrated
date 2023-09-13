document.addEventListener('DOMContentLoaded', function () {
    const blogPostContainer = document.getElementById("blogposts-container");
    const paginationContainer = document.querySelector(".pagination-container");

    let currentPage = 1;  // Initialize current page to 1
    const postsPerPage = 10;  // Number of posts per page

    function handleSinglePostClick(e) {
        const button = e.target.closest('.single-post-button');

        if (button) {
            const singlePostId = button.getAttribute('data-post-id');
            localStorage.setItem("single-post-id", singlePostId);
            location.assign(`blogpage.html?id=${singlePostId}`);
        }
    }


    // Function to fetch and display blog posts for a given page
    function fetchBlogPosts(page) {
        fetch(`https://osunstartuphubapi.pythonanywhere.com/api/blog/?page=${page}&page_size=${postsPerPage}`, {
            method: 'GET',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(result => {
                function formatBlogPost(singlePost) {
                    return `
                    <div class="col-lg-4" id="single-post">
                        <div class="imgwrap">
                            <img src="${singlePost.image}" alt="blogpost" class="img-fluid img-responsive">
                        </div>
                        <small>${singlePost.date_created_str}</small>
                        <h6>${singlePost.title}</h6>
                        <a class="single-post-link"><button class="single-post-button" data-post-id="${singlePost.id}">Read More</button></a>
                    </div>`;
                }

                const blogPostData = result.results;
                const formattedBlogPosts = blogPostData.map(formatBlogPost).join('');
                blogPostContainer.innerHTML = formattedBlogPosts;

                // Update pagination links
                updatePagination(result.count);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to update pagination links based on the total number of posts
    function updatePagination(totalPosts) {
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        paginationContainer.innerHTML = '';  // Clear existing pagination links

        const ul = document.createElement('ul');
        ul.classList.add('pagination', 'justify-content-center');

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');

            const a = document.createElement('a');
            a.classList.add('page-link');
            a.textContent = i;

            a.addEventListener('click', () => {
                currentPage = i;
                fetchBlogPosts(currentPage);
            });

            if (i === currentPage) {
                li.classList.add('active');
            }

            li.appendChild(a);
            ul.appendChild(li);
        }

        paginationContainer.appendChild(ul);
    }


    // Fetch and display initial blog posts
    fetchBlogPosts(currentPage);
    blogPostContainer.addEventListener('click', handleSinglePostClick);
});
