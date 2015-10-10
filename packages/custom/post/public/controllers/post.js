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
	$scope.postData = {};
    
	// load all posts records in scope variable.
	loadData();
	
	// This function will add new post using textarea.
    $scope.add = function(isValid) {
		if (isValid) {
			if( $scope.post_data.post_pid == 0 ){
				$scope.postData.content = $scope.post_data.content;
				$http.post('/api/post/add',$scope.postData).success(function(response) {
					loadData();
					$(document).find('#txt_content').val('');
				}).error(function(data) {
					console.log(data);
				});
			} else {
				$scope.postData.content = $scope.post_data.content;
				$scope.postData._id = $scope.post_data.post_pid;
				$http.post('/api/post/edit',$scope.postData).success(function(response) {
					loadData();
					$(document).find('#txt_content').val('');
				}).error(function(data) {
					console.log(data);
				});
			}
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
			if(parent_comment_id == 0){
				$(document).find('.comment-reply-div-' + post_id).css('display','inline-block');
			} else {
				$(document).find('.comment-reply-div-' + post_id).css('display','inline-block');
				$(document).find('.sub-comment-div-' + parent_comment_id).css('display','inline-block');
			}
			$(document).find('#txt_reply').val('');
			// $state.go('home');
		}).error(function(data) {
			console.log(data);
		});
	};
	
	$scope.getPostDetail = function(post_id) {
		console.log('post_id');
		console.log(post_id);
		$.ajax({
			url : '/api/post/getPostDetail/' + post_id,
			async : false,
		})
		.success(function(post_detail){
			console.log(post_detail);
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
						var reply_user_name = replies[reply_id]['user']['name'];
						reply_user_name = reply_user_name.replace(/\s+/g,' ').split(' ');
						var display_reply_user_name = '';
						for(var name_index in reply_user_name){
							if(name_index < 3){
								display_reply_user_name = display_reply_user_name + reply_user_name[name_index].charAt(0).toUpperCase();
							}
						}
						replies[reply_id]['user']['display_name'] = display_reply_user_name;
						if( replies[reply_id].parent_comment_id != "0" ){
							response[post_id]['reply'][replies[reply_id].parent_comment_id]['sub_reply'][replies[reply_id]._id] = replies[reply_id];
							response[post_id]['reply'][replies[reply_id].parent_comment_id]['total_sub_reply']++;
						} else {
							response[post_id]['reply'][replies[reply_id]._id] = replies[reply_id];
							response[post_id]['reply'][replies[reply_id]._id]['sub_reply'] = {};
							response[post_id]['reply'][replies[reply_id]._id]['total_sub_reply'] = 0;
						}
					}
					response[post_id]['total_reply'] = Object.keys(response[post_id]['reply']).length;
				}
				var user_name = response[post_id]['user']['name'];
				user_name = user_name.replace(/\s+/g,' ').split(' ');
				var display_user_name = '';
				for(var name_index in user_name){
					if(name_index < 3){
						display_user_name = display_user_name + user_name[name_index].charAt(0).toUpperCase();
					}
				}
				response[post_id]['user']['display_name'] = display_user_name;
			}
			console.log(response);
			$scope.posts = response;
		}
    };

  }
]);
