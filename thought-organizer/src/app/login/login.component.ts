import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule], 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post<{ success: boolean; message: string }>('/api/login', { username: this.username, password: this.password })
      .subscribe(response => {
        if (response.success) {
          localStorage.setItem('isLoggedIn', 'true'); 
          this.router.navigate(['/thought-organizer']); 
        } else {
          this.errorMessage = response.message;
        }
      }, error => {
        this.errorMessage = 'An error occurred during login.';
      });
  }
}
