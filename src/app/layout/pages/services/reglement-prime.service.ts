import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ContratAssurance, Recu } from '../models/assurance.model';

@Injectable({
  providedIn: 'root'
})
export class ReglementPrimeService {

  private mockContrats: ContratAssurance[] = [
    {
      id: '1',
      numeroPiece: 'RC-2024-003',
      client: 'Pierre Bernard',
      montantPrime: 450.75,
      dateEffet: new Date('2024-01-15'),
      statut: 'Non réglé'
    },
    {
      id: '2',
      numeroPiece: 'RC-2024-004',
      client: 'Alice Martin',
      montantPrime: 1200.00,
      dateEffet: new Date('2024-02-01'),
      statut: 'Non réglé'
    }
  ];

  constructor() { }

  findContratByNumeroPiece(numeroPiece: string): Observable<ContratAssurance | null> {
    const contrat = this.mockContrats.find(c => c.numeroPiece.toLowerCase() === numeroPiece.toLowerCase());
    return of(contrat || null);
  }

  genererRecu(reglementData: { montant: number; modeReglement: any; reference?: string; contrat: ContratAssurance }): Observable<Recu> {
    const { contrat, montant, modeReglement, reference } = reglementData;
    const now = new Date();

    const recu: Recu = {
      numeroRecu: `REC-${now.getFullYear()}-00${Math.floor(Math.random() * 100) + 1}`,
      numeroPiece: contrat.numeroPiece,
      dateOperation: now,
      heure: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      client: contrat.client,
      montant: montant,
      typeOperation: 'Encaissement',
      modeReglement: modeReglement,
      reference: reference,
      utilisateur: 'Marie Dubois' // Utilisateur connecté simulé
    };

    // Mettre à jour le statut du contrat (simulation)
    const originalContrat = this.mockContrats.find(c => c.id === contrat.id);
    if (originalContrat) {
      originalContrat.statut = 'Payé';
    }

    return of(recu);
  }
}
