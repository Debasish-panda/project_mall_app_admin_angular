import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CollapsserviceService } from '../../services/collapsservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userImage: string = "assets/image/user.png";
  constructor(public _collapsService:CollapsserviceService) { }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "assets/image/user.png" :
    environment.BASE_IMAGES_PATH + userDetails.imagePath
  }

  collapsSidebar(){
    this._collapsService.collapsOption = !this._collapsService.collapsOption;
  }

}
