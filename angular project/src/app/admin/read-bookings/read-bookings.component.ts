import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../booking.service';
import { ZimmerService } from '../../zimmer.service';
import { Observable } from 'rxjs';
import { Buchung } from '../../buchung';
import { Zimmer } from '../../zimmer';
import { Router } from '@angular/router';
import { CloseddayService } from '../../closedday.service';
import { Closedday } from '../../closedday';
import { AuthService } from '../../auth.service';
import { HuetteService } from '../../huette.service';
import { Rechnung } from '../../rechnung';
import { Zimmerzuteilung } from '../../zimmerzuteilung';

const monthNames = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                        'August', 'September', 'Oktober', 'November', 'Dezember'];

@Component({
  selector: 'app-read-bookings',
  templateUrl: './read-bookings.component.html',
  styleUrls: ['./read-bookings.component.css'],
  providers: [BookingService, ZimmerService]
})
export class ReadBookingsComponent implements OnInit {

    useCalendarView = true;
    resendTries = 0;
    huetteID: number;
    zimmerArr: Zimmer[];
    lagerArr: Zimmer[];
    rooms = ['Zimmer 1', 'Zimmer 2', 'Zimmer 3'];
    today: Date;
    year: number;
    month: number;
    monthName: string;
    numberOfDays: number;
    days: number[];
    bookingsOfMonth: Buchung[];
    bookingsForRoom: Buchung[];
    closeddaysOfMonth: Closedday[];
    roomAssignmentsOfEstablishment: Zimmerzuteilung[];

    testy = true;
 
    constructor(
        private authService: AuthService,
        private closeddayService: CloseddayService,
        private bookingService: BookingService,
        private zimmerService: ZimmerService,
        private huetteService: HuetteService,
        private router: Router
    ){}

    ngOnInit(){
        this.huetteID = this.authService.getHuetteID();
        
        this.zimmerService.readZimmerForHuette(this.huetteID)
            .subscribe(zimmer =>
                this.zimmerArr=zimmer['records']
             );

        // ID 3 --> lager
        this.huetteService.readZimmerWithCategory(this.huetteID, 3)
             .subscribe(zimmer => this.lagerArr=zimmer['records']);
        
        this.loadCalendar();
    }
 
    /*
     * Checks if the currently displayed day is in between the period of a booking.
     * Used to display which days are occupied and which days are not.
     */
    isRoomOccupiedAtThisDay(_day: number, _booking: Buchung) {
        // create new date because the date is only recognized as a string
        // --> date functions would not work
        let start = new Date(_booking.checkinDatum);
        let end = new Date(_booking.checkoutDatum);

        // console.log(_day + "." + this.month + "." + this.year)
        // console.log(start)
        // console.log(end)
        if (this.month === start.getMonth()+1 && this.month === end.getMonth()+1) {
            if (_day >= start.getDate() && _day <= end.getDate()) {
                // console.log("same month: true")
                return true;
            }
        }
        else if (this.month === start.getMonth()+1 && this.month !== end.getMonth()+1) {
            if (_day >= start.getDate()) {
                // console.log("other month: true")
                return true;
            } 
        } else if (this.month !== start.getMonth()+1 && this.month === end.getMonth()+1) {
            if (_day <= end.getDate()) {
                // console.log("other month: true")
                return true;
            }
        }
        return false;
    }

    getFreeLagerSpacesForDay(_day: number) : number {
        // console.log("--- DAY: " + _day + " ---")

        if (this.lagerArr === null || typeof(this.lagerArr) === 'undefined') {
            return -1;
        }

        
        // there is only one sleeping camp, use first result in array:
        var lager = this.lagerArr[0];
        
        if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
            return lager.plaetze;
        }
        
        if (this.roomAssignmentsOfEstablishment === null || typeof(this.roomAssignmentsOfEstablishment) === 'undefined') {
            return lager.plaetze;
        }
        
