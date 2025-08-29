import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
email: string = '';
  isLoading: boolean = false;
  isEmailSent: boolean = false;

   constructor(private router: Router) {}

  onSubmit() {
    if (this.email) {
      this.isLoading = true;
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.isEmailSent = true;
      }, 2000);
    }
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }

  onResendEmail() {
    this.onSubmit();
  }
}
