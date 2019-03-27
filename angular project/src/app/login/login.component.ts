import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router }      from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  isSuccessful = true;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
  }
  
  loginUserData = {}

  loginUser() {
  	this.authService.loginUser(this.loginUserData)
  		.subscribe(
  			res => {
  				if (res.status == 'loggedin') {
            //alert('login success');
            this.isSuccessful = true;

            this.authService.saveUserData(res);
  					// console.log('login success')


            // Get the redirect URL from our auth service
            // If no redirect has been set, use the default
            let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin';
     
            // Redirect the user
            this.router.navigate([redirect]);
  				} else {
            this.isSuccessful = false;
  					
  					// console.log('login failed')
  				}
  			},
  			err => console.log(err)
  		)
  }
  
}
