import { Component } from '@angular/core';

@Component({
  selector: 'app-reporting-clients',
  templateUrl: './reporting-clients.component.html',
  styleUrls: ['./reporting-clients.component.scss']
})
export class ReportingClientsComponent {
   activeSection: string = 'EditionAssurance';
   activeSectionEtat: string = '1';
  searchTerm: string = '';
  etats = [
  { key: '1', nom: 'Liste des Clients' },
  { key: '2', nom: 'Liste des Contrats' },
  { key: '2', nom: 'Liste des Sinistres' },
  { key: '2', nom: 'Liste des Paiements' }
];

  modules = [
    { key: 'EditionAssurance', label: 'Edition Assurance', icon: '📊' },
    { key: 'EditionComptabilites', label: 'Edition Comptabilites', icon: '💰' },
    { key: 'EditionSinistres', label: 'Edition Sinistres', icon: '🛡️' },
  ];

  // Champs de recherche pour EditionAssurance
  searchAgence: string = '';
  searchNom: string = '';
  searchPrenom: string = '';
  searchDebut: string = '';
  searchFin: string = '';

  setSection(key: string) {
    this.activeSection = key;
  }
  setSectionetat(key: string) {
    this.activeSectionEtat = key;
  }
  Toggles(){
  // Toggles
    document.querySelectorAll('[data-toggle]').forEach(t=>{
      t.addEventListener('click', ()=> t.classList.toggle('on'));
    });
  }

    toggleSidebar(){
    const sb = document.getElementById('sidebar');
      const scrim = document.getElementById('scrim');
      sb?.classList.toggle('open');
      scrim?.classList.toggle('show');
  }
    ngOnInit(): void {
    // ici tu pourras charger des données dynamiques
   
    setTimeout(() => {
      //this.toggleSidebar()
      this.Toggles()
    }, 3000);
  }
}

