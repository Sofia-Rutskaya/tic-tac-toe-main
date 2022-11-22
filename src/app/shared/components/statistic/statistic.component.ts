import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {
  @Input() won!: string;
  @Input() draw!: string;
  @Input() loose!: string;
  @Input() containerClass!: string;


  
}
