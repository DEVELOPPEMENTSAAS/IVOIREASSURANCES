import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { RecuCaisse, OperationExtourne, RecuSearchFilters } from '../models/recu.model';

@Injectable({
  providedIn: 'root'
})
export class RecuService {
  private recus: RecuCaisse[] = [
    {
      id: 1,
      numeroPiece: 'RC-2024-001',
      dateOperation: '2024-01-15',
      clientId: 1,
      clientNom: 'Dupont',
      clientPrenom: 'Jean',
      montant: 1200.00,
      typeOperation: 'encaissement',
      modeReglement: 'cheque',
      numeroRecu: 'REC-001-2024',
      description: 'Paiement prime assurance automobile',
      statut: 'valide',
      dateCreation: new Date('2024-01-15T10:30:00'),
      utilisateur: 'Marie Dubois',
      numeroCompte: 'CHQ-789456123'
    },
    {
      id: 2,
      numeroPiece: 'RC-2024-002',
      dateOperation: '2024-01-16',
      clientId: 2,
      clientNom: 'Martin',
      clientPrenom: 'Sophie',
      montant: 800.00,
      typeOperation: 'encaissement',
      modeReglement: 'virement',
      numeroRecu: 'REC-002-2024',
      description: 'Paiement prime assurance habitation',
      statut: 'valide',
      dateCreation: new Date('2024-01-16T14:15:00'),
      utilisateur: 'Pierre Leroy',
      referenceExterne: 'VIR-2024-0156'
    },
    {
      id: 3,
      numeroPiece: 'RC-2024-003',
      dateOperation: '2024-01-17',
      clientId: 3,
      clientNom: 'Bernard',
      clientPrenom: 'Pierre',
      montant: 450.00,
      typeOperation: 'decaissement',
      modeReglement: 'especes',
      numeroRecu: 'REC-003-2024',
      description: 'Remboursement sinistre automobile',
      statut: 'extourne',
      dateCreation: new Date('2024-01-17T09:45:00'),
      utilisateur: 'Marie Dubois'
    }
  ];

  private extournes: OperationExtourne[] = [
    {
      id: 1,
      recuOriginalId: 3,
      numeroPieceOriginal: 'RC-2024-003',
      motifExtourne: 'Erreur de montant - correction nécessaire',
      dateExtourne: '2024-01-18',
      utilisateurExtourne: 'Marie Dubois',
      montantExtourne: 450.00
    }
  ];

  private nextRecuId = 4;
  private nextExtourneId = 2;

  getRecuByPiece(numeroPiece: string, dateOperation?: string): Observable<RecuCaisse | null> {
    let recu = this.recus.find(r => r.numeroPiece === numeroPiece);
    
    if (recu && dateOperation) {
      // Vérifier aussi la date si fournie
      if (recu.dateOperation !== dateOperation) {
        recu = undefined;
      }
    }
    
    return of(recu || null).pipe(delay(500));
  }

  getRecus(filters: RecuSearchFilters): Observable<{recus: RecuCaisse[], total: number}> {
    let filteredRecus = [...this.recus];

    if (filters.numeroPiece) {
      filteredRecus = filteredRecus.filter(r => 
        r.numeroPiece.toLowerCase().includes(filters.numeroPiece!.toLowerCase())
      );
    }

    if (filters.dateOperation) {
      filteredRecus = filteredRecus.filter(r => r.dateOperation === filters.dateOperation);
    }

    if (filters.clientNom) {
      filteredRecus = filteredRecus.filter(r => 
        r.clientNom.toLowerCase().includes(filters.clientNom!.toLowerCase()) ||
        r.clientPrenom.toLowerCase().includes(filters.clientNom!.toLowerCase())
      );
    }

    if (filters.typeOperation) {
      filteredRecus = filteredRecus.filter(r => r.typeOperation === filters.typeOperation);
    }

    if (filters.statut) {
      filteredRecus = filteredRecus.filter(r => r.statut === filters.statut);
    }

    const total = filteredRecus.length;
    const startIndex = (filters.page - 1) * filters.size;
    const endIndex = startIndex + filters.size;
    const recus = filteredRecus.slice(startIndex, endIndex);

    return of({ recus, total }).pipe(delay(300));
  }

  extournerRecu(recuId: number, motif: string): Observable<OperationExtourne> {
    const recu = this.recus.find(r => r.id === recuId);
    if (!recu) {
      throw new Error('Reçu non trouvé');
    }

    if (recu.statut === 'extourne') {
      throw new Error('Ce reçu a déjà été extourné');
    }

    // Marquer le reçu comme extourné
    recu.statut = 'extourne';

    // Créer l'opération d'extourne
    const extourne: OperationExtourne = {
      id: this.nextExtourneId++,
      recuOriginalId: recuId,
      numeroPieceOriginal: recu.numeroPiece,
      motifExtourne: motif,
      dateExtourne: new Date().toISOString().split('T')[0],
      utilisateurExtourne: 'Utilisateur Actuel', // À remplacer par l'utilisateur connecté
      montantExtourne: recu.montant
    };

    this.extournes.push(extourne);

    return of(extourne).pipe(delay(500));
  }

  getExtournes(): Observable<OperationExtourne[]> {
    return of([...this.extournes]).pipe(delay(300));
  }

  generateRecuPDF(recu: RecuCaisse): Observable<Blob> {
    // Simulation de génération PDF
    const pdfContent = this.generatePDFContent(recu);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return of(blob).pipe(delay(1000));
  }

  private generatePDFContent(recu: RecuCaisse): string {
    // Simulation du contenu PDF
    return `
      REÇU DE CAISSE
      
      Numéro: ${recu.numeroRecu}
      Date: ${recu.dateOperation}
      
      Client: ${recu.clientPrenom} ${recu.clientNom}
      Montant: ${recu.montant}€
      Mode: ${recu.modeReglement}
      
      Description: ${recu.description}
    `;
  }
}