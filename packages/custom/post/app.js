'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Post = new Module('post');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Post.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Post.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Post.menus.add({
    title: 'Add New Post',
    link: 'Add New Post',
    roles: ['authenticated'],
    menu: 'main'
  });
  Post.menus.add({
    title: 'List of Posts',
    link: 'List of Posts',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Post.aggregateAsset('css', 'post.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Post.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Post.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Post.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Post;
});
