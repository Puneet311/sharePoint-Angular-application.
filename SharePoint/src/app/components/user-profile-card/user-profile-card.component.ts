import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent implements OnInit {

  @Input() user;
  constructor() { }

  ngOnInit(): void {
  }

}
