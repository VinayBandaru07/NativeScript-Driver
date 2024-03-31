  
  import { Component, OnInit } from '@angular/core'
  import {FirestoreService} from '../services/firestore_service'
  import { Dialogs} from "@nativescript/core/ui/dialogs";
import { FirebaseError } from '@nativescript/firebase-core';

  
  @Component({
    selector: 'ns-report',
    templateUrl: 'report.component.html',
    styleUrls:['report.component.css']
  })

  export class ReportComponent {
    reportText: string = "";
    textAreaControlIsValid : Boolean = true;
    isReportSubmissionLoading = false;
    reportFieldListener = false;

    constructor(private firestoreService: FirestoreService) {}

    checkCharLength(){
      if(this.reportFieldListener  ){
        if(this.reportText.trim().length > 9){
          this.textAreaControlIsValid = true;
        }
        else{
          this.textAreaControlIsValid = false;
        }
      }
    }

    sendReport() {
      if (this.reportText.trim().length > 9) {
          this.isReportSubmissionLoading = true
           this.firestoreService.addReport(this.reportText)
                .then(() => {
                  Dialogs.action({
                    message:'Your issue was reported successfully..!!',
                    title:"Success"
                    // theme:1234 set color theme
                  })
                    this.reportText = ""; // Clear the text field after sending the report
                })
                .catch(error => {
                  if(error instanceof FirebaseError){
                    Dialogs.action({
                      message:`Error sending your report: ${error.message}`,
                      title:"Error"
                      // theme:1234 set color theme
                    })
                  }
                  else{
                    Dialogs.action({
                      message:`Error sending your report`,
                      title:"Error"
                      // theme:1234 set color theme
                    })
                  }
                }).finally(()=>{
                  this.isReportSubmissionLoading = false
                });
        } else {
          this.textAreaControlIsValid = false;
          this.reportFieldListener = true;
        }
    }
}
  