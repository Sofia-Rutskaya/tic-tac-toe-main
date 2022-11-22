import { Component, OnInit } from '@angular/core';
import {
  RouterLinks
} from '../../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: [
    './sign-in.component.scss',
    '../../container/authorization.component.scss'
  ]
})
export class SignInComponent implements OnInit {
  readonly routerLinks: typeof RouterLinks = RouterLinks;
  passwordTitle:string = "Password";
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  get isResetPasswordPage(): boolean {
    return this.router.url.includes(RouterLinks.resetPass);
  }
}
