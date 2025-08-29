export type StatutContrat = 'Payé' | 'Non réglé';
export type ModeReglement = 'Espèces' | 'Wave' | 'Orange Money' | 'Moov Money' | 'MTN Money' | 'Virement Bancaire' | 'Chèque';

export interface ContratAssurance {
  id: string;
  numeroPiece: string;
  client: string;
  montantPrime: number;
  dateEffet: Date;
  statut: StatutContrat;
}

export interface Recu {
  numeroRecu: string;
  numeroPiece: string;
  dateOperation: Date;
  heure: string;
  client: string;
  montant: number;
  typeOperation: 'Encaissement' | 'Décaissement';
  modeReglement: ModeReglement;
  reference?: string;
  utilisateur: string;
}