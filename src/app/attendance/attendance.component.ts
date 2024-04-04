import { Component, OnInit } from '@angular/core'
import { FirestoreService } from '../services/firestore_service';
import { Messaging, FirebaseMessaging, Notification as nft} from '@nativescript/firebase-messaging';
import { firebase } from '@nativescript/firebase';




@Component({
  selector: 'ns-attendance',
  templateUrl: 'attendance.component.html',
  styleUrls:['attendance.component.css']
})

export class AttendanceComponent implements OnInit{
isCheckIn: Boolean = false;
firestoreService : FirestoreService
isLoading : Boolean = false

constructor(firestoreService : FirestoreService){
  this.firestoreService = firestoreService
}

onClickCheck(){
  let date = new Date()
  console.log("Came")
  let dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  if(this.firestoreService.lastCheckInDate == dateFormatted && !this.isCheckIn){
    return
  }
  console.log("Gone")
  this.isLoading = true
  if(this.isCheckIn){
    this.firestoreService.setCheckOutDate().then((data)=>{
      this.firestoreService.setCheckOutProfile().then((data)=>{
        this.isCheckIn = !this.isCheckIn
    this.isLoading = false
      })
    }).catch((err)=>{
      this.isLoading = false
    })
  }
  else{
    this.firestoreService.setCheckInDate().then((data)=>{
      this.firestoreService.setCheckInProfile().then((data)=>{
        this.isCheckIn = !this.isCheckIn
    this.isLoading = false
    this.firestoreService.lastCheckInDate = dateFormatted
      })
    }).catch((err)=>{
      this.isLoading = false
    })
  }
}

ngOnInit(): void {
  this.firestoreService.currentUserDetails.subscribe((data)=>{
    this.isCheckIn = data.data()['checkInStatus']
  })
}
}

