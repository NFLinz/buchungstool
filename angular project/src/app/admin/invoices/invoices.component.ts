import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rechnung } from '../../rechnung';
import { InvoiceService } from '../../invoice.service';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {

  huetteID: number;
  invoicesArr: Rechnung[];

  constructor(
    private authService: AuthService,
    private invoiceService: InvoiceService,
    private router: Router
  ){}

  ngOnInit() {
    this.huetteID = this.authService.getHuetteID();

    this.invoiceService.readInvoices(this.huetteID).subscribe(
        result => {
          this.invoicesArr = result['records'];
        }
      );
  }

  getDownloadURL(_rechnungID: number) : string {
    return this.invoiceService.getDownloadURL(_rechnungID);
  }

  showPDF(_rechnungID: number) {
    var res = this.invoiceService.downloadPDF(_rechnungID);
    console.log(res)
  }

  deleteInvoice(_invoice: Rechnung){
    if(confirm("Wollen Sie Rechnung Nr. " + _invoice.rechnungID + " wirklich löschen?")) {

        this.invoiceService.deleteInvoice(_invoice.rechnungID)
        .subscribe(
              result => {
                alert("Rechnung wurde gelöscht")
                this.ngOnInit();
              },
              error => {
                  alert("Problem: Rechnung konnte nicht gelöscht werden.")
                  console.log(error)
              }
          );
    }
}

}
