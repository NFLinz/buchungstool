import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Huette } from '../huette';
import { HuetteService } from '../huette.service';

@Component({
  selector: 'app-bookingstart',
  templateUrl: './bookingstart.component.html',
  styleUrls: ['./bookingstart.component.css']
})
export class BookingstartComponent implements OnInit {

  huette: Huette;

  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private huetteService: HuetteService) { }

  ngOnInit() {
    this.getHuette();
  }

  getHuette(): void {
    // get huetteID where the booking corresponds to ... '+' operator converts string to a number
    const huetteUrlID = +this.route.snapshot.paramMap.get('id');
    this.huetteService.readOneHuette(huetteUrlID)
        .subscribe(huette => this.huette=huette);
  }


  privateClicked() {
    const huetteUrlID = +this.route.snapshot.paramMap.get('id');

    this.router.navigate(["/booking/" + huetteUrlID]);
  }

  companyClicked() {
    const huetteUrlID = +this.route.snapshot.paramMap.get('id');

    this.router.navigate(["/companybooking/" + huetteUrlID]);
  }

}
