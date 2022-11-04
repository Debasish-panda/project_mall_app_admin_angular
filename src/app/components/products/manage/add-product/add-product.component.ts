import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { environment } from 'src/environments/environment';
import { __param } from 'tslib';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {

  productId: number = 0;
  addForm: FormGroup;
  submitted: boolean = false;
  dbops: DbOperation;
  buttonText: string = "";

  objSizes: any[] = [];
  objColors: any[] = [];
  objTags: any[] = [];
  objCategories: any[] = [];

  @ViewChild('file') elfile: ElementRef;

  bigImage = 'assets/image/product-noimage.jpg';
  images = [
    { img: "assets/image/noimage.png" },
    { img: "assets/image/noimage.png" },
    { img: "assets/image/noimage.png" },
    { img: "assets/image/noimage.png" },
    { img: "assets/image/noimage.png" },
  ]

  fileToUpload = [];
  counter: number = 1;


  formErrors = { //dynamic validation
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    colorId: '',
    categoryId: '',
    tagId: '',
  }
  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name can not be less than 3 char long',  //builtin should be small letter
      maxlength: 'Name can not be more than 20 char long'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title can not be less than 1 char long',  //builtin should be small letter
      maxlength: 'Title can not be more than 10 char long'
    },
    code: {
      required: 'Code is required',
      minlength: 'Code can not be less than 1 char long',  //builtin should be small letter
      maxlength: 'Code can not be more than 10 char long'
    },
    price: {
      required: 'Price is required',
      minlength: 'Price can not be less than 2 char long',  //builtin should be small letter
      maxlength: 'Price can not be more than 4 char long'
    },
    salePrice: {
      required: 'Sale price is required',
      minlength: 'Sale price can not be less than 1 char long',  //builtin should be small letter
      maxlength: 'Sale price can not be more than 4 char long'
    },
    discount: {
      required: 'Discount is required',
      minlength: 'Discount can not be less than 1 char long',  //builtin should be small letter
      maxlength: 'Discount can not be more than 4 char long'
    },
    sizeId: {
      required: 'Size is required',
    },
    colorId: {
      required: 'Color is required',
    },
    tagId: {
      required: 'Tag is required',
    },
    categoryId: {
      required: 'Category is required',
    },
  }

  constructor(
    private route: ActivatedRoute,
    private _httpservice: HttpService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private router: Router
  ) {
    this.route.queryParams.subscribe(param => {
      this.productId = param['productId']
    })
  }

  ngOnInit(): void {
    this.setFormState();
    this.getCategories();
    this.getTags();
    this.getSizes();
    this.getColors();

    if (this.productId && this.productId != null && this.productId > 0) {
      this.buttonText = "Update";
      this.dbops = DbOperation.update;
      this.getProductById(this.productId);
    }
  }


  setFormState() {
    this.buttonText = 'Add';
    this.dbops = DbOperation.create;
    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(5),
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
      ])],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      tagId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''], //we will set one default value 1 so no need validation
      isSale: [false],
      isNew: [false],
      shortDetails: [''],
      description: ['']
    })

    this.addForm.valueChanges.subscribe(() => { //this method set for validate once value change it will check and display if any err
      this.onValueChanges();
    })
    this.addForm.get('quantity').setValue(this.counter);
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

  getProductById(id: number) {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/ProductMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);

        this.counter = res.data.quantity;
        this.addForm.get('isSale').setValue(res.data.isSale === 1 ? true : false); //here by default we receve from api 0 and 1 but we want true or false so we made this one.
        this.addForm.get('isNew').setValue(res.data.isNew === 1 ? true : false);

        this._httpservice.get(environment.BASE_API_PATH + "/ProductMaster/GetProductPicturebyId/" + id).subscribe(res => {
          if (res.isSuccess && res.data.length > 0) {
            this.images = [
              { img: res.data[0].name != null ? environment.BASE_IMAGES_PATH + res.data[0].name : "assets/image/noimage.png" },
              { img: res.data[1].name != null ? environment.BASE_IMAGES_PATH + res.data[1].name : "assets/image/noimage.png" },
              { img: res.data[2].name != null ? environment.BASE_IMAGES_PATH + res.data[2].name : "assets/image/noimage.png" },
              { img: res.data[3].name != null ? environment.BASE_IMAGES_PATH + res.data[3].name : "assets/image/noimage.png" },
              { img: res.data[4].name != null ? environment.BASE_IMAGES_PATH + res.data[4].name : "assets/image/noimage.png" },
            ]
          } else {
            this._toastr.error(res.errors[0], "Add User")
          }
        })


      } else {
        this._toastr.error(res.errors[0], "Add User")
      }
    })
  }

  getSizes() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product")
      }
    })
  }
  getTags() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product")
      }
    })
  }
  getColors() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product")
      }
    })
  }
  getCategories() {
    // debugger;
    this._httpservice.get(environment.BASE_API_PATH + "/Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product")
      }
    })
  }

  get ctrl() {
    return this.addForm.controls;
  }

  upload(files: any, i: number) {
    if (files.length == 0) {
      return;
    }
    let type = files[0].type; //to check is is it files or not and it is defult at 0 index
    if (type.match(/image\/*/) == null) {
      this._toastr.error('Please upload a valid image', 'Add Product');
      this.elfile.nativeElement.value = ''; //set empty the value of file to display noimage in case wrong image anyone inputed.
      this.bigImage = 'assets/image/noimage.png'
    }
    this.fileToUpload[i] = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.images[i].img = reader.result.toString();
      this.bigImage = reader.result.toString();
    }
  }

  increment() { //for increament 
    this.counter = this.counter + 1;
    this.addForm.get('quantity').setValue(this.counter);
  }
  decrement() { //for decrement 
    if (this.counter > 1) {
      this.counter = this.counter - 1;
      this.addForm.get('quantity').setValue(this.counter);
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0, //this one default we need to set
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      colorId: '',
      categoryId: '',
      tagId: '',
      quantity: 0,
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });
    this.buttonText = "Update";
    this.dbops = DbOperation.update;

    this.bigImage = 'assets/image/product-noimage.jpg';
    this.images = [
      { img: "assets/image/noimage.png" },
      { img: "assets/image/noimage.png" },
      { img: "assets/image/noimage.png" },
      { img: "assets/image/noimage.png" },
      { img: "assets/image/noimage.png" },
    ]

    this.fileToUpload = [];
    this.counter = 1;
    this.router.navigate(['products/manage/product-list']);
  }

  Submit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    if (this.dbops === DbOperation.create && this.fileToUpload.length < 5) { //this is used for the validation image
      this._toastr.error('Please upload 5 image per Product', 'Add product');
      return;
    }
    else if (this.dbops === DbOperation.update && this.fileToUpload.length > 0 && this.fileToUpload.length < 5) {
      this._toastr.error('Please upload 5 image per Product', 'Add product');
      return;
    }

    const formData = new FormData(); //to send file this need to be done and below addForm we will change as formData and formData details we can not see in console.
    formData.append("Id", this.addForm.value.id);
    formData.append("Name", this.addForm.value.name);
    formData.append("Title", this.addForm.value.title);
    formData.append("Code", this.addForm.value.code);
    formData.append("Price", this.addForm.value.price);
    formData.append("SalePrice", this.addForm.value.salePrice);
    formData.append("Discount", this.addForm.value.discount);
    formData.append("Quantity", this.addForm.value.quantity);
    formData.append("IsSale", this.addForm.value.isSale);
    formData.append("IsNew", this.addForm.value.isNew);
    formData.append("SizeId", this.addForm.value.sizeId);
    formData.append("TagId", this.addForm.value.tagId);
    formData.append("ColorId", this.addForm.value.colorId);
    formData.append("CategoryId", this.addForm.value.categoryId);
    formData.append("ShortDetails", this.addForm.value.shortDetails);
    formData.append("Description", this.addForm.value.description);

    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        // formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name); //if we will use this one then for all image same image will update for that we will create one variable
        let toUpload = this.fileToUpload[i];
        formData.append("Image", toUpload, toUpload.name);
      }
    }



    switch (this.dbops) {
      case DbOperation.create:
        this._httpservice.postImage(environment.BASE_API_PATH + "/ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success('data saved successfully', "Add Product");
            this.cancelForm();
          }
          else {
            this._toastr.error(res.errors[0], "Add Product")
          }
        })
        break;
      case DbOperation.update:
        this._httpservice.postImage(environment.BASE_API_PATH + "/ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success('data updated successfully', "Add Product");
            this.cancelForm();
          }
          else {
            this._toastr.error(res.errors[0], "Add Product")
          }
        })
        break;
    }

  }

  ngOnDestroy() {
    this.objSizes = [];
    this.objColors = [];
    this.objTags = [];
    this.objCategories = [];
    this.fileToUpload = [];
  }
}
