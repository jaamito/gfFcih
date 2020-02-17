import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as $ from 'jquery';
import { TabsPageRoutingModule } from './tabs-routing.module';
import {HTTP} from '@ionic-native/http/ngx';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  providers: [HTTP],
  declarations: [TabsPage]
})
export class TabsPageModule {}

