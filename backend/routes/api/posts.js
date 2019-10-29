/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */

const express = require('express');

const router = express.Router();
const passport = require('passport');

// Load Post Model
const Post = require('../../models/Post');

// Load Profile Model
const Profile = require('../../models/Profile');

// Load post Validation
const validatePostInput = require('../../validation/post');

/**
 * @route GET api/posts/test
 * @desc Tests posts route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ mesg: 'Posts  Works just fine' }));

/**
 * @route GET api/posts
 * @desc Get all posts
 * @access Public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch(() => res.status(404).json({ nopostfound: 'There are noo such post' }));
});

/**
 * @route GET api/posts/:id
 * @desc Get all posts by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch(() => res.status(404).json({ nopostfound: 'No post with such ID' }));
});

/**
 * @route POST api/posts
 * @desc Create post
 * @access Private
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });
    newPost.save().then((post) => res.json(post));
  },
);

/**
 * @route DELETE api/posts/:id
 * @desc Delete post
 * @access Private
 */
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check if the user owns post
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete Post
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(() => res
          .status(404)
          .json({ postnotfound: 'No post found, or may have been deleted' }));
    });
  },
);

/**
 * @route POST api/posts/like/:id
 * @desc Like post
 * @access Private
 */
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already like this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(() => res.json(post));
        })
        .catch(() => res
          .status(404)
          .json({ alreadylikedpost: 'Thanks for your show of love' }));
    });
  },
);

/**
 * @route POST api/posts/unlike/:id
 * @desc Unlike post
 * @access Private
 */
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You haven't liked this post " });
          }

          // Get remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          post.save().then(() => res.json(post)); // Save dislike
        })
        .catch(() => res.status(404).json({ alreadylikedpost: 'No post found' }));
    });
  },
);

/**
 * @route POST api/posts/comment/:id
 * @desc Add comment
 * @access Private
 */
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };
      // Add to commeent Arrary
      post.comments.unshift(newComment);

      post
        .save()
        .then(() => res.json())
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
    });
  },
);


/**
 * @route DELETE api/posts/comment/:id/:comment/id
 * @desc Delete comment from post
 * @access Private
 */
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
      // Check to see if comment exists
        if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
          return res.status(404).json({ commentdoesnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save()
          .then(() => res.json(post))
          .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
      });
  },
);

module.exports = router;
