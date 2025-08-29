import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ContratAssurance, ContratSearchFilters } from '../models/contrat.model';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private contrats: ContratAssurance[] = [
    {
      id: 1,
      numero: 'AUTO-2024-001',
      clientId: 1,
      client: 'Jean Dupont',
      typeAssurance: 'auto',
      dateDebut: '2024-01-01',
      dateFin: '2024-12-31',
      montantPrime: 1200,
      franchise: 500,
      statut: 'actif',
      description: 'Assurance automobile tous risques',
      conditions: 'Couverture complète avec assistance 24h/24',
      dateCreation: new Date('2024-01-01')
    },
    {
      id: 2,
      numero: 'HAB-2024-002',
      clientId: 2,
      client: 'Sophie Martin',
      typeAssurance: 'habitation',
      dateDebut: '2024-02-01',
      dateFin: '2025-01-31',
      montantPrime: 800,
      franchise: 300,
      statut: 'actif',
      description: 'Assurance habitation multirisques',
      conditions: 'Protection contre incendie, dégâts des eaux, vol',
      dateCreation: new Date('2024-02-01')
    }
  ];

  private nextId = 3;

  getContrats(filters: ContratSearchFilters): Observable<{contrats: ContratAssurance[], total: number}> {
    let filteredContrats = [...this.contrats];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredContrats = filteredContrats.filter(contrat =>
        contrat.numero.toLowerCase().includes(search) ||
        contrat.client?.toLowerCase().includes(search) ||
        contrat.description.toLowerCase().includes(search)
      );
    }

    if (filters.typeAssurance) {
      filteredContrats = filteredContrats.filter(contrat => contrat.typeAssurance === filters.typeAssurance);
    }

    if (filters.statut) {
      filteredContrats = filteredContrats.filter(contrat => contrat.statut === filters.statut);
    }

    const total = filteredContrats.length;
    const startIndex = (filters.page - 1) * filters.size;
    const endIndex = startIndex + filters.size;
    const contrats = filteredContrats.slice(startIndex, endIndex);

    return of({ contrats, total }).pipe(delay(500));
  }

  getContrat(id: number): Observable<ContratAssurance | undefined> {
    return of(this.contrats.find(contrat => contrat.id === id)).pipe(delay(300));
  }

  createContrat(contrat: Omit<ContratAssurance, 'id' | 'dateCreation'>): Observable<ContratAssurance> {
    const newContrat: ContratAssurance = {
      ...contrat,
      id: this.nextId++,
      numero: this.generateContratNumber(contrat.typeAssurance),
      dateCreation: new Date()
    };
    this.contrats.push(newContrat);
    return of(newContrat).pipe(delay(500));
  }

  updateContrat(id: number, contrat: Partial<ContratAssurance>): Observable<ContratAssurance> {
    const index = this.contrats.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contrats[index] = { ...this.contrats[index], ...contrat };
      return of(this.contrats[index]).pipe(delay(500));
    }
    throw new Error('Contrat non trouvé');
  }

  deleteContrat(id: number): Observable<boolean> {
    const index = this.contrats.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contrats.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  private generateContratNumber(type: string): string {
    const prefix = type.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${number}`;
  }
}