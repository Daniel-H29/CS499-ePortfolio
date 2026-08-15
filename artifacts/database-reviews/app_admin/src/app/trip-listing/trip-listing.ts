import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card';

type SortOption = 'name-asc' | 'price-asc' | 'length-asc';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
  providers: [TripDataService]
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  message = '';
  sortOption: SortOption = 'name-asc';

  constructor(
    private tripDataService: TripDataService,
    private router: Router
  ) {
    console.log('trip-listing constructor');
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  /**
   * Sorts a copy of the trip array so the original service response is not
   * modified in place. Each option uses a comparison function suited to the
   * selected trip field.
   */
  public sortTrips(): void {
    this.trips = [...this.trips].sort((firstTrip, secondTrip) => {
      switch (this.sortOption) {
        case 'price-asc':
          return this.parseNumber(firstTrip.perPerson) - this.parseNumber(secondTrip.perPerson);

        case 'length-asc':
          return this.parseNumber(firstTrip.length) - this.parseNumber(secondTrip.length);

        case 'name-asc':
        default:
          return firstTrip.name.localeCompare(secondTrip.name, undefined, {
            sensitivity: 'base'
          });
      }
    });
  }

  /**
   * Converts values such as "$1,299" or "7 days" into numbers that can be
   * compared by the sorting algorithm.
   */
  private parseNumber(value: string): number {
    const parsedValue = Number.parseFloat(value.replace(/[^0-9.-]+/g, ''));
    return Number.isNaN(parsedValue) ? Number.POSITIVE_INFINITY : parsedValue;
  }

  private getStuff(): void {
    this.tripDataService
      .getTrips()
      .then((value: Trip[]) => {
        this.trips = value;
        this.sortTrips();

        if (value.length > 0) {
          this.message = `There are ${value.length} trips available`;
        } else {
          this.message = 'There were no trips retrieved from the database';
        }

        console.log(this.message);
      })
      .catch((error: unknown) => {
        console.error(error);
        this.message =
          error instanceof Error
            ? error.message
            : 'The request could not be completed.';
      });
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }
}
