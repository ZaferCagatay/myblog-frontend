import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  currentPasswordHide!: boolean;
  passwordHide!: boolean;
  confirmPasswordHide!: boolean;
  passwordMissMatch!: boolean;

  changePasswordHandle() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMissMatch = true;
    } else {
      this.passwordMissMatch = false;
      this.authService
        .changePassword({
          email: this.authService.getUserDetail()?.email,
          newPassword: this.newPassword,
          currentPassword: this.currentPassword,
        })
        .subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.matSnackBar.open('Password changed successfully.', 'Close', {
                duration: 3000,
              });
              this.authService.logout();
              this.router.navigate(['/login']);
            } else {
              this.matSnackBar.open(response.message, 'Close', {
                duration: 3000,
              });
            }
          },
          error: (error: HttpErrorResponse) => {
            this.matSnackBar.open(error.error.message, 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }
}
