import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(users: any[], agence: string, nom: string, prenom: string, debut: string, fin: string): any[] {
    return users.filter(u => {
      return (!agence || u.agence.toLowerCase().includes(agence.toLowerCase()))
        && (!nom || u.nom.toLowerCase().includes(nom.toLowerCase()))
        && (!prenom || u.prenom.toLowerCase().includes(prenom.toLowerCase()))
        && (!debut || u.dateDebut >= debut)
        && (!fin || u.dateFin <= fin);
    });
  }

}
