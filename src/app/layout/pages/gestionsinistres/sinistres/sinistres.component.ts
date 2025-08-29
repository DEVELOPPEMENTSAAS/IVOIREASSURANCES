import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SinistreService } from '../../services/sinistre.service';
import { ClientService } from '../../services/client.service';
import { ContratService } from '../../services/contrat.service';
import { Sinistre, SinistreSearchFilters, Expert } from '../../models/sinistre.model';
import { Client } from '../../models/client.model';
import { ContratAssurance } from '../../models/contrat.model';

@Component({
  selector: 'app-sinistres',
  templateUrl: './sinistres.component.html',
  styleUrls: ['./sinistres.component.scss']
})
export class SinistresComponent {
sinistres: Sinistre[] = [];
  clients: Client[] = [];
  contrats: ContratAssurance[] = [];
  contratsClient: ContratAssurance[] = [];
  experts: Expert[] = [];
  loading = false;
  submitting = false;
  
  // Modals
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  showStatutModal = false;
  selectedSinistre: Sinistre | null = null;
  editingSinistre: Sinistre | null = null;

  // Changement de statut
  nouveauStatut = '';
  commentaireStatut = '';
  expertSelectionne = '';

  // Pagination
  totalSinistres = 0;
  totalPages = 1;

  // Filtres
  filters: SinistreSearchFilters = {
    search: '',
    statut: '',
    typeSinistre: '',
    priorite: '',
    page: 1,
    size: 10
  };

  // Formulaire
  sinistreForm: any = {
    clientId: '',
    contratId: '',
    dateSinistre: '',
    dateDeclaration: new Date().toISOString().split('T')[0],
    typeSinistre: 'auto',
    natureSinistre: '',
    description: '',
    lieuSinistre: '',
    circonstances: '',
    montantEstime: 0,
    franchise: 0,
    priorite: 'normale',
    statut: 'enregistre',
    utilisateurCreation: 'Utilisateur Actuel'
  };

  private searchTimeout: any;

  constructor(
    private sinistreService: SinistreService,
    private clientService: ClientService,
    private contratService: ContratService
  ) {}

  ngOnInit() {
    this.loadSinistres();
    this.loadExperts();
  }

  loadSinistres() {
    this.loading = true;
    this.sinistreService.getSinistres(this.filters).subscribe({
      next: (result) => {
        this.sinistres = result.sinistres;
        this.totalSinistres = result.total;
        this.totalPages = Math.ceil(this.totalSinistres / this.filters.size);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sinistres:', error);
        this.loading = false;
      }
    });
  }

