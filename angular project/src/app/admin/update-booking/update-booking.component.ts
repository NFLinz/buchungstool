import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { BookingService } from '../../booking.service';
import { Buchung } from '../../buchung';

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.css']
})
export class UpdateBookingComponent implements OnInit {

  booking: Buchung;
  bookingID: number;
  update_booking_form: FormGroup;
  anreden = ['', 'Herr', 'Frau', 'Firma'];
  isRangeValid: boolean;
  boardTypes = ["", "Frühstück", "Halbpension"];


  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    formBuilder: FormBuilder,
    private location: Location
  ) {
    this.update_booking_form = formBuilder.group({
      buchungID: this.bookingID,
      preisErwachsene: [""],
      preisJugendliche: [""],
      preisKinder: [""],
      anrede: [""],
      erwachseneMitglieder: [""],
      jugendlicheMitglieder: [""],
      kinderMitglieder: [""],
      erwachseneNichtMitglieder: [""],
      jugendlicheNichtMitglieder: [""],
      kinderNichtMitglieder: [""],
      preis: [""],
      freiplaetzeErwMitglied: [""],
      freiplaetzeJgdMitglied: [""],
      freiplaetzeKindMitglied: [""],
      freiplaetzeErwNichtMitglied: [""],
      freiplaetzeJgdNichtMitglied: [""],
      freiplaetzeKindNichtMitglied: [""],
      verpflegung: [""],
      bvorname: [""],
      bnachname: [""],
      bgeburtsdatum: [""],
      badresse: [""],
      bplz: [""],
      bort: [""],
      btelefonnummer: [""],
      bmail: [""],
      bemerkung: [""],
      firmenname: [""],
      startDatum: [""],
      endDatum: [""],
      bezahlt: false,
      bestaetigt: false,
      rgversendet: false
    });

  }

  ngOnInit() {
    this.bookingID = +this.route.snapshot.paramMap.get('id');
    this.update_booking_form.get('buchungID').setValue(this.bookingID);
    
    this.fetchBookingDetails();
  }

  fetchBookingDetails() {
    // read one product record
    this.bookingService.readOneBooking(this.bookingID)
        .subscribe(result => {
            this.booking = result;

            if (String(this.booking.bestaetigt) === '0') {
              this.update_booking_form.get('bestaetigt').setValue(false);
            } else {
              this.update_booking_form.get('bestaetigt').setValue(true);
            }

            if (String(this.booking.rgversendet) === '0') {
              this.update_booking_form.get('rgversendet').setValue(false);
            } else {
              this.update_booking_form.get('rgversendet').setValue(true);
            }

            if (String(this.booking.bezahlt) === '0') {
              this.update_booking_form.get('bezahlt').setValue(false);
            } else {
              this.update_booking_form.get('bezahlt').setValue(true);
            }
        });
  }

  anredeSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.update_booking_form.get('anrede').setValue(_value);
  }

  verpflegungSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.update_booking_form.get('verpflegung').setValue(_value);
  }

  validateRange() {
    if (this.update_booking_form.get('startDatum').value === null || typeof(this.update_booking_form.get('startDatum').value) === 'undefined') {    
      return;
    }
    if (this.update_booking_form.get('endDatum').value === null || typeof(this.update_booking_form.get('endDatum').value) === 'undefined') {
      return;
    }

    if (this.update_booking_form.get('startDatum').value > this.update_booking_form.get('endDatum').value) {
      // console.log("start is greater")
      this.isRangeValid = false;
      return false;
    } else {
      // console.log("start is smaller")
      this.isRangeValid = true;
      return true;
    }
  }

  isEndDateDefined() {
    if (this.update_booking_form.get('endDatum').value === null || typeof(this.update_booking_form.get('endDatum').value) === 'undefined') {
      return false;
    } else {
      return true;
    }
  }


  updateBooking() {
    this.bookingService.updateBooking(this.update_booking_form.value)
      .subscribe(
          booking => {
              alert('Buchung wurde gespeichert')
              this.ngOnInit();  // refresh
          },
          error => {
              // TODO: show an error page here instead of the alert
              alert("Problem: Buchung konnte nicht geändert werden.")
              console.log(error)
              this.ngOnInit();
          }
      );

  }

  
  goBack() {
    this.location.back();
  }
}
