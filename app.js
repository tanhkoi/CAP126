const API_URL = "http://localhost:3000";

// Load danh sách bài viết
async function loadPosts() {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await response.json();
    const postList = document.getElementById("postList");
    postList.innerHTML = "";
    posts.forEach(post => {
        if (post.deleted) return;
        const li = document.createElement("li");
        li.innerHTML = `${post.title} - ${post.content} (Tác giả: ${post.authorName})
                            <button onclick="deletePost(${post.id})">Xóa</button>`;
        postList.appendChild(li);
    });
}

// Load danh sách tác giả
async function loadAuthors() {
    const response = await fetch(`${API_URL}/authors`);
    const authors = await response.json();
    const select = document.getElementById("author");
    const authorList = document.getElementById("authorList");
    select.innerHTML = "";
    authors.forEach((author) => {
        //
        const li = document.createElement("li");
        li.innerHTML = `${author.name} - Số bài post: ${author.postCount}
                            <button onclick="deletePost(${author.id})">Xóa</button>`;
        authorList.appendChild(li);
        //
        const option = document.createElement("option");
        option.value = author.id;
        option.textContent = author.name;
        select.appendChild(option);
    });
}

// Tạo bài viết mới
document
    .getElementById("postForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;
        const authorId = document.getElementById("author").value;

        const authorResponse = await fetch(`${API_URL}/authors/${authorId}`);
        const author = await authorResponse.json();

        const newPost = {
            title,
            content,
            authorId,
            authorName: author.name,
            deleted: false,
        };

        // Tạo bài post
        await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPost),
        });

        // Tăng số lượng bài viết của tác giả
        await fetch(`${API_URL}/authors/${authorId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postCount: author.postCount + 1 }),
        });

        loadPosts();
    });

// Tạo tác giả mới
document
    .getElementById("authorForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const newAuthor = {
            name,
            postCount: 0,
        }

        await fetch(`${API_URL}/authors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newAuthor),
        });

        console.log(newAuthor);

        loadAuthors();
    });


// Xóa mềm bài viết
async function deletePost(id) {
    await fetch(`${API_URL}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleted: true }),
    });
    loadPosts();
}

// Khởi động
window.onload = () => {
    loadPosts();
    loadAuthors();
};
