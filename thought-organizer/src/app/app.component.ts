import { Component } from '@angular/core';
import { ThoughtOrganizerComponent } from './thought-organizer/thought-organizer.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  styles: [],
  standalone: true,
  imports: [ThoughtOrganizerComponent, LoginComponent, RouterModule] // Ensure this is included
})
export class AppComponent {
  // Remove this method if not needed
  title(title: any) {
    throw new Error('Method not implemented.');
  }
}



