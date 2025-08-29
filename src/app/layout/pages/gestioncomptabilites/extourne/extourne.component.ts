import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecuService } from '../../services/recu.service';
import { RecuCaisse, OperationExtourne } from '../../models/recu.model';

@Component({
  selector: 'app-extourne',
  templateUrl: './extourne.component.html',
  styleUrls: ['./extourne.component.scss']
})
export class ExtourneComponent {
 searchForm = {
    numeroPiece: '',
    dateOperation: ''
  };

  recuTrouve: RecuCaisse | null = null;
  motifExtourne = '';
  extournes: OperationExtourne[] = [];
  
  searching = false;
  extourning = false;
  loadingHistory = false;
  searchPerformed = false;

  constructor(private recuService: RecuService) {}

  ngOnInit() {
    this.loadExtournes();
  }

  rechercherRecu() {
    if (!this.searchForm.numeroPiece.trim()) {
      return;
    }

    this.searching = true;
    this.searchPerformed = true;
    this.recuTrouve = null;

    this.recuService.getRecuByPiece(
      this.searchForm.numeroPiece.trim(),
      this.searchForm.dateOperation || undefined
    ).subscribe({
      next: (recu) => {
        this.recuTrouve = recu;
        this.searching = false;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.searching = false;
      }
    });
  }

  confirmerExtourne() {
    if (!this.recuTrouve || !this.motifExtourne.trim()) {
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir extourner ce reçu ? Cette action est irréversible.')) {
      return;
    }

    this.extourning = true;

    this.recuService.extournerRecu(this.recuTrouve.id!, this.motifExtourne.trim()).subscribe({
      next: (extourne) => {
        this.extourning = false;
        this.recuTrouve!.statut = 'extourne';
        this.motifExtourne = '';
        this.loadExtournes();
        alert('Le reçu a été extourné avec succès.');
      },
      error: (error) => {
        console.error('Erreur lors de l\'extourne:', error);
        this.extourning = false;
        alert('Erreur lors de l\'extourne: ' + error.message);
      }
    });
  }

  annulerRecherche() {
    this.searchForm = { numeroPiece: '', dateOperation: '' };
    this.recuTrouve = null;
    this.motifExtourne = '';
    this.searchPerformed = false;
  }

  loadExtournes() {
    this.loadingHistory = true;
    this.recuService.getExtournes().subscribe({
      next: (extournes) => {
        this.extournes = extournes;
        this.loadingHistory = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des extournes:', error);
        this.loadingHistory = false;
      }
    });
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'encaissement': 'Encaissement',
      'decaissement': 'Décaissement',
      'virement': 'Virement'
    };
    return labels[type] || type;
  }

  getModeLabel(mode: string): string {
    const labels: { [key: string]: string } = {
      'especes': 'Espèces',
      'cheque': 'Chèque',
      'virement': 'Virement',
      'carte': 'Carte Bancaire'
    };
    return labels[mode] || mode;
  }
}
