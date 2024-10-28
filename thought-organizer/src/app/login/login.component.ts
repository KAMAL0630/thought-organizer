import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThoughtService } from '../thought.service'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule] 
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  

  constructor(
    private router: Router, 
    private thoughtService: ThoughtService, 
    private authService: AuthService
) {}


  onLogin() {
    this.thoughtService.login(this.username, this.password).subscribe(
        (response) => {
            if (response.success) {
                
                this.authService.setSession(this.username, response.token);
                this.router.navigate(['/thought-organizer']); 
            } else {
                this.errorMessage = response.message;
            }
        },
        (error) => {
            this.errorMessage = 'Login failed. Please check your credentials and try again.';
        }
    );
}

}
