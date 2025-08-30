import { Component } from '@angular/core';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent {
  activeSection: string = 'contrats';
  searchTerm: string = '';
  selectedFormats: string[] = ['PDF'];
  selectedDevises: string[] = ['FCFA'];
  exercices = [
  { nom: '2024', journees: [] },
  { nom: '2025', journees: [] }
];
selectedExercice: any = null;
newJourneeDate: string = '';
  entrepriseForm: any = {}
  newProfilNom: string = '';
  modules = [
    { key: 'contrats', label: 'Contrats & Produits', icon: '🛡️' },
    { key: 'utilisateurs', label: 'Utilisateurs & Rôles', icon: '👥' },
    { key: 'profil', label: ' Gestion des Profils', icon: ' 🧑‍💼 ' },
    { key: 'exercice', label: 'Exercice & Journée', icon: '📅' },
    { key: 'tarification', label: 'Tarification & Commissions', icon: '💰' },
    { key: 'etats', label: 'États & Rapports', icon: '📊' },
    { key: 'notifications', label: 'Notifications & Alertes', icon: '🔔' },
    { key: 'localisation', label: 'Localisation & Devises', icon: '🌍' },
    { key: 'generaux', label: 'Paramètres généraux', icon: '⚙️' }
  ];

  palette: string[] = ['#2563eb', '#007bff', '#62957e', '#eab308', '#ef4444', '#a855f7', '#14b8a6'];
  selectedColor: string = '#2563eb';


newProfilDescriptions: string[] = [];

 searchAgence: string = '';
  searchNom: string = '';
  searchPrenom: string = '';
  searchDebut: string = '';
  searchFin: string = '';
  selectedUser: any = null;

  users = [
    { nom: 'Kouassi', prenom: 'Eloge', agence: 'Abidjan', dateDebut: '2024-01-01', dateFin: '2024-12-31', ProfilUtilisateurs: ['Administrateur'] },
    { nom: 'Traoré', prenom: 'Awa', agence: 'Bouaké', dateDebut: '2024-03-01', dateFin: '2024-09-30', ProfilUtilisateurs: ['Agent commercial'] },
    // ...autres utilisateurs...
  ];

  Profils = [
  {
    nom: 'Administrateur',
    description: ['Gestion des contrats', 'Gestion des utilisateurs', 'Gestion des tarifs', 'Accès aux rapports', 'Paramétrage général']
  },
  {
    nom: 'Caissier',
    description: ['Encaissement', 'Gestion des paiements', 'Consultation des contrats']
  },
  {
    nom: 'Agent commercial',
    description: ['Création de contrats', 'Consultation clients', 'Suivi des commissions']
  },
  {
    nom: 'Superviseur',
    description: ['Validation des contrats', 'Gestion des équipes', 'Accès aux rapports']
  },
  {
    nom: 'Lecture seule',
    description: ['Consultation des contrats', 'Consultation des rapports']
  }
];
  ProfilUtilisateurs = [
  {
    nom: 'Administrateur',
    droits: ['Gestion des contrats', 'Gestion des utilisateurs', 'Gestion des tarifs', 'Accès aux rapports', 'Paramétrage général']
  },
  {
    nom: 'Caissier',
    droits: ['Encaissement', 'Gestion des paiements', 'Consultation des contrats']
  },
  {
    nom: 'Agent commercial',
    droits: ['Création de contrats', 'Consultation clients', 'Suivi des commissions']
  },
  {
    nom: 'Superviseur',
    droits: ['Validation des contrats', 'Gestion des équipes', 'Accès aux rapports']
  },
  {
    nom: 'Lecture seule',
    droits: ['Consultation des contrats', 'Consultation des rapports']
  }
];
selectedProfil: any = null;
selectedUserDroits: string[] = [];


  pageSize: number = 5;
  currentPage: number = 1;
  paginatedUsers: any[] = [];
  totalPages: number = 1;

  searchUsers() {
    const filtered = this.users
      .filter(u =>
        (!this.searchAgence || u.agence.toLowerCase().includes(this.searchAgence.toLowerCase())) &&
        (!this.searchNom || u.nom.toLowerCase().includes(this.searchNom.toLowerCase())) &&
        (!this.searchPrenom || u.prenom.toLowerCase().includes(this.searchPrenom.toLowerCase())) &&
        (!this.searchDebut || u.dateDebut >= this.searchDebut) &&
        (!this.searchFin || u.dateFin <= this.searchFin)
      );
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.pageSize));
    this.currentPage = 1;
    this.paginate(filtered);
  }

  paginate(filteredUsers: any[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedUsers = filteredUsers.slice(start, start + this.pageSize);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchUsers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchUsers();
    }
  }
