import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuItemComponent } from '../../components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarMenuItemComponent],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent { 

  routes = routes[0].children?.filter(route => route.data)

}
