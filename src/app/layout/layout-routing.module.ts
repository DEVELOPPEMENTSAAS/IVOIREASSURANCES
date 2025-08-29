import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TenantGuard } from '../core/guards/tenant.guard'; // Optionnel
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientsComponent } from './pages/gestionclients/clients/clients.component';
import { ReglementsDePrimeAssuranceComponent } from './pages/gestioncomptabilites/reglements-de-prime-assurance/reglements-de-prime-assurance.component';
import { ContratsComponent } from './pages/gestioncontrats/contrats/contrats.component';
import { CreationJourneeComponent } from './pages/gestionJournee/creation-journee/creation-journee.component';
import { SinistresComponent } from './pages/gestionsinistres/sinistres/sinistres.component';
import { UtilisateursComponent } from './pages/gestionsUtilisateurs/utilisateurs/utilisateurs.component';
import { ParametresComponent } from './pages/parametres/parametres/parametres.component';
import { ReportingClientsComponent } from './pages/reporting/reporting-clients/reporting-clients.component';
import { ReeditionComponent } from './pages/gestioncomptabilites/reedition/reedition.component';
import { ExtourneComponent } from './pages/gestioncomptabilites/extourne/extourne.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // Vérifie l'authentification + tenant canActivate: [AuthGuard, TenantGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { path: 'dashboard', component: DashboardComponent },
      // Autres routes enfants ici
      {
        path: 'users',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'creation', pathMatch: 'full' },
          { path: 'creation', component: ClientsComponent }
        ],
      },
      {
        path: 'comptabilite',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'ReglementsDePrimeAssurance', pathMatch: 'full' },
          { path: 'ReglementsDePrimeAssurance', component: ReglementsDePrimeAssuranceComponent },
          { path: 'Reedition', component: ReeditionComponent },
          { path: 'Extourne', component: ExtourneComponent }
        ],
      },
      {
        path: 'contrats',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'Contrats', pathMatch: 'full' },
          { path: 'Contrats', component: ContratsComponent }
        ],
      },
      {
        path: 'Journee',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'CreationJournee', pathMatch: 'full' },
          { path: 'CreationJournee', component: CreationJourneeComponent }
        ],
      },
      {
        path: 'Sinistres',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'Sinistres', pathMatch: 'full' },
          { path: 'Sinistres', component: SinistresComponent }
        ],
      },
      {
        path: 'Utilisateurs',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'creation', pathMatch: 'full' },
          { path: 'creation', component: UtilisateursComponent }
        ],
      },
      {
        path: 'params',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'Parametres', pathMatch: 'full' },
          { path: 'Parametres', component: ParametresComponent }
        ],
      },
      {
        path: 'Reporting',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'ReportingClients', pathMatch: 'full' },
          { path: 'ReportingClients', component: ReportingClientsComponent }
        ],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}

