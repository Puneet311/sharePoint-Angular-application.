import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user:any
  uid:any
  constructor(
    private auth:AuthService,
    private toastr:ToastrService,
    private router:Router,
    private db:AngularFireDatabase) {
      auth.getUser().subscribe((user:any)=>{
        this.uid=user?.uid
        this.db.object(`/user/${this.uid}/`).valueChanges().subscribe((userObj:any)=>{
          if(userObj){
            this.user=userObj
          }
        })
      })
    }

  ngOnInit(): void {
  }

  addPost(){
    this.router.navigateByUrl('/addpost')
  }

 handelSignOut(){
    try{
      this.router.navigateByUrl('/signin').then(()=>{
        this.auth.signOut()
        this.toastr.info("Logout success",'',{
          closeButton:true
        })
        this.user=null
        this.uid=''
      })
    
    }
    catch(error){
      this.toastr.error("problem in signout",'',{
        closeButton:true
      })
    }
  }

}
