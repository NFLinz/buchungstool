import { Component, OnInit } from '@angular/core';
import { Huette } from '../huette';
import { HuetteService } from '../huette.service';


@Component({
  selector: 'app-huetten',
  templateUrl: './huetten.component.html',
  styleUrls: ['./huetten.component.css']
})
export class HuettenComponent implements OnInit {

	huetten: Huette[];

  constructor(private huetteService: HuetteService) { }

  ngOnInit() {
  }

}
