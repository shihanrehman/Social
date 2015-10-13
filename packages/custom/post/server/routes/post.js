'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Post, app, auth, database) {
	var post = require('../controllers/post')(Post);

	app.route('/api/post/add')
		.post(auth.requiresLogin, post.add);
	app.route('/api/post/edit')
		.post(auth.requiresLogin, post.edit);
	app.route('/api/post/addReply')
		.post(auth.requiresLogin, post.addReply);
	app.route('/api/post/setLike')
		.post(auth.requiresLogin, post.setLike);
	
	app.route('/api/post/getall')
		.get(post.getall);
	app.route('/api/post/getAllUsers')
		.get(post.getAllUsers);
	app.route('/api/post/getAllReply/:postId')
		.get(post.getAllReply);
	app.route('/api/post/getPostDetail/:postId')
		.get(post.getPostDetail);
	app.route('/api/post/getTotalLikes/:postId')
		.get(post.getTotalLikes);
		
		
	app.route('/api/post/deletePost/:postId')
		.get(post.deletePost);
	app.route('/api/post/deleteReply/:replyId')
		.get(post.deleteReply);

  app.get('/api/post/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/api/post/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/api/post/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/api/post/example/render', function(req, res, next) {
    Post.render('index', {
      package: 'post'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
