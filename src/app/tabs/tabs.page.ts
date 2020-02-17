import { Component } from '@angular/core';
import * as $ from 'jquery';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

	requestObject: any = null;
 	userName: string = '';
  	userPkId: string = '';
 	// http://pasarela.garciafaura.com/gfapp/accessworkcontrol/getActivity
 	// http://pasarela.garciafaura.com/gfapp/accessworkcontrol/login   -> POST ["imei"]
 	// http://pasarela.garciafaura.com/gfapp/accessworkcontrol/signin  -> POST ["imei"]
 	// http://pasarela.garciafaura.com/gfapp/accessworkcontrol/signout -> POST ["imei"]
 	// http://pasarela.garciafaura.com/gfapp/accessworkcontrol/delactivity

	constructor(
		private uniqueDeviceID: UniqueDeviceID,
		private device: Device,
		private uid: Uid, 
		private androidPermissions: AndroidPermissions,
		private alertController: AlertController,
		private network: Network,
		private geolocation: Geolocation,
		private loadingController: LoadingController,
		private backgroundMode: BackgroundMode,
		private http: HTTP
		){
	}

	//Pedir permisos sobre el TLF
	getPermission(){
	    this.androidPermissions.checkPermission(
	      this.androidPermissions.PERMISSION.READ_PHONE_STATE
	    ).then(res => {
	      if(res.hasPermission){

	      }else{
	        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
	          alert("Permissos actualitzats! Reinicia la aplicació");
	        }).catch(error => {
	          //alert("Error! "+error);
	        });
	      }
	    }).catch(error => {
	      //alert("Error! "+error);
	    });
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

	//GET INFO USUARIO
	loginUser(imei){
	    let data = {
	      'imei': imei,//imei,
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

	createActionUser(imei,action){

	    let data = {
	      'imei': imei,//imei,
	      'action': action,
	      'latitud': '41.3887901',
	      'longitud': '2.1589899'
	    };

	    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
	    .then(res => {
	      var obj = JSON.parse(res.data);
	      this.requestObject = localStorage.getItem("lastFichada")//obj["status"]
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
			uuid      :this.uid.UUID,
			vCordova  :this.device.cordova,
			isVirtual :this.device.isVirtual,
			marca     :this.device.manufacturer,
			model     :this.device.model,
			platform  :this.device.platform,
			serial    :this.device.serial,
			version   :this.device.version
		};

		this.getPermission()
		this.loginUser(objTlf.imei);


		$(document).ready(function(){

			//Variables globales
			let d: Date = new Date();
			let fecha: string;
			let fechaM: string;
			let fechaD: string;

		    if(d.getMonth() < 10){fechaM = "0"+(d.getMonth()).toString();}else{fechaM = d.getMonth().toString();}
		    if(d.getDate() < 10){fechaD = "0"+d.getDate().toString();}else{fechaD = d.getDate().toString();}

			//localStorage.removeItem('datosUser');
			if (localStorage.getItem("datosUser") === null) {
			  	localStorage.setItem('datosUser', "");
			}

			if (localStorage.getItem("ubicacion") === null) {
			  	localStorage.setItem('ubicacion', "");
			}

			if (localStorage.getItem("lastFichada") === null) {
			  	localStorage.setItem('lastFichada', "");
			}

			if(localStorage.getItem("lastFichada") != ''){
				$(".gfi-last-fich").html(localStorage.getItem("lastFichada"))
			}
			console.log(localStorage.getItem("datosUser"))
			$(".gfi-date").html("Día ("+fechaD+"-"+fechaM+"-"+d.getFullYear()+")")
			//Funciones globales
			$(document).on("click",".gfi-btn-action",function(){
				fecha = fechaD+"-"+fechaM+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
				console.log($(this).data("type")+" -> "+fecha+" Imei:"+objTlf.imei)
			})
		});		
	}

	async tpAction(action) {
		let actionMessage: string;
		let actionUser: string;

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


		if(action == 'Entrada'){
			actionMessage = 'Entrada feta amb exit.'
			actionUser = "signin";
			let hora: string =  ";E:"+horaF+":"+minF+":"+segF;
		    let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
		    //arrPrincipal = arrPrincipal.concat(arr);
		    localStorage.setItem('datosUser', arrPrincipal);
		    localStorage.setItem('lastFichada', "<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>");
      $(".gfi-last-fich").html("<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>")
		}else if(action == 'Sortida'){
			actionMessage = 'Sortida feta amb exit.'
			actionUser = "signout";
			let hora: string =  ";S:"+horaF+":"+minF+":"+segF;
			let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
			  //arrPrincipal = arrPrincipal.concat(arr);
			localStorage.setItem('datosUser', arrPrincipal);
			localStorage.setItem('lastFichada', "<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>");
			$(".gfi-last-fich").html("<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>")
		}

		this.createActionUser(this.uid.IMEI,actionUser);

		action = {
	        header: '',
	        subHeader: '',
	        message: actionMessage,
	        buttons: ['OK']
	    }

	    const alert = await this.alertController.create(action);
    	alert.present();
	}	
}
