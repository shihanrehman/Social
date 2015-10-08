'use strict';

/* jshint -W098 */
angular.module('mean.post').controller('PostController', ['$scope', '$stateParams', '$location', 'Global', '$http', 'Post', '$state', function($scope, $stateParams, $location, Global, $http, Post, $state) {
    $scope.global = Global;
	
    $scope.package = {
      name: 'post'
    };
	
	$scope.reply_data = {
      content: ''
    };
	
	$scope.post_data = {
		content : '',
		post_pid : 0
	};
	
	$scope.posts = {};
    
	// load all posts records in scope variable.
	loadData();
	
	// This function will add new post using textarea.
    $scope.add = function(isValid) {
		if (isValid) {
			$http.post('/api/post/add',$scope.post_data).success(function(response) {
				loadData();
				$(document).find('#txt_content').val('');
			}).error(function(data) {
				console.log(data);
			});
		
		} else {
			$scope.submitted = true;
		}
    };
	
	// This function will create reply for particular post or reply.
	$scope.addReply = function(reply, post_id, parent_comment_id) {
		$scope.reply_data.post_id = post_id;
		$scope.reply_data.parent_comment_id = parent_comment_id;
		$http.post('/api/post/addReply',$scope.reply_data).success(function(response) {
			loadData();
			$(document).find('#txt_content').val('');
			// $state.go('home');
		}).error(function(data) {
			console.log(data);
		});
	};
	
	$scope.getPostDetail = function(post_id) {
		$.ajax({
			url : '/api/post/getPostDetail/' + post_id,
			async : false,
		})
		.success(function(post_detail){
			$scope.post_data.content = post_detail[0].content;
			$scope.post_data.post_pid = post_detail[0]._id;
		});
	};
	
	$scope.deletePost = function(post_id) {
		$.ajax({
			url : '/api/post/deletePost/' + post_id,
			async : false,
		})
		.success(function(post_detail){
			loadData();
		});
	};
	$scope.deleteReply = function(reply_id) {
		$.ajax({
			url : '/api/post/deleteReply/' + reply_id,
			async : false,
		})
		.success(function(reply_detail){
			loadData();
		});
	};
	
	$scope.upload = function (mediaFile) {
		console.log('file selected');
		$scope.post_media = mediaFile;
		console.log("inputfile", $scope.post_media);
		console.log("inputfile", $scope.post_media.$ngfBlobUrl);
		console.log("inputfile", $scope.post_media.type);
	};
	// Function to load post and reply detail each time when any operation perform.
	function loadData() {
		var replies = '';
		var client = new XMLHttpRequest();
		client.open("GET", "/api/post/getall/", false);
		client.send();
		if( client.status == 200 ){
			var response = JSON.parse(client.response);
			for(var post_id in response){
				response[post_id]['reply'] = {};
				var reply_client = new XMLHttpRequest();
				reply_client.open("GET", '/api/post/getAllReply/' + response[post_id]._id, false);
				reply_client.send();
				if( reply_client.status == 200 ){
					var replies = JSON.parse(reply_client.response);
					for(var reply_id in replies){
						if( replies[reply_id].parent_comment_id != "0" ){
							response[post_id]['reply'][replies[reply_id].parent_comment_id]['sub_reply'][replies[reply_id]._id] = replies[reply_id];
							/*console.log('replies[reply_id]._id');
							console.log(replies[reply_id]._id);
							console.log('replies[reply_id].parent_comment_id');
							console.log(replies[reply_id].parent_comment_id);*/
						} else {
							response[post_id]['reply'][replies[reply_id]._id] = replies[reply_id];
							response[post_id]['reply'][replies[reply_id]._id]['sub_reply'] = {};
						}
					}
				}
			}
			console.log(response);
			$scope.posts = response;
		}
    };

  }
]);
