import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HuetteService } from '../../huette.service';
import { Huette } from '../../huette';
import { Zimmer } from '../../zimmer';
import { Closedday } from '../../closedday';
import { Buchung } from '../../buchung';
import { Zimmerkategorie } from '../../zimmerkategorie';
import { UserService } from '../../user.service';
import { MitreisenderService } from '../../mitreisender.service';
import { BookingService } from '../../booking.service';
import { CloseddayService } from '../../closedday.service';
import { Mitreisender } from '../../mitreisender';
import { Zimmerzuteilung } from '../../zimmerzuteilung';

const monthNames = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                        'August', 'September', 'Oktober', 'November', 'Dezember'];

@Component({
  selector: 'app-admin-create-booking',
  templateUrl: './admin-create-booking.component.html',
  styleUrls: ['./admin-create-booking.component.css']
})
export class AdminCreateBookingComponent implements OnInit {

  memberDiscountFactor = 0.9; // 10 % price reduction

  anreden = ['', 'Herr', 'Frau', 'Firma'];  

  adultRooms: Zimmer[];

  today: Date;
  year: number;
  month: number;
  monthName: string;
  numberOfDays: number;
  days: number[];
  isFirstCalendarStart = true;

  closeddaysOfMonth: Closedday[];
  bookingsOfMonth: Buchung[];
  bookingsForRoom: Buchung[];
  roomCategories: Zimmerkategorie[];
  selectedCategoryID: number;
  zimmerForCategoryArr: Zimmer[];
  selectedRoomsArr: Zimmer[];
  fellowTravelerDict = {};
  roomAssignmentsOfEstablishment: Zimmerzuteilung[];

  boardTypes = ["Frühstück", "Halbpension"];
  selectedBoardType = "Frühstück";
  
  paymentMethods = ["Zahlung auf Rechnung"];
  selectedPaymentMethod: string;
  selectedPaymentMethodNumber: number;


  huette: Huette;
  currentTab = 0; // Current tab is set to be the first tab (0)
  create_booking_form: FormGroup;
  mitreisendeForm: FormGroup;
  mitreisende: FormArray;

  // get huetteID where the booking corresponds to ... '+' operator converts string to a number
  huetteUrlID = +this.route.snapshot.paramMap.get('id');

  amountPersons = 1;
  areCalculatedAmountsAvailable = false;
  calculatedAmountNonMemberAdults = 1;         // real calculated amount (no of non-members who are adults at the day of arrival)
  calculatedAmountMemberAdults = 0;   // real calculated amount (no of members who are adults at the day of arrival)
  calculatedAmountNonMemberTeenagers = 0;      // real
  calculatedAmountMemberTeenagers = 0; // real
  calculatedAmountNonMemberKids = 0;           // real
  calculatedAmountMemberKids = 0;     // real

  totalPrice: number;

  dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  selectFirstDay = true;
  checkInDate = null;
  checkOutDate = null;
  monthOfCheckInDate: number;
  yearOfCheckInDate: number;
  areBookingsReadyForMonth = false;

  // initialize 'product service', 'category service' and 'form builder'
  constructor(
      private location: Location,
      private closeddayService: CloseddayService,
      private bookingService: BookingService,
      private mitreisenderService: MitreisenderService,
      private huetteService: HuetteService,
      private userService: UserService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router
  ){
      // based on our html form, build our angular form
      this.create_booking_form = this.formBuilder.group({
          huetteID: this.huetteUrlID,
          anrede: ["", Validators.required],
          zimmerArray: this.selectedRoomsArr,
          personen: this.amountPersons,
          erwachseneMitglieder: 0,
          erwachseneNichtMitglieder: 0,
          jugendlicheMitglieder: 0,
          jugendlicheNichtMitglieder: 0,
          kinderMitglieder: 0,
          kinderNichtMitglieder: 0, 
          checkinDatum: this.checkInDate,
          checkoutDatum: this.checkOutDate,
          preis: this.totalPrice,
          zimmerkategorie: ["", Validators.required],
          verpflegung: this.selectedBoardType,
          bvorname: ["", Validators.required],
          bnachname: ["", Validators.required],
          bgeburtsdatum: ["", Validators.required],
          badresse: ["", Validators.required],
          bplz: ["", Validators.required],
          bort: ["", Validators.required],
          btelefonnummer: ["", Validators.required],
          bmail: ["", Validators.required],
          zahlungsartID: this.selectedPaymentMethodNumber,
          zahlungsartName: this.selectedPaymentMethod,
          bmitglied: false,
          bemerkung: [""]
      });

      this.mitreisendeForm = this.formBuilder.group({
          mitreisende: this.formBuilder.array([this.createMitreisender()])
      });
  }

  ngOnInit(){
     this.getHuette();
     this.getRoomCategories();
     this.showTab(this.currentTab); // Display the current tab
     this.loadCalendar();
  }

  // ---------------------- SELECT -----------------------------------------------------
  zimmerkategorieSelectOnChange(_value: string) {
      // console.log("select: "+_value)

      // safety check
      if (this.roomCategories === null || typeof(this.roomCategories) === 'undefined') {
          return false;
      }

      // get category name and find corresponding ID
      let categoryName = this.create_booking_form.get('zimmerkategorie').value;
      var categoryID = -1;
      for (var i = 0; i < this.roomCategories.length; i++) {
          // safety check
          if (this.roomCategories[i] === null || typeof(this.roomCategories[i]) === 'undefined') {
              return false;
          }
          // search for the corresponding category
          if (this.roomCategories[i].name === categoryName) {
              categoryID = this.roomCategories[i].zimmerkategorieID;
          }
      }
      // return false if no matching category has been found
      if (categoryID === -1) {
          return false
      } else {
          this.selectedCategoryID = categoryID;
      }

      // get huetteID where the booking corresponds to ... '+' operator converts string to a number
      const huetteUrlID = +this.route.snapshot.paramMap.get('id');
      this.huetteService.readZimmerWithCategory(huetteUrlID, categoryID)
             .subscribe(zimmer => this.zimmerForCategoryArr=zimmer['records']);
  }

