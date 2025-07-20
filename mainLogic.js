setupui();
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
    let addPost = document.getElementById("addPost");
    if(token){
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("logOut").style.display = "block";
        document.getElementById("navImageName").style.display = "block";
        document.getElementById("navUserName").style.display = "block";
        document.getElementById("send").style.display = "block";
        document.getElementById("postComment").style.display = "block";
        if(addPost){
            addPost.style.display = "flex";
        }
        const user = getCurrentUser();
        document.getElementById("navUserName").innerHTML = `@${user.username}`;
        document.getElementById("navImageName").src = `${user.profile_image}`;
    } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";
        document.getElementById("logOut").style.display = "none";
        document.getElementById("navUserName").style.display = "none";
        document.getElementById("navImageName").style.display = "none";
        document.getElementById("send").style.display = "none";
        document.getElementById("postComment").style.display = "none";
        if(addPost){
            addPost.style.display = "none";
        }
    }
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
        alert("Not found maybe password or userName is wrong");
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