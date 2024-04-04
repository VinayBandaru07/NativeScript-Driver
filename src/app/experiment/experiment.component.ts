import { Component, OnInit } from '@angular/core'
import { FirestoreService } from '../services/firestore_service';
import { Messaging, FirebaseMessaging, Notification as nft} from '@nativescript/firebase-messaging';
import { firebase } from '@nativescript/firebase';




@Component({
  selector: 'ns-experiment',
  templateUrl: 'experiment.component.html',
  styleUrls:['experiment.component.css']
})
export class ExperimentComponent {

  
  firestoreService : FirestoreService;
  messaging : Messaging;

  constructor(firestoreService : FirestoreService){
    this.firestoreService = firestoreService
    this.getToken()
  }

  async getToken(){
    this.messaging = new Messaging()
    let token = await this.firestoreService.getToken()
     this.firestoreService.saveToken(token)
    console.log(token)
  }

}

