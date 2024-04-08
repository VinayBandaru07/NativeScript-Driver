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
col = "red"
  
  // firestoreService : FirestoreService;
  // messaging : Messaging;

  // constructor(firestoreService : FirestoreService){
  //   this.firestoreService = firestoreService
  //   this.getToken()
  // }

  // async getToken(){
  //   this.messaging = new Messaging()
  //   let token = await this.firestoreService.getToken()
  //    this.firestoreService.saveToken(token)
  //   console.log(token)
  // }

  students: Array<Object>



groupedStudents: any[];
firestoreService : FirestoreService
notifyOrder = true


constructor(firestoreService : FirestoreService) {
    this.firestoreService = firestoreService
    firestoreService.studentsAssigned.subscribe((data)=>{
        this.students = data
        this.groupedStudents = this.groupStudentsByOrganization(this.students)
    })
}

groupStudentsByOrganization(students: any[]): any[] {
    const groups = [];
    const groupedByOrganization = students.reduce((acc, student) => {
        if (!acc[student.orgId]) {
            acc[student.orgId] = [];
        }
        acc[student.orgId].push(student);
        return acc;
    }, {});
    // console.log(groupedByOrganization)

    for (const orgId in groupedByOrganization) {
        if (groupedByOrganization.hasOwnProperty(orgId)) {
            groups.push({
                orgId: orgId,
                showStudents :true,
                pickUpTime : groupedByOrganization[orgId][0]['pickUpTime'],
                orgPlace: groupedByOrganization[orgId][0]['orgPlace'],
                organization : groupedByOrganization[orgId][0]['organization'],
                students: groupedByOrganization[orgId]
            });
        }
    }

    return groups;
}

onStudentSelected(index: number, organization: string) {
    const selectedStudent = this.groupedStudents.find(group => group.organization === organization)?.students[index];
}

async onAcceptButtonClick(orgIndex: number, studentIndex: number) {
    let studentObject = this.groupedStudents[orgIndex]?.students[studentIndex]
    
    return new Promise<Boolean>((resolve, reject)=>{
        if (studentObject && studentObject['accepted'] == false) {
            this.firestoreService.acceptPickup(studentObject['id']).then((data)=>{
                studentObject['rejected'] = false;
                studentObject['accepted'] = true;
                resolve(true)
            }).catch((err)=>{
                resolve(false)
            })
        }
        else{
            resolve(true)
        }
    })

     // Set the accepted property to true
}

onRejectButtonClick(orgIndex: number, studentIndex: number){
    let studentObject = this.groupedStudents[orgIndex]?.students[studentIndex]
    if (studentObject && studentObject['rejected'] == false) {
        this.firestoreService.rejectPickup(studentObject['id']).then((data)=>{
            studentObject['rejected'] = true;
            studentObject['accepted'] = false;
        }).catch((err)=>{
            
        })
    }
}

async acceptAllInOrg(orgIndex:number){
    let orgObject = this.groupedStudents[orgIndex]
    for(let i : number = 0;i< orgObject?.students.length; i++){
        if(!(await this.onAcceptButtonClick(orgIndex, i))){
            break
        }
    }
}
}

