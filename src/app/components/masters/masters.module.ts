import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CatagoryComponent } from './catagory/catagory.component';
import { TagComponent } from './tag/tag.component';
import { ColorComponent } from './color/color.component';
import { UsertypeComponent } from './usertype/usertype.component';
import { SizeComponent } from './size/size.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    BrandlogoComponent,
    CatagoryComponent,
    TagComponent,
    ColorComponent,
    UsertypeComponent,
    SizeComponent
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    NgbModule, //for nav tab
    ReactiveFormsModule, //for formGroup
    NgxDatatableModule,

  ]
})
export class MastersModule { }
