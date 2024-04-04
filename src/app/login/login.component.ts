import { Component, OnInit } from '@angular/core'
import { FirebaseApp, FirebaseError, firebase } from '@nativescript/firebase-core'
import { Firestore } from '@nativescript/firebase-firestore';
import { Auth, FirebaseAuth } from '@nativescript/firebase-auth';
import { alert, prompt } from "@nativescript/core/ui/dialogs";
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'ns-login',
  templateUrl: 'login.component.html',
  styleUrls:['login.component.css']
})
export class LoginComponent implements OnInit {
  fb: FirebaseApp
  fireStore : Firestore;
  auth : Auth;

  username:String = '';
  password:String = '';
  usernameControlIsValid = true;
  passwordControlIsValid = true;
  usernameListener = false;
  passwordListener = false;

  constructor(private router: Router) {
    // Use the component constructor to inject providers.

  }

  isLoggingIn = true;
  isLoading = true;
  isSignInLoading = false;

  toggleForm() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  submit() {
    if (this.isLoggingIn) {
        // Perform the login
    } else {
        // Perform the registration
    }
  }

  async initFb(){
    this.fb = await firebase().initializeApp();
        console.log('init success');
    this.fireStore = new Firestore();
    this.auth = firebase().auth();
    console.log('cloud created');
    // await this.fireStore.collection('vinay').add({'name' : 'vinay', 'age':21})
    this.isLoading = false;
    console.log('added')
  }

  async loginWithUserNameAndPassword(){
      console.log(this.username);
      try{

        const navigationExtras: any = {
          clearHistory: true
        };
        this.isSignInLoading = true;
      this.auth.signInWithEmailAndPassword(this.username.toString(), this.password.toString()).then((creds)=>{
        console.log('successfully signed in: ' + creds.user.email.toString())
        this.router.navigate(["/attendance"], navigationExtras);
      }).catch((e)=>{
        this.isSignInLoading = false;
        if(e instanceof FirebaseError){
          let msg = e.message.toString();
          if(msg.substring(0,16) == 'There is no user'){
            msg = 'Incorrect Username/Password'
          }
          // else if(msg.substring(0,9) == 'A network'){
          
          // }
          // else if(msg == 'The email address is badly formatted.'){

          // }
          // else{
          //   msg = 'Unkown error'
          // }

          console.log(e.message.toString())
          alert({
            title: "INVALID",
            message: msg,
            okButtonText: "Ok"
          })
        }
      })
    }catch(e: unknown){
      
    }
  }

  async forgotPasswordDialog(){
    console.log(this.username);
    try{
    this.auth.signInWithEmailAndPassword(this.username.toString(), this.password.toString()).then((creds)=>{
      console.log('successfully signed in: ' + creds.user.email.toString())
    })
  }catch(e: unknown){
    console.log('helloooooo');
    if(e instanceof FirebaseError){
      prompt({
        title: "Forgot Password",
        message: e.message.toString(),
        defaultText: "",
        okButtonText: "Ok",
        cancelButtonText: "Cancel"
      }).then((data) => {
        if (data.result) {
          // Call the backend to reset the password
          alert({
            title: "APP NAME",
            message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
            okButtonText: "Ok"
          })
        }
      });
    }
  }
}

  onSubmit(){
    console.log(this.username, this.password)
    this.usernameListener = true;
    this.checkUsername();
    this.checkPassword();
    if(this.usernameControlIsValid && this.passwordControlIsValid){
        this.loginWithUserNameAndPassword();
    }
  }

  checkUsername(){
    console.log('false');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(this.username.toString())){
      this.usernameControlIsValid = false;
      return false;
    }
    this.usernameControlIsValid = true;
    return true;
  }

  checkPassword(){
    console.log('true')
    if(this.password.length < 1){
      this.passwordControlIsValid = false;
      return false;
    }
    this.passwordControlIsValid = true;
    return true;
  }

  listenToUsername(){
    if(this.usernameListener){
      this.checkUsername();
    }
  }

  listenToPassword(){
    if(this.passwordListener){
      
    }
  }

  activeUsernameListener(){
    this.checkUsername()
    this.usernameListener = true;
  }

  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for APP NAME to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        // Call the backend to reset the password
        alert({
          title: "APP NAME",
          message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
          okButtonText: "Ok"
        })
      }
    });
  }

  jumpToRegsitration(){
    const navigationExtras: any = {
      clearHistory: true
    };
    this.router.navigate(["/registration"], navigationExtras);
  }

  ngOnInit(): void {
    // Init your component properties here.
    this.initFb();
  }

  
}

