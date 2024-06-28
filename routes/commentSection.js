const { Router } = require("express");
const Comment = require("../models/CommentModel");
const commentRouter = Router();

commentRouter.post("/post_comment", async (req, res) => {
    try {
        const { comment, blogId } = req.body;
        createComment = await Comment.create({ comment, username: req.user.id, blog: blogId, likes: 0 });
        createComment = await Comment.findById({ _id: createComment._id }).populate("username", "-password");
        res.status(201).json(createComment);
    }
    catch (error) {
        res.status(401).json({ error: "Invalid Response" });
    }
})

commentRouter.put("/update_like", async (req, res) => {
    try {
        const { commentId } = req.body;
        let commentLikes = await Comment.findOneAndUpdate({ _id: commentId }, { $inc: { likes: 1 } }, { new: true });
        res.status(200).json(commentLikes);
    }
    catch (error) {
        res.status(401).json({ error: "Invalid Response" });
    }
})

commentRouter.get("/get_all_comments/:blogId", async(req,res)=>{
    try{
        let all_comments = await Comment.find({blog : req.params.blogId}).populate("username","-password");
        res.status(200).json(all_comments);
    }
    catch(error){
        res.status(401).json({error : "Invalid Response"});
    }
})

module.exports = commentRouter;