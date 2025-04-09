import { Component } from '@angular/core';
import { formControl, Validators } from '@al00x/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, AsyncPipe],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  control = formControl('Hello', Validators.required);
}
