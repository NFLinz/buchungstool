import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

	// our angular form
    create_user_form: FormGroup;
    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    huetteUrlID = +this._route.snapshot.paramMap.get('id');
 
    // initialize 'product service', 'category service' and 'form builder'
    constructor(
        private _userService: UserService,
        formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        // based on our html form, build our angular form
        this.create_user_form = formBuilder.group({
            vorname: ["", Validators.required],
            nachname: ["", Validators.required],
            geburtsdatum: ["", Validators.required],
            adresse: ["", Validators.required],
            plz: ["", Validators.required],
            ort: ["", Validators.required],
            telefonnummer: ["", Validators.required],
            mail: ["", Validators.required]
        });

        
    }
 
    // user clicks 'confirm' button
    createUser(){

        // send data to server
        this._userService.createUser(this.create_user_form.value)
            .subscribe(
                 userID => {
                    // show an alert to tell the user if user was created or not
                    this.createBooking(userID);
                 },
                 error => console.log(error)
             );
    }

    // send data to server
    createBooking(_user: number) {
      console.log('creating booking')
        this._userService.createBooking(_user)
            .subscribe(
                 booking => {
                    this._router.navigate(['/final']);
                    console.log(booking)
                 },
                 error => console.log(error)
             );
    }

	ngOnInit() {

	}

}
