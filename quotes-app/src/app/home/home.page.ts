import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../services/quote.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { QuoteComponent } from '../components/quote/quote.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule, QuoteComponent],
})
export class HomePage implements OnInit {
  currentQuote?: { quote: string; author: string };

  constructor(private quoteService: QuoteService, private router: Router) {}

  ngOnInit() {
    this.currentQuote = this.quoteService.getRandomQuote();
  }

  goToQuotesManagement() {
    this.router.navigate(['/quotes-management']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
