export interface Sinistre {
  id?: number;
  numeroSinistre: string;
  contratId: number;
  numeroContrat?: string;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  dateSinistre: string;
  dateDeclaration: string;
  typeSinistre: 'auto' | 'habitation' | 'sante' | 'vie' | 'professionnelle';
  natureSinistre: string;
  description: string;
  lieuSinistre: string;
  circonstances: string;
  montantEstime: number;
  montantExpertise?: number;
  montantReglement?: number;
  franchise: number;
  statut: 'enregistre' | 'transmis' | 'valide' | 'regle' | 'cloture' | 'rejete';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  expertId?: number;
  expertNom?: string;
  rapportExpertise?: string;
  dateTransmission?: string;
  dateValidation?: string;
  dateReglement?: string;
  dateCloture?: string;
  motifRejet?: string;
  documentsJoints: DocumentSinistre[];
  historique: HistoriqueSinistre[];
  dateCreation: Date;
  utilisateurCreation: string;
}

export interface DocumentSinistre {
  id?: number;
  sinistreId: number;
  nom: string;
  type: 'constat' | 'facture' | 'photo' | 'rapport' | 'autre';
  url: string;
  dateUpload: Date;
  utilisateur: string;
}

export interface HistoriqueSinistre {
  id?: number;
  sinistreId: number;
  action: string;
  statut: string;
  commentaire?: string;
  utilisateur: string;
  date: Date;
}

export interface SinistreSearchFilters {
  search: string;
  statut?: string;
  typeSinistre?: string;
  priorite?: string;
  dateDebut?: string;
  dateFin?: string;
  page: number;
  size: number;
}

export interface Expert {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  telephone: string;
  email: string;
}