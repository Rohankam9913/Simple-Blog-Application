const sel = document.getElementById("select");
let tags = [];

function cancel_tag(e){
    const item = document.getElementById(e.target.id);
    item.remove();
    tags = tags.filter((tag)=> tag === item.value);
}

function add_tag(){
    let val = sel.value;
            
    if(tags.includes(val)){
        return;
    }

    tags.push(val);
    const li = document.createElement("li");
    li.innerHTML = `${val} ❌`;

    li.id = `id_${tags.length}`;
    li.addEventListener("click",cancel_tag);

    li.classList.add("tag_name");

    const list = document.querySelector(".list");
    list.appendChild(li);
}

async function like_btn(i){ 
    const btn_id = document.getElementById(`${i}`);
    let commentId = btn_id.parentElement.id;

    const response = await fetch("http://localhost:3000/comments/update_like",{
        method : "PUT",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({commentId})
    });
    
    const data = await response.json();

    if(!data.error){
        btn_id.innerHTML = `Likes (${data.likes})`;
    }
}