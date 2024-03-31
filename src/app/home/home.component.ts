// home.component.ts

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Auth } from "@nativescript/firebase-auth";
import { FirebaseApp, firebase } from "@nativescript/firebase-core";
import { alert, prompt,confirm } from "@nativescript/core/ui/dialogs";

@Component({
  selector: "app-home",
  templateUrl : 'home.component.html'
})
export class HomeComponent implements OnInit { 

  constructor(private router: Router) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.initFb()
  }
  async initFb(){
    this.fb = await firebase().initializeApp();
        console.log('init success');
    this.auth = firebase().auth();
    console.log('cloud created');
    // await this.fireStore.collection('vinay').add({'name' : 'vinay', 'age':21})
    console.log('added')
  }



  fb: FirebaseApp
  auth : Auth;
  logout(){
    console.log('logging out')
    this.auth.signOut().then((val)=>{
      console.log("Logout success full");
      const navigationExtras: any = {
        clearHistory: true
      };
      this.router.navigate([""], navigationExtras);
    });
  }

  async deleteAccount(){
    console.log("Logging out")
     if ( await this.confirmDeleteAccount()){
      this.auth.currentUser.delete().then((val)=>{
        console.log('Account Deleted');
        const navigationExtras: any = {
          clearHistory: true
        };
        this.router.navigate([""], navigationExtras);
      })
     }
  }

  async confirmDeleteAccount() :Promise<Boolean>{
    var retVar : Boolean = false;

  retVar = await confirm({
      title: "Delete Account",
      message: "You will no longer access to your account details if you delete account",
      okButtonText: "Yes",
      cancelButtonText: "No"
    })
    console.log("Returning " + retVar)
    return retVar
  }
}
