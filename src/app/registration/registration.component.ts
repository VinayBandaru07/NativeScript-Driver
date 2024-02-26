
const  enum AndroidPermissions{
    READ_IMAGES = 'android.permission.READ_MEDIA_IMAGES'
  
  }
  
  import { Component, OnInit } from '@angular/core'
  import { FirebaseApp, FirebaseError, firebase, } from '@nativescript/firebase-core'
  import * as Firebase from '@nativescript/firebase-core'
  import { Firestore } from '@nativescript/firebase-firestore';
  import { Auth, FirebaseAuth } from '@nativescript/firebase-auth';
  import { alert, prompt } from "@nativescript/core/ui/dialogs";
  import { filePicker, MediaType } from '@angelengineering/filepicker';
  import * as myPermissions from 'ns-permissions';
  import { Storage, TaskEvent, TaskSnapshot } from '@nativescript/firebase-storage';
  import {  File } from '@nativescript/core';
  import { TaskState } from '@nativescript/firebase-storage/common';
  import { Router } from '@angular/router';
  
  const enum UploadFileType{
    licensePhoto = 'LICENSE_PHOTO', driverPhoto = 'DIRVER_PHOTO'
  }
  
  @Component({
    selector: 'ns-registration',
    templateUrl: 'registration.component.html',
    styleUrls:['registration.component.css']
  })
  export class RegistrationComponent implements OnInit {
      fb: FirebaseApp
    fireStore : Firestore;
    auth : Auth;
    storage : Storage
  
    isLoading: boolean = false;
    firstName: string = "";
    middleName: string = "";
    lastName: string = "";
    email: string = "";
    phone: string = "";
    homeAddress: any = { line1: "", line2: "", line3: "" };
    zipCode: string = "";
    drivingLicenseNo: string = ""
    uploadDrivingLicense: boolean = false;
    uploadPhoto:boolean = false;
    userName: string = "";
    password: string = "";
    reEnterPassword: string = "";
    licensePath:File;
    photoPath:File;
    
  
    // Control validation flags
    firstNameControlIsValid: boolean = true;
    lastNameControlIsValid: boolean = true;
    emailControlIsValid: boolean = true;
    phoneControlIsValid: boolean = true;
    homeAddressLine1ControlIsValid: boolean = true;
    homeAddressLine2ControlIsValid: boolean = true;
    homeAddressLine3ControlIsValid: boolean = true;
    zipCodeControlIsValid: boolean = true;
    uploadDrivingLicenseControlIsValid: boolean = true;
    uploadPhotoControlIsValid: boolean = true;
    userNameControlIsValid: boolean = true;
    passwordControlIsValid: boolean = true;
    reEnterPasswordControlIsValid: boolean = true;
    isSignUpLoading:boolean = false;
  
    constructor(private router: Router) {}
  
    ngOnInit() {
      this.initFb()
    }

    jumpToLogin(){
        const navigationExtras: any = {
            clearHistory: true
          };
          this.router.navigate(["/"], navigationExtras);
    }
  
    showAlert(title : String, text:String,){
      alert({
                    title:title.toString(),
                    message: text.toString(),
                    okButtonText: "Ok"
                  })
    }
  
    clearLicense(){
      this.uploadDrivingLicense = false;
    }
  
    clearProfilePhoto(){
      this.uploadPhoto = false;
    }
  
    async onSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.isSignUpLoading = true;
      try{
        this.auth.createUserWithEmailAndPassword(this.email, this.password).then((val)=>{
          this.fireStore.collection('drivers').doc(val.user.uid).set({
            firstName : this.firstName,
            lastName : this.lastName,
            middleName : this.middleName,
            email : this.email,
            phone : this.phone,
            homeAddressLine1 : this.homeAddress.line1,
            homeAddressLine2 : this.homeAddress.line2,
            homeAddressLine3 : this.homeAddress.line3,
            zipCode : this.zipCode,
            driverLicenseNo : this.drivingLicenseNo
          }).then((doc)=>{
            console.log('user created successfully')
            this.uploadFileToFirebaseStorage(this.licensePath, UploadFileType.licensePhoto).then((val)=>{
              if(val){
                console.log('selectedFiles: ' + val.toString())
                this.uploadFileToFirebaseStorage(this.photoPath, UploadFileType.driverPhoto).then((val2)=>{
                  this.isSignUpLoading = false;
                  if(val2){
                    console.log('successFully created user and uploaded images')
                    this.showAlert('Success',"User created successfully.")
                  }
                  else{
                    console.log('Profile uploading failed')
                  }
                })
              }else{
                console.log('License uploading failed')
              }
            });
          }).catch((e)=>{
            console.log(e.toString())
            this.showAlert('Error',"User successfully created. But failed to upload details, please sign-in to continue")
            this.isSignUpLoading = false;
          })
        }).catch((e)=>{
          // console.log(e.toString())
          this.showAlert('Error',e.message.toString())
          this.isSignUpLoading = false;
        })
      }catch(e){}
      
  
    }
  
   async onUploadDrivingLicense() {
      let pickedFiles ;
      pickedFiles = await this.getReadExternalStoragePermission() ? this.startSelection(UploadFileType.licensePhoto): [] ;
    }
  
      async initFb(){
      this.fb = await firebase().initializeApp();
          console.log('init success');
      this.fireStore = new Firestore();
      this.auth = firebase().auth();
      this.storage = firebase().storage();
      console.log('cloud created');
      // await this.fireStore.collection('vinay').add({'name' : 'vinay', 'age':21})
      this.isLoading = false;
      console.log('added')
    }
  
     async getReadExternalStoragePermission() {
       console.log('called')
  
  //      <key>NSPhotoLibraryUsageDescription</key>
  // <string>Requires access to photo library to upload media.</string>
  
       let isAuthorized = false;
       let result = await myPermissions.check(myPermissions.AndroidPermissions.READ_IMAGES, myPermissions.AndroidPermissions.READ_EXTERNAL_STORAGE);
       
         if (result[0] === 'authorized') {
          console.log('authorized')
           isAuthorized = true;
          } else {
            console.log('asking permission')
           let requestResult = await myPermissions.request(myPermissions.AndroidPermissions.READ_IMAGES, myPermissions.AndroidPermissions.READ_EXTERNAL_STORAGE);
           if(requestResult[0]==='authorized'){
            isAuthorized = true; console.log('ret true')
           }else{
            isAuthorized = false;console.log('ret false')
           }
            }
          
        console.log('returned')
  return isAuthorized;
     
    }
  
  
  
    async onUploadPhoto(){
      let pickedFiles ;
  // console.log(await this.getReadExternalStoragePermission())
    pickedFiles = await this.getReadExternalStoragePermission() ? this.startSelection(UploadFileType.driverPhoto): [] ;
    // pickedFiles = await this.startSelection();
  
    }
  
    async startSelection(uploadFileType : UploadFileType){
      let pickedFiles : File[];
      try {
         pickedFiles = await filePicker(MediaType.IMAGE + MediaType.DOCUMENT, false);
         if(uploadFileType == UploadFileType.driverPhoto){
          this.photoPath = pickedFiles[0]
          this.uploadPhoto = true;
         }
         else{
          this.licensePath = pickedFiles[0]
          this.uploadDrivingLicense = true;
         }
    
  
       } catch (err) {
         if (err) alert(err?.message);
       } 
       return pickedFiles;
    }
  
  
    // Assume filePath is the path to the file you want to upload
  
   async uploadFileToFirebaseStorage(filePath: File, uploadFileType : UploadFileType): Promise<boolean> {
      // Get a reference to the storage service
      console.log('uploading')
  
      // Get a reference to the storage root
      const storageRef = this.storage.ref(`uploads/${this.email}/${uploadFileType.toString()}` + `${filePath.extension}`);
      // // Get a reference to the file
      // const file = File.fromPath(filePath[0].path);
  
      // // Create a unique filename or use the existing file name
      // const fileName = file.name;
  
      // Create a reference to the file in the storage root
      // const fileRef = storageRef.child(`uploads/${fileName}`);
      // Upload the file to Firebase Storage
    let fileName : String = uploadFileType.toString();
    let updateDoc = {}
      try{
        const storageRef = this.storage.ref(`uploads/${this.email}/${fileName}` + `${filePath.extension}`);
         // Upload the file to Firebase Storage
         const uploadTask = storageRef.putFile(filePath.path);
         return new Promise<boolean>((resolve, reject) => {
         
  
          uploadTask.on(TaskEvent.STATE_CHANGED, async (sn) => {
  
            if(sn.state == TaskState.SUCCESS){
              console.log('Upload SUCCESS');
              updateDoc[`${fileName}`] = await storageRef.getDownloadURL()
              this.fireStore.collection('drivers').doc(this.auth.currentUser.uid).update({
                ...updateDoc
              })
              resolve(true); // Resolve the promise on success
            }
            else if(sn.state == TaskState.ERROR || sn.state == TaskState.CANCELLED){
              console.log('Upload Failed');
              this.isSignUpLoading = false;
              resolve(false)
            }
          });
        });
      }catch(e){
        
      }
  
  
  
          // .then((snapshot: any) => {
          //     console.log(`File uploaded successfully! Download URL: ${snapshot.downloadURL}`);
          // })
          // .catch((error: any) => {
          //     console.error(`File upload failed: ${error}`);
          // });
  }
  
  
   
    validateForm(): boolean {
      // Perform validation for mandatory fields
      if (
        !this.firstName ||
        !this.lastName ||
        !this.email ||
        !this.phone ||
        !this.homeAddress.line1 ||
        !this.zipCode ||
        !this.userName ||
        !this.password ||
        !this.reEnterPassword || !this.drivingLicenseNo
      ) {
        this.showAlert('Invalid','Please fill all the mandatory fields correctly')
        console.log('not filled')
        return false;
      }
  
      if(!this.uploadDrivingLicense){
        this.showAlert('Invalid','Please upload driver license')
        return false
      }
      if(!this.uploadPhoto){
        this.showAlert('Invalid','Please upload profile photo')
        return false
      }
  
      // Email format validation
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(this.email)) {
        this.showAlert('Invalid','Incorrect Email format')
        console.log('Email not correct')
        return false;
      }
  
      // Password strength validation: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
      const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordPattern.test(this.password)) {
        this.showAlert('Invalid','Password strength validation: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character')
        console.log('password not perfect')
        return false;
      }
  
      // Check if passwords match
      if (this.password !== this.reEnterPassword) {
        this.showAlert('Invalid',"Password didn't matched")
        console.log('password not matched')
        return false;
      }
  
      return true;
    }
  }
  
  