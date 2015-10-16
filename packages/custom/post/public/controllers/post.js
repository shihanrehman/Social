'use strict';

angular.module('mean.post',['ngFileUpload']).controller('PostController', ['$scope', '$rootScope', '$stateParams', '$location', 'Upload', 'Global', 'Post', 'MeanUser', 'Circles', '$http', '$q', function($scope, $rootScope, $stateParams, $location, Upload, Global, Post, MeanUser, Circles, $http, $q ) {
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
	$scope.post_media = '';
	$scope.posts = {};
	$scope.userDetail = {};
	$scope.users_list = {};
	$scope.postData = {};
	// load all posts records in scope variable.
	loadPostData();
	// load all users records in scope variable.
	loadAllUsers();
	
	// This function will add new post using textarea.
    $scope.add = function(isValid) {
		if (isValid) {
			if( $scope.post_data.post_pid == 0 ){
				$scope.postData.content = $scope.post_data.content;
				$http.post('/api/post/add',$scope.postData).success(function(response) {
					loadPostData();
					$(document).find('#txt_content').val('');
				}).error(function(data) {
					console.log(data);
				});
			} else {
				$scope.postData.content = $scope.post_data.content;
				$scope.postData._id = $scope.post_data.post_pid;
				$http.post('/api/post/edit',$scope.postData).success(function(response) {
					loadPostData();
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
			loadPostData();
			if(parent_comment_id == "0"){
				$(document).find('.comment-reply-div-' + post_id).css('display','inline-block');
			} else {
				$(document).find('.comment-reply-div-' + post_id).css('display','inline-block');
				$(document).find('.sub-comment-div-' + parent_comment_id).css('display','inline-block');
			}
			$(document).find('.txt_reply').val('');
		}).error(function(data) {
			console.log(data);
		});
	};
	
	// This function will set like for particular post or reply.
	$scope.setLike = function(content_id, is_post) {
		var likeData = {
			content_id: content_id,
			is_post: is_post
		};
		$http.post('/api/post/setLike',likeData).success(function(response) {
			loadPostData();
		}).error(function(data) {
			console.log(data);
		});
	};
	
	// This function will set like for particular post or reply.
	$scope.unsetLike = function(likeId) {
		$http.get('/api/post/unsetLike/' + likeId ).success(function(response) {
			loadPostData();
		}).error(function(data) {
			console.log(data);
		});
	};
	
	$scope.getPostDetail = function(post_id) {
		$http.get('/api/post/getPostDetail/' + post_id ).success(function(post_detail) {
			$scope.post_data.content = post_detail[0].content;
			$scope.post_data.post_pid = post_detail[0]._id;
		}).error(function(data) {
			console.log(data);
		});
	};
	$scope.loadPostData = function(post_id) {
		// load all posts records in scope variable.
		loadPostData();
		// load all users records in scope variable.
		loadAllUsers();
	};
	$scope.deletePost = function(post_id) {
		$.ajax({
			url : '/api/post/deletePost/' + post_id,
			async : false,
		})
		.success(function(post_detail){
			loadPostData();
		});
	};
	$scope.deleteReply = function(reply_id) {
		$.ajax({
			url : '/api/post/deleteReply/' + reply_id,
			async : false,
		})
		.success(function(reply_detail){
			loadPostData();
		});
	};
	
	$scope.upload = function (mediaFile) {
		console.log('file selected');
		console.log('mediaFile');
		$scope.post_media = mediaFile;
		console.log("inputfile", $scope.post_media.$ngfBlobUrl);
		console.log("inputfile", $scope.post_media.type);
	};
	
	function isUserLoggedin() {
		var deferred = $q.defer();
		$http.get('/api/users/me').success(function(response) {
			deferred.resolve(response);
		})
		.error(function(data, status, headers, config)
		{
			deferred.reject();
		});
		return deferred.promise;
	};
	// Function to load post and reply detail each time when any operation perform.
	function loadPostData() {	
		isUserLoggedin().then(function(userDetail){
			var replies = '';
			var client = new XMLHttpRequest();
			client.open("GET", "/api/post/getall/", false);
			client.send();
			if( client.status == 200 ){
				var response = JSON.parse(client.response);
				for(var post_id in response){
					if( userDetail ){
						var totalPostLike = getTotalLikes(response[post_id]._id,userDetail._id);
						response[post_id]['totalLikes'] = totalPostLike.totalLikes;
						response[post_id]['isLike'] = totalPostLike.isLike;
					}
					response[post_id]['reply'] = {};
					var reply_client = new XMLHttpRequest();
					reply_client.open("GET", '/api/post/getAllReply/' + response[post_id]._id, false);
					reply_client.send();
					if( reply_client.status == 200 ){
						var replies = JSON.parse(reply_client.response);
						for(var reply_id in replies){
							var reply_user_name = replies[reply_id]['user']['name'];
							reply_user_name = reply_user_name.trim().replace(/\s+/g,' ').split(' ');
							var display_reply_user_name = '';
							for(var name_index in reply_user_name){
								if(name_index < 3){
									display_reply_user_name = display_reply_user_name + reply_user_name[name_index].charAt(0).toUpperCase();
								}
							}
							replies[reply_id]['user']['display_name'] = display_reply_user_name;

							replies[reply_id]['display_date'] = getDisplayDate(replies[reply_id].created);
							if( userDetail ){
								var totalReplyLike = getTotalLikes(replies[reply_id]._id, userDetail._id);
								replies[reply_id]['totalLikes'] = totalReplyLike.totalLikes;
								replies[reply_id]['isLike'] = totalReplyLike.isLike;
							}
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
					user_name = user_name.trim().replace(/\s+/g,' ').split(' ');
					var display_user_name = '';
					response[post_id]['display_date'] = getDisplayDate(response[post_id].created);
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
		});
		
    };
	
	function getDisplayDate(created){
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var postDate = new Date(created);
		var currDate = new Date().getTime();
		var display_date = '';
		if( ( currDate - postDate.getTime() ) <= 86400000 ){
			var hourDiff  = ( currDate - postDate.getTime() );
			var secDiff = hourDiff / 1000; //in s
			var minDiff = hourDiff / 60 / 1000; //in minutes
			var hDiff = Math.floor(hourDiff / 3600 / 1000); //in hours
			if(hDiff == 0){
				var mDiff = Math.floor(minDiff - 60 * hDiff);
				if( mDiff < 1 ){
					display_date = 'Just now';
				} else {
					display_date = mDiff + ' mins ago';
				}
			} else {
				display_date = hDiff + ' hours ago';
			}
		} else {
			var ampm = 'AM';
			var hour = postDate.getHours();
			if( postDate.getHours() > 12 ){
				ampm = 'AM';
				hour = hour-12;
			}
			display_date = postDate.getFullYear() + ', ' + (monthNames[postDate.getMonth()]) + ' ' + postDate.getDate() + ' at ' + hour + ':' + postDate.getMinutes() + ' ' + ampm;
		}
		return display_date;
	};
	function getTotalLikes(content_id, user_id){
		var like_client = new XMLHttpRequest();
		like_client.open("GET", '/api/post/getTotalLikes/' + content_id + '/' + user_id, false);
		like_client.send();
		if( like_client.status == 200 ){
			return JSON.parse(like_client.response);
		}
	}
	// Function to load all users on left sidebar.
	function loadAllUsers() {
		var getUsers = new XMLHttpRequest();
		getUsers.open("GET", "/api/post/getAllUsers/", false);
		getUsers.send();
		if( getUsers.status == 200 ){
			var response = JSON.parse(getUsers.response);
			for(var user_id in response){
				var name = response[user_id]['name'];
				name = name.trim().replace(/\s+/g,' ').split(' ');
				var display_name = '';
				if(name.length == 1){
					display_name = name[0].substring(0, 2);
				} else {
					for(var index in name){
						if(index < 3){
							display_name = display_name + name[index].charAt(0);
						}
					}
				}
				response[user_id]['display_name'] = display_name.toUpperCase();;
			}
			$scope.users_list = response;
		}
	};
	
		
	}

]);
