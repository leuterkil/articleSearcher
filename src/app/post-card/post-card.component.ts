import { Component, Input } from '@angular/core';
import { Article } from '../interfaces/interfaces';

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() article?:Article
}
