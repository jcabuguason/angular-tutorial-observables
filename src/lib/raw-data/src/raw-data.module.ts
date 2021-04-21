import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';
import { RawDataComponent } from './raw-data.component';
import { RawDataService } from './raw-data.service';
import { LegacyRawDataComponent } from './legacy-raw-data/legacy-raw-data.component';

@NgModule({
  declarations: [RawDataComponent, LegacyRawDataComponent],
  imports: [CommonModule, TableModule, TooltipModule, LanguageModule, HttpClientModule],
  exports: [RawDataComponent],
  bootstrap: [RawDataComponent],
  providers: [RawDataService],
})
export class RawDataModule {}
