import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Quote } from 'src/app/models/quote.model';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class QuoteComponent implements OnInit {
  @Input() quote?: Quote;
  @Input() showAuthor: boolean = true;

  constructor() {}

  ngOnInit() {}
}
