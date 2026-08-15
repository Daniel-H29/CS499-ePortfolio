import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrls: ['./edit-trip.css']
})
export class EditTripComponent implements OnInit {

  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {

    let tripCode = localStorage.getItem("tripCode");

    if (!tripCode) {
      alert("Couldn't find tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    
    this.tripDataService.getTrip(tripCode)
      .then((value: any) => {

        this.trip = value;

        // IMPORTANT: your API likely returns ONE object, not an array
        this.editForm.patchValue(value);

        this.message = 'Trip ' + tripCode + ' retrieved';

        console.log(this.message);
      })
      .catch((error: any) => {
        console.log('Error: ' + error);
      });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
        .then((value: any) => {
          console.log(value);
          this.router.navigate(['']);
        })
        .catch((error: any) => {
          console.log('Error: ' + error);
        });
    }
  }

  get f() {
    return this.editForm.controls;
  }
}