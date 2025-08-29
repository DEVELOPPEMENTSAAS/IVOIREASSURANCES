import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  isLoading: boolean = false;
  isPasswordReset: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  passwordStrength: {
    score: number;
    label: string;
    color: string;
  } = { score: 0, label: 'Faible', color: '#EF4444' };

  constructor(private router: Router) {}

  // Méthodes de validation
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password);
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.password);
  }

  onPasswordChange() {
    this.calculatePasswordStrength();
  }

  calculatePasswordStrength() {
    let score = 0;
    
    if (this.password.length >= 8) score++;
    if (this.hasLowerCase()) score++;
    if (this.hasUpperCase()) score++;
    if (this.hasNumber()) score++;
    if (this.hasSpecialChar()) score++;

    if (score <= 2) {
      this.passwordStrength = { score: score * 20, label: 'Faible', color: '#EF4444' };
    } else if (score <= 3) {
      this.passwordStrength = { score: score * 20, label: 'Moyen', color: '#F59E0B' };
    } else if (score <= 4) {
      this.passwordStrength = { score: score * 20, label: 'Bon', color: '#3B82F6' };
    } else {
      this.passwordStrength = { score: 100, label: 'Fort', color: '#10B981' };
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.length > 0;
  }

  get isFormValid(): boolean {
    return this.password.length >= 8 && 
           this.hasLowerCase() &&
           this.hasUpperCase() &&
           this.hasNumber() &&
           this.passwordsMatch;
  }

  onSubmit() {
    if (this.isFormValid) {
      this.isLoading = true;
      // Simulation d'appel API
      setTimeout(() => {
        this.isLoading = false;
        this.isPasswordReset = true;
      }, 2000);
    }
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}