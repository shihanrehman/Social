'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Postm = mongoose.model('Post'),
    Replym = mongoose.model('Reply'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Post) {

    return {
        /**
         * Create an Post
         */
        add: function(req, res) {
            var post = new Postm(req.body);
            post.user = req.user;

            post.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the post'
                    });
                }

                /*Articles.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/articles/' + article._id,
                    name: article.title
                });*/

                res.json(post);
            });
        },
		/**
         * Update an Post
         */
        edit: function(req, res) {
			var postData = req.body;
			var postId = postData._id;
			var postContent = postData.content;
            
			Postm.update({ _id: postId },{content: postContent}).exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }
                res.json(posts);
            });
        },
		
		/**
         * Add reply
         */
        addReply: function(req, res) {
            var reply = new Replym(req.body);
            reply.user = req.user;

            reply.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the post'
                    });
                }

                /*Articles.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/articles/' + article._id,
                    name: article.title
                });*/
                res.json(reply);
            });
        },
		
        /**
         * Update an article
         */
        update: function(req, res) {
            var article = req.article;

            article = _.extend(article, req.body);


            article.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the article'
                    });
                }

                Articles.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: article.title,
                    url: config.hostname + '/articles/' + article._id
                });
                res.json(article);
            });
        },
        /**
         * Show an article
         */
        show: function(req, res) {

            Articles.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.article.title,
                url: config.hostname + '/articles/' + req.article._id
            });
            res.json(req.article);
        },
        /**
         * returns List of Posts
         */
        getall: function(req, res) {
			// Postm.find().sort('-created').populate('user', 'name username').exec(function(err, posts) {
			Postm.find().sort('-created').exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }
                res.json(posts);
            });
        },
		
		/**
         * returns List of all Reply
         */
        getAllReply: function(req, res) {
			// Replym.find({ post_id: req.params.postId }).sort('-created').exec(function(err, replies) {
			Replym.find({ post_id: req.params.postId }).exec(function(err, replies) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(replies);
            });
        },
		/**
         * returns detail of Post
         */
        getPostDetail: function(req, res) {
			Postm.find({ _id: req.params.postId }).sort('-created').exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(posts);
            });
        },
		/**
         * delete a Post
         */
		deletePost: function(req, res) {
			Postm.remove({ _id: req.params.postId }).exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(posts);
            });
        },
		/**
         * delete a reply
         */
		deleteReply: function(req, res) {
			Replym.remove({ _id: req.params.replyId }).exec(function(err, replies) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(replies);
            });
        }
    };
}