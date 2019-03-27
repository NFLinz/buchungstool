import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Huette } from '../huette';
import { HuetteService }  from '../huette.service';
import { EnquiryService } from '../enquiry.service';

@Component({
  selector: 'app-company-booking',
  templateUrl: './company-booking.component.html',
  styleUrls: ['./company-booking.component.css']
})
export class CompanyBookingComponent implements OnInit {

  anreden = ['', 'Herr', 'Frau', 'Firma'];
  personen = 1;
  huette: Huette;
  huetteID: number;
  create_company_booking_form: FormGroup;
  startDate: Date;
  endDate: Date;
  isRangeValid: boolean;


  constructor(
    private enquiryService: EnquiryService,
    private huetteService: HuetteService,
    private route: ActivatedRoute,
    private router: Router,
    formBuilder: FormBuilder,
    private location: Location
  ) { 
    // based on our html form, build our angular form
    this.create_company_booking_form = formBuilder.group({
      anrede: ["", Validators.required],
      firmenname: [""],
      firmenadresse: [""],
      firmenplz: [""],
      firmenort: [""],
      startDatum: [this.startDate, Validators.required],
      endDatum: [this.endDate, Validators.required],
      kontaktperson: ["", Validators.required],
      telefonnummer: ["", Validators.required],
      mail: ["", Validators.required],
      isRangeValid: [this.isRangeValid, Validators.requiredTrue],
      huetteID: [this.huetteID],
      personen: [1, Validators.required],
      mitglieder: [1, Validators.required],
      bemerkung: [""]
    });
  }

  ngOnInit() {
    this.getHuette();
    this.create_company_booking_form.get('huetteID').setValue(this.huetteID);
  }

  getHuette(): void {
    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    const huetteUrlID = +this.route.snapshot.paramMap.get('id');
    this.huetteID = huetteUrlID;
    this.huetteService.readOneHuette(huetteUrlID)
        .subscribe(huette => this.huette=huette);
  }


  validateRange() {

    if (this.create_company_booking_form.get('startDatum').value === null || typeof(this.create_company_booking_form.get('startDatum').value) === 'undefined') {    
      return;
    }
    if (this.create_company_booking_form.get('endDatum').value === null || typeof(this.create_company_booking_form.get('endDatum').value) === 'undefined') {
      return;
    }

    if (this.create_company_booking_form.get('startDatum').value > this.create_company_booking_form.get('endDatum').value) {
      // console.log("start is greater")
      this.isRangeValid = false;
      this.create_company_booking_form.get('isRangeValid').setValue(false);
      return false;
    } else {
      // console.log("start is smaller")
      this.isRangeValid = true;
      this.create_company_booking_form.get('isRangeValid').setValue(true);
      return true;
    }
  }

  isEndDateDefined() {
    if (this.create_company_booking_form.get('endDatum').value === null || typeof(this.create_company_booking_form.get('endDatum').value) === 'undefined') {
      return false;
    } else {
      return true;
    }
  }


  personenSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.personen = _value;
    this.create_company_booking_form.get('personen').setValue(_value);
  }

  mitgliederSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.create_company_booking_form.get('mitglieder').setValue(_value);
  }

  anredeSelectOnChange(_value: number) {
    // console.log("select: "+_value)
    this.create_company_booking_form.get('anrede').setValue(_value);
  }

  // user clicks 'create' button
  sendEnquiry(){
    this.enquiryService.sendEnquiry(this.create_company_booking_form.value, this.huetteID)
    .subscribe(
         result => {
            //  console.log("result:")
            //  console.log(result)
             this.router.navigate(["/companyfinal"]);
         },
         error => {
             // TODO: show an error page here instead of the alert
             alert("Problem: Anfrage konnte nicht erstellt werden.")
             console.log(error)
         }
     );

  }

  goBack() {
    this.location.back();
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


}
