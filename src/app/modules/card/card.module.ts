import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { CardSubtitleComponent } from './card-subtitle/card-subtitle.component';
import { CardBodyComponent } from './card-body/card-body.component';
import { CardActionsComponent } from './card-actions/card-actions.component';
import { CardFooterComponent } from './card-footer/card-footer.component';


const COMPONENTS = [
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardSubtitleComponent,
  CardBodyComponent,
  CardActionsComponent,
  CardFooterComponent,
]

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule
  ],
  exports: COMPONENTS
})
export class CardModule { }
