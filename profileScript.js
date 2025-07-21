const urlPrams = new URLSearchParams(window.location.search);
const id = urlPrams.get("userId");
const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
const defaultPostImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
function isValidHttpUrl(string) {
  try {
    let url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}
function getUserProfile() {
    document.querySelector(".loader").style.display="grid";
  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response) => {
        document.querySelector(".loader").style.display="none";
        const user = response.data.data;
        document.getElementById("email").innerHTML = user.email;
        document.getElementById("name").innerHTML = user.name;
        document.getElementById("userName").innerHTML = user.username;
        document.getElementById("commentCount").innerHTML = user.comments_count;
        document.getElementById("postCount").innerHTML = user.posts_count;
        document.getElementById("name-post").innerHTML = user.username;
        if (typeof user.profile_image === "string" && user.profile_image.trim() !== "") {
            document.getElementById("image").src = user.profile_image;
        } else {
            document.getElementById("image").src = defaultAvatar;
        }        
    })
    .catch(error => {
        document.querySelector(".loader").style.display="none";
        if (error.response && error.response.status === 404) {
          alert("❌ المستخدم غير موجود");
          window.location = "index.html";
        } else {
            alert("❌ خطأ غير متوقع:", error);
        }
    })
}
getUserProfile();
function getPosts() {
    document.querySelector(".loader").style.display="grid";
  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response) => {
        document.querySelector(".loader").style.display="none";
        let user = getCurrentUser();
        let p = response.data.data.map((ele) => {
            let editButtonContent = ``;
            const isMyPost = user != null && ele.author.id === user.id;
            if (isMyPost) {
            editButtonContent = `
                <button class="rounded" style="float:right;background-color: gray;color:white;font-weight:bold" onclick='editPsotBtnClicked("${ele.title}", "${ele.body}", ${ele.id})' data-bs-toggle="modal" data-bs-target="#editPost" id="editBtn">Edit</button>
                <button class="rounded mx-3" style="float:right;background-color: red;color:white; font-weight:bold" onclick='prepareDelete(${ele.id})' data-bs-toggle="modal" data-bs-target="#delPost" id="deltBtn">delete</button>
            `;
            }

            const authorImage =
            isValidHttpUrl(ele.author.profile_image) && !ele.author.profile_image.includes("localhost")
                ? ele.author.profile_image
                : defaultAvatar;

            let postImage = defaultPostImage;
            if (typeof ele.image === "string" && ele.image.trim() !== "") {
            if (isValidHttpUrl(ele.image)) {
                postImage = ele.image.includes("localhost") ? defaultPostImage : ele.image;
            } else {
                postImage = "https://tarmeezacademy.com" + ele.image;
            }
            }

            const tags = Array.isArray(ele.tags)
            ? ele.tags.map(t => `<button class="btn btn-secondary mx-1">${t.name}</button>`).join('')
            : '';

            return `
            <div class="card shadow-sm my-2">
                <div class="card-header">
                <img src="${authorImage}" alt="" style="width: 40px;height: 40px;" class="rounded-circle shadow-sm">
                <b>@${ele.author.username}</b>
                ${editButtonContent}
                </div>
                <div class="card-body" onClick="postDetails(${ele.id})" style="cursor: pointer">
                <img src="${postImage}" class="w-100" alt="">
                <h6 class="text-secondary">${ele.created_at}</h6>
                <h5>${ele.title}</h5>
                <p>${ele.body}</p>
                <hr/>
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <b class="mx-1">(${ele.comments_count}) comment</b>
                    <div class="d-flex mx-2">${tags}</div>
                </div>
                </div>
            </div>
            `;
        });

        document.querySelector(".userPosts").innerHTML += p.join('');
    })
    .catch((error) => {
        document.querySelector(".loader").style.display="none";
        alert(error);
    });
} 
getPosts();
function prepareDelete(postId) {
    idPost = postId;
}