selectUser(user: any) {
  this.selectedUser = user;
  // Trouve le profil de l'utilisateur
  this.selectedProfil = this.ProfilUtilisateurs.find(p => user.ProfilUtilisateurs?.includes(p.nom));
  this.selectedUserDroits = user.droits || [];
}

toggleDroit(droit: string) {
  const idx = this.selectedUserDroits.indexOf(droit);
  if (idx > -1) {
    this.selectedUserDroits.splice(idx, 1);
  } else {
    this.selectedUserDroits.push(droit);
  }
  // Mets à jour les droits de l'utilisateur sélectionné
  if (this.selectedUser) {
    this.selectedUser.droits = [...this.selectedUserDroits];
  }
}
  /*selectUser(user: any) {
    this.selectedUser = user;
  }

  toggleDroit(user: any, droit: string) {
    if (!user.ProfilUtilisateurs) user.ProfilUtilisateurs = [];
    const idx = user.ProfilUtilisateurs.indexOf(droit);
    if (idx > -1) {
      user.ProfilUtilisateurs.splice(idx, 1);
    } else {
      user.ProfilUtilisateurs.push(droit);
    }
  }*/



  changeColor(color: string) {
    this.selectedColor = color;
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--card', this.getCardColor(color));
    document.documentElement.style.setProperty('--btn', color);
  }

  getCardColor(color: string): string {
    // Simple logic: lighten the color for card background
    // You can improve this with a real color manipulation if needed
    if (color === '#2563eb') return '#eef2ff';
    if (color === '#007bff') return '#e7f0fd';
    if (color === '#62957e') return '#eafaf3';
    if (color === '#eab308') return '#fef9e7';
    if (color === '#ef4444') return '#fee2e2';
    if (color === '#a855f7') return '#f3e8ff';
    if (color === '#14b8a6') return '#e0fdfa';
    return '#fff';
  }
  setSection(section: string) {
    this.activeSection = section;
  }
  toggleFormat(format: string) {
    const idx = this.selectedFormats.indexOf(format);
    if (idx > -1) {
      this.selectedFormats.splice(idx, 1);
    } else {
      this.selectedFormats.push(format);
    }
  }
  toggleDevise(devise: string) {
    const idx = this.selectedDevises.indexOf(devise);
    if (idx > -1) {
      this.selectedDevises.splice(idx, 1);
    } else {
      this.selectedDevises.push(devise);
    }
  }
  toggleSidebar(){
    const sb = document.getElementById('sidebar');
      const scrim = document.getElementById('scrim');
      sb?.classList.toggle('open');
      scrim?.classList.toggle('show');
  }
  Toggles(){
  // Toggles
    document.querySelectorAll('[data-toggle]').forEach(t=>{
      t.addEventListener('click', ()=> t.classList.toggle('on'));
    });
  }
  //gestion profils------------------------------------------------
    /*addProfil() {
      if (this.newProfilNom.trim()) {
        this.Profils.push({ nom: this.newProfilNom, description: [] });
        this.newProfilNom = '';
      }
    }*/

    addDescription() {
      this.newProfilDescriptions.push('');
    }

    removeDescription(index: number) {
      this.newProfilDescriptions.splice(index, 1);
    }

    addProfil() {
      if (this.newProfilNom.trim()) {
        this.Profils.push({
          nom: this.newProfilNom,
          description: this.newProfilDescriptions.filter(d => d.trim())
        });
        this.newProfilNom = '';
        this.newProfilDescriptions = [];
      }
    }
  //fin gestion profils------------------------------------------------
  //gestion exercice et journée---------------------------------------
      addJournee() {
      if (this.selectedExercice && this.newJourneeDate) {
        this.selectedExercice.journees.push({ date: this.newJourneeDate, ouverte: false });
        this.newJourneeDate = '';
      }
    }

    ouvrirJournee(journee: any) {
      journee.ouverte = true;
    }

    fermerJournee(journee: any) {
      journee.ouverte = false;
    }
  //fin gestion exercice et journée---------------------------------------
  ngOnInit(): void {
    // ici tu pourras charger des données dynamiques
    this.searchUsers();
    setTimeout(() => {
      //this.toggleSidebar()
      this.Toggles()
    }, 3000);
  }
}
