// Create web server
// Create a new comment
// Get all comments
// Get a comment by id
// Update a comment
// Delete a comment

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// Create a new comment
router.post('/comments', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a comment by id
router.get('/comments/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const comment = await Comment.findById(_id);
    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a comment
router.patch('/comments/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['author', 'text', 'date'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({
      error: 'Invalid updates!'
    });
  }

  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;