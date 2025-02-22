import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../services/quote.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QuoteComponent } from '../components/quote/quote.component';
import { Quote } from '../models/quote.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule, QuoteComponent],
})
export class HomePage implements OnInit {
  currentQuote!: Quote;

  constructor(private quoteService: QuoteService, private router: Router) {
    // Esto lo agregué para que se inicie el plugin al cargar la página y desapareciera el error:
    // "Error al obtener una cita aleatoria: TypeError: Cannot read properties of undefined (reading 'query')"
    // Pero no resultó, así que lo comenté.
    // this.quoteService.iniciarPlugin().then(() => {
    //   this.quoteService.getRandomQuote(); // Espera la cita aleatoria
    // });
  }

  async ngOnInit() {
    try {
      // Verificar que la base de datos esté lista antes de obtener la cita aleatoria
      await this.quoteService.iniciarPlugin();
      const randomQuote = await this.quoteService.getRandomQuote();

      if (randomQuote) {
        this.currentQuote = randomQuote;
      } else {
        this.currentQuote = {
          quote: 'No se encontró una cita aleatoria.',
          author: 'Desconocido',
        };
      }
    } catch (error) {
      console.error('Error al obtener una cita aleatoria:', error);
      this.currentQuote = {
        quote: 'Error al cargar la cita.',
        author: 'Desconocido',
      };
    }
  }

  goToQuotesManagement() {
    this.router.navigate(['/quotes-management']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
