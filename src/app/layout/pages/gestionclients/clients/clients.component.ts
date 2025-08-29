import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client, ClientSearchFilters, PieceJointe } from '../../models/client.model';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
clients: Client[] = [];
  loading = false;
  submitting = false;
  isDragging = false;
  
  // Modals
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  showDocumentsModal = false;
  selectedClient: Client | null = null;
  editingClient: Client | null = null;

  // Pagination
  totalClients = 0;
  totalPages = 1;

  // Filtres
  filters: ClientSearchFilters = {
    search: '',
    statut: '',
    page: 1,
    size: 10
  };

  // Formulaire
  clientForm: any = {
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    cin: '',
    profession: '',
    statut: 'actif',
    photo: ''
  };

  private searchTimeout: any;

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getClients(this.filters).subscribe({
      next: (result) => {
        this.clients = result.clients;
        this.totalClients = result.total;
        this.totalPages = Math.ceil(this.totalClients / this.filters.size);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadClients();
    }, 500);
  }

  changePage(page: number) {
    this.filters.page = page;
    this.loadClients();
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

  openAddModal() {
    //this.resetForm();
    this.showAddModal = true;
  }
closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
   
    this.resetForm();
  }

   resetForm() {
     this.clientForm = {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      cin: '',
      profession: '',
      statut: 'actif'
    };
  }
formatFileSize(size: number): string {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
submitClientForm(){}
  viewClient(client: Client) {
    this.selectedClient = client;
    this.showViewModal = true;
  }

  editClient(client: Client) {
    this.editingClient = client;
    this.clientForm = { ...client };
    this.showEditModal = true;
  }

  openDocumentsModal(client: Client) {
    this.selectedClient = client;
    this.showDocumentsModal = true;
  }

  deleteClient(client: Client) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.prenom} ${client.nom} ?\n\nCette action est irréversible et supprimera également tous les documents associés.`)) {
      this.submitting = true;
      this.clientService.deleteClient(client.id!).subscribe({
        next: () => {
          this.loadClients();
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.submitting = false;
        }
      });
    }
  }

  // Gestion des photos
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vérification de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo est trop volumineuse (max 5MB)');
        return;
      }

      // Vérification du type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Prévisualisation immédiate
      const reader = new FileReader();
      reader.onload = (e) => {
        this.clientForm.photo = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.clientForm.photo = '';
  }

  // Gestion des documents
  onDocumentSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleDocumentFile(file);
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
      this.handleDocumentFile(files[0]);
    }
  }

  handleDocumentFile(file: File) {
    // Vérification de la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    // Vérification du type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Veuillez sélectionner un PDF, DOC, DOCX, JPG ou PNG');
      return;
    }

    if (this.selectedClient) {
      this.submitting = true;
      this.clientService.addPieceJointe(this.selectedClient.id!, {
        nom: file.name,
        type: file.type,
        url: '#', // URL simulée
        taille: file.size
      }).subscribe({
        next: (piece) => {
          if (this.selectedClient) {
            if (!this.selectedClient.pieces) this.selectedClient.pieces = [];
            this.selectedClient.pieces.push(piece);
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du document:', error);
          this.submitting = false;
        }
      });
    }
  }

  deletePiece(piece: PieceJointe) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le document "${piece.nom}" ?`)) {
      this.clientService.deletePieceJointe(piece.clientId, piece.id!).subscribe({
        next: () => {
          if (this.selectedClient && this.selectedClient.pieces) {
            const index = this.selectedClient.pieces.findIndex(p => p.id === piece.id);
            if (index !== -1) {
              this.selectedClient.pieces.splice(index, 1);
            }
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du document:', error);
        }
      });
    }
  }
}
