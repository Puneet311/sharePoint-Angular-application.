import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  uid: string;
  user: any;
  usersPost: any;
  usersImage: string[] = [];
  isLoading: boolean = true;
  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.auth.getUser().subscribe((user: any) => {
      this.uid = user?.uid;
      this.db
        .object(`/user/${this.uid}`)
        .valueChanges()
        .subscribe((userObj) => {
          if (userObj) {
            this.user = userObj;
          }
        });
    });
    this.db
      .object(`/posts`)
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.usersPost =  Object.values(obj).sort((a, b) =>
          a.date > b.date ? 1 : -1
        );
          this.usersPost.map((value:any)=>{
            if(value.userId===this.uid){
              this.usersImage.push(value.picture)
            }
          })
          this.isLoading = false;
        } else {
          this.usersPost = [];
          this.usersImage=[]
          this.isLoading = false;
        }
      });
  }
}
