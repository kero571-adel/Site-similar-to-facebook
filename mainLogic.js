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
