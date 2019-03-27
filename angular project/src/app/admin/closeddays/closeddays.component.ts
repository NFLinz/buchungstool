import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Closedday } from '../../closedday';
import { CloseddayService } from '../../closedday.service';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-closeddays',
  templateUrl: './closeddays.component.html',
  styleUrls: ['./closeddays.component.css']
})
export class CloseddaysComponent implements OnInit {

  huetteID: number;
  closeddaysArr: Closedday[];

  constructor(
    private authService: AuthService,
    private closeddayService: CloseddayService,
    private router: Router
  ){}

  ngOnInit() {
    this.huetteID = this.authService.getHuetteID();

    this.closeddayService.readCloseddays(this.huetteID).subscribe(
        result => {
          this.closeddaysArr = result['records'];
        }
      );
  }

  createClosedDay() {
    this.router.navigate(["/admin/closeddays/create"]);
  }

  deleteClosedDay(_day: Closedday){
    if(confirm("Wollen Sie Sperrtag Nr. " +  + " wirklich löschen?")) {

        this.closeddayService.deleteClosedDay(_day.sperrtagID)
        .subscribe(
              result => {
                alert("Sperrtag wurde gelöscht")
                this.ngOnInit();  // close details page
              },
              error => {
                  alert("Problem: Sperrtag konnte nicht gelöscht werden.")
                  console.log(error)
              }
          );
    }
}

}
