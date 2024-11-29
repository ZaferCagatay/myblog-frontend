import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmailRequest } from '../../interfaces/confirm-email-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MatIconModule, MatSnackBarModule, CommonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css',
})
export class ConfirmEmailComponent implements OnInit {
  confirmEmail = {} as ConfirmEmailRequest;
  isLoading!: boolean;
  isConfirmEmailSuccess!: boolean;
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  matSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.confirmEmail.email = params['email'];
      this.confirmEmail.token = params['token'];
    });

    this.authService.confirmEmail(this.confirmEmail).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.isConfirmEmailSuccess = true;
        } else {
          this.isConfirmEmailSuccess = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.matSnackBar.open(error.error.message, 'Close', {
          duration: 3000,
        });
        this.isConfirmEmailSuccess = false;
      },
    });
    this.isLoading = false;
  }
}
