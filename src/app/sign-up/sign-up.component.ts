import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { ITlv, TlvType, TlvClass } from 'ber-tlv';
import { TlvFactory, IParseError } from 'ber-tlv';
import { AiroundProtocolBuilder } from "../app.module";
import { Router } from "@angular/router";


const SERVER_URL = 'http://127.0.0.1:4300/mock';

const FORM_CONTROLS_CONFIG = {
  firstname: new FormControl('', [
    Validators.required,
    Validators.minLength(2)
  ]),
  lastname: new FormControl('', [
    Validators.required,
    Validators.minLength(2)
  ]),
  email : new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  password: new FormControl('', [
    Validators.required,
    Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&].{8,}$')
  ]),
  passwordConfirm: new FormControl('', [
    Validators.required
  ]),
  gender: new FormControl('female', [
    Validators.required]),
  birthdate: new FormControl('', [
    Validators.required,
    Validators.pattern('^((((0[13578])|(1[02]))[\\/](([0-2][0-9])|(3[01])))|(((0[469])|([469])|(11))[\\/](([1-9])|([0-2][0-9])|(30)))|((2|02)[\\/](([1-9])|([0-2][0-9]))))[\\/]\\d{4}$|^\\d{4}$')
  ])
};

const FORM_CONTROLS_EXTRA_CONFIG = {
  validator: checkIfMatchingPasswords('password', 'passwordConfirm')
};

let headers = new HttpHeaders();
headers.append('Access-Control-Allow-Origin', '*');
headers.append("Access-Control-Allow-Headers", "X-Requested-With");
headers.append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent   {
  /**
   * Property to control the password visibility
   * @type {boolean}
   */
  hide = true;

  constructor(@Inject(FormBuilder)private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router) {
    this.router.navigate(['uvc']);
  }

  /**
   * Form contents validator
   * @type {FormGroup}
   */
  formGroup = this.formBuilder.group( FORM_CONTROLS_CONFIG, FORM_CONTROLS_EXTRA_CONFIG);

  /**
   * Callback: triggered when the submit button is clicked
   */
  onSubmit(){
    //console.log(this.formGroup.value);
    if(this.formGroup.status === 'VALID'){
      const result = this.formGroup.value;
      let user = {
        firstname: result.firstname,
        lastname: result.lastname,
        id: result.email,
        password: result.password,
        birthdate: result.birthdate,
        gender: result.gender
      };

      console.log(AiroundProtocolBuilder.SGU(user))
      console.dir(JSON.parse(AiroundProtocolBuilder.SGU(user)))

      this.router.navigate(['uvc']);

      this.http.post(SERVER_URL, AiroundProtocolBuilder.SGU(user), {
          // headers: headers,
          responseType: 'text'})
        .subscribe((res) => console.dir(res));
    }
  }
}

/**
 * Validator for checking whether typed password is correct or not
 * @param {string} passwordKey
 * @param {string} passwordConfirmationKey
 * @returns {(group: FormGroup) => (void | void)}
 */
function checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
    let passwordInput = group.controls[passwordKey],
      passwordConfirmInput = group.controls[passwordConfirmationKey];
    if (passwordInput.value !== passwordConfirmInput.value) {
      return passwordConfirmInput.setErrors({notEquivalent: true})
    }
    else {
      return passwordConfirmInput.setErrors(null);
    }
  }
}
