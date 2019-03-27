import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReadBookingsComponent } from './read-bookings/read-bookings.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { ManagementComponent } from './management/management.component';
import { DataComponent } from './data/data.component';
import { CloseddaysComponent } from './closeddays/closeddays.component';
import { CloseddaysCreateComponent } from './closeddays-create/closeddays-create.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { AdminCreateBookingComponent } from './admin-create-booking/admin-create-booking.component';
import { AdminBookingstartComponent } from './admin-bookingstart/admin-bookingstart.component';
import { AdminCompanyBookingComponent } from './admin-company-booking/admin-company-booking.component';
import { UpdateBookingComponent } from './update-booking/update-booking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, SignInComponent, ReadBookingsComponent, BookingDetailComponent, ManagementComponent, DataComponent, CloseddaysComponent, CloseddaysCreateComponent, InvoicesComponent, AdminCreateBookingComponent, AdminBookingstartComponent, AdminCompanyBookingComponent, UpdateBookingComponent]
})
export class AdminModule { }
