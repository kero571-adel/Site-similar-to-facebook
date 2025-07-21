setupui();
let currentPage = 1;
let lastPage = 1
let idPost = "";
//profile page

//profile page
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
        document.querySelector(".loader").style.display ="none";
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
                        <div class="card-header d-flex alien-item-center justify-content-space-between">
                            <div style="cursor: pointer" onClick="showPost(${ele.author.id})">
                                <img src="${typeof ele.author.profile_image === 'string' ? ele.author.profile_image : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}" alt="" style="width: 40px;height: 40px;" class="rounded-circle shadow-sm">
                                <b>@${ele.author.username}</b>
                            </div>
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
        alert("Logout failed", error.response.data);
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
    .then(()=>{
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
function getCurrentUser(){
    let user = null;
    const storageUser = localStorage.getItem("currentUser");
    if(storageUser){
        user = JSON.parse(storageUser);
    }
    return user
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
      const modal = bootstrap.Modal.getInstance(document.getElementById('editPost'));
      modal.hide();
      getPosts();
      const toastElement = document.getElementById('toast-success');
      let toast = new bootstrap.Toast(toastElement);
      toast.show();
    })
    .catch((error) => {
        alert("❌ Error editing post", error.response?.data || error);
    });
}
function delPost() {
    const token = localStorage.getItem("token");
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${idPost}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      getPosts();
      const modalElement = document.getElementById('delPost');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
  
      const toastElement = document.getElementById('toast-success');
      if (toastElement) {
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    })
    .catch((error) => {
        alert("❌ Error editing post", error.response?.data || error);
    });
}  
function loginBtnOnClick(){
    let userNameLogin = document.getElementById("recipient-name").value;
    let passwordLogin = document.getElementById("exampleInputPassword1").value;
    axios.post('https://tarmeezacademy.com/api/v1/login', {
    "username": userNameLogin,
    "password": passwordLogin
    })
    .then((response)=>{
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("currentUser",JSON.stringify(response.data.user));
        bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
        setupui();
        const toastElement = document.getElementById('toast-success');
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch((error)=>{
        console.log(error);
    });
}
function registerBtnClick(){
    let userName = document.getElementById("register-userName").value;
    let name = document.getElementById("register-name").value;
    let password = document.getElementById("register-password").value;
    const imageInput = document.getElementById("register-image").files[0];
    let formData = new FormData();
    formData.append("username",userName);
    formData.append("name",name);
    formData.append("password",password);
    formData.append("image",imageInput);
    axios.post('https://tarmeezacademy.com/api/v1/register',formData,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then((response)=>{
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("currentUser",JSON.stringify(response.data.user));
        bootstrap.Modal.getInstance(document.getElementById("exampleModalRegister")).hide();
        setupui();
        const toastElement = document.getElementById('toast-success');
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch((error)=>{
       alert(error);
    });
}
function setupui() {
    const token = localStorage.getItem("token");
    let addPost = document.getElementById("addPost");

    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const logoutBtn = document.getElementById("logOut");
    const navUserName = document.getElementById("navUserName");
    const navImageName = document.getElementById("navImageName");
    const sendBtn = document.getElementById("send");
    const postComment = document.getElementById("postComment");
    const editBtns = document.querySelectorAll("#editBtn");

    if (token) {
        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "block";
        if (navImageName) navImageName.style.display = "block";
        if (navUserName) navUserName.style.display = "block";
        if (sendBtn) sendBtn.style.display = "block";
        if (postComment) postComment.style.display = "block";
        if (addPost) addPost.style.display = "flex";
        editBtns.forEach(btn => {
            btn.style.display = "block";
          });          

        const user = getCurrentUser();
        if (navUserName) navUserName.innerHTML = `@${user.username}`;
        if (navImageName) navImageName.src = `${typeof user.profile_image === 'string' ? user.profile_image : 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}`;
    } else {
        if (loginBtn) loginBtn.style.display = "block";
        if (registerBtn) registerBtn.style.display = "block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (navUserName) navUserName.style.display = "none";
        if (navImageName) navImageName.style.display = "none";
        if (sendBtn) sendBtn.style.display = "none";
        if (postComment) postComment.style.display = "none";
        if (addPost) addPost.style.display = "none";
        editBtns.forEach(btn => {
            btn.style.display = "none";
          });
          
    }
}
function showPost(id){
    window.location = `profile.html?userId=${id}`;
}
function profiledClick(){
    let user = getCurrentUser();
    if(user){
        window.location = `profile.html?userId=${user.id}`;
    }else{
        window.location = `profile.html`;
    }
}