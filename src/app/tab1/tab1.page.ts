import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import * as $ from 'jquery';
import { Uid } from '@ionic-native/uid/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  requestObject: any = null;
  userName: string = '';
  userPkId: string = '';

  constructor(private uid: Uid,
              private alertController: AlertController,
  			      private router: Router,
              private loadingController: LoadingController,
              private geolocation: Geolocation,
              private backgroundMode: BackgroundMode,
              //private http: HttpClient
              private http: HTTP
  ){}

  async tpAction(action) {
    const loading = await this.loadingController.create({
      message: 'Guardant '+action+"...",
      duration: 1000
    });
    loading.present();

    const { role, data } = await loading.onDidDismiss();

    var objTlf = {
      imei      :this.uid.IMEI, 
      iccid     :this.uid.ICCID, 
      imsi      :this.uid.IMSI,
      mac       :this.uid.MAC,
      uuid      :this.uid.UUID
    };

    let d: Date = new Date();
    let horaF: string;
    let minF: string;
    let segF: string;
    let actionUser: string = "xxxx";
    if(d.getHours() < 10){
      horaF = "0"+d.getHours().toString();
    }else{
      horaF = d.getHours().toString();
    }

    if(d.getMinutes() < 10){
      minF = "0"+d.getMinutes().toString();
    }else{
      minF = d.getMinutes().toString();
    }

    if(d.getSeconds() < 10){
      segF = "0"+d.getSeconds().toString();
    }else{
      segF = d.getSeconds().toString();
    }

    if(action == "Entrada"){
      actionUser = "entrada";
      let hora: string =  ";E:"+horaF+":"+minF+":"+segF;
      let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
      //arrPrincipal = arrPrincipal.concat(arr);
      localStorage.setItem('datosUser', arrPrincipal);
      localStorage.setItem('lastFichada', "<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>");
      $(".gfi-last-fich").html("<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>")

      action = {
        header: '',
        subHeader: '',
        message: 'Entrada feta amb exit.',
        buttons: ['OK']
      }
    }else{
      actionUser = "sortida";
      let hora: string =  ";S:"+horaF+":"+minF+":"+segF;
      let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
      //arrPrincipal = arrPrincipal.concat(arr);
      localStorage.setItem('datosUser', arrPrincipal);
      localStorage.setItem('lastFichada', "<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>");
      $(".gfi-last-fich").html("<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>")

      action = {
        header: '',
        subHeader: '',
        message: 'Sortida feta amb èxit.',
        buttons: ['OK']
      }
    }

    let dataRequest = {
      'imei': objTlf["imei"],
      'action': actionUser,
      'latitud': '41.3887901',
      'longitud': '2.1589899',
    };

    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', dataRequest,{})
    .then(res => {
      var obj = JSON.parse(res.data);
      this.userName = obj["userName"];
      this.userPkId = obj["userPkId"];
    }).catch(err => {
      this.requestObject = JSON.stringify(err)
    });
    
    const alert = await this.alertController.create(action);
    alert.present();
  }

  loginUser(imei){
    let data = {
      'imei': imei,
      'action': 'login',
      'latitud': '41.3887901',
      'longitud': '2.1589899'
    };

    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
    .then(res => {
      var obj = JSON.parse(res.data);
      this.userName = obj["userName"];
      this.userPkId = obj["userPkId"];
    }).catch(err => {
      this.requestObject = JSON.stringify(err)
    });
  }

  ngAfterViewInit(){

    var objTlf = {
      imei      :this.uid.IMEI, 
      iccid     :this.uid.ICCID, 
      imsi      :this.uid.IMSI,
      mac       :this.uid.MAC,
      uuid      :this.uid.UUID
    };

    this.loginUser(objTlf.imei);
  }


  getPosition(){
    this.geolocation.getCurrentPosition().then((resp) => {
      let lon: number = resp.coords.longitude
      let lat: number = resp.coords.latitude

      let lati: string = "["+lat.toString()+"]" 
          let arrLati: string = localStorage.getItem("ubicacion")+lati.trim();
          //arrPrincipal = arrPrincipal.concat(arr);
          localStorage.setItem('ubicacion', arrLati);
          $(".gfi-lat").append(localStorage.getItem("ubicacion"))
      //$(".gfi-lon").html(lon.toString())
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
     //data.coords.latitude
     //data.coords.longitude
    });
  }


}
