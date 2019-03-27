import { Component, OnInit } from '@angular/core';
import { HuetteService } from '../../huette.service';
import { Huette } from '../../huette';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
  providers: [HuetteService]
})
export class ManagementComponent implements OnInit {

  huette: Huette;

  constructor(private _huetteService: HuetteService,
              private _router: Router
  ){}

  ngOnInit() {
    this._huetteService.readOneHuette(1).subscribe(
        result => {
          this.huette = result;
        }
      );
  }

}
