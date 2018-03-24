var express = require('express');
var fs = require("fs");
var path = require("path");
var cookieParser = require("cookie-parser");
var app = express();


app.use(express.static('public'));
app.use(cookieParser());

// app.get('/getinfo', function(req, res){
//     res.status(200).send('Web Programming is Cool!!!');
// });

var dictionary = [];

fs.readFile("./words.json","utf-8",function(err,data){
    if(err) throw err;
    let temp = JSON.parse(data.trim());
    for(word in temp){
        dictionary.push({
            "name":word,
            "definition":temp[word]
        })
    }
});

app.get('/dictionary',function(req,res) {
    const word = req.query["word"];
    let results = dictionary.filter((eachWord) => {
        return eachWord.name.toLowerCase() === word.toLowerCase();
    })
    if(results.length) res.json(results[0]);
    else res.status(400).end();
});

app.get('/suggestion',function(req,res) {
    const word = req.query["word"];
    let results = dictionary.filter((eachWord) => {
        return eachWord.name.toLowerCase().indexOf(word.toLowerCase()) != -1;
    }).map((eachWord) => {
        return {
            "keyword":eachWord.name
        }
    })
    if(results.length) res.json(results);
    else res.status(400).end();
});

app.get('/editWord',function(req,res) {
    const word = req.query["word"];
    const newDefinition = req.query["definition"];

    fs.readFile("./words.json","utf-8",function(err,data){
        if(err) throw err;
        let temp = JSON.parse(data.trim());
        temp[word] = newDefinition;

        fs.writeFile("./words.json",JSON.stringify(temp),function(err){
            res.status(400).end();
        });

        res.status(200).end();
    });
    
});

app.get('/addWord',function(req,res) {
    const word = req.query["word"];
    const newDefinition = req.query["definition"];

    fs.readFile("./words.json","utf-8",function(err,data){
        if(err) throw err;
        var temp = JSON.parse(data.trim());
        temp[word] = newDefinition;

        fs.writeFile("./words.json",JSON.stringify(temp),function(err){
            res.status(400).end();
        });

        res.status(200).end();
    });
    
});

app.get("/signup",function(req,res){
    res.sendfile(path.join(__dirname,"public/signup.html"));
});

app.get("/signin",function(req,res){
    res.sendfile(path.join(__dirname,"public/signin.html"));
});

app.get('/login',function(req,res) {

    const username = req.query["username"];
    const password = req.query["password"];

    fs.readFile("./users.json","utf-8",function(err,data){
        if(err) throw err;
        var temp = Array.from(JSON.parse(data.trim()));
        let user = temp.filter((eachUser)=>{
            return (eachUser.username === username) && (eachUser.password === password);
        });
        if(user.length){
            var cookie = req.cookies.token;
            if(cookie === undefined){
                res.cookie("token",user[0].token,{
                    maxAge:900000,
                    httpOnly : true
                })

            }else{
                console.log("already logged in"+cookie);
            }
            console.log(cookie);
            res.send("Login successful. token : "+user[0].token);

        }
        else{
            res.send("Login failed.");
        }

        res.status(200).end();
    });

});


app.get('/register',function(req,res) {
    const username = req.query["username"];
    const password = req.query["password"];

    fs.readFile("./users.json","utf-8",function(err,data){
        if(err) throw err;
        var temp = Array.from(JSON.parse(data.trim()));
        temp.push({
            "username": username,
            "password": password,
            "token" : (temp.length===0)?0:temp[temp.length-1].token+1  
        });

        fs.writeFile("./users.json",JSON.stringify(temp),function(err){
            res.status(400).end();
        });

        res.status(200).end();
    });
    
});


app.get('/getinfo', (req, res) => {
    var json = `
    {
        "message": "Web Programming is Cool!!!"
    }
    `
    res.header('Content-Type', 'application/json');
    res.status(200).send(json);
});

PORT = 3000;

app.listen(PORT,()=>{
    console.log(`server is up and running on port ${PORT}`);
});