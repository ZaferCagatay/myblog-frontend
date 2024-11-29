import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, MatSnackBarModule, MatIconModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetPassword = {} as ResetPasswordRequest;
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  matSnackBar = inject(MatSnackBar);
  passwordHide!: boolean;
  confirmPasswordHide!: boolean;
  confirmPassword!: string;
  passwordMissMatch!: boolean;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetPassword.email = params['email'];
      this.resetPassword.token = params['token'];
    });
  }

  resetPasswordHandle() {
    if (this.resetPassword.newPassword !== this.confirmPassword) {
      this.passwordMissMatch = true;
    } else {
      this.passwordMissMatch = false;
      this.authService.resetPassword(this.resetPassword).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.matSnackBar.open(response.message, 'Close', {
              duration: 3000,
            });
          } else {
            this.matSnackBar.open(response.message, 'Close', {
              duration: 3000,
            });
          }
          this.router.navigate(['/login']);
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
