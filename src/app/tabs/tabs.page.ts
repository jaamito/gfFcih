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

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
 
	constructor(
		private uniqueDeviceID: UniqueDeviceID,
		private device: Device,
		private uid: Uid, 
		private androidPermissions: AndroidPermissions,
		private alertController: AlertController,
		private network: Network,
		private geolocation: Geolocation,
		private backgroundMode: BackgroundMode
		){}


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

	ngAfterViewInit(){
		this.backgroundMode.setEnabled(true);

		let autoSaveInterval: number = setInterval( ()=>{
			this.getPosition();
		},5000);

		let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
		  $(".gfi-imei").html('network was disconnected :-(');
		});

		// stop disconnect watch
		disconnectSubscription.unsubscribe();
		// watch network for a connection
		let connectSubscription = this.network.onConnect().subscribe(() => {
		  $(".gfi-imei").html('network connected!');
		  // We just got a connection but we need to wait briefly
		   // before we determine the connection type. Might need to wait.
		  // prior to doing any api requests as well.
		  setTimeout(() => {
		    if (this.network.type === 'wifi') {
		      $(".gfi-imei").html('we got a wifi connection, woohoo!');
		    }
		  }, 3000);
		});

		// stop connect watch
		connectSubscription.unsubscribe();


		this.getPermission()

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

		$(document).ready(function(){

			//Variables globales
			let d: Date = new Date();
			let fecha: string;
			let fechaM: string;
			let fechaD: string;

		    if(d.getMonth() < 10){fechaM = "0"+d.getMonth().toString();}else{fechaM = d.getMonth().toString();}
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
 
}
