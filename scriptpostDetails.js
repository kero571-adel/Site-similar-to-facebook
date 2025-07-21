const urlPrams = new URLSearchParams(window.location.search);
const id = urlPrams.get("postId");
function getPostsDetails() {
    document.querySelector(".loader").style.display="grid";
document.getElementById("comments").innerHTML = "";
axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
        document.querySelector(".loader").style.display="none";
    const post = response.data.data;
    const comments = post.comments;
    const author = post.author;
    let commentsPost = comments.map((c)=>{
        return(`
            <div>
            <img src="${typeof post.author.profile_image === 'string' ? post.author.profile_image : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}" class="rounded-circle" style="width: 40px;height: 40px;"/>
            <b>@${c.author.username}</b>
        </div>
        <div>${c.body}</div>
        `)
    })
    document.getElementById("comments").innerHTML = commentsPost;
    document.getElementById("username-span").innerHTML = author.username;
    document.getElementById("showPostUserName").innerHTML = author.username;
    document.getElementById("showPostimage").src =
    typeof author.profile_image === "string" && author.profile_image.trim() !== ""
    ? author.profile_image
    : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";
    document.getElementById("image-card-body").src =
    typeof post.image === "string" && post.image.trim() !== ""
        ? post.image
        : "";
    document.getElementById("time").innerHTML = author.created_at;
    document.getElementById("title").innerHTML = post.title;
    document.getElementById("p").innerHTML = post.body;
    const commentCount = document.getElementById("comment");
    if (commentCount && post.comments_count !== undefined) {
        commentCount.innerHTML = `(${post.comments_count}) comment`;
    }

    })
    .catch((error) => {
        document.querySelector(".loader").style.display="none";
        alert("Logout failed", error.response.data);
    });
}

function createCommentClick() {
    document.querySelector(".loader").style.display="grid";
let commentBody = document.getElementById("postComment").value.trim();
if (!commentBody) {
    document.querySelector(".loader").style.display="none";
    alert("الرجاء كتابة تعليق قبل الإرسال");
    return;
}
const token = localStorage.getItem("token");
axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, {
    body: commentBody
}, {
    headers: {
    Authorization: `Bearer ${token}`
    }
})
    .then(() => {
        document.querySelector(".loader").style.display="none";
        document.getElementById("postComment").value = "";
        getPostsDetails();
        const toastElement = document.getElementById('toast-success');
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch(error => {
        document.querySelector(".loader").style.display="none";
        alert("خطأ أثناء إرسال التعليق:", error.response?.data || error.message);
    });
}
getPostsDetails();