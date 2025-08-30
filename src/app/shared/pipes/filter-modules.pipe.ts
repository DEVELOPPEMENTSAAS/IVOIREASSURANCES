import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterModules'
})
export class FilterModulesPipe implements PipeTransform {

  transform(modules: any[], search: string): any[] {
    if (!search) return modules;
    const term = search.toLowerCase();
    return modules.filter(m =>
      m.label.toLowerCase().includes(term)
    );
  }
}
