function show_password(){
    const password = document.getElementById("password");
    if(password.getAttribute("type") === "password"){
        password.setAttribute("type","text");
    }
    else{
        password.setAttribute("type","password");
    }
}

function navigateTo(path){
    window.location.href = path;
}

function check_email(email){
    let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    let result = regex.test(email);
    return result;
}

const not_logged_in = document.getElementById("not_logged_in");
const logged_in = document.getElementById("logged_in");
    
if(JSON.parse(localStorage.getItem("user")) !== null){
    not_logged_in.style.display = "none";
    logged_in.style.display = "";
}
else{
    not_logged_in.style.display = "";
    logged_in.style.display = "none";
}

async function logout(){
    const response = await fetch("http://localhost:3000/logout");
    const data = await response.json();

    if(data.msg === "Deletetd Successfully"){
        localStorage.removeItem("user");
    }

    window.location.reload();
}