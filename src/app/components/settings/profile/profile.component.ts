import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userImage: string = "assets/image/user.png";
  fullName: string = "";
  emailId: string = "";
  firstName: string = "";
  lastName: string = "";
  userDetails: any;

  addedImagePath: string = "assets/image/noimage.png";
  fileToUpload: any;
  @ViewChild('file') elfile: ElementRef;

  constructor(
    private _httpservice: HttpService,
    private _toastr: ToastrService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImage = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null) ? "assets/image/user.png" :
      environment.BASE_IMAGES_PATH + this.userDetails.imagePath;
    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.emailId = this.userDetails.emailId;
    this.fullName = `${this.userDetails.firstName} ${this.userDetails.lastName}`

  }

  ngAfterViewInit(){
    console.log(this.elfile.nativeElement);
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

  changePic() {
    if (!this.fileToUpload) {
      this._toastr.error("please upload an image", "Profile Image")
      return;
    }

    const formData = new FormData(); //to send file this need to be done and below addForm we will change as formData and formData details we can not see in console.
    formData.append("Id", this.userDetails.id);
    formData.append("Image", this.fileToUpload, this.fileToUpload.name);

    this._httpservice.postImage(environment.BASE_API_PATH + "/UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success('Profile image updated successfully', "Profile Master");
        this.elfile.nativeElement.value = "";
        this.addedImagePath = "assets/image/noimage.png";
        this.fileToUpload = null;

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Are you want to see this changes rightnow?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Rightnow',
          cancelButtonText: 'No, keepit',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/auth/login'])
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
      else {
        this._toastr.error(res.errors[0], "Profile Master")
      }
    })

  }
  tabChange(event: any) {
    this.elfile.nativeElement.value = "";
    this.addedImagePath = "assets/image/noimage.png";
    this.fileToUpload = null;
  }

}
