import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router }      from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Buchungstool';
	huetteID;
	show_read_huetten_html=true;
	show_read_one_huette_html=false;

	constructor(public authService: AuthService, private router: Router) {	  }

	logout() {
	    this.authService.logoutAndClear();
	    this.router.navigate(['/dashboard']);
	}

	// show huetten list
	showReadHuetten($event){
	    // set title
	    this.title=$event.title;
	 
	    // hide all html then show only one html
	    this.hideAll_Html();
	    this.show_read_huetten_html=true;
	}

  	// show details of a huette
	showReadOneHuette($event){
	 
	    // set title and huette ID
	    this.title=$event.title;
	    this.huetteID=$event.huetteID;
	 
	    // hide all html then show only one html
	    this.hideAll_Html();
	    this.show_read_one_huette_html=true;
	}



	// hide all html views
	hideAll_Html(){
	    this.show_read_huetten_html=false;
	    this.show_read_one_huette_html=false;
	}
}