import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecuService } from '../../services/recu.service';
import { RecuCaisse } from '../../models/recu.model';

@Component({
  selector: 'app-reedition',
  templateUrl: './reedition.component.html',
  styleUrls: ['./reedition.component.scss']
})
export class ReeditionComponent {
searchForm = {
    numeroPiece: '',
    dateOperation: ''
  };

  recuTrouve: RecuCaisse | null = null;
  currentDate = new Date();
  
  searching = false;
  printing = false;
  generating = false;
  searchPerformed = false;

  constructor(private recuService: RecuService) {}

  ngOnInit() {
    // Initialisation si nécessaire
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

  imprimerRecu() {
    if (!this.recuTrouve) return;

    this.printing = true;
    
    // Simuler un délai d'impression
    setTimeout(() => {
      window.print();
      this.printing = false;
    }, 500);
  }

  telechargerPDF() {
    if (!this.recuTrouve) return;

    this.generating = true;

    this.recuService.generateRecuPDF(this.recuTrouve).subscribe({
      next: (blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `recu_${this.recuTrouve!.numeroRecu}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.generating = false;
      },
      error: (error) => {
        console.error('Erreur lors de la génération PDF:', error);
        this.generating = false;
        alert('Erreur lors de la génération du PDF');
      }
    });
  }

  annulerRecherche() {
    this.searchForm = { numeroPiece: '', dateOperation: '' };
    this.recuTrouve = null;
    this.searchPerformed = false;
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