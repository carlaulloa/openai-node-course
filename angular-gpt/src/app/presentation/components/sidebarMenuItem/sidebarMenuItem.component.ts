import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu-item',
  imports: [RouterLink],
  template: `
    <a [routerLink]="path()"
    routerLinkActive="bg-black-800"
    class="flex justify-center items-center hover:bg-sky-800 rounded-md p-2 transition-colors">
    <i class="{{icon()}} text-2xl mr-4 text-indigo-400"></i>
    <div class="flex flex-col flex-grow">
      <span class="text-black text-lg font-semibold">{{title()}}</span>
      <span class="text-gray-400 text-sm">{{description()}}</span>
    </div>
    </a>
  `,
})
export class SidebarMenuItemComponent { 

  icon = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  path = input.required<string>();
  

}
