'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Post Schema
 */
var PostSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  media: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
PostSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
PostSchema.statics.load = function(cb) {
  this.find().populate('user', 'name username').exec(cb);
};

/*PostSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};*/

mongoose.model('Post', PostSchema);
