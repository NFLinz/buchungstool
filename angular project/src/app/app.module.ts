import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HuettenComponent } from './huetten/huetten.component';
import { HuetteDetailComponent } from './huette-detail/huette-detail.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminModule} from './admin/admin.module';
import { ReadHuettenComponent } from './dashboard/read-huetten/read-huetten.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './auth.service';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { LoginRoutingModule } from './/login-routing.module';
import { BookingFinalComponent } from './booking-final/booking-final.component';
import { MakeBookingComponent } from './make-booking/make-booking.component';
import { TestComponent } from './test/test.component';
import { BookingstartComponent } from './bookingstart/bookingstart.component';
import { CompanyBookingComponent } from './company-booking/company-booking.component';
import { CompanyBookingFinalComponent } from './company-booking-final/company-booking-final.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HuettenComponent,
    HuetteDetailComponent,
    PageNotFoundComponent,
    ReadHuettenComponent,
    LoginComponent,
    SignUpComponent,
    CreateBookingComponent,
    CreateUserComponent,
    BookingFinalComponent,
    MakeBookingComponent,
    TestComponent,
    BookingstartComponent,
    CompanyBookingComponent,
    CompanyBookingFinalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AdminModule,
    AppRoutingModule,
    LoginRoutingModule  // <-- needs to be last entry in imports!
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
