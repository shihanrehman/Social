'use strict';

angular.module('mean-factory-interceptor', [])
  .factory('httpInterceptor', ['$q', '$location',
    function($q, $location) {
      return {
        'response': function(response) {
          if (response.status === 401) {
            // $location.path('/auth/login'); (This will redirect user to default login page of MEAN.)
			
            $location.path('/'); //(This will override to over custom login)
            return $q.reject(response);
          }
          return response || $q.when(response);
        },

        'responseError': function(rejection) {

          if (rejection.status === 401) {
            // $location.url('/auth/login');
            $location.url('/');
            return $q.reject(rejection);
          }
          return $q.reject(rejection);
        }

      };
    }
  ])
//Http Interceptor to check auth failures for XHR requests
.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }
]);
