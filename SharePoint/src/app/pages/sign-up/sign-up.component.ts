import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireDatabase } from '@angular/fire/compat/database';

import { readAndCompressImage } from 'browser-image-resizer';
import { finalize } from 'rxjs/operators';
import { imageConfig } from 'src/utils/config';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  picture: string = `https://firebasestorage.googleapis.com/v0/b/kirana-f08b6.appspot.com/o/img.png?alt=media&token=1857e7db-06df-4e77-9756-60aa018e1460`;
  uploadPercent: number = null;
  uuid:any
  fileValue:any
  showUploadButton=false
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: [''],
      bio: [''],
    });
  }

  ngOnInit(): void {}
 
  onSubmit() {
    const { email, password } = this.signUpForm.value;

    this.auth
      .signUp(email, password)
      .then((res) => {
        const { uid } = res.user;
        this.uuid = uid

        this.db.object(`/user/${uid}`).set({
          id: uid,
          name: this.signUpForm.value.name,
          email: email,
          password: password,
          country: this.signUpForm.value.country,
          username: this.signUpForm.value.username,
          bio: this.signUpForm.value.bio,
          dob: this.signUpForm.value.dob,
          picture: this.picture,
        });
      })
      .then(() => {
        this.router.navigateByUrl('/');
        this.toastr.success('Sign Up Success');
      })
      .catch((err) => {
        this.toastr.error('Sign up failed');
        this.signUpForm.reset();
      });
    
  }

  async uploadFile() {
    // const file = event.target.files[0];
    const file= this.fileValue

    let resizedImage = await readAndCompressImage(file, imageConfig);
    const filePath = file.name; //rename by uuid
    // filePath = this.uuid
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
