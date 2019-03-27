import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

	registerUserData = {}
	constructor(private _auth: AuthService) { }

	ngOnInit() {
	}

/*
	registerUser() {
		// call the method and subscribe to the observable
		this._auth.registerUser(this.registerUserData)
			.subscribe(
				res => console.log(res),
				err => console.log(err)
			)
		console.log(this.registerUserData)
	}
	*/

}
