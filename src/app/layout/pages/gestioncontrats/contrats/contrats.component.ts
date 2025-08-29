import { Component } from '@angular/core';
import { ContratService } from '../../services/contrat.service';
import { ContratAssurance, ContratSearchFilters } from '../../models/contrat.model';
@Component({
  selector: 'app-contrats',
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.scss']
})
export class ContratsComponent {
contrats: ContratAssurance[] = [];
  clients: any = [
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
      dateCreation: new Date('2023-01-15'),
      pieces: []
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
      dateCreation: new Date('2023-02-20'),
      pieces: []
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
      dateCreation: new Date('2023-03-10'),
      pieces: []
    }
  ];
  loading = false;
  submitting = false;
  isDragging = false;
  selectedFile: File | null = null;
  previewContent: string = '';
  
  // Modals
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedContrat: ContratAssurance | null = null;
  editingContrat: ContratAssurance | null = null;

  // Pagination
  totalContrats = 0;
  totalPages = 1;

  // Filtres
  filters: ContratSearchFilters = {
    search: '',
    typeAssurance: '',
    statut: '',
    page: 1,
    size: 10
  };

  // Formulaire
  contratForm: any = {
    clientId: '',
    typeAssurance: 'auto',
    dateDebut: '',
    dateFin: '',
    montantPrime: 0,
    franchise: 0,
    statut: 'actif',
    description: '',
    conditions: ''
  };

  private searchTimeout: any;

  constructor(
    private contratService: ContratService,
    //private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadContrats();
  }

  loadContrats() {
    this.loading = true;
    this.contratService.getContrats(this.filters).subscribe({
      next: (result) => {
        this.contrats = result.contrats;
        this.totalContrats = result.total;
        this.totalPages = Math.ceil(this.totalContrats / this.filters.size);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contrats:', error);
        this.loading = false;
      }
    });
  }

  /*loadClients() {
    this.clientService.getClients({ search: '', page: 1, size: 100 }).subscribe({
      next: (result) => {
        this.clients = result.clients;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
      }
    });
  }*/

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadContrats();
    }, 500);
  }

  changePage(page: number) {
    this.filters.page = page;
    this.loadContrats();
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

  getStatusColor(statut: string): string {
    switch (statut) {
      case 'actif': return '#10b981';
      case 'suspendu': return '#f59e0b';
      case 'expire': return '#6b7280';
      case 'annule': return '#ef4444';
      default: return '#6b7280';
    }
  }

  viewContrat(contrat: ContratAssurance) {
    this.selectedContrat = contrat;
    this.showViewModal = true;
  }

  editContrat(contrat: ContratAssurance) {
    this.editingContrat = contrat;
    this.contratForm = { ...contrat };
    //this.loadClients();
    this.showEditModal = true;
  }

  deleteContrat(contrat: ContratAssurance) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le contrat ${contrat.numero} ?`)) {
      this.submitting = true;
      this.contratService.deleteContrat(contrat.id!).subscribe({
        next: () => {
          this.loadContrats();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.submitting = false;
        }
      });
    }
  }

  // Gestion des fichiers
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    // Vérification de la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    // Vérification du type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Veuillez sélectionner un PDF, DOC ou DOCX');
      return;
    }

    this.selectedFile = file;
    this.generatePreview(file);
  }

  generatePreview(file: File) {
    if (file.type === 'application/pdf') {
      // Pour un vrai PDF, vous utiliseriez PDF.js
      this.previewContent = `
        <div class="text-center">
          <p>Fichier PDF sélectionné</p>
          <p class="text-sm text-gray-500">La prévisualisation PDF complète sera disponible après implémentation de PDF.js</p>
        </div>
      `;
    } else {
      // Pour les autres types, afficher les informations du fichier
      this.previewContent = `
        <div class="bg-gray-50 p-4 rounded">
          <h6>Document sélectionné</h6>
          <p><strong>Nom:</strong> ${file.name}</p>
          <p><strong>Taille:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> ${file.type}</p>
          <p class="text-sm text-gray-500 mt-2">
            Le document sera joint au contrat lors de l'enregistrement
          </p>
        </div>
      `;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.previewContent = '';
  }

  submitContratForm() {
    this.submitting = true;
    
    // Ajouter le nom du client sélectionné
    //@ts-ignore
    const selectedClient = this.clients.find(c => c.id == this.contratForm.clientId);
    if (selectedClient) {
      this.contratForm.client = `${selectedClient.prenom} ${selectedClient.nom}`;
    }

    if (this.editingContrat) {
      // Modification
      this.contratService.updateContrat(this.editingContrat.id!, this.contratForm).subscribe({
        next: () => {
          this.loadContrats();
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
      this.contratService.createContrat(this.contratForm).subscribe({
        next: () => {
          this.loadContrats();
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
    this.selectedContrat = null;
    this.editingContrat = null;
    this.selectedFile = null;
    this.previewContent = '';
    this.resetForm();
  }

  resetForm() {
    this.contratForm = {
      clientId: '',
      typeAssurance: 'auto',
      dateDebut: '',
      dateFin: '',
      montantPrime: 0,
      franchise: 0,
      statut: 'actif',
      description: '',
      conditions: ''
    };
  }
}