        let bookingsOnThisDayArr: Buchung[] = new Array();
        for (let booking of this.bookingsOfMonth) {
            var isLagerBooking = true;

            // filter bookings which are not lager bookings
            for (let assignment of this.roomAssignmentsOfEstablishment) {
                if (assignment.buchungID === booking.buchungID) {
                    if (assignment.zimmerID !== lager.zimmerID) {
                        isLagerBooking = false;
                    }
                }
            }

            if (!isLagerBooking) {
                continue;   // leave loop for this booking
            }

            // create new date because the date is only recognized as a string
            // --> date functions would not work
            let start = new Date(booking.checkinDatum);
            let end = new Date(booking.checkoutDatum);

            if (this.month === start.getMonth()+1 && this.month === end.getMonth()+1) {
                if (_day >= start.getDate() && _day <= end.getDate()) {
                    bookingsOnThisDayArr.push(booking);
                }
            }
            else if (this.month === start.getMonth()+1 && this.month !== end.getMonth()+1) {
                if (_day >= start.getDate()) {
                    bookingsOnThisDayArr.push(booking);
                } 
            } else if (this.month !== start.getMonth()+1 && this.month === end.getMonth()+1) {
                if (_day <= end.getDate()) {
                    bookingsOnThisDayArr.push(booking);
                }
            }
        }

        var freeSpacesInCamp = lager.plaetze;

