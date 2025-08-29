import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReglementPrimeService } from '../../services/reglement-prime.service';
import { ContratAssurance, Recu, ModeReglement } from '../../models/assurance.model';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
@Component({
  selector: 'app-reglements-de-prime-assurance',
  templateUrl: './reglements-de-prime-assurance.component.html',
  styleUrls: ['./reglements-de-prime-assurance.component.scss']
})
export class ReglementsDePrimeAssuranceComponent {
 searchForm: FormGroup;
  reglementForm: FormGroup;

  contrat: ContratAssurance | null = null;
  recu: Recu | null = null;
  
  isLoading = false;
  searchError: string | null = null;
  submitted = false;
  
  modesReglement: ModeReglement[] = ['Espèces', 'Wave', 'Orange Money', 'Moov Money', 'MTN Money', 'Virement Bancaire', 'Chèque'];

  constructor(
    private fb: FormBuilder,
    private reglementPrimeService: ReglementPrimeService
  ) {
    this.searchForm = this.fb.group({
      numeroPiece: ['', Validators.required]
    });

    this.reglementForm = this.fb.group({
      montant: [{ value: '', disabled: true }, [Validators.required, Validators.min(0.01)]],
      modeReglement: ['', Validators.required],
      reference: ['']
    });
  }

  ngOnInit(): void {
    // Logique d'initialisation
  }

  onSearch(): void {
    this.submitted = true;
    this.contrat = null;
    this.recu = null;
    this.searchError = null;
    
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    const numeroPiece = this.searchForm.value.numeroPiece;

    // Simuler un appel API
    this.reglementPrimeService.findContratByNumeroPiece(numeroPiece).pipe(delay(1000)).subscribe({
      next: (contrat) => {
        if (contrat) {
          this.contrat = contrat;
          this.reglementForm.patchValue({ montant: this.contrat.montantPrime });
          this.reglementForm.controls['montant'].enable();
        } else {
          this.searchError = `Aucun contrat trouvé pour le numéro de pièce : ${numeroPiece}`;
        }
        this.isLoading = false;
      },
      error: () => {
        this.searchError = 'Une erreur est survenue lors de la recherche.';
        this.isLoading = false;
      }
    });
  }

  onValiderReglement(): void {
    if (this.reglementForm.invalid || !this.contrat) {
      return;
    }

    this.isLoading = true;
    const reglementData = {
      ...this.reglementForm.value,
      contrat: this.contrat
    };

    // Simuler la création du reçu
    this.reglementPrimeService.genererRecu(reglementData).pipe(delay(1500)).subscribe(recu => {
      this.recu = recu;
      this.isLoading = false;
      this.contrat = null; // Cacher la section de règlement après génération
    });
  }

  onNouvelleRecherche(): void {
    this.submitted = false;
    this.contrat = null;
    this.recu = null;
    this.searchError = null;
    this.searchForm.reset();
    this.reglementForm.reset();
    this.reglementForm.controls['montant'].disable();
  }

  imprimerRecu(): void {
    window.print();
  }
}