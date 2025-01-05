import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private quotes: { quote: string; author: string }[] = [
    // South Park Quotes (My Favorite Show)
    {
      quote: 'Dios mío, ¡es asqueroso!',
      author: 'Stan Marsh',
    },
    {
      quote: 'No estoy gordo, estoy festivamente regordete.',
      author: 'Eric Cartman',
    },
    {
      quote: '¡Hay una serpiente en mi bota!',
      author: 'Mr. Garrison',
    },
    {
      quote: 'Los niños tienen razón.',
      author: 'Chef',
    },
    {
      quote: 'Lu lu lu, estoy en problemas.',
      author: 'Butters Stotch',
    },
    {
      quote: '¡Oh, mi Dios! ¡Mataron a Kenny!',
      author: 'Stan Marsh y Kyle Broflovski',
    },
    {
      quote: '¡Hola, chicos!',
      author: 'Mr. Hankey',
    },
    {
      quote: '¡Oh, Mie#$a!',
      author: 'Randy Marsh',
    },
  ];

  constructor() {}

  getQuotes() {
    return [...this.quotes]; // Devuelve una copia del array
  }

  getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  addQuote(quote: string, author: string) {
    this.quotes.unshift({ quote, author });
  }

  deleteQuote(index: number) {
    console.log('Eliminar', index);
    this.quotes.splice(index, 1);
  }
}
