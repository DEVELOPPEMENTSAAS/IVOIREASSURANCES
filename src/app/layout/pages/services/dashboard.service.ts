import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { KPICard, ProductData, ChartData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getKPIData(): Observable<KPICard[]> {
    const kpiData: KPICard[] = [
      {
        title: 'Primes Encaissées',
        value: '€2,450,000',
        change: 12.5,
        trend: 'up',
        icon: 'euro'
      },
      {
        title: 'Contrats Signés',
        value: '1,247',
        change: 8.3,
        trend: 'up',
        icon: 'file-text'
      },
      {
        title: 'Sinistres Enregistrés',
        value: '89',
        change: -5.2,
        trend: 'down',
        icon: 'alert-triangle'
      },
      {
        title: 'Taux de Sinistralité',
        value: '7.1%',
        change: -2.1,
        trend: 'down',
        icon: 'trending-down'
      }
    ];
    return of(kpiData);
  }

  getProductsData(): Observable<ProductData[]> {
    const productsData: ProductData[] = [
      {
        name: 'Automobile',
        premiums: 1200000,
        contracts: 542,
        claims: 38,
        claimsRatio: 7.0,
        color: '#3B82F6'
      },
      {
        name: 'Santé',
        premiums: 850000,
        contracts: 389,
        claims: 28,
        claimsRatio: 7.2,
        color: '#10B981'
      },
      {
        name: 'Prévoyance',
        premiums: 320000,
        contracts: 234,
        claims: 15,
        claimsRatio: 6.4,
        color: '#F59E0B'
      },
      {
        name: 'Habitation',
        premiums: 280000,
        contracts: 178,
        claims: 12,
        claimsRatio: 6.7,
        color: '#EF4444'
      }
    ];
    return of(productsData);
  }

  getMonthlyData(): Observable<ChartData> {
    const monthlyData: ChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Automobile',
          data: [180000, 195000, 210000, 225000, 240000, 255000],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Santé',
          data: [120000, 135000, 142000, 148000, 155000, 162000],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Prévoyance',
          data: [45000, 48000, 52000, 55000, 58000, 62000],
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4
        }
      ]
    };
    return of(monthlyData);
  }

  getClaimsRatioData(): Observable<ChartData> {
    const claimsRatioData: ChartData = {
      labels: ['Automobile', 'Santé', 'Prévoyance', 'Habitation'],
      datasets: [
        {label: 'ClaimsRatioData',
          data: [7.0, 7.2, 6.4, 6.7],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 0
        }
      ]
    };
    return of(claimsRatioData);
  }

  getContractsData(): Observable<ChartData> {
    const contractsData: ChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Nouveaux Contrats',
          data: [120, 135, 142, 158, 165, 178],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: '#3B82F6',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Renouvellements',
          data: [89, 95, 102, 108, 115, 125],
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10B981',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }
      ]
    };
    return of(contractsData);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}