import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThoughtNode } from './thought-organizer/thought-organizer.component';

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {
  private apiUrl = 'http://localhost:5000/api/thoughts';

  constructor(private http: HttpClient) {}

  
  login(username: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>('/api/login', { username, password });
  }

  getApplicationState(): Observable<ThoughtNode> {
    return this.http.get<ThoughtNode>(`${this.apiUrl}/state`);
  }

  saveApplicationState(state: ThoughtNode): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/state`, state);
  }
}
