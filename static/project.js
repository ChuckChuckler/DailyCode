var upvotes;

function setup(username, projectName, projectDesc, creationTime, projectRepo, projectDemo, upvoteNum){
  document.getElementById("projectName").innerText = projectName;
  document.getElementById("username").innerText = `By ${username}`;
  document.getElementById("creationTime").innerText = `Created at ${creationTime}`;
  document.getElementById("projectRepo").href = projectRepo;
  document.getElementById("projectDemo").href = projectDemo;
  document.getElementById("projectDescription").innerText = projectDesc;
  document.getElementById("upvotes").innerText = `${upvoteNum}`;
  upvotes = upvoteNum;
}

function updateUpvotes(status){
  fetch("/upvote", {
    method: "POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({status: status})
  })

  .then(response=>{
    if(!response.ok){
      console.log("response not ok");
    }else{
      return response.json();
    }
  })

  .then(data=>{
    upvotes = data.newNum;
    document.getElementById("upvotes").innerText = `${upvotes}`;
  })
}
