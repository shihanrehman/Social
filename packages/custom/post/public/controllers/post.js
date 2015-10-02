'use strict';

/* jshint -W098 */
angular.module('mean.post').controller('PostController', ['$scope', '$stateParams', '$location', 'Global', '$http', 'Post', '$state',
  function($scope, $stateParams, $location, Global, $http, Post, $state) {
    $scope.global = Global;
	
    $scope.package = {
      name: 'post'
    };
	
	$scope.reply_data = {
      content: '',
	  postid: ''	  
    };

	$scope.posts = {};
    
	// load all posts records in scope variable.
	loadData();
	
	// This function will add new post using textarea.
    $scope.add = function(isValid) {
		if (isValid) {
			$http.post('/api/post/add',$scope.post).success(function(response) {
				loadData();
				$(document).find('#txt_content').val('');
				// $state.go('home');
			}).error(function(data) {
				console.log(data);
			});
		
		} else {
			$scope.submitted = true;
		}
    };
	
	// This function will create reply for particular post or reply.
	$scope.addReply = function() {
		// console.log(reply_data);
		console.log($scope.reply_data);
		return 0;
			$http.post('/api/post/addReply',reply_data).success(function(response) {
				loadData();
				$(document).find('#txt_content').val('');
				// $state.go('home');
			}).error(function(data) {
				console.log(data);
			});
		
		/*} else {
			$scope.submitted = true;
		}*/
    };
	
	// Function to load post and reply detail each time when any operation perform.
	function loadData() {
		$http.get('/api/post/getall').success(function(response) {
			$scope.posts = response;
		}).error(function(data) {
			console.log(data);
		});
    };
	
  }
]);
