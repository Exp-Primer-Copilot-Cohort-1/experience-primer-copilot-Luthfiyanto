// Create web server

// Import modules
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const { ensureAuthenticated } = require("../config/auth");

// Create comment
router.post("/create", ensureAuthenticated, [check("comment", "Comment is required").not().isEmpty(), check("postId", "Post ID is required").not().isEmpty()], async (req, res) => {
  // Check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else if (!req.user) {
    return res.status(401).json({ errors: "User not logged in" });
  }

  // Create new comment
  const comment = new Comment({
    comment: req.body.comment,
    user: req.user.id,
    post: req.body.postId,
  });

  // Save comment
  try {
    await comment.save();
    res.status(200).json({ msg: "Comment created" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: "Server error" });
  }
});

// Get comments
router.get("/get/:postId", async (req, res) => {
  // Find comments
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({
      date: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: "Server error" });
  }
});

// Delete comment
router.delete("/delete/:commentId", ensureAuthenticated, async (req, res) => {
  // Find comment
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ errors: "Comment not found" });
    }

    // Check if user is owner of comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: "User not authorized" });
    }

    // Delete comment
    await comment.remove();
    res.status(200).json({ msg: "Comment deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: "Server error" });
  }
});

module.exports = router;

// End of file
