import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { TenantService } from '../services/tenant.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private tenantService: TenantService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clonedRequest = req;

    const token = this.authService.getToken();
    const tenantId = this.tenantService.getTenantId();

    const headers: { [key: string]: string } = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (tenantId) {
      headers['X-Tenant-ID'] = tenantId;
    }

    if (Object.keys(headers).length > 0) {
      clonedRequest = req.clone({
        setHeaders: headers
      });
    }

    return next.handle(clonedRequest);
  }
}
