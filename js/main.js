window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    const getImg = document.getElementById("getImg");
    const imgList = document.getElementById("imgList");
    const getImgJSX = "getImg.jsx";

    const http = require("http");
    const fs = require("fs");
    const ejs = require("ejs");
    const qs = require("qs");
    const server = http.createServer();
    const url = 3000;
    let msg;
    let n = 0;
    const template = fs.readFileSync(__dirname + "/js/public/form.ejs","utf-8");
    const PSForm = fs.readFileSync(__dirname + "/js/public/fromPS.ejs","utf-8");
    const resultForm = fs.readFileSync(__dirname + "/js/public/result.ejs","utf-8");
    let posts = [];
    
    
    getImg.addEventListener("click",()=>{
        csInterface.evalScript(`$.evalFile("${extensionRoot}${getImgJSX}")`,(o)=>{
            console.log(o);
            const images = JSON.parse(o);
            console.log(images);
            images.forEach(v=>{
                const li = document.createElement("li");
                li.textContent = v;
                li.classList.add("img");
                imgList.appendChild(li);
            });
        });
    });
    
    server.on("request",(req,res)=>{
        console.log(req.url);
        n++
        
        switch(req.url){
            case "/form":
                if(req.method === "POST"){
                    req.data = "";
                    req.on("data",chunk=>{
                        req.data += chunk;
                    });
                    req.on("end",()=>{
                        const query = qs.parse(req.data);
                        posts.push(query.name);
                        renderForm(posts,res);
                    });
                }else{
                    renderForm(posts,res);    
                }
            
            return;
                
            case "/fromPS":
                const img = Array.from(document.getElementsByClassName("img"));
                const list = img.map(v => v.textContent);
                console.log(list);
                renderPS(PSForm,list,"got Images",res);
                return;
                
            case "/result":
                if(req.method === "POST"){
                    req.data = "";
                    req.on("data",chunk=>{
                        req.data += chunk;
                    });
                    req.on("end",()=>{
                        const query = qs.parse(req.data);
                        console.log(query.paths);
                        const posts = query.paths.map(v => v);
                        renderPS(resultForm,posts,"sent images",res);
                        csInterface.evalScript(`openImages(${JSON.stringify(posts)})`,(o)=>{
                            alert("opened");
                        });
                    });
                }else{
                    res.writeHead(200,{"Content-type": "text/plain"});
                    res.write("error");
                    res.end();
                }
                return;
                
            case "/profile":
                msg = "about me";
                break;
            
            default:
                msg = "wrong page";
                break;
        }
        res.writeHead(200,{"Content-type": "text/plain"});
        res.write(msg);
        res.end();
    });
    
    function renderForm(posts,res){
        const data = ejs.render(template,{
                        title: "kawano",
                        content: "<strong>World!</strong>",
                        n:n,
                        posts:posts
                    });
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write(data);
        res.end();
    }
    
    function renderPS(temp,list,title,res){
        const data = ejs.render(temp,{
            title:title,
            images:list
        });
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write(data);
        res.end();
    }

    server.listen(url);
}
    
