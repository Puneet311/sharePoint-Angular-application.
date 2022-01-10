import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];

  isLoading = false;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private db: AngularFireDatabase
  ) {
    this.isLoading = true;

    //get all users
    this.db
      .object(`/user`)
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.users = Object.values(obj);
          this.isLoading = false;
        } else {
          this.toastr.error('No data found');
          this.users = [];
          this.isLoading = false;
        }
      });

    //grab all post
    this.db
      .object(`/posts`)
      .valueChanges()
      .subscribe((obj) => {
        if (obj) {
          this.posts = Object.values(obj).sort((a, b) =>
            a.date > b.date ? 1 : -1
          );
          this.isLoading = false;
        }else{
          this.toastr.error("No Post to display")
          this.posts=[]
          this.isLoading=false
        }
      });
  }

  ngOnInit(): void {}
}
