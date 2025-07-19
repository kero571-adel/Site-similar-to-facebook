function getCurrentUser(){
    let user = null;
    const storageUser = localStorage.getItem("currentUser");
    if(storageUser){
        user = JSON.parse(storageUser);
    }
    return user
}
function setupui() {
    console.log("setupui()");
    const token = localStorage.getItem("token");
    if(token){
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("logOut").style.display = "block";
        document.getElementById("navImageName").style.display = "block";
        document.getElementById("navUserName").style.display = "block";
        document.getElementById("addPost").style.display = "flex";
        const user = getCurrentUser();
        document.getElementById("navUserName").innerHTML = `@${user.username}`;
        document.getElementById("navImageName").src = `@${user.profile-image}`;
    } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";
        document.getElementById("logOut").style.display = "none";
        document.getElementById("navUserName").style.display = "none";
        document.getElementById("navImageName").style.display = "none";
        document.getElementById("addPost").style.display = "none";
    }
}
setupui();
function getPosts(){
    let posts = document.querySelector(".posts");
    axios.get('https://tarmeezacademy.com/api/v1/posts?limit=5')
    .then((response)=>{
        console.log(response);
        let tags;
        let p = response.data.data.map((ele)=>{
            tags = Array.isArray(ele.tags)
            ? ele.tags.map(t => `<button type="button" class="btn btn-secondary mx-1">${t.name}</button>`).join(''): '';          
            return(
                `
                    <div class="card shadow-sm my-2">
                        <div class="card-header">
                            <img src="${typeof ele.author.profile_image === 'string' ? ele.author.profile_image : 'default.jpg'}" alt="" style="width: 40px;height: 40px;" class="rounded-circle shadow-sm">
                            <b>@${ele.author.username}</b>
                        </div>
                        <div class="card-body">
                            <img src="${typeof ele.image === 'string' ? ele.image : 'default-post.jpg'}" class="w-100" alt="">
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
        posts.innerHTML = p.join('');
    })
    .catch((error)=>{
        alert(error);
    })
}
getPosts();
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
        alert("Not found maybe password or userName is wrong");
    });
}
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