import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isUserMenuOpen: boolean = false; 
  public isMenuitemOpen: boolean = false; 
  public username: string = '';

  constructor(private sidebarService: SidebarService,
             ) {
    this.menuItems = sidebarService.menu;
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      this.username = storedUser;
    }
  }

  ngOnInit(): void {
   
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  toggleCollapse(item: any): void {
    item.expanded = !item.expanded; // Alterna el estado de expansión del elemento del menú
  }
}