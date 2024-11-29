import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  hide = true;
  userEmail!: string;
  otpCode!: string;
  isSubmmitting = false;
  show2faPanel = false;
  form!: FormGroup;
  fb = inject(FormBuilder);

  login() {
    this.userEmail = this.form.value['email'];
    this.isSubmmitting = true;
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.matSnackBar.open(response.message, 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
          this.router.navigate(['/']);
        } else {
          this.show2faPanel = true;
        }
        this.isSubmmitting = false;
      },
      error: (error) => {
        this.matSnackBar.open(error.error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.isSubmmitting = false;
      },
    });
  }

  verify2fa() {
    this.authService
      .verifyTwoFa({ email: this.userEmail, enteredOtpCode: this.otpCode })
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.matSnackBar.open(response.message, 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
            this.router.navigate(['/']);
          } else {
            this.show2faPanel = true;
          }
        },
        error: (error) => {
          this.matSnackBar.open(error.error.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
          });
        },
      });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
