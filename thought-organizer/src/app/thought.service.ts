import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThoughtNode } from './thought-organizer/thought-organizer.component';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {
  private apiUrl = 'http://localhost:5000/api/thoughts';
  private authUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) {}

 
  register(username: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.authUrl}/register`, { username, password });
  }


  login(username: string, password: string): Observable<{ success: boolean; message: string; token: string }> {
    return this.http.post<{ success: boolean; message: string; token: string }>(`${this.authUrl}/login`, { username, password });
  }


  getApplicationState(username: string, token: string): Observable<ThoughtNode> {
    return this.http.get<ThoughtNode>(`${this.apiUrl}/state`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

 
  saveApplicationState(state: ThoughtNode, token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/state`, state, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
