import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HuetteService } from '../../huette.service';
import { Huette } from '../../huette';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-bookingstart',
  templateUrl: './admin-bookingstart.component.html',
  styleUrls: ['./admin-bookingstart.component.css']
})
export class AdminBookingstartComponent implements OnInit {

  huette: Huette;
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
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

    this.router.navigate(["admin/createbooking/" + huetteUrlID]);
  }

  companyClicked() {
    const huetteUrlID = +this.route.snapshot.paramMap.get('id');

    this.router.navigate(["admin/companybooking/" + huetteUrlID]);
  }

  goBack() {
    this.location.back();
  }

}