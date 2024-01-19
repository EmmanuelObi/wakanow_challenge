import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { UserDetails } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  userMessage = '';

  userDetails: UserDetails = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    admin: false,
  };

  adminApproved: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getAdminApprovalStatus().subscribe((approved) => {
      this.adminApproved = approved;
    });
  }

  submitForm() {
    this.http.post('https://reqres.in/api/users', this.userDetails).subscribe({
      next: () => {
        this.userService.addUser(this.userDetails);
        this.router.navigate(['/login']);

        if (!this.adminApproved) {
          this.userService.approveFirstUser();
        }
        this.clearForm();
        this.userMessage = 'Sign Up successful!';
      },
    });
  }

  clearForm() {
    this.userDetails = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      admin: false,
    };
  }
}