  verpflegungSelectOnChange(_value: string) {
    // console.log("select: " + _value)
    this.selectedBoardType = _value;
}

  personSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.amountPersons = _value;
    this.fillMitreisendeFormArray();
  }

  calcTotalPersons() {
      return Number(this.amountPersons);
  }

  anredeSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.create_booking_form.get('anrede').setValue(_value);
  }

  getTotalPersonsArray(_startIndex: number) {
      // create an empty array with one element for each person
      let personArr: number[] = new Array();

      if (_startIndex === 0) {
          // fill array ascending starting at 0 ... 0,1,2,3,4,5,...n (including the booking person)
          for (var i = 0; i <= this.calcTotalPersons(); i++) {
              personArr.push(i);
          }
      } else {
          // fill array ascending starting at 1 ... 1,2,3,4,5,...n (person 0 is the booking person)
          for (var i = 1; i < this.calcTotalPersons(); i++) {
              personArr.push(i);
          }
      }

      return personArr;
  }

  /*
   * Helper method. Creates an ascending array (e.g. 0,1,2,3,4,5,6)
   */
  getAscendingArray(_start: number, _end: number) {
      let arr: number[] = new Array();

      for (var i = _start; i <= _end; i++) {
          arr.push(i);
      }

      return arr;
  }

  // ----------------------- CALENDAR --------------------------------------------------
  loadCalendar() {
      // console.log("loadCalendar")
      let today = new Date();
      this.today = today;
      this.year = today.getFullYear();
      this.month = today.getMonth() + 1;
      this.monthName = monthNames[today.getMonth()];
      this.calcDaysOfMonth();
      this.loadBookingsOfMonth();
  }

  loadBookingsOfMonth() {
      // console.log("loadBookingsOfMonth")
      const huetteUrlID = +this.route.snapshot.paramMap.get('id');

      this.bookingService.readBookingsByDate(huetteUrlID, this.month, this.year).subscribe(
              bookings => {
                  this.bookingsOfMonth=bookings['records'];
                  this.areBookingsReadyForMonth = true;
              },
              error => {
                  console.log(error);
                  this.areBookingsReadyForMonth = false;
              }
          );

      this.closeddayService.readCloseddaysByDate(huetteUrlID, this.month, this.year).subscribe(
          result => {
              this.closeddaysOfMonth = result['records'];
          },
          error => {
              console.log(error);
          }
      );

        // Get the room assignments for each booking
        this.bookingService.getAllRoomAssignmentsForEstablishment(huetteUrlID, this.month, this.year).subscribe(
            result => {
                this.roomAssignmentsOfEstablishment = result['records'];
            },
            error => {
                console.log(error)
            }
        );


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



  /*
   * Checks if the currently displayed day is in between the period of a booking.
   * Used to display which days are occupied and which days are not.
   */
  isOneRoomFreeOnThisDay(_day: number) {
      // console.log("isOneRoomFreeOnThisDay: " + _day)
      if (this.isFirstCalendarStart) {
          this.loadBookingsOfMonth();
          this.isFirstCalendarStart = false;
      }

      // use special method for sleeping camp spaces:
      if (this.selectedCategoryID !== null && typeof(this.selectedCategoryID) !== 'undefined') {
          if (+this.selectedCategoryID === 3) {    // ID 3 --> Lager, force comparison as 'number' with the + operator
            //   console.log("use lager")
              return this.isSleepingCampFreeOnThisDay(_day);
          }
      }

      var freeRoomsArr: Zimmer[] = new Array();
      var selectedArr: Zimmer[] = new Array();

      if (this.zimmerForCategoryArr === null || typeof(this.zimmerForCategoryArr) === 'undefined') {
          return false;
      }
      if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
          for (let zimmer of this.zimmerForCategoryArr) {
              freeRoomsArr.push(zimmer);
          }

          if (freeRoomsArr.length > 0) {    
              // simple room distribution approach: fill up rooms sequentially with the needed beds
              var personAmount = this.calcTotalPersons();         // store amount of total persons
              var index = 0;                                      // array index
              while (personAmount > 0) {                          // test if end of persons has been reached (-> no other room necessary)
                  if (freeRoomsArr[index] === null || typeof(freeRoomsArr[index]) === 'undefined') {             // safety check
                      return false;
                  }

                  selectedArr.push(freeRoomsArr[index]);          // select this room
                  personAmount -= freeRoomsArr[index].plaetze;    // subtract beds of room from the person amount
                  index++;                                                
              }                
              this.selectedRoomsArr = selectedArr;                // store selected rooms for later use
              this.create_booking_form.get('zimmerArray').setValue(this.selectedRoomsArr);

              return true;
          } else {
              // console.log("kein Zimmer mehr frei am "  + _day + "." + this.month + ".")
              return false;
          }    
      }

      // filter all bookings of the month which are in the relevant time period
      let bookingsOnThisDayArr: Buchung[] = new Array();
      for (let booking of this.bookingsOfMonth) {
          // create new date because the date is only recognized as a string
          // --> date functions would not work
          let start = new Date(booking.checkinDatum);
          let end = new Date(booking.checkoutDatum);

          // console.log(_day + "." + this.month + "." + this.year)
          // console.log(start)
          // console.log(end)
          if (this.month === start.getMonth()+1 && this.month === end.getMonth()+1) {
              if (_day >= start.getDate() && _day <= end.getDate()) {
                  // console.log("same month: true")
                  bookingsOnThisDayArr.push(booking);
              }
          }
          else if (this.month === start.getMonth()+1 && this.month !== end.getMonth()+1) {
              if (_day >= start.getDate()) {
                  // console.log("other month: true")
                  bookingsOnThisDayArr.push(booking);
              } 
          } else if (this.month !== start.getMonth()+1 && this.month === end.getMonth()+1) {
              if (_day <= end.getDate()) {
                  // console.log("other month: true")
                  bookingsOnThisDayArr.push(booking);
              }
          }
      }

      // if there are no bookings on this day, set all rooms as 'free'
      if (bookingsOnThisDayArr.length === 0) {
          for (let zimmer of this.zimmerForCategoryArr) {
              freeRoomsArr.push(zimmer);
          }
      } else {
          // check if the filtered bookings booked a room of the selected category
          // find out which room is occupied and which is still free
          // checks for every room if there is any booking on it
          var i = 0;
          for (let zimmer of this.zimmerForCategoryArr) {
            var isRoomFree = true;
            for (let booking of bookingsOnThisDayArr) {

                for (let assignment of this.roomAssignmentsOfEstablishment) {
                    // if the room is already assigned to a booking, mark it as occupied
                    if (assignment.buchungID === booking.buchungID && assignment.zimmerID === zimmer.zimmerID) {
                        isRoomFree = false;
                    }
                }
            }

            if (isRoomFree) {
                freeRoomsArr.push(zimmer);
            }
        }
      }
      // console.log("length: " + freeRoomsArr.length)
      // return if this day is still available or not
      if (freeRoomsArr.length > 0) {

          // loop only used for debug
          // console.log("***")
          // freeRoomsArr.forEach(element => {
          //     console.log(element.bezeichnung + " hat " + element.plaetze + " frei am " + _day + "." + this.month + ".")
          // });

          // simple room distribution approach: fill up rooms sequentially with the needed beds
          var personAmount = this.calcTotalPersons();         // store amount of total persons
          var index = 0;                                      // array index
          while (personAmount > 0) {                          // test if end of persons has been reached (-> no other room necessary)
              if (freeRoomsArr[index] === null || typeof(freeRoomsArr[index]) === 'undefined') {             // safety check
                  return false;
              }

              selectedArr.push(freeRoomsArr[index]);          // select this room
              personAmount -= freeRoomsArr[index].plaetze;    // subtract beds of room from the person amount
              index++;                                                
          }
          
          this.selectedRoomsArr = selectedArr;                // store selected rooms for later use
          this.create_booking_form.get('zimmerArray').setValue(this.selectedRoomsArr);

          return true;
      } else {
          // console.log("***")
          // console.log("kein Zimmer mehr frei am "  + _day + "." + this.month + ".")
          return false;
      }
  }

  isSleepingCampFreeOnThisDay(_day: number) : boolean {
      var selectedArr: Zimmer[] = new Array();

      if (this.zimmerForCategoryArr === null || typeof(this.zimmerForCategoryArr) === 'undefined') {
          return false;
      }

      if (this.roomAssignmentsOfEstablishment === null || typeof(this.roomAssignmentsOfEstablishment) === 'undefined') {
        return false;
      }

      // there is only one sleeping camp, use first result in array:
      var lager = this.zimmerForCategoryArr[0];

      // case: there are no bookings in this month... just check if the camp has enough spaces
      if (this.bookingsOfMonth === null || typeof(this.bookingsOfMonth) === 'undefined') {
        //   console.log("of month is null")
          var personAmount = this.calcTotalPersons();         // store amount of total persons

          if (lager.plaetze < personAmount) {
              return false;
          } else {
              return true;
          } 
      }

      // filter all bookings of the month which are in the relevant time period
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
        freeSpacesInCamp -=     (Number(booking.erwachseneMitglieder) + Number(booking.jugendlicheMitglieder) + 
                                Number(booking.kinderMitglieder) + Number(booking.erwachseneNichtMitglieder) + 
                                Number(booking.jugendlicheNichtMitglieder) + Number(booking.kinderNichtMitglieder));
      }

    //   if (_day < 4) {
    //       console.log("day: " + _day)            
    //       console.log("total persons: " + this.calcTotalPersons())
    //       console.log("free spaces: " + freeSpacesInCamp)
    //       console.log("diff: " + (this.calcTotalPersons() <= freeSpacesInCamp))
    //   }


      // check if there are still enough spaces to fit all persons of the booking
      if (this.calcTotalPersons() <= freeSpacesInCamp) {
          selectedArr.push(lager);
          this.selectedRoomsArr = selectedArr;    // store camp room for later use
          this.create_booking_form.get('zimmerArray').setValue(this.selectedRoomsArr);

          return true;
      } else {
          return false;
      }
  }

  calcDaysOfMonth() {
      // console.log("calcDaysOfMonth")
      this.numberOfDays = new Date(this.year, this.month, 0).getDate();

      let dayArr = Array(this.numberOfDays+1).fill(0).map((x,i)=>i);
      this.days = dayArr.slice(1);
  }

  loadNextMonth() {
      // console.log("loadNextMonth")
      if (this.month == 12) {
          this.year += 1;
          this.month = 1;
      } else {
          this.month += 1;
      }
      this.monthName = monthNames[this.month - 1];

      this.calcDaysOfMonth();
      this.areBookingsReadyForMonth = false;
      this.loadBookingsOfMonth();
  }

  loadPreviousMonth() {
      // console.log("------------------")
      // console.log("loadPreviousMonth")
      if (this.month == 1) {
          this.year -= 1;
          this.month = 12;
      } else {
          this.month -= 1;
      }

      this.monthName = monthNames[this.month - 1];

      this.calcDaysOfMonth();
      this.areBookingsReadyForMonth = false;
      this.loadBookingsOfMonth();
  }


  calcFirstDayAndPaddingOfMonth() {
      // values from 0 (sunday) to 6 (saturday) ... monday -> 1
      var firstWeekday = new Date(this.year + "-" + this.month + "-01").getDay();
      firstWeekday = (firstWeekday===0) ? 7 : firstWeekday;

      // create an empty array with as many elements as there are "free" days at the beginning of the calendar view
      let emptyDaysArr: number[] = new Array();

      // start at index 1 because we want to find out the days till monday
      for(var i = 1; i<firstWeekday; i++) {
          emptyDaysArr.push(1);
      }

      return emptyDaysArr;
  }

  setCheckInDate(_day: number) {
      this.checkInDate = new Date(Date.UTC(this.year, this.month-1, _day, 0, 0, 0, 0));
      this.create_booking_form.get('checkinDatum').setValue(this.checkInDate);
      this.selectFirstDay = false;     // check that the next click selects the checkout date
      this.checkOutDate = null;        // reset checkout in case the user selects a new date after first selection
      this.monthOfCheckInDate = this.month;   // save month for bookings which belong to multiple months
      this.yearOfCheckInDate = this.year;     // save year for bookings which belong to multiple months/years
  }

  setCheckOutDate(_day: number) {
      // see if checkout is in the same year or if another year was selected
      if (this.year === this.yearOfCheckInDate) {

          // see if checkout is in the same month or if another month was selected
          if (this.month === this.monthOfCheckInDate) {
              // console.log("use same month")
              // in same month: must not be the same day as checkin and later than checkin)
              if (this.checkInDate.getDate() === _day || _day < this.checkInDate.getDate()) {
                  return
              }
          } else if (this.month < this.monthOfCheckInDate) {    // month in same year must not be < month of check in
              return;
          }
          
      } else if (this.year < this.yearOfCheckInDate) {      // year must not be < year of check in
          return;
      }
      

      // make sure there are no bookings (i.e. unavailable days) within the selected period
      for (var i = this.checkInDate.getDate(); i <= _day; i++) {
          if (this.isOneRoomFreeOnThisDay(i) === false) {
              return;
          }
          if (this.isClosedOnThisDay(i) === true) {
              return;
          }
      }
      // month value is one too high for this constructor
      this.checkOutDate = new Date(Date.UTC(this.year, this.month-1, _day));
      this.create_booking_form.get('checkoutDatum').setValue(this.checkOutDate);
      this.selectFirstDay = true;
  }

  /*
   * Checks if the current day is between the selected check in and check out dates
   * Used for highlighting selected days.
   */
  isDayInRange(_day: number) {
      // mark first day when end date is not yet defined
      
      if (this.checkInDate !== null && this.checkOutDate === null) {
          // console.log("month" + this.month)
          // console.log("checkm: " + this.checkInDate.getMonth())
          if (_day === this.checkInDate.getDate()) {
              // make sure that we are in the same month
              // otherwise we would see day x highlighted when changing to another month
              if (this.checkInDate.getMonth()+1 === this.month) {
                  return true;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      }

      if (this.checkInDate === null && this.checkOutDate !== null) {
          if (_day === this.checkOutDate.getDate()) {
              if (this.checkInDate.getMonth()+1 === this.month) {
                  return true;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      }

      if (this.checkInDate === null && this.checkOutDate === null) {
          return false;
      }

      // if (_day >= this.checkInDate.getDate() && _day <= this.checkOutDate.getDate()) {
      //     return true;
      // }



      if (this.month === this.checkInDate.getMonth()+1 && this.month === this.checkOutDate.getMonth()+1) {
          if (_day >= this.checkInDate.getDate() && _day <= this.checkOutDate.getDate()) {
              // console.log("same month: true")
              return true;
          }
      }
      else if (this.month === this.checkInDate.getMonth()+1 && this.month !== this.checkOutDate.getMonth()+1) {
          if (_day >= this.checkInDate.getDate()) {
              // console.log("other month: true")
              return true;
          } 
      } else if (this.month !== this.checkInDate.getMonth()+1 && this.month === this.checkOutDate.getMonth()+1) {
          if (_day <= this.checkOutDate.getDate()) {
              // console.log("other month: true")
              return true;
          }
      }
      return false;







  }


  calcNightsBetweenDates() {
      if (this.checkInDate === null || this.checkOutDate === null) {
          return;
      }

      //Get 1 day in milliseconds
      var one_day=1000*60*60*24;
      
      // Convert both dates to milliseconds
      var date1_ms = this.checkInDate.getTime();
      var date2_ms = this.checkOutDate.getTime();
      
      // Calculate the difference in milliseconds
      var difference_ms = date2_ms - date1_ms;
          
      // Convert back to days and return
      return Math.round(difference_ms/one_day); 
  }

  // ----------------------- HUETTE --------------------------------------------------
  getHuette(): void {
      // get huetteID where the booking corresponds to ... '+' operator converts string to a number
      const huetteUrlID = +this.route.snapshot.paramMap.get('id');
      this.huetteService.readOneHuette(huetteUrlID)
          .subscribe(huette => this.huette=huette);
  }

  // ----------------------- Zimmerkategorien --------------------------------------------------
  getRoomCategories(): void {
      // get huetteID where the booking corresponds to ... '+' operator converts string to a number
      const huetteUrlID = +this.route.snapshot.paramMap.get('id');
      this.huetteService.readCategories(huetteUrlID)
          .subscribe(categories => this.roomCategories=categories['records']);
  }

  // ----------------------- Mitreisende -------------------------------------------------------
  /*
   * Creates a template object for the form array
   */
  createMitreisender(): FormGroup {
      return this.formBuilder.group({
        vorname: '',
        nachname: '',
        geburtsdatum: '',
        mitglied: false
      });
  }

  fillMitreisendeFormArray() {
      // console.log("before: " +  this.mitreisendeForm.get('mitreisende').value.length)
      if (this.mitreisende !== null && typeof(this.mitreisende) !== 'undefined') {
          this.mitreisende.reset();
          this.mitreisendeForm.setControl("mitreisende", this.formBuilder.array([this.createMitreisender()]));
      }
      // console.log("after: " + this.mitreisendeForm.get('mitreisende').value.length)


      for (var i = 1; i < this.calcTotalPersons()-1; i++) {
          this.addMitreisender();
      }
      // console.log("after adding length: " + this.mitreisende.length)
      // console.log("after adding form: " + this.mitreisendeForm.get('mitreisende').value.length)


  }

  /*
   * Adds another entry to the mitreisende form array
   */
  addMitreisender(): void {
      this.mitreisende = this.mitreisendeForm.get('mitreisende') as FormArray;
      this.mitreisende.push(this.createMitreisender());
  }

  // ----------------------- CHECKOUT --------------------------------------------------

  resetMitreisendeForm() {
    // console.log("resetting form")
    this.mitreisendeForm.setControl("mitreisende", null);
  }


  calculateCorrectPersonAmounts() {
      // if function gets called again, reset values
      if (this.areCalculatedAmountsAvailable) {
          this.calculatedAmountNonMemberAdults = 1;
          this.calculatedAmountMemberAdults = 0;
          this.calculatedAmountNonMemberTeenagers = 0;
          this.calculatedAmountMemberTeenagers = 0;
          this.calculatedAmountNonMemberKids = 0;
          this.calculatedAmountMemberKids = 0;
          this.areCalculatedAmountsAvailable = false;
      }

      var useMitreisende = true;
      var personArr = this.mitreisendeForm.get('mitreisende') as FormArray;

      if (personArr === null || typeof(personArr) === 'undefined') {
          useMitreisende = false;
      } else {
          if (personArr.length > 0) {
              if (personArr.at(0).value.vorname === "") {   // first entry may be uninitialized and produce errors
                  this.resetMitreisendeForm();
                  personArr.reset;
                  useMitreisende = false;
              }
          }
      }


      if (useMitreisende) {
          for (var i = 0; i < personArr.length; i++) {
    
              var birthday = personArr.at(i).value.geburtsdatum;   // returns a string!
              var age = this.calculateAgeAtDayOfArrival(birthday);
    
              var tempMitreisender = new Mitreisender();
              tempMitreisender = personArr.at(i).value;
    
              if (tempMitreisender.mitglied) { // check if person is a member
                  if (age >= 15) {
                      this.calculatedAmountMemberAdults++;
                  } else if (age < 15 && age >= 6) {
                      this.calculatedAmountMemberTeenagers++;
                  } else if (age < 6) {
                      this.calculatedAmountMemberKids++;
                  }
              } else {
                  if (age >= 15) {
                      this.calculatedAmountNonMemberAdults++;
                  } else if (age < 15 && age >= 6) {
                      this.calculatedAmountNonMemberTeenagers++;
                  } else if (age < 6) {
                      this.calculatedAmountNonMemberKids++;
                  }
              }
          }      
      }

      // check if booking person is also a member
      if (this.create_booking_form.get('bmitglied').value) {
          // add to members and remove from non members
          this.calculatedAmountMemberAdults++;
          this.calculatedAmountNonMemberAdults--;
      }



      this.areCalculatedAmountsAvailable = true;

      this.create_booking_form.get('erwachseneMitglieder').setValue(this.calculatedAmountMemberAdults);
      this.create_booking_form.get('erwachseneNichtMitglieder').setValue(this.calculatedAmountNonMemberAdults);
      this.create_booking_form.get('jugendlicheMitglieder').setValue(this.calculatedAmountMemberTeenagers);
      this.create_booking_form.get('jugendlicheNichtMitglieder').setValue(this.calculatedAmountNonMemberTeenagers);
      this.create_booking_form.get('kinderMitglieder').setValue(this.calculatedAmountMemberKids);
      this.create_booking_form.get('kinderNichtMitglieder').setValue(this.calculatedAmountNonMemberKids);

    //   this.create_booking_form.get('erwachsene').setValue(this.calculatedAmountNonMemberAdults + this.calculatedAmountMemberAdults);
    //   this.create_booking_form.get('jugendliche').setValue(this.calculatedAmountNonMemberTeenagers + this.calculatedAmountMemberTeenagers);
    //   this.create_booking_form.get('kinder').setValue(this.calculatedAmountNonMemberKids + this.calculatedAmountMemberKids);
  }

  getSinglePriceForAdults() {
      // console.log("getsingleprice:")
      // console.log("selectedarr: " + this.selectedRoomsArr)
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      
      var val = Number(this.selectedRoomsArr[0].preisErw);
      // console.log("preis" + val)
      return this.toATLocale(val);
  }

  getMemberPriceForAdults() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      
      var val = Number(this.selectedRoomsArr[0].preisErw) * this.memberDiscountFactor;
      
      return this.toATLocale(val);
  }

  calcTotalPriceForAdults() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = (this.selectedRoomsArr[0].preisErw * this.calcNightsBetweenDates() * this.calculatedAmountNonMemberAdults);
      return this.toATLocale(val);
  }

  calcTotalPriceForMemberAdults() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = (this.selectedRoomsArr[0].preisErw * this.memberDiscountFactor* this.calcNightsBetweenDates() * this.calculatedAmountMemberAdults);
      return this.toATLocale(val);
  }

  getSinglePriceForTeenagers() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = Number(this.selectedRoomsArr[0].preisJgd);
      return this.toATLocale(val);
  }

  getMemberPriceForTeenagers() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = Number(this.selectedRoomsArr[0].preisJgd) * this.memberDiscountFactor;
      return this.toATLocale(val);
  }

  calcTotalPriceForTeenagers() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = (this.selectedRoomsArr[0].preisJgd * this.calcNightsBetweenDates() * this.calculatedAmountNonMemberTeenagers);
      return this.toATLocale(val);
  }

  calcTotalPriceForMemberTeenagers() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }
      var val = (this.selectedRoomsArr[0].preisJgd * this.memberDiscountFactor * this.calcNightsBetweenDates() * this.calculatedAmountMemberTeenagers);
      return this.toATLocale(val);
  }

  getSinglePriceForKids() {
      var val = 0;
      return this.toATLocale(val);
  }

  getMemberPriceForKids() {
      var val = 0;
      return this.toATLocale(val);
  }

  calcTotalPriceForKids() {
      var val = 0;
      return this.toATLocale(val);
  }

  calcTotalPriceForMemberKids() {
      var val = 0;
      return this.toATLocale(val);
  }

  getSinglePriceForBreakfasts() {
    if (this.huette === null || typeof(this.huette) === 'undefined') {
        return;
    }
    var val = Number(this.huette.fruehstueckspreis);
    return this.toATLocale(val);
    }

    calcTotalPriceForBreakfasts() {
        if (this.huette === null || typeof(this.huette) === 'undefined') {
            return;
        }
        var val = (this.calcTotalPersons() * this.huette.fruehstueckspreis * this.calcNightsBetweenDates());
        return this.toATLocale(val);
    }

    getSinglePriceForHalfBoards() {
        if (this.huette === null || typeof(this.huette) === 'undefined') {
            return;
        }
        var val = Number(this.huette.halbpensionspreis);
        return this.toATLocale(val);
    }

    calcTotalPriceForHalfBoards() {
        if (this.huette === null || typeof(this.huette) === 'undefined') {
            return;
        }
        var val = (this.calcTotalPersons() * this.huette.halbpensionspreis * this.calcNightsBetweenDates());
        return this.toATLocale(val);
    }


  calcTotalSumOfServices() {
      if (this.selectedRoomsArr === null || typeof(this.selectedRoomsArr) === 'undefined') {
          return;
      }
      if (this.selectedRoomsArr[0] === null) {
          return;
      }

      var nights = this.calcNightsBetweenDates();

      var adult = (this.selectedRoomsArr[0].preisErw * nights * this.calculatedAmountNonMemberAdults);
      var teen = (this.selectedRoomsArr[0].preisJgd * nights * this.calculatedAmountNonMemberTeenagers);
      var kid = 0;
      var adultMember = (this.selectedRoomsArr[0].preisErw * this.memberDiscountFactor * nights * this.calculatedAmountMemberAdults);
      var teenMember = (this.selectedRoomsArr[0].preisJgd * this.memberDiscountFactor * nights * this.calculatedAmountMemberTeenagers);

      var board = 0;
      if (this.selectedBoardType === 'Frühstück') {
          board = (this.calcTotalPersons() * this.huette.fruehstueckspreis * this.calcNightsBetweenDates());
      } else {
          board = (this.calcTotalPersons() * this.huette.halbpensionspreis * this.calcNightsBetweenDates());
      }

      var val =   (Number(adult) + 
                  Number(teen) + 
                  Number(kid) + 
                  Number(adultMember) +
                  Number(teenMember) +
                  Number(board)
                  );


      this.totalPrice = val;

      if (this.create_booking_form !== null && typeof(this.create_booking_form) !== 'undefined') {
          this.create_booking_form.get('preis').setValue(val);
      }
      
      return this.toATLocale(val);
  }


  calcDepositSum() {
      var val = this.totalPrice * 0.5;
      
      return this.toATLocale(val);
  }

  // ----------------------- Price --------------------------------------------------
  getAdultPriceForCategory(_catID: number): number {
      var aRooms: Zimmer[];

      // get array of rooms for category
      const urlID = +this.route.snapshot.paramMap.get('id');
      this.huetteService.readZimmerWithCategory(urlID, _catID)
              .subscribe(zimmer => this.adultRooms=zimmer['records']);

      if (this.adultRooms === null || typeof(this.adultRooms) === 'undefined') {
          return -1;
      } else {
          // only use first entry as an example to get the price:
          return this.adultRooms[0].preisErw;
      }
  }

  getTeenagerPriceForCategory(_catID: number): number {
      // safety check
      if (this.roomCategories === null || typeof(this.roomCategories) === 'undefined') {
          return -1;
      }

      var tRooms: Zimmer[];

      // get array of rooms for category
      const urlID = +this.route.snapshot.paramMap.get('id');
      this.huetteService.readZimmerWithCategory(urlID, _catID)
              .subscribe(zimmer => tRooms=zimmer['records']);


      // only use first entry as an example to get the price:
      return tRooms[0].preisJgd;
  }
  

  // ----------------------- BOOKING --------------------------------------------------
  // user clicks 'create' button
  createBooking(){

      // send deposit payment request
      this.bookingService.sendPaymentRequest(this.create_booking_form.value)
      .subscribe(
          result => {
          },
          error => {
              // TODO: show an error page here instead of the alert
              alert("Problem: Zahlungsaufforderung konnte nicht gesendet werden.")
              console.log(error)
          }
      );

      // send data to server
      this.bookingService.createBooking(this.create_booking_form.value)
          .subscribe(
               booking => {
                  //  console.log("result:")
                  //  console.log(booking)

                  // pass ID of the newly created booking
                  if(this.storeMitreisende(booking.buchungID)) {
                      this.router.navigate(['/final']);
                  }
               },
               error => {
                   // TODO: show an error page here instead of the alert
                   alert("Problem: Buchung konnte nicht erstellt werden.")
                   console.log(error)
               }
           );
  }

  storeMitreisende(_buchungID: number): boolean {
      var tempArr = this.mitreisendeForm.get('mitreisende') as FormArray;

      if (tempArr === null || typeof(tempArr) === 'undefined') {
        return true;    // none available
      }

      for (var i = 0; i < tempArr.length; i++) {
          // create new mitreisender object and add the ID of the newly created booking
          var tempMitreisender = new Mitreisender();
          tempMitreisender = tempArr.at(i).value;
          tempMitreisender.buchungID = _buchungID;
          this.mitreisenderService.createMitreisender(tempMitreisender).subscribe(
              result => {
                  console.log("mitreisender created")
              },
              error => {
                  console.log("err: ")
                  console.log(error)
                  return false;
              }
          );
      }
      return true;
  }

  // ----------------------- PAGE DESIGN and FORMS --------------------------------------------------
  // displays the specified tab
  showTab(_n) {
    var tabArray = document.getElementsByClassName("tab");
    var elem = <HTMLElement> tabArray[_n];
    elem.style.display = "block";    // enable display settings

    // adjust the Previous/Next buttons:
    if (_n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }

    // change button text for last index
  //   if (_n == (tabArray.length - 1)) {
  //     document.getElementById("nextBtn").innerHTML = "Weiter";
  //   } else {
  //     document.getElementById("nextBtn").innerHTML = "Weiter";
  //   }

    // run a function that displays the correct step indicator:
    this.fixStepIndicator(_n)
  }

  // sets the "active" class to the step which is currently in view
  // used to highlight the current step indicator
  fixStepIndicator(_n) {
    // remove the "active" class of all steps...
    var stepArr = document.getElementsByClassName("step");
    for (var i = 0; i < stepArr.length; i++) {
      stepArr[i].className = stepArr[i].className.replace(" active", "");
    }

    // add the "active" class to the current step:
    stepArr[_n].className += " active";
  }

  // finds out the tab to display
  nextPrev(_n) {
    // This function will figure out which tab to display
    var tabArray = document.getElementsByClassName("tab");

    // add other behavior to next button when it is the last page (payment), _n !== -1: exclude back button
    if (_n !== -1 && this.currentTab == (tabArray.length - 1)) {
        // TODO: open payment provider page
        

        switch (this.selectedPaymentMethod) {
            case "Paypal":
                // code...
                break;
            case "Sofortüberweisung":
                // code...
                break;
            case "Kreditkarte":
                // code...
                break;
            case "Zahlung auf Rechnung":
                this.createBooking();
                break;

            default:
                this.router.navigate(["/dashboard/"]);
                break;
        }

    } else if (_n === -1 && this.currentTab == (tabArray.length - 1)) {
        var elem = <HTMLElement> tabArray[this.currentTab];
        elem.style.display = "none";
        this.currentTab = this.currentTab + _n;
        this.showTab(this.currentTab);
    } else {
        var elem = <HTMLElement> tabArray[this.currentTab];

        var nextButton = document.getElementById("nextBtn")

        // Exit the function if any field in the current tab is invalid:
        if (_n == 1 && !this.validateForm()) {
            nextButton.className = "nextBtnInactive"
            return false;
        } else {
            nextButton.className = "nextBtnActive"
        }

        // Hide the current tab:
        elem.style.display = "none";

        // Increase or decrease the current tab by 1:
        this.currentTab = this.currentTab + _n;

        // if you have reached the end of the form... :
        if (this.currentTab >= tabArray.length) {
          //...the form gets submitted:
          //document.getElementById("regForm").submit();
          return false;
        }

        if (this.currentTab === 4) {
          // console.log("calculating")
          this.calculateCorrectPersonAmounts();
        }

        // Otherwise, display the correct tab:
        this.showTab(this.currentTab);
    }
  }

  // checks if form is valid
  validateForm() {
    var isFormValid = true;

    var tabArray = document.getElementsByClassName("tab");
    var elem = <HTMLElement> tabArray[this.currentTab];

    switch (this.currentTab) {
        case 0:    // tab 1
              if (this.create_booking_form.get('zimmerkategorie').value === '') {
                  isFormValid = false;
              }
              if (this.checkInDate === null || this.checkOutDate === null) {
                  isFormValid = false;
              }
              break;
      
        case 1:   // breakfast: can also be 0, therefore no need for validation
              isFormValid = true;
        case 2:   // booking person
              var inputFields = elem.getElementsByTagName("input");
              for (var i = 0; i < inputFields.length - 2; i++) {    // check every inputfield in the current tab except for 'bemerkung'
                  if (inputFields[i].value === "") {             // if field empty
                    inputFields[i].className += " invalid";     // add an "invalid" class to the field
                    isFormValid = false;                        // and set the current valid status to false
                  } else {
                      inputFields[i].className = "form-control"
                  }
              }

              if (inputFields[2] !== null && typeof(inputFields[2]) !== 'undefined') {
                  let age = this.calculateAge(this.create_booking_form.get('bgeburtsdatum').value);
                  if (age < 18 || age > 120 || isNaN(age)) {
                      inputFields[2].className += " invalid";
                      isFormValid = false;
                  } else {
                      inputFields[2].className = "form-control"
                  }
              }

              break;
        case 3:   // fellow travelers
              // console.log("fellow traveler validation")
              var inputFields = elem.getElementsByTagName("input");

              var fieldsPerPerson = 4;

              // check every inputfield in the current tab
              for (var i = 0; i < inputFields.length; i+=fieldsPerPerson) {    // first field: vorname
              // console.log(i)
                  if (inputFields[i].value === "") {             // if field empty
                      inputFields[i].className += " invalid";     // add an "invalid" class to the field
                      isFormValid = false;                        // and set the current valid status to false
                  } else {
                    inputFields[i].className = "form-control"
                  }
              }
              // console.log("end of 1")


              for (var i = 1; i < inputFields.length; i+=fieldsPerPerson) {    // 2nd field: nachname
                  if (inputFields[i].value === "") {             // if field empty
                      inputFields[i].className += " invalid";     // add an "invalid" class to the field
                      isFormValid = false;                        // and set the current valid status to false
                  } else {
                    inputFields[i].className = "form-control"
                  }
              }
              // console.log("end of 2")

              for (var i = 2; i < inputFields.length; i+=fieldsPerPerson) {    // 3rd field: geburtsdatum
                  let age = this.calculateAge(inputFields[i].value);
                  if (age < 0 || age > 120 || Number.isNaN(age)) {
                      inputFields[i].className += " invalid";
                      isFormValid = false;
                  } else {
                    inputFields[i].className = "form-control"
                  }
              }

              // console.log("end of validation")

              // for (var i = 3; i < inputFields.length; i+=fieldsPerPerson) {    // 4th field: member checkmark
              //    // checkmark is optional and needs no special treatment
              // }

              break;
          case 4: // checkout
            isFormValid = true;
            break;
          
          case 5: // payment method
              if (this.selectedPaymentMethod === null || typeof(this.selectedPaymentMethod) === 'undefined' || this.selectedPaymentMethod === "") {
                  isFormValid = false;
              } else {
                  isFormValid = true;
              }
              break;
        default:
            isFormValid = false;
            break;
    }


    
    
    // If the valid status is true, mark the step as finished and valid:
    if (isFormValid) {
      var stepArr = document.getElementsByClassName("step");
      var step = <HTMLElement> stepArr[this.currentTab];
      step.className += " finish";
    }

  //   isFormValid = true;     // uncomment this for debug (no need to fill everything correctly)
    return isFormValid; // return the valid status
  }


  private calculateAge(_birthdayString: string) {
      var birthDate = new Date(_birthdayString);
      var today = new Date();
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

  private calculateAgeAtDayOfArrival(_birthdayString: string) {
      var birthDate = new Date(_birthdayString);
      var arrival = new Date(this.create_booking_form.get('checkinDatum').value)
      var age = arrival.getFullYear() - birthDate.getFullYear();
      var m = arrival.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && arrival.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

  // ---------------------- ZAHLUNGSART -----------------------------------------------------
  zahlungsartSelectOnChange(_value: string) {
      // console.log("select: "+_value)

      // safety check
      if (this.paymentMethods === null || typeof(this.paymentMethods) === 'undefined') {
          return false;
      }

      // get category name and find corresponding ID
      this.selectedPaymentMethod = this.create_booking_form.get('zahlungsartName').value;

      switch (this.selectedPaymentMethod) {
          case "Sofortüberweisung":
              this.selectedPaymentMethodNumber = 1;
              break;
          case "Kreditkarte":
              this.selectedPaymentMethodNumber = 1;
              break;
          case "Zahlung auf Rechnung":
              this.selectedPaymentMethodNumber = 1;          
              break;
          default:
              this.selectedPaymentMethodNumber = 1;
              break;
      }
      this.create_booking_form.get('zahlungsartID').setValue(this.selectedPaymentMethodNumber);
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
  

  // ---------------------- HELPERS -----------------------------------------------------
  cancelBooking() {
      this.router.navigate(["/admin/"]);
  }
  
  goBack() {
    this.location.back();
  }
}
