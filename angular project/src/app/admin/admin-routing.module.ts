import { NgModule } from '@angular/core';
import { AuthGuard } from '../auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
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

const adminRoutes: Routes = [
  { 
  	path: 'admin',  
  	component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [    
          { path: 'data', component: DataComponent },
          { path: 'invoices', component: InvoicesComponent },      
          { path: 'bookings', component: ReadBookingsComponent },
          { path: 'booking/:id', component: BookingDetailComponent },
          { path: 'bookingstart/:id', component: AdminBookingstartComponent },
          { path: 'createbooking/:id', component: AdminCreateBookingComponent },
          { path: 'companybooking/:id', component: AdminCompanyBookingComponent },
          { path: 'update/:id', component: UpdateBookingComponent },
          { path: 'closeddays', component: CloseddaysComponent },
          { path: 'closeddays/create', component: CloseddaysCreateComponent },
          { path: '**', component: ManagementComponent }
        ]
      }
    ]
 
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AdminRoutingModule { }
