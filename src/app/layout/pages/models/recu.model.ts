export interface RecuCaisse {
  id?: number;
  numeroPiece: string;
  dateOperation: string;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  montant: number;
  typeOperation: 'encaissement' | 'decaissement' | 'virement';
  modeReglement: 'especes' | 'cheque' | 'virement' | 'carte';
  numeroRecu: string;
  description: string;
  statut: 'valide' | 'extourne' | 'annule';
  dateCreation: Date;
  utilisateur: string;
  numeroCompte?: string;
  referenceExterne?: string;
}

export interface OperationExtourne {
  id?: number;
  recuOriginalId: number;
  numeroPieceOriginal: string;
  motifExtourne: string;
  dateExtourne: string;
  utilisateurExtourne: string;
  montantExtourne: number;
  nouveauRecu?: RecuCaisse;
}

export interface RecuSearchFilters {
  numeroPiece?: string;
  dateOperation?: string;
  clientNom?: string;
  typeOperation?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  page: number;
  size: number;
}