let currentPage = 1;
let lastPage = 1
let idPost = "";
window.addEventListener("scroll",()=>{
    const endOfHeight = window.innerHeight+window.pageYOffset >= document.body.offsetHeight;
    if (endOfHeight && currentPage < lastPage) {
        currentPage += 1;
        getPosts(false, currentPage);
    }
});
function postDetails(postid){
    location=`postDetails.html?postId=${postid}`;
}
function getPosts(reload = true,page){
    let posts = document.querySelector(".posts");
    if (!posts) {
        return;
    }
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
    .then((response)=>{
        console.log(response);
        lastPage = response.data.meta.last_page;
        if(reload){
            posts.innerHTML = "";
        }
        let tags;
        let user = getCurrentUser();
        let p = response.data.data.map((ele) => {
            let editButtonContent = ``;
            const isMyPost = user != null && ele.author.id === user.id;
            if (isMyPost) {
                editButtonContent = `
                    <button class="rounded" style="float:right;background-color: gray;color:white;font-weight:bold" onclick='editPsotBtnClicked("${ele.title}", "${ele.body}", ${ele.id})' data-bs-toggle="modal" data-bs-target="#editPost" id="editBtn">Edit</button>
                    <button class="rounded mx-3" style="float:right;background-color: red;color:white; font-weight:bold" onclick='${idPost=ele.id}' data-bs-toggle="modal" data-bs-target="#delPost" id="deltBtn">delete</button>
                `;
            }        
            tags = Array.isArray(ele.tags)
            ? ele.tags.map(t => `<button type="button" class="btn btn-secondary mx-1">${t.name}</button>`).join(''): '';          
            return(
                `
                    <div class="card shadow-sm my-2">
                        <div class="card-header">
                            <img src="${typeof ele.author.profile_image === 'string' ? ele.author.profile_image : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}" alt="" style="width: 40px;height: 40px;" class="rounded-circle shadow-sm">
                            <b>@${ele.author.username}</b>
                            ${editButtonContent}
                        </div>
                        <div class="card-body" onClick="postDetails(${ele.id})"style="cursor: pointer">
                            <img src="${typeof ele.image === 'string' ? ele.image : ''}" class="w-100" alt="">
                            <h6 class="text-secondary">${ele.created_at}</h6>
                            <h5>${ele.title}</h5>
                            <p>${ele.body}</p>
                            <hr/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <b>(${ele.comments_count}) comment</b>
                            <div class="d-flex">${tags}</div>
                        </div>
                    </div>
                `
            )
        });
        posts.innerHTML += p.join('');
    })
    .catch((error)=>{
        alert(error);
    })
}
getPosts();
function logOut(){
    const token = localStorage.getItem("token");
    axios.post("https://tarmeezacademy.com/api/v1/logout", {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    })
    .then(()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setupui();
        const toastElement = document.getElementById('toast-success');
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch(error => {
        console.error("Logout failed", error.response.data);
    });
}
function createNewPost(){
    let title = document.getElementById("poat-title").value;
    let body = document.getElementById("poat-body").value;
    const imageInput = document.getElementById("post-image").files[0];
    let formData = new FormData();
    formData.append("title",title);
    formData.append("body",body);
    formData.append("image",imageInput);
    axios.post('https://tarmeezacademy.com/api/v1/posts',formData,{
        headers: {
            "authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
        }
    })
    .then((response)=>{
        console.log(response);
        bootstrap.Modal.getInstance(document.getElementById("createNewPost")).hide();
        const toastElement = document.getElementById('toast-success');
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
        getPosts();
    })
    .catch((error)=>{
        alert(error.response.data.message);
    });
}
function editPsotBtnClicked(title, body, id) {
    document.getElementById("editPost-poat-title").value = title;
    document.getElementById("editPost-poat-body").value = body;
    idPost = id;
}
function editDataPost() {
    const token = localStorage.getItem("token");
    const title = document.getElementById("editPost-poat-title").value;
    const body = document.getElementById("editPost-poat-body").value;
    const data = {
      title,
      body
    };
    axios.put(`https://tarmeezacademy.com/api/v1/posts/${idPost}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      console.log("✅ Edited", response.data);
      const modal = bootstrap.Modal.getInstance(document.getElementById('editPost'));
      modal.hide();
      getPosts();
      const toastElement = document.getElementById('toast-success');
      let toast = new bootstrap.Toast(toastElement);
      toast.show();
    })
    .catch((error) => {
      console.error("❌ Error editing post", error.response?.data || error);
    });
}
function delPost() {
    const token = localStorage.getItem("token");
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${idPost}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("✅ Edited", response.data);
      const modal = bootstrap.Modal.getInstance(document.getElementById('delPost'));
      modal.hide();
      getPosts();
      const toastElement = document.getElementById('toast-success');
      let toast = new bootstrap.Toast(toastElement);
      toast.show();
    })
    .catch((error) => {
      console.error("❌ Error editing post", error.response?.data || error);
    });
}
  