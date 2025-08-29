import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  fullName: string = 'Bolaty Euloge';
  username: string = '123';
  tagline: string = '';
  email: string = 'bolatyeuloge11@gmail.com';
  isUsernameAvailable: boolean = true;
  errorMessage: string = '';
  
 constructor(private authService: AuthService) {}
  onContinue() {
    if (!this.authService.login(this.fullName, this.username)) {
      this.errorMessage = 'Identifiants incorrects';
    }
  }
  onForgotPassword(){
    this.authService.forgotPasswordroute(this.fullName);
  }
  onUsernameChange() {
    // Simulate username validation
    this.isUsernameAvailable = this.username.length > 3;
  }
}
