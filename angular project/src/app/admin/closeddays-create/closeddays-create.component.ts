import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { CloseddayService } from '../../closedday.service';
import { Router } from "@angular/router";
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-closeddays-create',
  templateUrl: './closeddays-create.component.html',
  styleUrls: ['./closeddays-create.component.css']
})
export class CloseddaysCreateComponent implements OnInit {

  huetteID: number;
  create_closedday_form: FormGroup;
  startDate: Date;
  endDate: Date;
  isRangeValid: boolean;

  constructor(
    private authService: AuthService,
    private closeddayService: CloseddayService,
    private router: Router,
    formBuilder: FormBuilder,
    private location: Location
  ) { 
    // based on our html form, build our angular form
    this.create_closedday_form = formBuilder.group({
      startDatum: [this.startDate, Validators.required],
      endDatum: [this.endDate, Validators.required],
      info: ["", Validators.required],
      isRangeValid: [this.isRangeValid, Validators.requiredTrue],
      huetteID: [this.huetteID]
    });
  }

  ngOnInit() {
    this.huetteID = this.authService.getHuetteID();
    this.create_closedday_form.get('huetteID').setValue(this.huetteID);
  }


  validateRange() {

    if (this.create_closedday_form.get('startDatum').value === null || typeof(this.create_closedday_form.get('startDatum').value) === 'undefined') {    
      return;
    }
    if (this.create_closedday_form.get('endDatum').value === null || typeof(this.create_closedday_form.get('endDatum').value) === 'undefined') {
      return;
    }

    if (this.create_closedday_form.get('startDatum').value > this.create_closedday_form.get('endDatum').value) {
      // console.log("start is greater")
      this.isRangeValid = false;
      this.create_closedday_form.get('isRangeValid').setValue(false);
      return false;
    } else {
      // console.log("start is smaller")
      this.isRangeValid = true;
      this.create_closedday_form.get('isRangeValid').setValue(true);
      return true;
    }
  }

  isEndDateDefined() {
    if (this.create_closedday_form.get('endDatum').value === null || typeof(this.create_closedday_form.get('endDatum').value) === 'undefined') {
      return false;
    } else {
      return true;
    }
  }



  // user clicks 'create' button
  createClosedDay(){
    this.closeddayService.createClosedDay(this.create_closedday_form)
            .subscribe(
                 result => {
                    // show an alert to tell the user if booking was created or not
                    console.log(result)
                    alert("Erfolgreich gespeichert")
                    this.goBack();
                 },
                 error => console.log(error)
             );
  }

  goBack() {
    this.location.back();
  }
}
