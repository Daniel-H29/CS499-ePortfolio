import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data.service';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {

private storage: Storage = localStorage;

constructor(
    private tripDataService: TripDataService
) { }

public getToken(): string | null {
    return this.storage.getItem('travlr-token');
}

public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
}

public login(user: User, password: string): Promise<any> {
  return this.tripDataService.login(user, password)
    .then((authResp: AuthResponse) => this.saveToken(authResp.token));
}

public register(user: User, password: string): Promise<any> {
  return this.tripDataService.register(user, password)
    .then((authResp: AuthResponse) => this.saveToken(authResp.token));
}

public logout(): void {
    this.storage.removeItem('travlr-token');
}

public isLoggedIn(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

public getCurrentUser(): User | undefined {
    if (this.isLoggedIn()) {
        const token: string | null = this.getToken();
        const { email, name } = JSON.parse(atob(token!.split('.')[1]));
        return { email, name } as User;
    }
    return undefined;
}
}