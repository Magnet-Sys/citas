import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuoteService } from '../services/quote.service';
import { AlertController } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotes-management',
  templateUrl: './quotes-management.page.html',
  styleUrls: ['./quotes-management.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class QuotesManagementPage implements OnInit {
  quotes!: { quote: string; author: string }[]; // Use '!' para inicializar más tarde
  newQuoteText!: string;
  newQuoteAuthor!: string;
  allowDeleteOnHome!: boolean;
  private allowDeleteSubscription!: Subscription;

  constructor(
    private quoteService: QuoteService,
    private alertController: AlertController,
    private settingsService: SettingsService
  ) {}

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
    // Utilizo metodo para desuscribirme y evitar fugas de memoria
    this.allowDeleteSubscription.unsubscribe();
  }

  addQuote() {
    if (this.newQuoteText && this.newQuoteAuthor) {
      this.quoteService.addQuote(this.newQuoteText, this.newQuoteAuthor);
      this.newQuoteText = '';
      this.newQuoteAuthor = '';
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