  loadClients() {
    this.clientService.getClients({ search: '', page: 1, size: 100 }).subscribe({
      next: (result) => {
        this.clients = result.clients;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }

  loadContrats() {
    this.contratService.getContrats({ search: '', page: 1, size: 100 }).subscribe({
      next: (result) => {
        this.contrats = result.contrats;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contrats:', error);
      }
    });
  }

  loadExperts() {
    this.sinistreService.getExperts().subscribe({
      next: (experts) => {
        this.experts = experts;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des experts:', error);
      }
    });
  }

  onClientChange() {
    // Filtrer les contrats du client sélectionné
    this.contratsClient = this.contrats.filter(c => c.clientId == this.sinistreForm.clientId);
    this.sinistreForm.contratId = '';
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadSinistres();
    }, 500);
  }

  changePage(page: number) {
    this.filters.page = page;
    this.loadSinistres();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxPages = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.filters.page - Math.floor(maxPages / 2));
    
    for (let i = 0; i < maxPages; i++) {
      const page = startPage + i;
      if (page <= this.totalPages) {
        pages.push(page);
      }
    }
    return pages;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'auto': 'Automobile',
      'habitation': 'Habitation',
      'sante': 'Santé',
      'vie': 'Vie',
      'professionnelle': 'Professionnelle'
    };
    return labels[type] || type;
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'enregistre': 'Enregistré',
      'transmis': 'Transmis',
      'valide': 'Validé',
      'regle': 'Réglé',
      'cloture': 'Clôturé',
      'rejete': 'Rejeté'
    };
    return labels[statut] || statut;
  }

  getStatutsDisponibles(statutActuel: string): {value: string, label: string}[] {
    const transitions: { [key: string]: {value: string, label: string}[] } = {
      'enregistre': [
        { value: 'transmis', label: 'Transmettre' },
        { value: 'rejete', label: 'Rejeter' }
      ],
      'transmis': [
        { value: 'valide', label: 'Valider' },
        { value: 'rejete', label: 'Rejeter' }
      ],
      'valide': [
        { value: 'regle', label: 'Régler' },
        { value: 'rejete', label: 'Rejeter' }
      ],
      'regle': [
        { value: 'cloture', label: 'Clôturer' }
      ],
      'rejete': [],
      'cloture': []
    };
    return transitions[statutActuel] || [];
  }

  viewSinistre(sinistre: Sinistre) {
    this.selectedSinistre = sinistre;
    this.showViewModal = true;
  }

  editSinistre(sinistre: Sinistre) {
    this.editingSinistre = sinistre;
    this.sinistreForm = { ...sinistre };
    this.loadClients();
    this.loadContrats();
    this.onClientChange();
    this.showEditModal = true;
  }

  changerStatutSinistre(sinistre: Sinistre) {
    this.selectedSinistre = sinistre;
    this.nouveauStatut = '';
    this.commentaireStatut = '';
    this.expertSelectionne = '';
    this.showStatutModal = true;
  }

  confirmerChangementStatut() {
    if (!this.selectedSinistre || !this.nouveauStatut) return;

    this.submitting = true;

    // Si on valide et qu'un expert est sélectionné, l'assigner d'abord
    if (this.nouveauStatut === 'valide' && this.expertSelectionne) {
      this.sinistreService.assignerExpert(this.selectedSinistre.id!, parseInt(this.expertSelectionne)).subscribe({
        next: () => {
          this.changerStatutFinal();
        },
        error: (error) => {
          console.error('Erreur lors de l\'assignation de l\'expert:', error);
          this.submitting = false;
        }
      });
    } else {
      this.changerStatutFinal();
    }
  }

  private changerStatutFinal() {
    this.sinistreService.changerStatut(
      this.selectedSinistre!.id!, 
      this.nouveauStatut, 
      this.commentaireStatut
    ).subscribe({
      next: () => {
        this.loadSinistres();
        this.closeModals();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut:', error);
        alert('Erreur: ' + error.message);
        this.submitting = false;
      }
    });
  }

  submitSinistreForm() {
    this.submitting = true;
    
    // Ajouter les informations du client et contrat sélectionnés
    const selectedClient = this.clients.find(c => c.id == this.sinistreForm.clientId);
    const selectedContrat = this.contrats.find(c => c.id == this.sinistreForm.contratId);
    
    if (selectedClient) {
      this.sinistreForm.clientNom = selectedClient.nom;
      this.sinistreForm.clientPrenom = selectedClient.prenom;
    }
    
    if (selectedContrat) {
      this.sinistreForm.numeroContrat = selectedContrat.numero;
      this.sinistreForm.typeSinistre = selectedContrat.typeAssurance;
    }

    if (this.editingSinistre) {
      // Modification
      this.sinistreService.updateSinistre(this.editingSinistre.id!, this.sinistreForm).subscribe({
        next: () => {
          this.loadSinistres();
          this.closeModals();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.submitting = false;
        }
      });
    } else {
      // Création
      this.sinistreService.createSinistre(this.sinistreForm).subscribe({
        next: () => {
          this.loadSinistres();
          this.closeModals();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.submitting = false;
        }
      });
    }
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
    this.showStatutModal = false;
    this.selectedSinistre = null;
    this.editingSinistre = null;
    this.nouveauStatut = '';
    this.commentaireStatut = '';
    this.expertSelectionne = '';
    this.resetForm();
  }

  resetForm() {
    this.sinistreForm = {
      clientId: '',
      contratId: '',
      dateSinistre: '',
      dateDeclaration: new Date().toISOString().split('T')[0],
      typeSinistre: 'auto',
      natureSinistre: '',
      description: '',
      lieuSinistre: '',
      circonstances: '',
      montantEstime: 0,
      franchise: 0,
      priorite: 'normale',
      statut: 'enregistre',
      utilisateurCreation: 'Utilisateur Actuel'
    };
    this.contratsClient = [];
  }
}