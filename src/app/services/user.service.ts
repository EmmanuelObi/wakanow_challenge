import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = new BehaviorSubject<UserDetails[]>([]);
  private adminApproved: boolean = false;
  private adminApprovalSubject = new BehaviorSubject<boolean>(
    this.adminApproved
  );
  platformId: Object;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
  }

  user$ = this.users.asObservable();

  getUsers() {
    if (this.platformId) {
      const storedUsers = sessionStorage.getItem('users');
      if (storedUsers) {
        this.users.next(JSON.parse(storedUsers) as UserDetails[]);
      } else {
        const admin: UserDetails = {
          admin: true,
          email: 'admin@gmail.com',
          firstname: 'John',
          lastname: 'Doe',
          approved: true,
          password: 'test123@gmail.com',
          tempKey: 'Test',
        };

        this.users.next([admin]);
        this.saveUsersToStorage();
      }
    }
  }

  saveUsersToStorage(): void {
    // Save users to session storage
    sessionStorage.setItem('users', JSON.stringify(this.users.value));
  }

  addUser(user: UserDetails): void {
    this.users.next([
      ...this.users.value,
      { ...user, approved: false, tempKey: null },
    ]);
    this.saveUsersToStorage();
  }

  approveFirstUser(): void {
    if (!this.adminApproved && this.users.value.length > 0) {
      this.users.value[1].approved = true;
      this.users.value[1].admin = true;
      this.generateTempKey(this.users.value[1]);
      this.adminApproved = true;
      this.adminApprovalSubject.next(this.adminApproved);
      this.saveUsersToStorage();
    }
  }

  generateTempKey(user: any): void {
    const tempKey = Math.random().toString(36).substring(2, 15);
    user.tempKey = tempKey;
  }

  getAdminApprovalStatus(): Observable<boolean> {
    return this.adminApprovalSubject.asObservable();
  }

  getApprovedUserByTempKey(userDetails: {
    email: string;
    password: string;
  }): any {
    return this.users.value.find(
      (user) =>
        user.approved &&
        user.tempKey !== null &&
        userDetails.email === user.email &&
        userDetails.password === user.password
    );
  }

  updateUserData(updatedUser: any): void {
    const index = this.users.value.findIndex(
      (user) => user.approved && user.tempKey === updatedUser.tempKey
    );
    if (index !== -1) {
      // Users can update their own information
      this.users.value[index] = { ...this.users.value[index], ...updatedUser };
    }
    this.saveUsersToStorage();
  }

  removeUser(tempKey: string): void {
    const index = this.users.value.findIndex(
      (user) => user.approved && user.tempKey === tempKey
    );
    if (index !== -1) {
      // Users cannot remove themselves
      this.users.value.splice(index, 1);
    }
    this.saveUsersToStorage();
  }
}
