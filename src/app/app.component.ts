import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNavComponent } from './shared/app-nav/app-nav.component';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AppNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'app';
  userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getUsers();
  }
}
