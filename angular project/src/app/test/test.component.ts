import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { BookingService } from '../booking.service';
import { UserService } from '../user.service';
import { Buchung } from '../buchung';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Huette } from '../huette';
import { HuetteService }  from '../huette.service';
import { Zimmer } from '../zimmer';
import { Zimmerkategorie }  from '../zimmerkategorie';
import { MitreisenderService } from '../mitreisender.service';
import { Mitreisender } from '../mitreisender';


declare let paypal: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, AfterViewChecked {

    mitreisendeForm: FormGroup;
    mitreisende: FormArray;
    checkinDate = "2018-12-12";
    addScript = false;
    paypalLoad = true;
    finalAmount: number = 1;

    paypalConfig = {
        // Configure environment
        env: 'sandbox',
        client: {
          sandbox: 'AUHFs3b071TgXEh4ay3zjIDGtmzfY-7YYponG5EhqftGDB1-UFgbePDnBXNpXMZ9Wt6NfUf6SPf3XCQx',
          production: 'demo_production_client_id'
        },
        // Enable Pay Now checkout flow (optional)
        commit: true,

        // Set up a payment
        payment: function(data, actions) {
            return actions.payment.create({
                transactions: [{
                    amount: {
                        total: this.finalAmount.toFixed(2),
                        currency: 'EUR'
                    }
                }]
            });
        },
        // Execute the payment
        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function() {
            // Show a confirmation message to the buyer
            window.alert('Zahlung erfolgreich. Vielen Dank!');
            });
        }
    };



    constructor(
        private bookingService: BookingService,
        private mitreisenderService: MitreisenderService,
        private huetteService: HuetteService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ){
        this.mitreisendeForm = this.formBuilder.group({
            mitreisende: this.formBuilder.array([this.createMitreisender()])
            // mitreisenderVorname: ["", Validators.required],
            // mitreisenderNachname: ["", Validators.required],
            // mitreisenderGeburtsdatum: ["", Validators.required],
            // mitreisenderIstMitglied: false
        });
    }

    ngOnInit(){
        for (var i = 1; i < 2; i++) {
            this.addMitreisender();
        }

    }

    ngAfterViewChecked(){
        if (!this.addScript) {

            // TODO place somewhere else
            // store final amount in temp variable, otherwise paypal api shows it as undefined
            var tempAmount = this.finalAmount;

            // reset the config with the temp amount value
            this.paypalConfig.payment = function(data, actions) {
                return actions.payment.create({
                    transactions: [{
                        amount: {
                            total: tempAmount,
                            currency: 'EUR'
                        }
                    }]
                });
            },

            this.addPaypalScript().then(() => {
                paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
                this.paypalLoad = false;
            })
        }
    }

    addPaypalScript() {
        this.addScript = true;
        return new Promise((resolve, reject) => {
            let scripttagElement = document.createElement('script');
            scripttagElement.src = "https://www.paypalobjects.com/api/checkout.js";
            scripttagElement.onload = resolve;
            document.body.appendChild(scripttagElement);
        })
    }


    createMitreisender(): FormGroup {
        return this.formBuilder.group({
          vorname: '',
          nachname: '',
          geburtsdatum: '',
          mitglied: false
        });
    }

    addMitreisender(): void {
        this.mitreisende = this.mitreisendeForm.get('mitreisende') as FormArray;
        this.mitreisende.push(this.createMitreisender());
    }



    getTotalPersonsArray(_startIndex: number) {
        // create an empty array with one element for each person
        let personArr: number[] = new Array();

        if (_startIndex === 0) {
            // fill array ascending starting at 0 ... 0,1,2,3,4,5,...n (including the booking person)
            for (var i = 0; i <= 3; i++) {
                personArr.push(i);
            }
        } else {
            // fill array ascending starting at 1 ... 1,2,3,4,5,...n (person 0 is the booking person)
            for (var i = 1; i < 3; i++) {
                personArr.push(i);
            }
        }

        return personArr;
    }

    storeMitreisende() {
        console.log(this.mitreisendeForm)
        var tempArr = this.mitreisendeForm.get('mitreisende') as FormArray;
        for (var i = 0; i < tempArr.length; i++) {
            // console.log(tempArr.at(i))
            var tempMitreisender = new Mitreisender();
            tempMitreisender = tempArr.at(i).value;
            console.log(tempMitreisender.mitglied)
            tempMitreisender.buchungID = 1;
            this.mitreisenderService.createMitreisender(tempMitreisender).subscribe(
                result => {
                    console.log("mitreisender created")
                },
                error => {
                    console.log("err: ")
                    console.log(error)
                }
            );
        }
    }

    getCalculatedAmountOfAdults() {
        var amount = 1;

        for (var i = 0; i < this.mitreisende.length; i++) {
            var birthday = this.mitreisende.at(i).value.geburtsdatum;   // returns a string!
            var age = this.calculateAgeAtDayOfArrival(birthday);
            if (age >= 18) {
                amount++;
            } 
        }
        return amount;
    }

    private calculateAgeAtDayOfArrival(_birthdayString: string) {
        var birthDate = new Date(_birthdayString);
        var checkin = new Date(this.checkinDate);
        var age = checkin.getFullYear() - birthDate.getFullYear();
        var m = checkin.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && checkin.getDate() < birthDate.getDate())) {
            age--;
        }
        // console.log(age)
        return age;
    }

}