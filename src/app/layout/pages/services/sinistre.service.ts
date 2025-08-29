import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Sinistre, SinistreSearchFilters, DocumentSinistre, HistoriqueSinistre, Expert } from '../models/sinistre.model';

@Injectable({
  providedIn: 'root'
})
export class SinistreService {
  private sinistres: Sinistre[] = [
    {
      id: 1,
      numeroSinistre: 'SIN-2024-001',
      contratId: 1,
      numeroContrat: 'AUTO-2024-001',
      clientId: 1,
      clientNom: 'Dupont',
      clientPrenom: 'Jean',
      dateSinistre: '2024-01-10',
      dateDeclaration: '2024-01-12',
      typeSinistre: 'auto',
      natureSinistre: 'Collision',
      description: 'Accident de la circulation avec dégâts matériels',
      lieuSinistre: 'Avenue des Champs-Élysées, Paris',
      circonstances: 'Collision par l\'arrière lors d\'un freinage d\'urgence',
      montantEstime: 3500,
      montantExpertise: 3200,
      montantReglement: 2700,
      franchise: 500,
      statut: 'regle',
      priorite: 'normale',
      expertId: 1,
      expertNom: 'Martin Expertise',
      rapportExpertise: 'Dégâts conformes à la déclaration, réparation nécessaire',
      dateTransmission: '2024-01-13',
      dateValidation: '2024-01-15',
      dateReglement: '2024-01-20',
      documentsJoints: [],
      historique: [],
      dateCreation: new Date('2024-01-12T10:30:00'),
      utilisateurCreation: 'Marie Dubois'
    },
    {
      id: 2,
      numeroSinistre: 'SIN-2024-002',
      contratId: 2,
      numeroContrat: 'HAB-2024-002',
      clientId: 2,
      clientNom: 'Martin',
      clientPrenom: 'Sophie',
      dateSinistre: '2024-01-18',
      dateDeclaration: '2024-01-18',
      typeSinistre: 'habitation',
      natureSinistre: 'Dégât des eaux',
      description: 'Fuite de canalisation dans la salle de bain',
      lieuSinistre: '456 avenue des Champs, Lyon',
      circonstances: 'Rupture de canalisation encastrée, dégâts au sol et murs',
      montantEstime: 2800,
      franchise: 300,
      statut: 'transmis',
      priorite: 'haute',
      dateTransmission: '2024-01-19',
      documentsJoints: [],
      historique: [],
      dateCreation: new Date('2024-01-18T14:20:00'),
      utilisateurCreation: 'Pierre Leroy'
    }
  ];

  private experts: Expert[] = [
    { id: 1, nom: 'Martin', prenom: 'Pierre', specialite: 'Automobile', telephone: '01 23 45 67 89', email: 'p.martin@expertise.fr' },
    { id: 2, nom: 'Durand', prenom: 'Marie', specialite: 'Habitation', telephone: '01 98 76 54 32', email: 'm.durand@expertise.fr' },
    { id: 3, nom: 'Bernard', prenom: 'Paul', specialite: 'Professionnel', telephone: '01 45 67 89 12', email: 'p.bernard@expertise.fr' }
  ];

  private nextId = 3;

  getSinistres(filters: SinistreSearchFilters): Observable<{sinistres: Sinistre[], total: number}> {
    let filteredSinistres = [...this.sinistres];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredSinistres = filteredSinistres.filter(sinistre =>
        sinistre.numeroSinistre.toLowerCase().includes(search) ||
        sinistre.clientNom.toLowerCase().includes(search) ||
        sinistre.clientPrenom.toLowerCase().includes(search) ||
        sinistre.description.toLowerCase().includes(search) ||
        sinistre.lieuSinistre.toLowerCase().includes(search)
      );
    }

    if (filters.statut) {
      filteredSinistres = filteredSinistres.filter(sinistre => sinistre.statut === filters.statut);
    }

    if (filters.typeSinistre) {
      filteredSinistres = filteredSinistres.filter(sinistre => sinistre.typeSinistre === filters.typeSinistre);
    }

    if (filters.priorite) {
      filteredSinistres = filteredSinistres.filter(sinistre => sinistre.priorite === filters.priorite);
    }

    const total = filteredSinistres.length;
    const startIndex = (filters.page - 1) * filters.size;
    const endIndex = startIndex + filters.size;
    const sinistres = filteredSinistres.slice(startIndex, endIndex);

