import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
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
import { ReactiveFormsModule } from '@angular/forms'; // <- IMPORTANT

@NgModule({
  declarations: [
    LayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    ClientsComponent,
    ReglementsDePrimeAssuranceComponent,
    ContratsComponent,
    CreationJourneeComponent,
    SinistresComponent,
    UtilisateursComponent,
    ParametresComponent,
    ReportingClientsComponent,
    ReeditionComponent,
    ExtourneComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutRoutingModule,
    ReactiveFormsModule  // <- Ajoute ça
  ]
})
export class LayoutModule { }
