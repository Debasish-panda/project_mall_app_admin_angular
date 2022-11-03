import { Component, OnInit } from '@angular/core';
import { CollapsserviceService } from '../../services/collapsservice.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(public _collapsService:CollapsserviceService) { }

  ngOnInit(): void {
  }

}
