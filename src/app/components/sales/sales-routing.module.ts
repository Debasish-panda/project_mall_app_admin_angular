import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { TransationsComponent } from './transations/transations.component';

const routes: Routes = [
  {path:'', children:[
    {path:'orders', component:OrdersComponent},
    {path:'transactions', component:TransationsComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
