import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThoughtService } from '../thought.service';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  registerUsername: string = '';
  registerPassword: string = '';
  registrationErrorMessage: string = '';

  constructor(private router: Router, private thoughtService: ThoughtService) {}

  onRegister() {
    this.thoughtService.register(this.registerUsername, this.registerPassword).subscribe(
      (response) => {
        if (response.success) {
          alert('User created successfully!');
          this.router.navigate(['/']); 
        } else {
          this.registrationErrorMessage = response.message;
        }
      },
      (error) => {
        this.registrationErrorMessage = 'Registration failed. Please try again.';
      }
    );
  }
}
