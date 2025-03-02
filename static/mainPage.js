var projects;

window.onload = function(){
    console.log("load");
    setupPage();
}

function setupPage(){
console.log("loaded");
fetch("/getProjects", {
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    }
})

.then(response=>{
    if(!response.ok){
        console.log("response not ok");
    }else{
        return response.json();
    }
})

.then(data=>{
    if(data.message=="success"){
        projects = data.projects;

        console.log(projects.length);
        
        for(const project of projects){
            console.log(project);
            let holderDiv = document.createElement("div");
            holderDiv.className = "col";

            let innerHolder = document.createElement("div");
            innerHolder.className = "card-h-100";

            let divBody = document.createElement("div");
            divBody.className = "card-body";
            
            let username = document.createElement('h6');
            username.innerText = project.user;
            username.className = "card-title";

            let projectName = document.createElement('h5');
            projectName.innerText = project.projectName;
            projectName.className = "card-title";

            let description = document.createElement('p');
            description.innerText = project.projectDesc;
            description.className = "card-text";

            divBody.append(username, projectName, description);

            let divFooter = document.createElement("div");
            divFooter.className = "card-footer";
            
            let creationTime = document.createElement('small');
            creationTime.innerText = project.creationTime;
            creationTime.className = "text-body-secondary";

            let upvotes = document.createElement('small');
            upvotes.innerText = `${project.upvotes} upvotes`;
            upvotes.className = "text-body-secondary";

            divFooter.append(creationTime, document.createElement("br"), upvotes);
            
            innerHolder.append(divBody, divFooter);

            holderDiv.append(innerHolder);

            holderDiv.onclick = function(){
                fetch("/displayProject", {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        userName: project.user,
                        projectName: project.projectName,
                        projectDesc: project.projectDesc,
                        projectRepo: project.projectRepo,
                        projectDemo: project.projectDemo,
                        upvotes: project.upvotes
                    })
                })

                .then(response=>{
                    if(!response.ok){
                        console.log("response not ok");
                    }else{
                        return response.json();
                    }
                })

                .then(data=>{
                    if(data.message == "success"){
                        window.location.href = "/rdrctProject";
                    }
                })
            }

            document.getElementById("projectDisplay").append(holderDiv);
        }
    }
})
}

for(i = 0; i < 10; i++){
    const project = [projects[0],projects[1],projects[4]];
    leaderBoard.push(project);
}

async function createPost(){
    let username = document.getElementById("username").value;
    let projectName = document.getElementById("projectName").value;
    let time = new Date().toLocaleTimeString();
    let projectRepo = document.getElementById("repo").value;
    let projectDemo = document.getElementById("demo").value;
    let projectDescription = document.getElementById("description").value;

    const info = {
        name: username,
        projectName: projectName,
        projectDesc: projectDescription,
        projectRepo: projectRepo,
        projectDemo: projectDemo,
        time: time
    };

    try {
        const response = await fetch("/projectCreate",{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(info)
        })

        if(!response.ok){
            throw new Error("Failed to fetch");         
        }

    } catch (error) {
        console.error("Failed");
    }
    console.log(info);
}

document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function() {
        const description = button.closest('.entry').querySelector('.challenge-description');
        description.style.display = description.style.display === 'none' ? 'block' : 'none';
    });
});

