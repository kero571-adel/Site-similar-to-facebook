function setupui(){
    const token = localStorage.getItem("token");
    if(token){
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
    }else{
        document.getElementById("logOut").style.display = "none";
    }
}
let posts = document.querySelector(".posts");
window.onload = ()=>{
    setupui();
    axios.get('https://tarmeezacademy.com/api/v1/posts?limit=5')
    .then((response)=>{
        console.log(response);
        let p = response.data.data.map((ele)=>{
            return(
                `
                    <div class="card shadow-sm my-2">
                        <div class="card-header">
                            <img src="${ele.author.profile_image}" alt="" style="width: 40px;height: 40px;"class="rounded-circle shadow-sm">
                            <b>@${ele.author.username}</b>
                        </div>
                        <div class="card-body">
                            <img src="${ele.image}" class="w-100" alt="">
                            <h6 class="text-secondary">${ele.created_at}</h6>
                            <h5>${ele.title}</h5>
                            <p>${ele.body}</p>
                            <hr/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <b>(${ele.comments_count}) comment</b>
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
        const toastElement = document.getElementById('toast-success');
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
        document.getElementById("logOut").style.display = "block";
        let toast = new bootstrap.Toast(toastElement);
        toast.show();
    })
    .catch((error)=>{
        console.log(error);
        alert("Not found maybe password or userName is wrong");
    });
}
function logOut(){
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    //window.location.reload();
    document.getElementById("logOut").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "block";
}