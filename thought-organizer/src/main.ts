
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { ThoughtOrganizerComponent } from './app/thought-organizer/thought-organizer.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RegisterComponent } from './app/register/register.component';

const routes = [
  { path: '', component: LoginComponent },
  { path: 'thought-organizer', component: ThoughtOrganizerComponent },
  { path: 'register', component:RegisterComponent},
  { path: '**', redirectTo: '' }, 
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
});
