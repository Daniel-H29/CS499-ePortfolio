const mongoose = require('mongoose');
const Review = require('../models/review');
const Trip = require('../models/travlr');

const validationMessage = (error) => {
  if (error?.name === 'ValidationError') {
    return Object.values(error.errors).map((item) => item.message).join(' ');
  }
  return error.message || 'The database operation failed.';
};

// GET /reviews?tripCode=GALR210214
const reviewsList = async (req, res) => {
  try {
    const filter = req.query.tripCode
      ? { tripCode: req.query.tripCode.toUpperCase() }
      : {};

    const reviews = await Review.find(filter)
      .populate('trip', 'code name resort')
      .sort({ createdAt: -1 })
      .exec();

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: validationMessage(error) });
  }
};

// GET /reviews/:reviewId
const reviewsFindById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.reviewId)) {
    return res.status(400).json({ message: 'The review ID is invalid.' });
  }

  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('trip', 'code name resort')
      .exec();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ message: validationMessage(error) });
  }
};

// POST /reviews (JWT required)
const reviewsAddReview = async (req, res) => {
  try {
    const tripCode = String(req.body.tripCode || '').trim().toUpperCase();
    const trip = await Trip.findOne({ code: tripCode }).exec();

    if (!trip) {
      return res.status(404).json({ message: `Trip ${tripCode || '(missing code)'} was not found.` });
    }

    const review = await Review.create({
      trip: trip._id,
      tripCode: trip.code,
      reviewerName: req.body.reviewerName,
      reviewerEmail: req.body.reviewerEmail,
      rating: Number(req.body.rating),
      comment: req.body.comment
    });

    await review.populate('trip', 'code name resort');
    return res.status(201).json(review);
  } catch (error) {
    const status = error?.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({ message: validationMessage(error) });
  }
};

// PUT /reviews/:reviewId (JWT required)
const reviewsUpdateReview = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.reviewId)) {
    return res.status(400).json({ message: 'The review ID is invalid.' });
  }

  try {
    const review = await Review.findById(req.params.reviewId).exec();

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (req.body.tripCode) {
      const tripCode = String(req.body.tripCode).trim().toUpperCase();
      const trip = await Trip.findOne({ code: tripCode }).exec();
      if (!trip) {
        return res.status(404).json({ message: `Trip ${tripCode} was not found.` });
      }
      review.trip = trip._id;
      review.tripCode = trip.code;
    }

    ['reviewerName', 'reviewerEmail', 'rating', 'comment'].forEach((field) => {
      if (req.body[field] !== undefined) {
        review[field] = field === 'rating' ? Number(req.body[field]) : req.body[field];
      }
    });

    const updatedReview = await review.save();
    await updatedReview.populate('trip', 'code name resort');
    return res.status(200).json(updatedReview);
  } catch (error) {
    const status = error?.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({ message: validationMessage(error) });
  }
};

// DELETE /reviews/:reviewId (JWT required)
const reviewsDeleteReview = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.reviewId)) {
    return res.status(400).json({ message: 'The review ID is invalid.' });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId).exec();

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(200).json({ message: 'Review deleted successfully.', id: deletedReview._id });
  } catch (error) {
    return res.status(500).json({ message: validationMessage(error) });
  }
};

module.exports = {
  reviewsList,
  reviewsFindById,
  reviewsAddReview,
  reviewsUpdateReview,
  reviewsDeleteReview
};
