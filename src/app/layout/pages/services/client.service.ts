import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Client, PieceJointe, ClientSearchFilters } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: Client[] = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@email.com',
      telephone: '+33 1 23 45 67 89',
      adresse: '123 rue de la Paix, 75001 Paris',
      dateNaissance: '1980-05-15',
      cin: 'AB123456',
      profession: 'Ingénieur',
      statut: 'actif',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      dateCreation: new Date('2023-01-15'),
      pieces: [
        {
          id: 1,
          clientId: 1,
          nom: 'Carte d\'identité',
          type: 'image/jpeg',
          url: '#',
          taille: 245760,
          dateUpload: new Date('2023-01-15')
        },
        {
          id: 2,
          clientId: 1,
          nom: 'Justificatif de domicile',
          type: 'application/pdf',
          url: '#',
          taille: 512000,
          dateUpload: new Date('2023-01-16')
        }
      ]
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@email.com',
      telephone: '+33 1 98 76 54 32',
      adresse: '456 avenue des Champs, 69000 Lyon',
      dateNaissance: '1975-12-03',
      cin: 'CD789012',
      profession: 'Médecin',
      statut: 'actif',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      dateCreation: new Date('2023-02-20'),
      pieces: [
        {
          id: 3,
          clientId: 2,
          nom: 'Passeport',
          type: 'image/jpeg',
          url: '#',
          taille: 189440,
          dateUpload: new Date('2023-02-20')
        }
      ]
    },
    {
      id: 3,
      nom: 'Bernard',
      prenom: 'Pierre',
      email: 'pierre.bernard@email.com',
      telephone: '+33 4 56 78 90 12',
      adresse: '789 boulevard du Midi, 13000 Marseille',
      dateNaissance: '1990-08-22',
      cin: 'EF345678',
      profession: 'Avocat',
      statut: 'inactif',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      dateCreation: new Date('2023-03-10'),
      pieces: []
    }
  ];

  private nextId = 4;
  private nextPieceId = 4;

  getClients(filters: ClientSearchFilters): Observable<{clients: Client[], total: number}> {
    let filteredClients = [...this.clients];

    // Filtrage par recherche
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredClients = filteredClients.filter(client =>
        client.nom.toLowerCase().includes(search) ||
        client.prenom.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.telephone.includes(search) ||
        client.cin.toLowerCase().includes(search)
      );
    }

    // Filtrage par statut
    if (filters.statut) {
      filteredClients = filteredClients.filter(client => client.statut === filters.statut);
    }

    const total = filteredClients.length;
    const startIndex = (filters.page - 1) * filters.size;
    const endIndex = startIndex + filters.size;
    const clients = filteredClients.slice(startIndex, endIndex);

    return of({ clients, total }).pipe(delay(500));
  }

  getClient(id: number): Observable<Client | undefined> {
    return of(this.clients.find(client => client.id === id)).pipe(delay(300));
  }

  createClient(client: Omit<Client, 'id' | 'dateCreation'>): Observable<Client> {
    const newClient: Client = {
      ...client,
      id: this.nextId++,
      dateCreation: new Date(),
      pieces: []
    };
    this.clients.push(newClient);
    return of(newClient).pipe(delay(800));
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...client };
      return of(this.clients[index]).pipe(delay(600));
    }
    throw new Error('Client non trouvé');
  }

  deleteClient(id: number): Observable<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  addPieceJointe(clientId: number, piece: Omit<PieceJointe, 'id' | 'clientId' | 'dateUpload'>): Observable<PieceJointe> {
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      const newPiece: PieceJointe = {
        ...piece,
        id: this.nextPieceId++,
        clientId,
        dateUpload: new Date()
      };
      if (!client.pieces) client.pieces = [];
      client.pieces.push(newPiece);
      return of(newPiece).pipe(delay(800));
    }
    throw new Error('Client non trouvé');
  }

  deletePieceJointe(clientId: number, pieceId: number): Observable<boolean> {
    const client = this.clients.find(c => c.id === clientId);
    if (client && client.pieces) {
      const index = client.pieces.findIndex(p => p.id === pieceId);
      if (index !== -1) {
        client.pieces.splice(index, 1);
        return of(true).pipe(delay(500));
      }
    }
    return of(false).pipe(delay(500));
  }

  uploadPhoto(file: File): Observable<string> {
    // Simulation d'upload de photo
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }).then(result => of(result).pipe(delay(1000))) as any;
  }
}