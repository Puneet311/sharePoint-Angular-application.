import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {v4 as uuidv4} from "uuid"


import { readAndCompressImage } from 'browser-image-resizer';
import { finalize } from 'rxjs/operators';
import { imageConfig } from 'src/utils/config';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  localUser = null
  location:string
  description:string
  picture:string=''
  uploadPercent:number=null
  showUploadButton:boolean=false;
  fileValue:any
  constructor(
    private auth :AuthService,
    private toastr:ToastrService,
    private router:Router,
    private db:AngularFireDatabase,
    private storage:AngularFireStorage
  ) {
    this.auth.getUser().subscribe((user)=>{
      this.db.object(`/user/${user.uid}`)
      .valueChanges()
      .subscribe((user)=>{
        this.localUser=user
      })
    })
   }

  ngOnInit(): void {
  }

  onSubmit(){
    const uid =uuidv4()

    this.db.object(`/posts/${uid}`).set({
      id:uid,
      locationName:this.location,
      description:this.description,
      picture:this.picture,
      by:this.localUser.name,
      userName:this.localUser.username,
      date:Date.now()
    })
    .then(()=>{
      this.toastr.success("Post added successfully")
      this.router.navigateByUrl("/")
    })
    .catch((error)=>{
      this.toastr.error("opppps error")
    })
  }

  async uploadFile() {
    // const file = event.target.files[0];
    const file=this.fileValue

    let resizedImage = await readAndCompressImage(file, imageConfig);
    // const filePath = file.name; //rename by uuid
    const filePath = uuidv4()
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percent) => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url
            this.toastr.success('Image upload success')
            this.showUploadButton=false
          })
        })
      ).subscribe();
  }


  uploadFileLocal(e){
    if(e.target.files){
      this.fileValue=e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(this.fileValue);
      reader.onload=(event:any)=>{
        this.picture=event.target.result;
        this.showUploadButton=true
      }
    }
  }

}
