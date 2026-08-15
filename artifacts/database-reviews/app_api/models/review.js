const mongoose = require('mongoose');

// Reviews are stored in their own collection and reference the related trip.
const reviewSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'trips',
    required: true,
    index: true
  },
  tripCode: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  reviewerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 60
  },
  reviewerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'A valid email address is required.']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number from 1 to 5.'
    }
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Supports fast retrieval by trip and newest-first display.
reviewSchema.index({ tripCode: 1, createdAt: -1 });

module.exports = mongoose.model('reviews', reviewSchema);
