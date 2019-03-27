import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Buchung }         from '../../buchung';
import { BookingService }  from '../../booking.service';
import { MitreisenderService } from '../../mitreisender.service';
import { Mitreisender } from '../../mitreisender';
import { Rechnung } from '../../rechnung';
import { Zimmer } from '../../zimmer';
import { ZimmerService } from '../../zimmer.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
  providers: [BookingService]
})
export class BookingDetailComponent implements OnInit {

  resendTries = 0;
  booking: Buchung;
  mitreisendeArr: Mitreisender[];
  bookedRoomsArr: Zimmer[];
  showFinalizeButton = false;

  constructor(
      private bookingService: BookingService,
      private mitreisenderService: MitreisenderService,
      private zimmerService: ZimmerService,
      private location: Location,
      private router: Router,
      private route: ActivatedRoute
  	) { }

  ngOnInit() {
    this.getBooking();
    this.getMitreisende();
  }

	goBack(): void {
		this.location.back();
	}

	getBooking(): void {
		// get bookingID where the booking corresponds to ... '+' operator converts string to a number
		var bookingUrlID = +this.route.snapshot.paramMap.get('id');
		this.bookingService.readOneBooking(bookingUrlID).subscribe(
        result => {
          this.booking=result;

          // returned boolean actually has type string, therefore use a string comparison
          if (String(this.booking.bestaetigt) === "1") {
            this.showFinalizeButton = true;
          } else {
            this.showFinalizeButton = false;
          }
        },
        error => console.log(error)
      );

    // Get the room assignments for the booking
    this.bookingService.getRoomsForBooking(bookingUrlID).subscribe(
        result => {
            var roomAssignmentsArr = result['records'];
            var roomsOfBooking: Zimmer[] = new Array();

            for (let assignment of roomAssignmentsArr) {

              // get room object of the assigned ID
              this.zimmerService.readOneZimmer(assignment.zimmerID).subscribe(
                  result => {
                      roomsOfBooking.push(result);
                  },
                  error => {
                      console.log(error)
                  }
              );
            }
            this.bookedRoomsArr = roomsOfBooking;
        },
        error => {
            console.log(error)
        }
    );
  }

  printrooms() {
    console.log(this.bookedRoomsArr)
  }
  
  getMitreisende(): void {
		var bookingUrlID = +this.route.snapshot.paramMap.get('id');
    this.mitreisenderService.readMitreisendeForBooking(bookingUrlID).subscribe(
        result => this.mitreisendeArr=result['records'],
        error => console.log(error)
      );
  }

	toATLocale(_x) {
        if (_x === null || typeof(_x) === 'undefined') {
            return;
		}
		if (typeof(_x) === 'string') {
			_x = +_x;	// convert to number
		}

    return _x.toLocaleString('de-AT', {
        style: 'currency', 
        currency: 'EUR', 
        minimumFractionDigits: 2 
      });
  }

  toATLocaleDate(_x) {
    if (_x === null || typeof(_x) === 'undefined') {
        return;
    }
    if (typeof(_x) === 'string') {
      _x = new Date(_x);
    }

    return _x.toLocaleDateString('de-AT', {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  birthdayToATLocaleDate(_x) {
    if (_x === null || typeof(_x) === 'undefined') {
        return;
    }
    if (typeof(_x) === 'string') {
      _x = new Date(_x);
    }
    
    if (_x.getFullYear() < 1 || isNaN(_x.getFullYear)) {
      return "";
    }
 

    return _x.toLocaleDateString('de-AT', {
      year: 'numeric', month: 'numeric', day: 'numeric'
    });
  }

  // when user clicks the 'update' button
  updateBooking(){
    this.router.navigate(["/admin/update/" + this.booking.buchungID]);    
  }


  // when user clicks the 'delete' button
  deleteBooking(){
      if(confirm("Wollen Sie Buchung Nr. " + this.booking.buchungID + " wirklich löschen?")) {

          this.bookingService.deleteBooking(this.booking.buchungID)
          .subscribe(
                result => {
                  alert("Buchung wurde gelöscht")
                  this.goBack();  // close details page
                },
                error => {
                    alert("Problem: Buchung konnte nicht gelöscht werden.")
                    console.log(error)
                }
            );
      }
  }

  confirmBooking() {
      if(confirm("Wollen Sie die Buchung bestätigen?")) {
          this.bookingService.confirmBooking(this.booking)
          .subscribe(
                result => {
                  alert("Buchung wurde bestätigt")
                  this.showFinalizeButton = true;
                  this.ngOnInit();  // refresh
                },
                error => {
                    alert("Problem: Buchung konnte nicht bestätigt werden oder Mail konnte nicht gesendet werden.")
                    console.log(error)
                    this.ngOnInit();  // refresh
                }
            );
      }
  }

  setBookingAsPaid() {
    if(confirm("Zahlungseingang bestätigen?")) {
        this.bookingService.setBookingAsPaid(this.booking)
        .subscribe(
              result => {
                alert("Zahlungseingang bestätigt")
                this.ngOnInit();  // refresh
              },
              error => {
                  alert("Problem: Zahlungseingang konnte nicht bestätigt werden oder Mail konnte nicht gesendet werden.")
                  console.log(error)
                  this.ngOnInit();  // refresh
              }
          );
    }
  }

  finalizeBooking() {
    if(this.resendTries !== 0 || confirm("Wollen Sie die Rechnung absenden?")) {
      this.bookingService.getInvoiceForBooking(this.booking.buchungID).subscribe(
          result => {

              // console.log(result)
              // console.log(typeof(result))

              // error occurs probably because the invoice is not existing yet, resend it
              if (result.rechnungID === null && this.resendTries === 0) {
                  // console.log("result id is null, trying to create & resend invoice")
                  this.createInvoiceAndResend(this.booking.buchungID);
              } else {
                this.bookingService.sendInvoiceForBooking(result)
                .subscribe(
                      result => {
                        alert("Rechnung wurde versendet")
                        this.ngOnInit();  // refresh
                      },
                      error => {
                          console.log(error)
                          alert("Rechnung konnte nicht versendet werden")
                          this.ngOnInit();  // refresh
                      }
                  );
              }
          },
          error => {
            console.log("Cannot get invoice")
            console.log(error)
          }
        );
    }

}

createInvoiceAndResend(_bookingID: number) {
    console.log("trying to create & resend invoice")
    this.resendTries++;

    var tempInvoice = new Rechnung();
    tempInvoice.buchungID = _bookingID;
    tempInvoice.huetteID = this.booking.huetteID;
    tempInvoice.datum = new Date();

    this.bookingService.createInvoiceForBooking(tempInvoice).subscribe(
        result => {
            // console.log(result)
            this.finalizeBooking();
        },
        error => {
            console.log("could not create invoice")
            console.log(error)
        }
    )
}

createInvoice() {
  this.bookingService.getInvoiceForBooking(this.booking.buchungID).subscribe(
    result => {

        if (result.rechnungID === null && this.resendTries === 0) {
          var tempInvoice = new Rechnung();
          tempInvoice.buchungID = this.booking.buchungID;
          tempInvoice.huetteID = this.booking.huetteID;
          tempInvoice.datum = new Date();
        
          this.bookingService.createInvoiceForBooking(tempInvoice).subscribe(
              result => {
                  alert("Rechnung wurde erstellt")
              },
              error => {
                  alert("Rechnung konnte nicht erstellt werden")
              }
          )
        } else {
          alert("Rechnung existiert bereits")
        }
    },
    error => {
      console.log("Cannot get invoice")
      console.log(error)
    }
  );
}



}
