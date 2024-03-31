  
  import { Component, OnInit } from '@angular/core'
  import {FirestoreService,} from '../services/firestore_service'
  import { Dialogs} from "@nativescript/core/ui/dialogs";
import { FirebaseError } from '@nativescript/firebase-core';
import { EditProfileOptions } from '../classes/EditProfileOptions';

  
  @Component({
    selector: 'ns-editprofile',
    templateUrl: 'editprofile.component.html',
    styleUrls:['editprofile.component.css']
  })

  export class EditProfileComponent implements OnInit {

    email: string = "";
    phone: string = "";
    homeAddress: any = { line1: "", line2: "", line3: "" };
    zipCode = "";



    isLoading = true;
    isSubmitLoading:boolean = false;

    firestoreService : FirestoreService;
    
    constructor(firestoreService : FirestoreService){
      this.firestoreService = firestoreService
    }

    ngOnInit(): void {
      this.firestoreService.getProfile().then((data)=>{
        let content = data.data()
        let editProfileOptions = new EditProfileOptions(content['email'], content['phone'], content["homeAddressLine1"], content["homeAddressLine2"], content["homeAddressLine3"], content['zipCode'])
        this.email = content['email']
        this.phone = content['phone']
        this.homeAddress.line1 = content["homeAddressLine1"]
        this.homeAddress.line2 = content["homeAddressLine2"]
        this.homeAddress.line3 = content["homeAddressLine3"]
        this.zipCode = content['zipCode']
        this.isLoading = false
      }).catch((err)=>{
        this.showAlert("Error", `An error occured ${err.toString()}`)
      })
    }

    showAlert(title : String, text:String,){
      alert({
                    title:title.toString(),
                    message: text.toString(),
                    okButtonText: "Ok"
                  })
    }

    validateForm() : boolean{
      if( !this.email ||
        !this.phone ||
        !this.homeAddress.line1){
          this.showAlert('Invalid','Please fill all the mandatory fields correctly')
          return false;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        this.showAlert('Invalid','Incorrect Email format')
        console.log('Email not correct')
        return false;
      }
      const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number
if (!phonePattern.test(this.phone)) {
  this.showAlert('Invalid', 'Incorrect Phone number format');
  console.log('Phone number not correct');
  return false;
}
      return true
    }

    async onSubmit(){
      if(! this.validateForm){
        return
      }
      
      this.isSubmitLoading = true;
    await this.firestoreService.updateProfile(new EditProfileOptions(this.email, this.phone, this.homeAddress.line1, this.homeAddress.line2,this.homeAddress.line3, this.zipCode)).then((data)=>{
        this.showAlert('Success', 'Profile updated')
      }).catch((err)=>{
        this.showAlert('Error', `0An error occured: ${err.toString()}`)
      })
      this.isSubmitLoading = false;
    }


}
  