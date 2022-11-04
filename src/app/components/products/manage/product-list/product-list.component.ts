import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  objRows: any[] = [];

  constructor(private _httpservice: HttpService,
    private _toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/ProductMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product List")
      }
    })
  }

  Edit(id: number) {
    this.router.navigate(['/products/manage/add-product'], {queryParams:{productId:id}});
  }
  Delete(id: number) {
    let obj = { // in post method we need to pass object format so here we made object format.
      id: id
    }
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._httpservice.post(environment.BASE_API_PATH + "/ProductMaster/Delete", obj).subscribe(res => {
          if (res.isSuccess) {
            // this._toastr.success('record deleted', "User Master");
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "Product List")
          }
        })
        
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your record file is safe :)',
          'error'
        )
      }
    })
   
  }

  ngOnDestroy() {
    this.objRows = null;
  }

}
