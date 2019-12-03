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
          private loadingController: LoadingController) {}

  async tpAction(action) {

    const loading = await this.loadingController.create({
      message: 'Guardan '+action+"...",
      duration: 1000
    });
    loading.present();

    const { role, data } = await loading.onDidDismiss();

    var d = new Date();

    if(action == "Entrada"){
      $(".gfi-last-fich").html("<ion-badge color='primary' >E:"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"</ion-badge>")
      $(".gfi-last-fich").attr("color","primary");
      action = {
        header: '',
        subHeader: '',
        message: 'Entrada feta amb exit.',
        buttons: ['OK']
      }
    }else{
      $(".gfi-last-fich").html("<ion-badge color='tertiary' >S:"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"</ion-badge>")
      $(".gfi-last-fich").attr("width","tertiary");
      action = {
        header: '',
        subHeader: '',
        message: 'Sortida feta amb exit.',
        buttons: ['OK']
      }
    }

    var cat = localStorage.getItem('miGato');
    console.log(cat)

    const alert = await this.alertController.create(action);
  
    alert.present();
  }


}
