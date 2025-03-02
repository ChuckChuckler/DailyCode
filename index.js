import express, { response } from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";

let app = express();
app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("static"));
app.use(express.json());

let userName;
let projectName;
let projectDesc;
let creationTime;
let projectRepo;
let projectDemo;
let upvoteNum;

const uri = "mongodb+srv://goofyahhsharma:GrumioInTheRoomio69@yeowch.h97dzjw.mongodb.net/?retryWrites=true&w=majority&appName=yeowch";

const client = new MongoClient(uri);

await client.connect();
const projectDB = client.db("dailyCodeDB");
const projects = projectDB.collection("projects");

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/getProjects", async(req, res)=>{
    let projectsArr;
    try{
        projectsArr = await projects.find({}).toArray();
        console.log(projectsArr);
        console.log("working? possibly? maybe?");
        res.send({"message":"success", "projects":projectsArr});
    }
    catch(err){
        console.log(err);
    }
})

app.post("/projectCreate", async (req, res)=>{
    let user = req.body.name;
    let projectName = req.body.projectName;
    let projectDesc = req.body.projectDesc;
    let creationTime = req.body.time;
    let repoLink = req.body.repoLink;
    let demoLink = req.body.demoLink;

    try{
        let allProjects = await projects.find({projectName: projectName}).toArray();
        if(allProjects.length > 0){
            res.send({"message":`There is already a project named ${projectName}`});
        }
        projects.insertOne({
            user: user,
            projectName: projectName,
            projectDesc: projectDesc,
            repoLink: repoLink,
            demoLink: demoLink,
            upvotes: 0,
            creationTime: creationTime
        });
        console.log("success pookie bookie");
        res.send({"message":"success"});
    }catch(e){
        console.log(e);
        res.send({"message":e});
    }
});

app.post("/upvote", async (req, res)=>{
    if(req.body.status == "up"){
        upvoteNum+=1;
    }else{
        upvoteNum-=1;
    }

    await projects.updateOne(
        { projectName: projectName }, 
        { $set: { upvotes: upvoteNum } } 
    );

    res.send({"message":"skibidi", "newNum":upvoteNum});
})

app.post("/addComment", async (req, res)=>{
    let projectName = req.body.projectName;
    let existingComments = req.body.comments;
    let commentorName = req.body.commentorName;
    let comment = req.body.comment;
    try{
        projects.updateOne({projectName:projectName}, {comments: existingComments.append([commentorName, comment])});
        res.send({"message":"success"});
    }catch(e){
        res.send({"message":e});
    }
})

app.post("/displayProject", async (req, res)=>{
    userName = req.body.userName;
    projectName = req.body.projectName;
    projectDesc = req.body.projectDesc;
    creationTime = req.body.creationTime;
    projectRepo = req.body.projectRepo;
    projectDemo = req.body.projectDemo;
    upvoteNum = req.body.upvotes;
    console.log(projectName);
    res.send({"message":"success"});
})

app.get('/rdrctProject', (req, res)=>{
    res.render("project", { "username":userName, "projectName":projectName, "projectDesc":projectDesc, "creationTime":creationTime, "projectRepo":projectRepo, "projectDemo":projectDemo, "upvoteNum":upvoteNum });
})

app.listen(8080, () => {
    console.log(`listening on 8080`);
});
