import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { isUndefined } from "util";
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot([{path:'', loadChildren: 'app/sign-up/sign-up.module#SignUpModule'}])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


export class AiroundProtocolBuilder {

  private constructor(){};

  static SGU(user: {birthdate: string, gender: string, id: string, password: string, firstname: string, lastname: string}): string {
    return new PROTO_FACTORY.PROTO_SGU(user.birthdate, user.gender, user.id, user.password, user.firstname, user.lastname).generate()
  }
}

declare global {
  interface String {
    hexBitsLength(): string;
    toHex(): string;
  }
}

String.prototype.hexBitsLength = function (this: string){
  return (this.length*8).toString(16);
};

String.prototype.toHex = function (this: string){
  let result = '';
  for(let i=0; i<this.length; i++){
    result += this.charCodeAt(i).toString(16);
  }

  return result;
};

namespace PROTO_FACTORY {

  export class PROTO_SGU {
    body = new PROTO_BODY.SGU();

    constructor(birthdate: string, gender: string, id: string, password: string, firstname: string, lastname: string){
      this.body.birthdate = birthdate;
      this.body.gender = gender;
      this.body.tlv = new PROTO_BODY.SGU_TLV(id, password, firstname, lastname);
    }

    generate(): string{
      let header = new PROTO_HEADER({type: 1, length: this.body.value.length, eid: 302}).header
      let body = this.body.value;

      return '{'+header+', '+body+'}'
    }
  }

  namespace PROTO_BODY {

    export class SGU {
      readonly MAX_SIZE_BIRTHDATE = 32;

      private _birthdate_32: string;
      private _gender_8: string;
      private _tlv: SGU_TLV;

      set birthdate (date: string) {

        if(isUndefined( date )) throw 'Invalid input';

        let splitedDate = date.split( '/' );
        let sequenceDate = '';
        let numDate = -1;

        for( let fragment of splitedDate ) {
          sequenceDate += fragment;
        }

        try {
          numDate = Number( sequenceDate );
        } catch(e) {
          throw e;
        }

        if(numDate < 0 || numDate > 2 ** this.MAX_SIZE_BIRTHDATE) {
          throw new RangeError();
        }
        this._birthdate_32 = sequenceDate;
      }

      get birthdate () {
        if(isUndefined( this._birthdate_32 )) throw 'Empty value';
        return this._birthdate_32;
      }

      set gender (gender: string) {
        if(gender.toLowerCase() === 'male') {
          this._gender_8 = 'm';
        } else if(gender.toLowerCase() === 'female') {
          this._gender_8 = 'f';
        } else if(gender.toLowerCase() === 'other') {
          this._gender_8 = 'o';
        } else {
          throw 'invalid input'
        }
      }

      get gender () {
        if(isUndefined( this._gender_8 )) throw 'Empty value';
        return this._gender_8;
      }

      set tlv (tlv: SGU_TLV) {
        this._tlv = tlv;
      }

      get tlv () {
        if(isUndefined( this._tlv )) throw 'Empty value';
        return this._tlv;
      }

      get value () {
        return '"body": {' +
          '"birthdate": ' + '"'+this.birthdate +'"'+
          ', "gender": ' + '"' + this.gender + '"' +
          ', "tlv": ' + '"'+this.tlv.value +'"'
          + '}'
      }
    }

    export class SGU_TLV {
      private readonly _id_type: string = '01';
      private _id: string;
      private _id_length: string;

      private readonly _password_type: string = '02';
      private _password: string;
      private _password_length: string;

      private readonly _firstname_type: string = '03';
      private _firstname: string;
      private _firstname_length: string;

      private readonly _lastname_type: string = '04';
      private _lastname: string;
      private _lastname_length: string;

      constructor (id: string, password: string, firstname: string, lastname: string) {
        this.id = id;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
      }

      set id (id: string) {
        this._id_length = id.hexBitsLength();
        this._id = id.toHex();
      }

      set password (password: string) {
        this._password_length = password.hexBitsLength();
        this._password = password.toHex();
      }

      set firstname (firstname: string) {
        this._firstname_length = firstname.hexBitsLength();
        this._firstname = firstname.toHex();
      }

      set lastname (lastname: string) {
        this._lastname_length = lastname.hexBitsLength();
        this._lastname = lastname.toHex();
      }

      get value () {
        return this._id_type + this._id_length + this._id
          + this._password_type + this._password_length + this._password
          + this._firstname_type + this._firstname_length + this._firstname
          + this._lastname_type + this._lastname_length + this._lastname;
      }
    }

  }

  class PROTO_HEADER {
    field1 = '"msg_type"';
    field2 = '"msg_length"';
    field3 = '"endpoint_id"';

    delimeter = ' : ';
    seperator = ', ';

    private _type_8: number = -1;
    private _length_16: number = -1;
    private _eid_24: number = -1;

    constructor (config: { type: number, length: number, eid: number }) {
      this._type_8 = config.type;
      this._length_16 = config.length;
      this._eid_24 = config.eid;
    }

    get header () {
      try {
        if(this._type_8 * this._length_16 * this._eid_24 < 0) throw new RangeError();

        let builtHeader = '"header": {';
        builtHeader += this.field1 + this.delimeter + this._type_8 + this.seperator;
        builtHeader += this.field2 + this.delimeter + this._length_16 + this.seperator;
        builtHeader += this.field3 + this.delimeter + this._eid_24;
        builtHeader += '}';

        return builtHeader

      } catch(e) {
        if(e instanceof RangeError) {
          console.log( 'Invalid value' );
        } else {
          console.log( 'Unexpected error' );
        }
        return '';
      }
    }
  }
}