    return of({ sinistres, total }).pipe(delay(500));
  }

  getSinistre(id: number): Observable<Sinistre | undefined> {
    return of(this.sinistres.find(sinistre => sinistre.id === id)).pipe(delay(300));
  }

  createSinistre(sinistre: Omit<Sinistre, 'id' | 'numeroSinistre' | 'dateCreation' | 'historique' | 'documentsJoints'>): Observable<Sinistre> {
    const newSinistre: Sinistre = {
      ...sinistre,
      id: this.nextId++,
      numeroSinistre: this.generateSinistreNumber(),
      dateCreation: new Date(),
      historique: [{
        id: 1,
        sinistreId: this.nextId - 1,
        action: 'Création du sinistre',
        statut: 'enregistre',
        commentaire: 'Sinistre créé et enregistré dans le système',
        utilisateur: sinistre.utilisateurCreation,
        date: new Date()
      }],
      documentsJoints: []
    };
    this.sinistres.push(newSinistre);
    return of(newSinistre).pipe(delay(500));
  }

  updateSinistre(id: number, sinistre: Partial<Sinistre>): Observable<Sinistre> {
    const index = this.sinistres.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sinistres[index] = { ...this.sinistres[index], ...sinistre };
      return of(this.sinistres[index]).pipe(delay(500));
    }
    throw new Error('Sinistre non trouvé');
  }

  changerStatut(id: number, nouveauStatut: string, commentaire?: string): Observable<Sinistre> {
    const sinistre = this.sinistres.find(s => s.id === id);
    if (!sinistre) {
      throw new Error('Sinistre non trouvé');
    }

    // Validation des transitions de statut
    if (!this.isTransitionValide(sinistre.statut, nouveauStatut)) {
      throw new Error('Transition de statut non autorisée');
    }

    sinistre.statut = nouveauStatut as any;
    
    // Mettre à jour les dates selon le statut
    const now = new Date().toISOString().split('T')[0];
    switch (nouveauStatut) {
      case 'transmis':
        sinistre.dateTransmission = now;
        break;
      case 'valide':
        sinistre.dateValidation = now;
        break;
      case 'regle':
        sinistre.dateReglement = now;
        break;
      case 'cloture':
        sinistre.dateCloture = now;
        break;
    }

    // Ajouter à l'historique
    const nouvelleEntree: HistoriqueSinistre = {
      id: sinistre.historique.length + 1,
      sinistreId: id,
      action: `Changement de statut vers ${nouveauStatut}`,
      statut: nouveauStatut,
      commentaire: commentaire || '',
      utilisateur: 'Utilisateur Actuel',
      date: new Date()
    };
    sinistre.historique.push(nouvelleEntree);

    return of(sinistre).pipe(delay(500));
  }

  getExperts(): Observable<Expert[]> {
    return of([...this.experts]).pipe(delay(300));
  }

  assignerExpert(sinistreId: number, expertId: number): Observable<Sinistre> {
    const sinistre = this.sinistres.find(s => s.id === sinistreId);
    const expert = this.experts.find(e => e.id === expertId);
    
    if (!sinistre || !expert) {
      throw new Error('Sinistre ou expert non trouvé');
    }

    sinistre.expertId = expertId;
    sinistre.expertNom = `${expert.prenom} ${expert.nom}`;

    const nouvelleEntree: HistoriqueSinistre = {
      id: sinistre.historique.length + 1,
      sinistreId: sinistreId,
      action: 'Assignation d\'expert',
      statut: sinistre.statut,
      commentaire: `Expert assigné: ${expert.prenom} ${expert.nom}`,
      utilisateur: 'Utilisateur Actuel',
      date: new Date()
    };
    sinistre.historique.push(nouvelleEntree);

    return of(sinistre).pipe(delay(500));
  }

  private generateSinistreNumber(): string {
    const year = new Date().getFullYear();
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SIN-${year}-${number}`;
  }

  private isTransitionValide(statutActuel: string, nouveauStatut: string): boolean {
    const transitions: { [key: string]: string[] } = {
      'enregistre': ['transmis', 'rejete'],
      'transmis': ['valide', 'rejete'],
      'valide': ['regle', 'rejete'],
      'regle': ['cloture'],
      'rejete': [],
      'cloture': []
    };
    return transitions[statutActuel]?.includes(nouveauStatut) || false;
  }
}