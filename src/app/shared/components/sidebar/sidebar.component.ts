import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../interface/menu.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userImage: string = "assets/image/user.png";
  logoImage: string = "assets/image/logo.png";
  fullName: string = "";
  emailId: string = "";
  menuItems : Menu[] = [];

  constructor(private _menuService:MenuService) { }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('userDetails')); //this one we can get via service and this is ex of to get from local storage
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    this.emailId = `${userDetails.email}`;
    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "assets/image/user.png" :
    environment.BASE_IMAGES_PATH + userDetails.imagePath;
    
    this.menuItems = this._menuService.MENUITEMS;
  }

  toggleNavActive(menuItem: Menu) {
    menuItem.active = !menuItem.active;
  }
}
