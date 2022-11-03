import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatchValidator } from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../../shared/services/http.service'
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _httpService: HttpService,
    private _authservice: AuthService
  ) { }
  @ViewChild('nav') elnav: any; //to get the template variable to navigate to login page post registration register()

  ngOnInit(): void {
    this.setLoginForm();
    this.setRegisterForm();
  }

  setLoginForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  // setRegisterForm() {
  //   this.registerForm = this._fb.group({
  //     firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
  //     lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
  //     email: ['', Validators.compose([Validators.required, Validators.email])],
  //     userTypeId: [1],
  //     password: ['', Validators.compose([Validators.required])],
  //     confirmPassword: ['', Validators.required],
  //   },
  //     {
  //       validators: MustMatchValidator('password', 'confirmPassword')
  //     }
  //   )
  // }

  setRegisterForm() {
    this.registerForm = new FormGroup({ //setRegisterForm updated code for multiple validation
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      userTypeId: new FormControl(1),
      password: new FormControl('', Validators.compose([Validators.required])),
      confirmPassword: new FormControl('', Validators.required),
    },
      MustMatchValidator('password', 'confirmPassword')

    )
  }

  get ctrl() {
    return this.registerForm.controls;
  }

  login() {
    if (this.loginForm.get('userName').value === "") {
      this._toastr.error('username is required', "Login")
    } else if (this.loginForm.get('password').value === "") {
      this._toastr.error('Password is required', "Login")
    } else {
      if (this.loginForm.valid) {
        //call api
        this._httpService.post(environment.BASE_API_PATH + "/UserMaster/Login/", this.loginForm.value).subscribe(res => {
          console.log(res);
          if (res.isSuccess) {
            this._authservice.authLogin(res.data); // here we will send data to authLogin service
            this.loginForm.reset();
          } else {
            this._toastr.error(res.errors[0], "Login")
          }
        })
      }
    }

  }
  register(formData: FormGroup) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this._httpService.post(environment.BASE_API_PATH + "UserMaster/Save/", formData.value).subscribe(res => { //insted of this.registerForm.value we can use formData it is same
      if (res.isSuccess) {
        this._toastr.success("Registration successful", "Registration");
        this.registerForm.reset( //here we reset the filled value as blank
          {
            firstName: '',
            lastName: '',
            email: '',
            userTypeId: 1,
            password: '',
            confirmPassword: '',
          }
        )
        this.submitted = false; //else will get validation message multiple time
        this.elnav.select('logintab'); //post registration navigate to login nav
      } else {
        this._toastr.error(res.errors[0], "Registration")

      }
    })
  }
}
