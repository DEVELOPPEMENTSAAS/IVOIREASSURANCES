import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'access_token';
 
    constructor(private router: Router) {}

  isLoggedIn(): boolean {
    // Vérifie si un token existe en sessionStorage (ou en mémoire)
    const token = sessionStorage.getItem(this.tokenKey);
    return !!token;
  }

  login(username: string, password: string): boolean {
    // Valeurs en dur
    if (username === 'Bolaty Euloge' && password === '123') {
      sessionStorage.setItem('access_token', '1234567890'); // stockage simple
      localStorage.setItem('token', 'fake-jwt-token'); // stockage simple
      window.location.href = '/core/dashboard'; // redirection
      //this.router.navigate(['/dashboard']); // redirection
      return true;
    }
    return false;
  }
  forgotPasswordroute(fullName: string): void {
    // Redirection vers la page de réinitialisation du mot de passe
    this.router.navigate(['/auth/verify-email']);
  }
  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

   // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // (Optionnel) Méthode pour stocker le token après login
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }
}