// firestore.service.ts
import { Injectable } from "@angular/core";
import { FirebaseApp, FirebaseError, firebase } from '@nativescript/firebase-core'
import { Auth } from "@nativescript/firebase-auth";
import { DocumentData, DocumentReference, DocumentSnapshot, Firestore } from "@nativescript/firebase-firestore";
import {EditProfileOptions} from '../classes/EditProfileOptions'




@Injectable({
    providedIn: "root"
})
export class FirestoreService {
    private firestore: Firestore;
    private fireAuth : Auth;

    constructor() {
        this.firestore =  firebase().firestore();
        this.fireAuth = firebase().auth()
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
}
