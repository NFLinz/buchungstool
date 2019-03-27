import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HuettenComponent }      from './huetten/huetten.component';
import { HuetteDetailComponent }  from './huette-detail/huette-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { ReadHuettenComponent } from './dashboard/read-huetten/read-huetten.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { BookingFinalComponent } from './booking-final/booking-final.component';
import { TestComponent } from './test/test.component';
import { BookingstartComponent } from './bookingstart/bookingstart.component';
import { CompanyBookingComponent } from './company-booking/company-booking.component';
import { CompanyBookingFinalComponent } from './company-booking-final/company-booking-final.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },	// redirect
  { path: 'dashboard', component: ReadHuettenComponent },
  { path: 'huette/:id', component: HuetteDetailComponent },
  { path: 'huetten', component: HuettenComponent },  
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'newuser', component: CreateUserComponent },
  { path: 'bookingstart/:id', component: BookingstartComponent },
  { path: 'booking/:id', component: CreateBookingComponent },
  { path: 'companybooking/:id', component: CompanyBookingComponent },
  { path: 'final', component: BookingFinalComponent },
  { path: 'companyfinal', component: CompanyBookingFinalComponent },
  { path: 'test', component: TestComponent },
  { path: '**', component: PageNotFoundComponent }		// Wildcart route 
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
