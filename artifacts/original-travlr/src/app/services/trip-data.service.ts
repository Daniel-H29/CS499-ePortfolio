import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Trip } from "../models/trip";
import { BROWSER_STORAGE } from "../storage";
import { User } from "../models/user";
import { AuthResponse } from "../models/auth-response";

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private apiBaseUrl = "http://localhost:3000/api/";
  private tripUrl = `${this.apiBaseUrl}trips/`;

  public getTrips(): Promise<Trip[]> {
    return this.http
      .get<Trip[]>(`${this.apiBaseUrl}trips`)
      .toPromise()
      .then(res => res as Trip[])
      .catch(this.handleError);
  }

  public getTrip(tripCode: string): Promise<Trip> {
    console.log("Inside TripDataService#getTrip");
    return this.http
      .get<Trip>(this.tripUrl + tripCode)
      .toPromise()
      .then(response => response as Trip)
      .catch(this.handleError);
  }

  public addTrip(formData: Trip): Promise<Trip> {
    console.log("Inside TripDataService#addTrip");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("travlr-token")}`,
    });

    return this.http
      .post<Trip>(this.tripUrl, formData, { headers })
      .toPromise()
      .then(response => response as Trip)
      .catch(this.handleError);
  }

  public updateTrip(formData: Trip): Promise<Trip> {
    console.log("Inside TripDataService#updateTrip");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("travlr-token")}`,
    });

    return this.http
      .put<Trip>(this.tripUrl + formData.code, formData, { headers })
      .toPromise()
      .then(response => response as Trip)
      .catch(this.handleError);
  }

  public login(user: User, password: string): Promise<AuthResponse> {
    return this.makeAuthApiCall("login", user, password);
  }

  public register(user: User, password: string): Promise<AuthResponse> {
    return this.makeAuthApiCall("register", user, password);
  }

  private makeAuthApiCall(
    urlPath: string,
    user: User,
    password: string
  ): Promise<AuthResponse> {

    const url: string = `${this.apiBaseUrl}/${urlPath}`;

    const body = {
      name: user.name,
      email: user.email,
      password: password
    };

    return this.http
      .post<AuthResponse>(url, body)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("Something has gone wrong", error);
    return Promise.reject(error.message || error);
  }
}