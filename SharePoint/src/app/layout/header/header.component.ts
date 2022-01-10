import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email:any=null
  constructor(
    private auth:AuthService,
    private toastr:ToastrService,
    private router:Router) {

     auth.getUser().subscribe((user:any)=>{
       this.email=user?.email
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
        this.email=null
      })
    
    }
    catch(error){
      this.toastr.error("problem in signout",'',{
        closeButton:true
      })
    }
  }

}
