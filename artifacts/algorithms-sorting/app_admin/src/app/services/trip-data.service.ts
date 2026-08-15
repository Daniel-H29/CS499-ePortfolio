import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Trip } from '../models/trip';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private readonly apiBaseUrl = 'http://localhost:3000/api';
  private readonly tripsUrl = `${this.apiBaseUrl}/trips`;

  constructor(
    private readonly http: HttpClient,
    @Inject(BROWSER_STORAGE) private readonly storage: Storage
  ) {}

  public getTrips(): Promise<Trip[]> {
    return this.executeRequest(
      this.http.get<Trip[]>(this.tripsUrl),
      'retrieve the trip list'
    );
  }

  public getTrip(tripCode: string): Promise<Trip> {
    return this.executeRequest(
      this.http.get<Trip>(`${this.tripsUrl}/${tripCode}`),
      `retrieve trip ${tripCode}`
    );
  }

  public addTrip(formData: Trip): Promise<Trip> {
    return this.executeRequest(
      this.http.post<Trip>(this.tripsUrl, formData, {
        headers: this.createAuthenticatedHeaders()
      }),
      'add the trip'
    );
  }

  public updateTrip(formData: Trip): Promise<Trip> {
    return this.executeRequest(
      this.http.put<Trip>(`${this.tripsUrl}/${formData.code}`, formData, {
        headers: this.createAuthenticatedHeaders()
      }),
      `update trip ${formData.code}`
    );
  }

  public login(user: User, password: string): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user, password);
  }

  public register(user: User, password: string): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user, password);
  }

  private makeAuthApiCall(
    urlPath: 'login' | 'register',
    user: User,
    password: string
  ): Promise<AuthResponse> {
    const body = {
      name: user.name,
      email: user.email,
      password
    };

    return this.executeRequest(
      this.http.post<AuthResponse>(`${this.apiBaseUrl}/${urlPath}`, body),
      `${urlPath} the user`
    );
  }

  private createAuthenticatedHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  private executeRequest<T>(
    request$: Observable<T>,
    operation: string
  ): Promise<T> {
    return firstValueFrom(
      request$.pipe(
        catchError((error: HttpErrorResponse) => {
          throw this.createApplicationError(error, operation);
        })
      )
    );
  }

  private createApplicationError(
    error: HttpErrorResponse,
    operation: string
  ): Error {
    let reason = 'An unexpected error occurred.';

    if (error.status === 0) {
      reason = 'The server could not be reached.';
    } else if (error.status === 401 || error.status === 403) {
      reason = 'Your session is not authorized for this action.';
    } else if (error.error?.message) {
      reason = error.error.message;
    } else if (error.message) {
      reason = error.message;
    }

    const applicationError = new Error(`Unable to ${operation}. ${reason}`);
    console.error(applicationError.message, error);
    return applicationError;
  }
}
