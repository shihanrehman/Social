'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Like Schema
 */
var LikeSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content_id: {
    type: String,
    required: true,
    trim: true
  },
  is_post: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


/**
 * Statics
 */
// LikeSchema.statics.load = function(cb) {
  // this.find().populate('user', 'name username').exec(cb);
// };

LikeSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Like', LikeSchema);
