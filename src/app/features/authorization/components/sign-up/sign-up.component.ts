import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { emailPattern, passwordPattern, PasswordRulesStartValue, RouterLinks } from 'app/app.config';
import { PASSWORD_VALIDATION_RULES } from 'app/core/models/authorization.models';
import { InfoDialogComponent } from 'app/shared/components/modals/info-dialog/info-dialog.component';
import { validatePassword } from 'app/shared/utils';
import { Observable, take, tap } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [
    './sign-up.component.scss',
    '../../container/authorization.component.scss'
  ]
})


export class SignUpComponent implements OnInit {
readonly routerLinks: typeof RouterLinks = RouterLinks;
signUpForm!: FormGroup;
passwordTitle: string = 'Create a password';
isPasswordRulesValid: PASSWORD_VALIDATION_RULES = PasswordRulesStartValue;
passwordSubscription$!: Observable<string>;
  constructor(
    
    private fb: FormBuilder,
    private authService: AuthorizationService,
    private router: Router,
    private dialig: MatDialog

  ) { }

  get nickName(): FormControl{
    return this.signUpForm.get('nickName') as FormControl;
  }
  get email(): FormControl{
    return this.signUpForm.get('email') as FormControl;
  }
  get password(): FormControl{
    return this.signUpForm.get('password') as FormControl;
  }
  
  get checkbox(): FormControl{
    return this.signUpForm.get('checkbox') as FormControl;
  }

  get isEmailTouched(): boolean{
    return this.email.touched;
  }

  get isPasswordTouched(): boolean{
    return this.password.touched;
  }
  get isNameInvalid(): boolean{
    return this.nickName.touched  && this.nickName.invalid;
  }
  get isEmailInvalid(): boolean{
    return this.email.touched && this.email.invalid;
  }
  
  get isFormTouched(): boolean{
    return this.password.touched;
  }
  get isFormValid(): boolean{
    const isAllControlTouched = this.isPasswordTouched && this.nickName.touched && this.email.touched && this.checkbox.touched
    return !this.signUpForm.valid && isAllControlTouched;
  }
  get isPasswordValid(): boolean{
    return this.password.valid;
  }

  ngOnInit(): void {
    this.initForm();
    this.signUpForm.valueChanges.subscribe(value => console.log(value));
    this.checkPassword();
  }

  private checkPassword(): void{
    this.passwordSubscription$ = this.password.valueChanges.pipe(
      tap(value => this.isPasswordRulesValid = validatePassword(value)),
    );
  }

signUp(): void{
  if(this.signUpForm.valid){
    const requestBody = { ... this.signUpForm.value};
    delete requestBody.checkbox;
    this.authService.signUp(requestBody).pipe(
      take(1),
    ).subscribe(() => this.confirmModelCall());
  }
  else{
    this.signUpForm.markAllAsTouched();
  }
}


private confirmModelCall():void{
this.dialig.open(InfoDialogComponent,{
  hasBackdrop: false,
  data:{
    content: 'We successfully received your data and sent data for confirmation',
    description: 'Please go to your email to confirm your account',
    type: 'SUCCESS'
  }
}).afterClosed().pipe(
  take(1),
  tap(()=> this.router.navigate([RouterLinks.confirmRegistration]))
).subscribe()
}

private initForm(): void{
  this.signUpForm = this.fb.group({ 
    nickName: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.pattern(emailPattern)]],
    password: ['', [
    Validators.required,
    Validators.pattern(passwordPattern)]],
    checkbox:[false, Validators.requiredTrue]
  })
}
}
