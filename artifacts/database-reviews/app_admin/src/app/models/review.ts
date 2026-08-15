export interface ReviewTripSummary {
  _id: string;
  code: string;
  name: string;
  resort: string;
}

export interface Review {
  _id?: string;
  trip?: ReviewTripSummary;
  tripCode: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}
