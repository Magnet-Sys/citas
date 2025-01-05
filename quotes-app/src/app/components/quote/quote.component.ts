import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class QuoteComponent implements OnInit {
  @Input() quote?: { quote: string; author: string };
  @Input() showAuthor: boolean = true;

  constructor() {}

  ngOnInit() {}
}
