const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const Post = require("../models/Post");

// @route GET api/posts
// @desc Create get
// @access private
router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error " });
  }
});

// @route POST api/posts
// @desc Create post
// @access private
router.post("/", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;

  // simple validation
  if (!title)
    return res.status(400).json({
      success: false,
      message: "title is required",
    });

  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith("https://") ? url : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, massage: "Happy learning", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route PUT api/posts
// @desc Update get
// @access private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, url, status } = req.body;
  // simple validation
  if (!title)
    return res.status(400).json({
      success: false,
      message: "title is required",
    });

  try {
    let updatePost = {
      title,
      description: description || "",
      url: (url.startsWith("https://") ? url : `https://${url}`) || "",
      status: status || "TO LEARN",
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatePost = await Post.findOneAndUpdate(postUpdateCondition, updatePost, {
      new: true,
    });

    // User not author to update post or not found
    if (!updatePost)
      return res
        .status(401)
        .json({ success: false, message: "post not found" });

    res.json({
      success: true,
      message: "Excellent progress",
      post: updatePost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// @route DELETE api/posts
// @desc Delete get
// @access private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletePost = await Post.findOneAndDelete(postDeleteCondition);

    // User not author to update post or not found
    if (!deletePost)
      return res
        .status(401)
        .json({ success: false, message: "post not found" });

    res.json({ success: true, post: deletePost, message: "Delete success !" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
