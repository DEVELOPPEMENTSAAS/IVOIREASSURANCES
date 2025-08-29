import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private tenantKey = 'tenant_id';
  private tenantId: string | null = null;

  constructor() {
    // Si un tenant est déjà en sessionStorage, on le récupère au démarrage
    this.tenantId = sessionStorage.getItem(this.tenantKey);
  }

  setTenantId(id: string): void {
    this.tenantId = id;
    sessionStorage.setItem(this.tenantKey, id);
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  isTenantValid(): boolean {
    // Ici, tu pourrais ajouter une vérification API pour valider le tenant
    return !!this.tenantId;
  }

  clearTenant(): void {
    this.tenantId = null;
    sessionStorage.removeItem(this.tenantKey);
  }
}
