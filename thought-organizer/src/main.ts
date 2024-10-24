
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { ThoughtOrganizerComponent } from './app/thought-organizer/thought-organizer.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'thought-organizer', component: ThoughtOrganizerComponent },
  { path: '**', redirectTo: '' }, 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
});
