export interface ContratAssurance {
  id?: number;
  numero: string;
  clientId: number;
  client?: string;
  typeAssurance: 'auto' | 'habitation' | 'sante' | 'vie' | 'professionnelle';
  dateDebut: string;
  dateFin: string;
  montantPrime: number;
  franchise: number;
  statut: 'actif' | 'suspendu' | 'expire' | 'annule';
  description: string;
  conditions: string;
  document?: File;
  documentUrl?: string;
  dateCreation: Date;
}

export interface ContratSearchFilters {
  search: string;
  typeAssurance?: string;
  statut?: string;
  page: number;
  size: number;
}