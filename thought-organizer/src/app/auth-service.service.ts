import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post('/api/register', { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/login', { username, password });
  }

  
  setSession(username: string, token: string): void {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
  }

 
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }
}
