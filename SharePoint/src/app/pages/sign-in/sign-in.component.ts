import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm!:FormGroup
  constructor(
    private fb:FormBuilder,
    private auth:AuthService,
    private toastr:ToastrService,
    private router:Router

  ) {
    this.signInForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    })
   }

  ngOnInit(): void {
  }

  reset(){
    this.signInForm.reset()
  }

  onSubmit(){
    const {email,password}=this.signInForm.value

    this.auth.signIn(email,password)
    .then(()=>{
      this.toastr.success("Sign In success",'',{
        closeButton:true
      })
      this.router.navigateByUrl("/")
    })
    .catch((error)=>{
      this.toastr.error(`Sign In failed:${error.message}`,"",{
        closeButton:true
      })
    })
  }

}
