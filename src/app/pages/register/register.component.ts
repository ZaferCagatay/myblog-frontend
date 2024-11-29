import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  roles$!: Observable<Role[]>;
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = inject(Router);
  passwordHide!: boolean;
  confirmPasswordHide!: boolean;
  isSubmmitting = false;
  errors!: ValidationError[];

  register() {
    this.isSubmmitting = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);
        this.isSubmmitting = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errors = err!.error;
        if (err!.status === 400) {
          this.matSnackBar.open('Validations error', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
          });
        }
        this.isSubmmitting = false;
      },
      complete: () => console.log('Registered successfully!'),
    });
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        fullName: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );

    this.roles$ = this.roleService.getRoles();
  }

  private passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
