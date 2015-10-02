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
         * Find article by id
         */
        article: function(req, res, next, id) {
            Article.load(id, function(err, article) {
                if (err) return next(err);
                if (!article) return next(new Error('Failed to load article ' + id));
                req.article = article;
                next();
            });
        },
        /**
         * Create an article
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
         * Create an article
         */
        addReply: function(req, res) {
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
         * Delete an article
         */
        destroy: function(req, res) {
            var article = req.article;


            article.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the article'
                    });
                }

                Articles.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: article.title
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
         * List of Articles
         */
        getall: function(req, res) {
			// Postm.find().sort('-created').populate('user', 'name username').exec(function(err, posts) {
			Postm.find().sort('-created').exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }

                res.json(posts)
            });

        }
    };
}