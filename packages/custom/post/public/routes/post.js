'use strict';

angular.module('mean.post').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
		.state('home', {
		  url: '/',
		  templateUrl: 'post/views/post.html'
		});		
  }
]);
