import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule, } from "@angular/router/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { PipesModule } from "src/app/shared/pipes/pipes.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthServiceMock } from "../../mocks/auth-service.mock";
import { AuthService } from "../../services/AuthService";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

describe('Pruebas del LoginComponent', () => {
  let component: LoginComponent;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        PipesModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Si el campo email esta vacio el FormControl del email debe ser invalido', () => {
    component.loginForm.setValue({ email: null, password: null })
    expect(component.emailControl.invalid).toBeTrue();
  });

  it('Si el campo password esta vacio el FormControl del password debe ser invalido', () => {
    component.loginForm.setValue({ email: null, password: null })
    expect(component.passwordControl.invalid).toBeTrue();
  });

  it('Si el loginForm es invalido, debe marcar todos los controles como touched', () => {
    component.loginForm.setValue({ email: null, password: null })
    const spyOnMarkAllAsTouched = spyOn(component.loginForm, 'markAllAsTouched');

    component.login();

    expect(spyOnMarkAllAsTouched).toHaveBeenCalled();
  });

  it('Si el loginForm es valido, debe llamar al metodo login del AuthService', () => {
    component.loginForm.setValue({ email: 'test@mail.com', password: '12345678' });
    const spyOnAuthServiceLogin = spyOn(TestBed.inject(AuthService), 'login');
    component.login();
    expect(component.loginForm.valid).toBeTrue();
    expect(spyOnAuthServiceLogin).toHaveBeenCalled();
  });
});
