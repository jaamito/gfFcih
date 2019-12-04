import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import * as $ from 'jquery';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertController: AlertController,
  			      private router: Router,
              private loadingController: LoadingController
            ){}

  async tpAction(action) {

    const loading = await this.loadingController.create({
      message: 'Guardant '+action+"...",
      duration: 1000
    });
    loading.present();

    const { role, data } = await loading.onDidDismiss();

    let d: Date = new Date();
    let horaF: string;
    let minF: string;
    let segF: string;

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

    const alert = await this.alertController.create(action);
  
    alert.present();
  }


}
