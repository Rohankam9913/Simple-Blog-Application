const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const mainRouter = Router();

const create_token = (id,username,email)=>{
    return jwt.sign({id,username, email}, process.env.secret, {expiresIn : "1h"});
}

mainRouter.get("/",async (req,res)=>{
    let all_blogs = await Blog.find({}).populate("author", "-password").sort({"createdAt":-1}).limit(5);   
    res.render("home.ejs",{all_blogs});
})

mainRouter.get("/login",(req,res)=>{
    if(req.cookies.token){
        return res.redirect("back");
    }

    res.render("login.ejs");
})

mainRouter.get("/register",(req,res)=>{
    if(req.cookies.token){
        return res.redirect("back");
    }
    res.render("register.ejs");
})

mainRouter.post("/register",async (req,res)=>{
    try{
        const { username, email, password } = req.body;
        let userDetails = await User.create({ username : username, email : email, password : password });
        userDetails = await User.findById({_id : userDetails._id}).select("-password");
        const token = create_token(userDetails._id,username,email);
        res.cookie("token",token,{maxAge : 360000, httpOnly : true});
        res.status(201).json(userDetails);
    }
    catch(error){
        if(error.code === 11000){
            return res.status(401).json({error : "This email is already registered"});
        }

        res.status(400).json({error : "Fetch Failed"});
    }
})

mainRouter.post("/login",async (req,res)=>{
    try{
        const { email, password } = req.body;

        let userDetails = await User.check_credentials(email,password);
        userDetails = await User.findById({_id : userDetails._id}).select("-password");
        const token = create_token(userDetails._id,userDetails.username,email);
        res.cookie("token",token,{maxAge : 360000, httpOnly : true});
        res.status(200).json(userDetails);
    }
    catch(error){
        if(error.message === "User Credentials don't match"){
            return res.status(401).json({error : error.message});
        }
        console.log(error.message)
        res.status(400).json({error : "Fetch Failed"});
    }
})

mainRouter.get("/logout", async (req,res)=>{
    if(!req.cookies.token){
        return res.status(401).json({error : "Invalid Respones"});
    }

    res.clearCookie("token");
    res.status(200).json({msg : "Deletetd Successfully"});
})

module.exports = mainRouter;