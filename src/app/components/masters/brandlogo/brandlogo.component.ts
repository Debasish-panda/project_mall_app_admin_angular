import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-brandlogo',
  templateUrl: './brandlogo.component.html',
  styleUrls: ['./brandlogo.component.scss']
})
export class BrandlogoComponent implements OnInit {

  addForm: FormGroup;
  buttonText: string;
  dbops: DbOperation;
  objRows: any[] = [];
  objRow: any;
  addedImagePath: string = "assets/image/noimage.png";
  fileToUpload: any;
  @ViewChild('nav') elnav: any;
  @ViewChild('file') elfile: ElementRef;
  formErrors = { //dynamic validation
    name: '',
  }
  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 1 char long',  //builtin should be small letter
      maxlength: 'Name can not be more than 10 char long'
    }
  }

  constructor(private _httpservice: HttpService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  setFormState() {
    this.buttonText = 'Add';
    this.dbops = DbOperation.create;
    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
      ])]
    })

    this.addForm.valueChanges.subscribe(() => { //this method set for validate once value change it will check and display if any err
      this.onValueChanges();
    })
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }
    for (const field of Object.keys(this.formErrors)) { //Object.keys will get the key of formErrors (object in key and value pairs)
      this.formErrors[field] = ""; //set the value empty from starting.

      const control = this.addForm.get(field);
      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];
        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + " ";
          }
        }
      }
    }
  }

  get ctrl() {
    return this.addForm.controls;
  }

  upload(files: any) {
    if (files.length == 0) {
      return;
    }
    let type = files[0].type; //to check is is it files or not and it is defult at 0 index
    if (type.match(/image\/*/) == null) {
      this._toastr.error('Please upload a valid image', 'Brand Logo Master');
      this.elfile.nativeElement.value = ''; //set empty the value of file to display noimage in case wrong image anyone inputed.
      this.addedImagePath = 'assets/image/noimage.png'
    }
    this.fileToUpload = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    }
  }

  Submit() {
    if (this.addForm.invalid) {
      return;
    }

    if (this.dbops === DbOperation.create && !this.fileToUpload) { //this is used for the validation image
      this._toastr.error('Please upload an image', 'BrandLogo Master');
      return;
    }

    const formData = new FormData(); //to send file this need to be done and below addForm we will change as formData and formData details we can not see in console.
    formData.append("Id", this.addForm.value.id);
    formData.append("Name", this.addForm.value.name);
    formData.append("Image", this.fileToUpload, this.fileToUpload.name);

    switch (this.dbops) {
      case DbOperation.create:
        this._httpservice.postImage(environment.BASE_API_PATH + "/BrandLogo/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success('data saved successfully', "Brand Logo");
            this.resetForm();
          }
          else {
            this._toastr.error(res.errors[0], "Brand Logo")
          }
        })
        break;
      case DbOperation.update:
        this._httpservice.postImage(environment.BASE_API_PATH + "/BrandLogo/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success('data updated successfully', "Brand Logo");
            this.resetForm();
          }
          else {
            this._toastr.error(res.errors[0], "Brand Logo")
          }
        })
        break;
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });
    this.buttonText = "Add";
    this.elfile.nativeElement.value = '';
    this.addedImagePath = 'assets/image/noimage.png'
    this.dbops = DbOperation.create;
    this.getData();
    this.elnav.select('view');
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: ''
    });
    this.buttonText = "Add";
    this.elfile.nativeElement.value = '';
    this.addedImagePath = 'assets/image/noimage.png'
    this.dbops = DbOperation.create;
    this.elnav.select('view');
  }

  getData() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/BrandLogo/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Brand Logo")
      }
    })
  }
  Edit(id: number) {
    this.buttonText = "Update";
    this.dbops = DbOperation.update;
    this.elnav.select('addtab')
    this.objRow = this.objRows.find(x => x.id === id);
    this.addForm.patchValue(this.objRow);
    this.addedImagePath = this.objRow.imagePath;
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
        this._httpservice.post(environment.BASE_API_PATH + "/BrandLogo/Delete", obj).subscribe(res => {
          if (res.isSuccess) {
            // this._toastr.success('record deleted', "Brand Logo");
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "Brand Logo")
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
    this.objRow = null;
    this.objRows = null;
  }

  tabChange(event: any) {
    this.addForm.reset({
      id: 0,
      name: ''
    });
    this.buttonText = "Add";
    this.dbops = DbOperation.create;
    this.elfile.nativeElement.value = '';
    this.addedImagePath = 'assets/image/noimage.png'
  }

}
