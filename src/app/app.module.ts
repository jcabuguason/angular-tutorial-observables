import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { PlaceHolderModule } from './modules/place-holder/place-holder.module';
import { PlaceHolderComponent } from './modules/place-holder/place-holder.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PlaceHolderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
