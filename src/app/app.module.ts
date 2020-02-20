import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    StatusBar,
    Network,
    SplashScreen,
	  UniqueDeviceID,
    Uid,
    BackgroundMode,
    Platform,
    Device,
    Geolocation,
    AndroidPermissions,
    AppUpdate,
    AppVersion,
    HTTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
