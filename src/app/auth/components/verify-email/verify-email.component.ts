import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {
token: string = '';
  isVerifying: boolean = false;
  isVerified: boolean = false;
  verificationFailed: boolean = false;
  isVerifyingEmail: boolean = true;
  email: string = '';
  FormEmail: string = '';

 // email: string = '';
  isLoading: boolean = false;
  isEmailSent: boolean = false;
  Verificationducode: boolean = false
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

    onSubmit() {
    if (this.email) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.isEmailSent = true;
        //this.isVerifyingEmail = false
        this.Verificationducode = true
      }, 2000);
    }
  }

  
  ngOnInit() {
    
  }

  

  onContinueToLogin() {
   // this.router.navigate(['/auth/VerificationOtp']);
    window.location.href = '/auth/VerificationOtp';
  }

 

  
}
