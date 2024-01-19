import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserDetails } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  users: UserDetails[] = [];

  constructor(private userService: UserService) {}

  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'email',
    'admin',
    'approved',
  ];
  dataSource = new MatTableDataSource<UserDetails>(this.users);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.users;
  }

  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (value) => {
        this.users = value;
      },
    });
  }
}
