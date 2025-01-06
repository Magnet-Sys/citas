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
    // Inicializo el FormGroup con los FormControl y sus validaciones
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

  async ngOnInit() {
    await this.quoteService.iniciarPlugin();
    await this.updateQuote();

    // Obtengo el valor inicial de allowDeleteOnHome
    this.allowDeleteOnHome = this.settingsService.getAllowDeleteOnHome();
    // Me suscribo a los cambios en allowDeleteOnHome
    this.allowDeleteSubscription =
      this.settingsService.allowDeleteOnHome$.subscribe((value) => {
        this.allowDeleteOnHome = value;
      });
  }

  async updateQuote() {
    this.quotes = await this.quoteService.getQuotes();
  }

  async addQuote($event: Quote) {
    console.log('Cita para agregar--->', $event);

    const quote: Quote = {
      quote: $event.quote,
      author: $event.author,
    };
    // Espero que la cita se agregue a la base de datos
    await this.quoteService.addQuote(quote);
    // Obtener la lista actualizada de la base de datos
    this.quotes = await this.quoteService.getQuotes();
    this.quoteForm.reset();
    this.updateQuote();
  }

  deleteQuote(index: number) {
    // Obtener el ID de la cita a eliminar
    const quoteId: number = this.quotes[index].id ?? 0;
    // Eliminar la cita del array local
    this.quotes.splice(index, 1);
    // Llamo al servicio para eliminar la cita de la base de datos usando el ID
    this.quoteService.deleteQuote(quoteId);
  }

  ngOnDestroy() {
    // Utilizo método para desuscribirme y evitar fugas de memoria
    this.allowDeleteSubscription.unsubscribe();
  }

  // Método para validar formulario en caso de que no se haya ingresado cita o autor muestro un alerta
  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     header: 'Error',
  //     message: 'Por favor, ingrese la cita y el autor.',
  //     buttons: ['OK'],
  //   });

  //   await alert.present();
  // }
}
