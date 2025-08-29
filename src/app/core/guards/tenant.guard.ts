import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TenantService } from '../services/tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {

  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.tenantService.isTenantValid()) {
      return true;
    } else {
      // Redirection vers la page de login si le tenant est absent ou invalide
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
