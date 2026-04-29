import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../modelos/user';

interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Login del administrador o usuario normal
  authenticate(loginData: { username: string; password: string }): Observable<AuthResponse> {
    const body = {
      email: loginData.username,
      password: loginData.password
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, body)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  // Registro de usuario normal
  registerUser(user: User): Observable<AuthResponse> {
    const body = {
      nombre: user.name,
      email: user.email,
      password: user.password,
      telefono: user.phoneNumber,
      direccionEnvio: user.address,
      preferencias: ''
    };

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, body)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRoles(): string[] {
  const token = this.getToken();

  if (!token) {
    return [];
  }

  try {
    const payloadBase64 = token.split('.')[1];

    const payloadJson = atob(
      payloadBase64
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    );

    const payload = JSON.parse(payloadJson);

    return payload.roles || [];
  } catch (error) {
    console.error('Error leyendo roles del token:', error);
    return [];
  }
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }

  isUser(): boolean {
    return this.getRoles().includes('ROLE_USER');
  }

  getAccount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/account`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${user.id}`, user);
  }
}