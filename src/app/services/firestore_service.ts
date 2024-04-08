// firestore.service.ts
import { Injectable } from "@angular/core";
import { FirebaseApp, FirebaseError, firebase } from '@nativescript/firebase-core'
import { Auth } from "@nativescript/firebase-auth";
import { DocumentData, DocumentReference, DocumentSnapshot, Firestore, Timestamp } from "@nativescript/firebase-firestore";
import {EditProfileOptions} from '../classes/EditProfileOptions'
import { BehaviorSubject, Subject } from "rxjs";




@Injectable({
    providedIn: "root"
})
export class FirestoreService {
    private firestore: Firestore;
    private fireAuth : Auth;

    currentUserDetails : Subject<DocumentSnapshot<DocumentData>> = new  Subject()
    lastCheckInDate : string
    studentsAssigned : Subject<Array<Object>> = new Subject()

    constructor() {
        console.log(Timestamp.now().toDate())
        this.firestore =  firebase().firestore();
        this.fireAuth = firebase().auth()
        // this.getCurrentUserDetails()
        this.getStudents()
    }

    addReport(reportText: string): Promise<DocumentReference<DocumentData>> {
        const reportsCollection = this.firestore.collection("reports");
        return reportsCollection.add({
            text: reportText,
            timestamp: Date.now(),
            userId : this.fireAuth.currentUser?.uid
        });
    }

    async updateProfile(options : EditProfileOptions ){
        if(this.fireAuth.currentUser.email !== options.email){
            await this.fireAuth.currentUser.updateEmail(options.email)
        }
        return  this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).update({
            email:options.email,
            homeAddressLine1 : options.address_line1,
            homeAddressLine2 : options.address_line2,
            homeAddressLine3 : options.address_line3
        })
    }

     getProfile() : Promise<DocumentSnapshot<DocumentData>>{
          return  this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).get()
    }

    async getToken(){
        return await this.fireAuth.currentUser.getIdToken()
    }

    saveToken(token : string){
        this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).update({
            token:token
        }).then((data)=>{
            console.log("Updated succss")
        })
    }

    getCurrentUserDetails(){
        let date = Timestamp.now().toDate()
  let dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).get().then((data)=>{
            this.currentUserDetails.next(data)
            this.lastCheckInDate = data.data()['checkInDate'] ?? dateFormatted
            console.log(JSON.stringify(data.data()))
        })
    }

    setCheckInProfile(){
        let date = Timestamp.now().toDate()
  let dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        return  this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).update({
            "checkInStatus" : true,
            "checkInDate" : dateFormatted
        })
    }

    setCheckOutProfile(){
        return  this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).update({
            "checkInStatus" : false
        })
    }

    setCheckInDate(){
        let date = Timestamp.now().toDate()
  let dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
       return this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).collection('days').doc(Timestamp.now().toDate().toDateString()).set({
            "checkInStatus" : true,
            "checkInTime" : dateFormatted
        })
    }

    setCheckOutDate(){
       return this.firestore.collection('drivers').doc(this.fireAuth.currentUser.uid).collection('days').doc(this.lastCheckInDate).set({
            "checkInStatus" : false,
            "checkOutTime" : Timestamp.now()
        })
    }

    getStudents(){
        this.firestore.collection('drivers').doc("D7BJt50vzmetsgE2oTfq2vxhp9I3").collection('days').doc("06-04-2024").collection('students').get().then((data)=>{
            let studentsArray : Array<Object> = []
            data.docs.forEach((doc)=>{
                studentsArray.push({
                    id : doc.id,
                    ...doc.data()
                })
                this.studentsAssigned.next(studentsArray)
            })
        })
    }

    acceptPickup(studentId: string){
       return this.firestore.collection('drivers').doc("D7BJt50vzmetsgE2oTfq2vxhp9I3").collection('days').doc('06-04-2024').collection('students').doc(studentId).update({
            accepted : true,
            rejected : false
        })
    }

    rejectPickup(studentId: string){
       return this.firestore.collection('drivers').doc("D7BJt50vzmetsgE2oTfq2vxhp9I3").collection('days').doc('06-04-2024').collection('students').doc(studentId).update({
            accepted : false,
            rejected : true
        })
    }

    acceptAllInOrg(orgId){
        
    }

}
