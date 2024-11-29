import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserDetail } from '../../interfaces/user-detail';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  userDetail!: UserDetail;
  user2faState!: boolean;
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  accountDetail$ = this.authService.getDetail();
  userDetail$ = this.authService.getDetail().subscribe({
    next: (response) => {
      this.userDetail = response;
      this.user2faState = response.twoFactorEnabled;
    },
    error: (error) => {
      console.log(error);
    },
  });

  twoFaChange() {
    this.authService.change2faState(this.userDetail.email).subscribe({
      next: (response) => {
        this.matSnackBar.open(
          `2FA ${this.user2faState ? 'Deactivated' : 'Activated'} Successfully`,
          'Close',
          {
            duration: 3000,
          }
        );
        this.user2faState = !this.user2faState;
      },
      error: (error) => {
        this.matSnackBar.open(error.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
