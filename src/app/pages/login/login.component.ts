import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userMessage = '';
  userDetails = {
    email: '',
    password: '',
  };

  constructor(private userService: UserService, private router: Router) {}

  submitForm(form: any): void {
    const user = this.userService.getApprovedUserByTempKey(this.userDetails);
    if (user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.userMessage = 'Invalid user!';
    }
  }
}
