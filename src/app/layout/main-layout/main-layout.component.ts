import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
sidebarload(){
  // --- Gestion sidebar compact / étendue (desktop) + persistance ---
  const sidebar = document.getElementById('sidebar');
  const toggleCompact = document.getElementById('toggleCompact');
  const saved = localStorage.getItem('sidebar-compact');
  if (sidebar && saved === '1') sidebar.classList.add('compact');
  if (sidebar && toggleCompact) {
    toggleCompact.addEventListener('click', () => {
      sidebar.classList.toggle('compact');
      localStorage.setItem('sidebar-compact', sidebar.classList.contains('compact') ? '1' : '0');
    });
  }

  // --- Ouverture/fermeture mobile ---
  const openSidebarBtn = document.getElementById('openSidebar');
  const overlay = document.getElementById('overlay');

  function openMobileNav(){
    if (sidebar && overlay) {
      sidebar.classList.add('open');
      overlay.hidden = false;
      overlay.classList.add('show');
      sidebar.setAttribute('tabindex', '-1');
      sidebar.focus();
    }
  }
  function closeMobileNav(){
    if (sidebar && overlay) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      setTimeout(() => { if (overlay) overlay.hidden = true; }, 180);
    }
  }
  if (openSidebarBtn) openSidebarBtn.addEventListener('click', openMobileNav);
  if (overlay) overlay.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

  ngOnInit(): void {
    // ici tu pourras charger des données dynamiques
    setTimeout(() => {
      this.sidebarload()
    }, 3000);
  }
}
