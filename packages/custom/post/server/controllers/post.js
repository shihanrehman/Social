'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Postm = mongoose.model('Post'),
    Replym = mongoose.model('Reply'),
    Likem = mongoose.model('Like'),
    Userm = mongoose.model('User'),
	async = require('async'),
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
                res.json(reply);
            });
        },
		/**
         * Set like
         */
        setLike: function(req, res) {
            var like = new Likem(req.body);
            like.user = req.user;

            like.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the post'
                    });
                }
                res.json(like);
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
			
			/*Postm.find().sort('-created').populate('user', 'name username').exec(function(err, posts) {
				if (err) {
					return res.status(500).json({
						error: 'Cannot list the articles'
					});
				}
				var list_posts = posts;
				for(var postId in list_posts){
					async.waterfall([
						function (callback) {
							Replym.find({ post_id: list_posts[postId]._id }).populate('user', 'name username').exec(function(err, replies) {
								if (err) {
									return res.status(500).json({
										error: 'Cannot list the replies'
									});
								}
								callback(null, replies)
							});
						},
						function (replies, callback) {
							list_posts[postId]['reply'] = replies;
						}
					], function (err, result) {
						console.log('Main Callback --> ' + result);
					});
				}
				console.log(list_posts)
				// res.json(list_posts);
			});
				
			return 0;*/
			Postm.find().sort('-created').populate('user', 'name username').exec(function(err, posts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }
				var list_posts = posts;
				res.json(list_posts);
			});
		},
		/**
         * returns List of Users
         */
        getAllUsers: function(req, res) {
			Userm.find().exec(function(err, users) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }
                res.json(users);
            });
        },
		
		/**
         * returns List of all Reply
         */
        getAllReply: function(req, res) {
			Replym.find({ post_id: req.params.postId }).populate('user', 'name username').exec(function(err, replies) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(replies);
            });
        },
		/**
         * returns total no. of likes
         */
        getTotalLikes: function(req, res) {
			Likem.count({content_id: req.params.postId}).exec(function(err, totalLikes) {
				if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
				async.waterfall([
					function (callback) {
						Likem.findOne({content_id: req.params.postId, user:req.params.userId}).exec(function(err, isLike) {
							if (err) {
								return res.status(500).json({
									error: 'Cannot list the replies'
								});
							}
							var isLiked = 0;
							if(isLike){
								var isLiked = isLike.id;
							}
							var likeData = {
								totalLikes : totalLikes,
								isLike : isLiked
							};
							res.json(likeData);
						});
					}
				], function (err, result) {
					console.log('Main Callback --> ' + result);
				});
				// res.json(totalLikes);
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
			Replym.remove({ post_id: req.params.postId }).exec(function(err, replies) {
				if (err) {
					return res.status(500).json({
						error: 'Cannot list the replies'
					});
				}
				Postm.remove({ _id: req.params.postId }).exec(function(err, posts) {
					if (err) {
						return res.status(500).json({
							error: 'Cannot list the replies'
						});
					}
					res.json(posts);
				});
			});
        },
		/**
         * delete a reply
         */
		deleteReply: function(req, res) {
			Replym.remove({ $or: [ { _id: req.params.replyId }, { parent_comment_id: req.params.replyId } ] }).exec(function(err, replies) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the replies'
                    });
                }
                res.json(replies);
            });
        },
		/**
         * unset Like
         */
		unsetLike: function(req, res) {
			Likem.remove({ _id: req.params.likeId }).exec(function(err, replies) {
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