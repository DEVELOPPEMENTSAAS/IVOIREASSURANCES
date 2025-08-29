// Guard pour empêcher l'accès aux routes d'auth si déjà connecté
import { CanActivateChild } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivateChild(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      // Redirige vers le dashboard si déjà connecté
      return this.router.createUrlTree(['core/dashboard']);
    }
    return true;
  }


  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Redirection vers la page de login si l'utilisateur n'est pas connecté
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}