        // subtract all used spaces in the camp
        for (let booking of bookingsOnThisDayArr) {
            freeSpacesInCamp -= (Number(booking.erwachseneMitglieder) + Number(booking.jugendlicheMitglieder) + 
                                Number(booking.kinderMitglieder) + Number(booking.erwachseneNichtMitglieder) + 
                                Number(booking.jugendlicheNichtMitglieder) + Number(booking.kinderNichtMitglieder));
        }
        return freeSpacesInCamp;
    }

    isClosedOnThisDay(_day: number) {
        if (this.closeddaysOfMonth === null || typeof(this.closeddaysOfMonth) === 'undefined') {
            return;
        }
        
        // console.log("---------")
        for (let closedday of this.closeddaysOfMonth) {

            // create new date because the date is only recognized as a string
            // --> date functions would not work
            let start = new Date(closedday.startDatum);
            let end = new Date(closedday.endDatum);

            // console.log(_day + "." + this.month + "." + this.year)
            // console.log(start)
            // console.log(end)
            if (this.month === start.getMonth()+1 && this.month === end.getMonth()+1) {
                if (_day >= start.getDate() && _day <= end.getDate()) {
                    // console.log("same month: true")
                    return true;
                }
            }
            else if (this.month === start.getMonth()+1 && this.month !== end.getMonth()+1) {
                if (_day >= start.getDate()) {
                    // console.log("other month: true")
                    return true;
                } 
            } else if (this.month !== start.getMonth()+1 && this.month === end.getMonth()+1) {
                if (_day <= end.getDate()) {
                    // console.log("other month: true")
                    return true;
                }
            }
        };
        return false;
    }
    

    getBookingsForRoom(_zimmerID: number) {

        let bookingArr: Buchung[] = new Array();

        if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
            return
        }

        if (this.roomAssignmentsOfEstablishment === null || typeof(this.roomAssignmentsOfEstablishment) === 'undefined') {
            return
        }

        for (let booking of this.bookingsOfMonth) {

            for (let assignment of this.roomAssignmentsOfEstablishment) {
                // if the room is already assigned to a booking, mark it as occupied
                if (assignment.buchungID === booking.buchungID && assignment.zimmerID === _zimmerID) {
                    bookingArr.push(booking);
                }
            }

        }

        this.bookingsForRoom = bookingArr;
        return bookingArr;
    }


    loadCalendar() {
        let today = new Date();
        this.today = today;
        this.year = today.getFullYear();
        this.month = today.getMonth() + 1;
        this.monthName = monthNames[today.getMonth()];
        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    loadBookingsOfMonth() {
        this.bookingService.readBookingsByDate(this.huetteID, this.month, this.year)
            .subscribe(bookings =>
                this.bookingsOfMonth=bookings['records']
            );

        this.closeddayService.readCloseddaysByDate(this.huetteID, this.month, this.year).subscribe(
                result => {
                    this.closeddaysOfMonth = result['records'];
                }
            );


        // Get the room assignments for each booking
        this.bookingService.getAllRoomAssignmentsForEstablishment(this.huetteID, this.month, this.year).subscribe(
            result => {
                this.roomAssignmentsOfEstablishment = result['records'];
            },
            error => {
                console.log(error)
            }
        );
    }

    calcDaysOfMonth() {
        this.numberOfDays = new Date(this.year, this.month, 0).getDate();

        let dayArr = Array(this.numberOfDays+1).fill(0).map((x,i)=>i);
        this.days = dayArr.slice(1);
    }

    loadNextMonth() {
        if (this.month == 12) {
            this.year += 1;
            this.month = 1;
        } else {
            this.month += 1;
        }

        this.monthName = monthNames[this.month - 1];

        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    loadPreviousMonth() {
        if (this.month == 1) {
            this.year -= 1;
            this.month = 12;
        } else {
            this.month -= 1;
        }
        
        this.monthName = monthNames[this.month - 1];

        this.calcDaysOfMonth();
        this.loadBookingsOfMonth();
    }

    // when user clicks the 'read' button
    readOneBooking(_id){
        this.router.navigate(["/admin/booking/" + _id]);
    }

    createBooking() {
        this.router.navigate(["/admin/bookingstart/" + this.huetteID]);
    }

    toggleViewMode() {
        this.useCalendarView = !this.useCalendarView;
    }

    // when user clicks the 'update' button
    updateBooking(_id){
        this.router.navigate(["/admin/update/" + _id]);        
    }


    // when user clicks the 'delete' button
    deleteBooking(_id){
        if(confirm("Wollen Sie Buchung Nr. " + _id + " wirklich löschen?")) {

            this.bookingService.deleteBooking(_id)
            .subscribe(
                 result => {
                    alert("Buchung wurde gelöscht")
                    this.ngOnInit();    // refresh component to make changes visible
                 },
                 error => {
                     alert("Problem: Buchung konnte nicht gelöscht werden.")
                     console.log(error)
                 }
             );
  
        }
        
    }

    confirmBooking(_booking) {
        if(confirm("Wollen Sie die Buchung bestätigen?")) {
            this.bookingService.confirmBooking(_booking)
            .subscribe(
                  result => {
                    alert("Buchung wurde bestätigt")
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
  
    finalizeBooking(_id: number) {
        // console.log("id " + _id)
        if(confirm("Wollen Sie die Rechnung absenden?")) {

            this.bookingService.getInvoiceForBooking(_id).subscribe(
                result => {

                    // console.log(result)
                    // console.log(typeof(result))

                    // error occurs probably because the invoice is not existing yet, resend it
                    if (result.rechnungID === null && this.resendTries === 0) {
                        // console.log("result id is null, trying to create & resend invoice")
                        this.createInvoiceAndResend(_id);
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
                error => console.log(error)
            );
        }
    }

    createInvoiceAndResend(_bookingID: number) {
        console.log("trying to create & resend invoice")
        this.resendTries++;

        var tempInvoice = new Rechnung();
        tempInvoice.buchungID = _bookingID;
        tempInvoice.huetteID = this.huetteID;
        tempInvoice.datum = new Date();

        this.bookingService.createInvoiceForBooking(tempInvoice).subscribe(
            result => {
                console.log(result)
                this.finalizeBooking(_bookingID);
            },
            error => {
                console.log("could not create invoice")
                console.log(error)
            }
        )
    }

    toATLocaleDate(_x) {
        if (_x === null || typeof(_x) === 'undefined') {
            return;
        }
        if (typeof(_x) === 'string') {
          _x = new Date(_x);
        }
    
        return _x.toLocaleDateString('de-AT', {
          weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'
        });
    }

    getTotalPersonsOfBooking(_booking: Buchung) : Number {
        return  Number(_booking.erwachseneMitglieder) + Number(_booking.jugendlicheMitglieder) + 
                Number(_booking.kinderMitglieder) + Number(_booking.erwachseneNichtMitglieder) + 
                Number(_booking.jugendlicheNichtMitglieder) + Number(_booking.kinderNichtMitglieder);
    }

}
