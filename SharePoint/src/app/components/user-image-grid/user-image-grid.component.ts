import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-image-grid',
  templateUrl: './user-image-grid.component.html',
  styleUrls: ['./user-image-grid.component.css']
})
export class UserImageGridComponent implements OnInit {
  @Input() usersImage;
  constructor() { }

  ngOnInit(): void {
  }

}
