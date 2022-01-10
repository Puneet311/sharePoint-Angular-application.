import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import{faThumbsUp,faThumbsDown,faShareSquare} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnChanges {

  @Input() post;
  uid:any=null
  faThumbsUp=faThumbsUp
  faThumbsDown=faThumbsDown
  faShareSquare=faShareSquare
  upvote = 0;
  downvote = 0;
  constructor(
    private auth:AuthService,
    private db:AngularFireDatabase
  ) {
    this.auth.getUser().subscribe((user)=>{
      this.uid=user?.uid
    })
   }
 
  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.post.vote){
      Object.values(this.post.vote).map((value:any)=>{
        if(value.upVote){
          this.upvote += 1
        }
        if(value.downVote){
          this.downvote +=1
        }
      })
    }
  }

  upvotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upVote:1
    })
  }

  downvotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downVote:1
    })
  }

  getUserName(){
    return `https://instagram.com/${this.post.username}`
  }

}
