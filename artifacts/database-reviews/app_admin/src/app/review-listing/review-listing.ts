import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Review } from '../models/review';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-review-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-listing.html',
  styleUrl: './review-listing.css',
  providers: [TripDataService]
})
export class ReviewListingComponent implements OnInit {
  reviews: Review[] = [];
  trips: Trip[] = [];
  filterTripCode = '';
  message = '';
  errorMessage = '';
  isSaving = false;

  newReview: Review = this.emptyReview();

  constructor(private readonly tripDataService: TripDataService) {}

  ngOnInit(): void {
    this.loadTrips();
    this.loadReviews();
  }

  public loadReviews(): void {
    this.errorMessage = '';
    this.tripDataService
      .getReviews(this.filterTripCode || undefined)
      .then((reviews) => {
        this.reviews = reviews;
        this.message = `${reviews.length} review${reviews.length === 1 ? '' : 's'} found.`;
      })
      .catch((error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to retrieve reviews.';
      });
  }

  public addReview(): void {
    this.errorMessage = '';
    this.message = '';
    this.isSaving = true;

    this.tripDataService
      .addReview(this.newReview)
      .then(() => {
        this.message = 'Review added successfully.';
        this.newReview = this.emptyReview();
        this.loadReviews();
      })
      .catch((error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to add the review.';
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  public deleteReview(review: Review): void {
    if (!review._id || !confirm(`Delete the review from ${review.reviewerName}?`)) {
      return;
    }

    this.tripDataService
      .deleteReview(review._id)
      .then(() => {
        this.message = 'Review deleted successfully.';
        this.loadReviews();
      })
      .catch((error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to delete the review.';
      });
  }

  private loadTrips(): void {
    this.tripDataService
      .getTrips()
      .then((trips) => {
        this.trips = trips;
        if (!this.newReview.tripCode && trips.length > 0) {
          this.newReview.tripCode = trips[0].code;
        }
      })
      .catch((error: unknown) => {
        this.errorMessage = error instanceof Error ? error.message : 'Unable to retrieve trips.';
      });
  }

  private emptyReview(): Review {
    return {
      tripCode: '',
      reviewerName: '',
      reviewerEmail: '',
      rating: 5,
      comment: ''
    };
  }
}
