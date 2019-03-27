import { Component, OnInit } from '@angular/core';
import { Huette } from '../huette';
import { HuetteService } from '../huette.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	huetten: Huette[] = [];

  constructor(private huetteService: HuetteService) { }

  ngOnInit() {
  	//this.getHuetten();
  }
/*
  getHuetten(): void {
  	this.huetteService.getHuetten()
  		.subscribe(huetten => this.huetten = huetten);
  }
*/
}
