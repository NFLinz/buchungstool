import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HuetteService } from '../../huette.service';
import { Observable } from 'rxjs';
import { Huette } from '../../huette';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read-huetten',
  templateUrl: './read-huetten.component.html',
  styleUrls: ['./read-huetten.component.css'],
  providers: [HuetteService]
})
export class ReadHuettenComponent implements OnInit {

  // store list of products
  huetten: Huette[];

  constructor(private _huetteService: HuetteService,
              private _router: Router
  ){}

  // Read huetten from API.
  ngOnInit(){
      this._huetteService.readHuetten()
          .subscribe(huetten => this.huetten=huetten['records']
          );
  }

  scroll(el) {
      el.scrollIntoView(true);
  }

  // redirect to booking component
  openBookingFor(_id) {
    this._router.navigate(["/bookingstart/" + _id]);
  }


  // when user clicks the 'read' button
  readOneHuette(_id){
      // tell the parent component (AppComponent)
      this._router.navigate(["/huette/" + _id]);
  }
}
