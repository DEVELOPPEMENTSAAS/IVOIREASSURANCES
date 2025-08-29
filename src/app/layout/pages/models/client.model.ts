export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance: string;
  cin: string;
  profession: string;
  statut: 'actif' | 'inactif';
  photo?: string; // URL de la photo
  dateCreation: Date;
  pieces?: PieceJointe[];
}

export interface PieceJointe {
  id?: number;
  clientId: number;
  nom: string;
  type: string;
  url: string;
  taille: number; // en bytes
  dateUpload: Date;
}

export interface ClientSearchFilters {
  search: string;
  statut?: 'actif' | 'inactif' | '';
  page: number;
  size: number;
}