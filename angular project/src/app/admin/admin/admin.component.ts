import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { HuetteService } from '../../huette.service';
import { Huette } from '../../huette';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  name = "User";
  huetteID: number;
  huette: Huette;

  constructor(
      private authService: AuthService,
      private huetteService: HuetteService
    ) { }

  ngOnInit() {
    this.name = this.authService.getName();

    this.huetteID = this.authService.getHuetteID();

    // console.log(this.huetteID)
    
    this.huetteService.readOneHuette(this.huetteID)
          .subscribe(result => this.huette=result);
  }

}
