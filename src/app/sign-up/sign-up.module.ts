import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule, MatCheckboxModule, MatIcon, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatRadioButton,
  MatRadioGroup,
  MatRadioModule, MatSpinner,
} from "@angular/material";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([{path:'', component: SignUpComponent}])
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule { }
