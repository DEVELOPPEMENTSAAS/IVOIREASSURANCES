import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { DashboardService } from '../services/dashboard.service';
import { KPICard, ProductData, FilterState, ChartData } from '../models/dashboard.model';
// ✅ Register all chart types, scales, and controllers
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  @ViewChild('premiumChart') premiumChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('claimsChart') claimsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('contractsChart') contractsChartRef!: ElementRef<HTMLCanvasElement>;

  kpiData: KPICard[] = [];
  productsData: ProductData[] = [];
  lastUpdate: Date = new Date();
  
  filters: FilterState = {
    period: '30d',
    agency: 'Toutes',
    user: 'Tous',
    product: 'Tous'
  };

  private premiumChart?: Chart;
  private claimsChart?: Chart;
  private contractsChart?: Chart;

  constructor(private dashboardService: DashboardService) {}
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
    
    setTimeout(() => {
      this.loadData();
      this.sidebarload()
    }, 1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
     this.initializeCharts();
    }, 3000);
    
  }

  loadData(): void {
    this.dashboardService.getKPIData().subscribe(data => {
      this.kpiData = data;
    });

    this.dashboardService.getProductsData().subscribe(data => {
      this.productsData = data;
    });
  }

  initializeCharts(): void {
    this.createPremiumChart();
    this.createClaimsChart();
    this.createContractsChart();
  }

  createPremiumChart(): void {
    this.dashboardService.getMonthlyData().subscribe(data => {
      const ctx = this.premiumChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.premiumChart = new Chart(ctx, {
          type: 'line',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: window.devicePixelRatio || 1,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                callbacks: {
                  label: (context: any) => {
                    return `${context.dataset.label}: ${new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(context.parsed.y)}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                  callback: (value: any) => {
                    return new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(value);
                  }
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    });
  }

  createClaimsChart(): void {
    this.dashboardService.getClaimsRatioData().subscribe(data => {
      const ctx = this.claimsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.claimsChart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: window.devicePixelRatio || 1,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                  label: (context: any) => {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }

  createContractsChart(): void {
    this.dashboardService.getContractsData().subscribe(data => {
      const ctx = this.contractsChartRef.nativeElement.getContext('2d');
      if (ctx) {
        this.contractsChart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: window.devicePixelRatio || 1,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    });
  }

  handleRefresh(): void {
    this.lastUpdate = new Date();
    this.loadData();
    // Ici vous pouvez ajouter la logique de rechargement des données en temps réel
  }

  onFiltersChange(): void {
    // Ici vous pouvez ajouter la logique de filtrage des données
    console.log('Filters changed:', this.filters);
  }

  getIconSymbol(icon: string): string {
    const iconMap: { [key: string]: string } = {
      'euro': '€',
      'file-text': '📄',
      'alert-triangle': '⚠️',
      'trending-down': '📉'
    };
    return iconMap[icon] || '📊';
  }

  getTrendClass(trend: string): string {
    return `trend-${trend}`;
  }

  getRatioClass(ratio: number): string {
    if (ratio < 7) return 'ratio-good';
    if (ratio > 7.5) return 'ratio-danger';
    return 'ratio-warning';
  }

  formatCurrency(amount: number): string {
    return this.dashboardService.formatCurrency(amount);
  }
}
