import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuoteService } from '../services/quote.service';
import { AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';
import { Quote } from '../models/quote.model';

@Component({
  selector: 'app-quotes-management',
  templateUrl: './quotes-management.page.html',
  styleUrls: ['./quotes-management.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, ReactiveFormsModule],
})
export class QuotesManagementPage implements OnInit, OnDestroy {
  quotes!: Quote[]; // Use '!' para inicializar más tarde
  allowDeleteOnHome!: boolean;
  private allowDeleteSubscription!: Subscription;
  quoteForm: FormGroup; // Defino el FormGroup

  constructor(
    private quoteService: QuoteService,
    private alertController: AlertController,
    private settingsService: SettingsService
  ) {
    // Inicializo el FormGroup con los FormControl y sus validadores
    this.quoteForm = new FormGroup({
      quote: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      author: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
  }

  ngOnInit() {
    this.quotes = this.quoteService.getQuotes();

    // Obtengo el valor inicial de allowDeleteOnHome
    this.allowDeleteOnHome = this.settingsService.getAllowDeleteOnHome();
    // Me suscribo a los cambios en allowDeleteOnHome
    this.allowDeleteSubscription =
      this.settingsService.allowDeleteOnHome$.subscribe((value) => {
        this.allowDeleteOnHome = value;
      });
  }

  ngOnDestroy() {
    // Utilizo método para desuscribirme y evitar fugas de memoria
    this.allowDeleteSubscription.unsubscribe();
  }

  addQuote() {
    if (this.quoteForm.valid) {
      // Si el formulario es válido, obtengo los valores de los campos
      this.quoteService.addQuote(
        this.quoteForm.value.quote,
        this.quoteForm.value.author
      );
      this.quoteForm.reset(); // Reseteo el formulario
      this.quotes = this.quoteService.getQuotes(); // Actualizo lista
    } else {
      this.presentAlert();
    }
  }

  deleteQuote(index: number) {
    // Elimino la cita directamente del array local
    this.quotes.splice(index, 1);
    // Aca llamo al servicio para actualizar el array en el servicio
    this.quoteService.deleteQuote(index);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor, ingrese la cita y el autor.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
