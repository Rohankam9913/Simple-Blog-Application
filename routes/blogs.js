const { Router } = require("express");
const Blog = require("../models/blogModel");
const blogRouter = Router();
const Comment = require("../models/CommentModel");

const get_date_time = (date) => {
    let dateTime = new Date(date);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let M = months[dateTime.getMonth()];
    let D = dateTime.getDate();
    let Y = dateTime.getFullYear();

    return `${M} ${D} ${Y}`;
}

blogRouter.get("/create_blog", (req, res) => {
    res.render("create_blog.ejs");
});

blogRouter.post("/create_blog", async (req, res) => {
    try {
        const { title, description, content, tags } = req.body;
        let blogDetails = await Blog.create({ title, description, content, tags, author: req.user.id });
        blogDetails = await Blog.findById({ _id: blogDetails._id }).populate("author", "-password");
        res.status(201).json(blogDetails);
    }
    catch (error) {
        res.status(401).json({ error: "Invalid response" });
    }
})

blogRouter.get("/get_all_blogs", async (req, res) => {
    try {
        let blog_tags;
        if(req.query.tags){
            let tags = req.query.tags;
            blog_tags = await Blog.find({ tags: { $elemMatch: { $eq: tags } } });
        }

        let all_blogs = await Blog.find({}).populate("author", "-password")
        if (all_blogs.length > 0) {
            res.render("all_blogs.ejs", { all_blogs, blog_tags });
        }
        else {
            res.render("all_blogs.ejs", { all_blogs: "" });
        }
    }
    catch (error) {
        res.render("all_blogs", { error: "No Blogs to show" });
    }
})

blogRouter.get("/get_my_blogs", async (req, res) => {
    try {
        const authorId = req.user.id;
        let blogs = await Blog.find({ author: authorId }).sort({"createdAt":-1});

        if (blogs.length === 0) {
            return res.render("my_blog.ejs", { blogs: [] });
        }

        res.render("my_blog.ejs", { blogs: blogs });
    }
    catch (error) {
        console.log(error.message);
        res.status(401).json({ error: "Invalid Response" });
    }
})

blogRouter.get("/individual_blog/:blog_id", async (req, res) => {
    try {
        let blog_id = req.params.blog_id;
        let individual_blog_details = await Blog.findById({ _id: blog_id }).populate("author", "-password");
        let all_comments = await Comment.find({blog : blog_id}).populate("username","-password").sort({"createdAt" : -1});

        let dateTime = get_date_time(individual_blog_details.createdAt);

        let comment_date_time = [];
        for(let i = 0;i < all_comments.length;i++){
            let date = get_date_time(all_comments[i].createdAt);
            comment_date_time.push(date);
        }

        res.render("blog.ejs", { individual_blog_details, dateTime, all_comments, blog_id, comment_date_time });
    }

    catch (error) {
        console.log(error.message);
        res.status(401).json({ error: "Invalid Response" });
    }
})


module.exports = blogRouter;