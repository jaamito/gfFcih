import { Component,NgZone } from '@angular/core';
import * as $ from 'jquery';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController } from '@ionic/angular';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

	requestObject: any = null;
	requestError: any = null;
 	userName: string;
  	userPkId: string;
  	AppName:string;
  	PackageName:string;
  	VersionCode:string|number;
  	VersionNumber:string;

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
		private http: HTTP,
		private appUpdate: AppUpdate,
		private appVersion: AppVersion,
		private zone: NgZone
		){

		//Revisar si existe algúna actualización
		const updateUrl = 'http://pasarela.garciafaura.com/gfapp/version.xml';
   		this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('Update available') });
   		
   		//Pedir persimos para la ubicación y la ubicación
	    this.geolocation.getCurrentPosition().then((resp) => {
			let lon: number = resp.coords.longitude
			let lat: number = resp.coords.latitude

		 	let lati: string = lat.toString()+","+lon.toString(); 
	      	let arrLati: string = lati;//localStorage.getItem("ubicacion")+lati.trim();
	      	//arrPrincipal = arrPrincipal.concat(arr);
	      	localStorage.setItem('ubicacion', arrLati);
	      	//$(".gfi-lat").append(localStorage.getItem("ubicacion"))
		 	//$(".gfi-lon").html(lon.toString())
		}).catch((error) => {
		  console.log('Error getting location', error);
		});

		let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
		 //data.coords.latitude
		 //data.coords.longitude
		});

		//Pedir permisos para leer IMEI
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

	    //Obtener datos de la apk
	    this.appVersion.getAppName().then(value => {
	      this.AppName = value;
	    }).catch(err => {
	      alert(err);
	    });
	    this.appVersion.getPackageName().then(value => {
	      this.PackageName = value;
	    }).catch(err => {
	      alert(err);
	    });
	    this.appVersion.getVersionCode().then(value => {
	      this.VersionCode = value;
	    }).catch(err => {
	      alert(err);
	    });
	    this.appVersion.getVersionNumber().then(value => {
	      this.VersionNumber = value;
	    }).catch(err => {
	      alert(err);
	    });

	    let desconectar = this.network.onDisconnect().subscribe(() => {
	  		localStorage.setItem('network', "0");
	  		console.log('network no connect!');
	  		$(".gfi-resi").append("[network no connect!]")
	  	});

	  	let conectar = this.network.onConnect().subscribe(() => {
		  	console.log('network connected!');
		  	$(".gfi-resi").append("[network connected!]")
		  	localStorage.setItem('network', "1");

		  	if(localStorage.getItem("datosUser") != ''){
		  		let data = {
			      'imei': this.uid.IMEI,//imei,
			      'action': "pushHisto",
			      'arrList': localStorage.getItem("datosUser")
			    };

			    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
			    .then(res => {
			      var obj = JSON.parse(res.data);
			      if(obj["status"] == 'ok'){
			      	localStorage.clear();
			      	this.requestError = "Success";
			      }else{
			      	this.requestError = "Sense connexió a Internet";
			      }

			    }).catch(err => {
			      this.requestError = JSON.stringify(err)
			    });
		  	}
		  /*
		  setTimeout(() => {
		    if (this.network.type === 'wifi') {
		      console.log('Conectados al Wi-Fi');
		    }
		    if (this.network.type === 'ethernet') {
		      console.log('Conectados al ethernet');
		    }
		    if (this.network.type === '3g') {
		      console.log('Conectados al 3g');
		    }
		  }, 3000);*/
		});
	}


	doRefresh(event) {
	    //this.zone.run(() => {});
	    setTimeout(() => {
	    	this.ngAfterViewInit();
	    	event.target.complete();
	    }, 2000);
		
	}


	//limpiar Cache
	cleanCache(){
		localStorage.clear();
	}

	//GET INFO USUARIO
	loginUser(imei){
	    let data = {
	      'imei': imei,//imei,
	      'action': 'login',
	    };

	    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
	    .then(res => {
	      var obj = JSON.parse(res.data);
	      this.userName = obj["userName"];
	      this.userPkId = obj["userPkId"];
	    }).catch(err => {
	      this.userAlert();
	    });

	    $(".gfi-resi").html("login")
	}

	async presentAlert() {
	    const alert = await this.alertController.create({
	      header: 'Alerta',
	      subHeader: 'No tienes conexión a internet',
	      message: 'La acción quedará guardada, pero revisa tu conexión a internet.',
	      buttons: ['OK']
	    });

	    await alert.present();
	  }

	  async userAlert() {
	    const alert = await this.alertController.create({
	      header: 'Alerta',
	      subHeader: 'No se ha podido recuperar tu usuario',
	      message: 'Contacta con jacabanero@garciafaura\nilopez@garciafaura.com',
	      buttons: ['OK']
	    });

	    await alert.present();
	  }

	createActionUser(imei,action,lat,lon){
		if(localStorage.getItem('network') == "1"){
			$(".gfi-network").html("Tienes conexión");
			let data = {
		      'imei': imei,
		      'action': action,
		      'latitud': lat,
		      'longitud': lon
		    };

		    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
		    .then(res => {
		      //var obj = JSON.parse(res.data);
		      //this.requestObject = "Acció executada amb exit!";
		    }).catch(err => {
		      //this.requestObject = "No s'ha pogut contactar amb el servidor"
		    });
		    $(".gfi-resi").html("Create "+action)
		}else{
			this.presentAlert();
		}
	}

	pushHistoUser(imei,action,arrList){

	    let data = {
	      'imei': imei,//imei,
	      'action': action,
	      'arrList': arrList
	    };

	    this.http.get('http://pasarela.garciafaura.com/gfapp/newlogin.php', data,{})
	    .then(res => {
	      var obj = JSON.parse(res.data);
	      if(obj["status"] == 'ok'){
	      	localStorage.clear();
	      	this.requestError = "Success";
	      }else{
	      	this.requestError = "Sense connexió a Internet";
	      }

	    }).catch(err => {
	      this.requestError = JSON.stringify(err)
	    });
	    $(".gfi-resi").html("PushInfo")
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

		//this.getPosition();
		//this.getPermission();
		this.loginUser(objTlf.imei);

		/*if(localStorage.getItem("datosUser") != '' && localStorage.getItem("datosUser") !== null){
			//this.pushHistoUser(this.uid.IMEI,"pushHisto",localStorage.getItem("datosUser"))
		}*/

		$(document).ready(function(){

			//Variables globales
			let d: Date = new Date();
			let fecha: string;
			let fechaM: string;
			let fechaD: string;

			//localStorage.removeItem('datosUser');
			if (localStorage.getItem("datosUser") === null) {
			  	localStorage.setItem('datosUser', "");
			}

			if (localStorage.getItem("network") === null) {
			  	localStorage.setItem('network', "");
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
			$(".gfi-infoFich").html(localStorage.getItem("datosUser"))

			$(".gfi-date").html("Día ("+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear()+")")
			$(".gfi-date").data("dta",d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear())
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
		let result: any;

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

	    var fechActual = $(".gfi-date").data("dta")
	    var ubication = localStorage.getItem("ubicacion");
		var ubicat = ubication.split(",");

		if(action == 'Entrada'){
			actionMessage = 'Entrada feta amb exit.'
			actionUser = "signin";
			this.createActionUser(this.uid.IMEI,actionUser,ubicat[0],ubicat[1]);
		    if(localStorage.getItem('network') == "0"){
		    	let hora: string =  ";E:"+horaF+":"+minF+":"+segF+"|"+fechActual+"|"+localStorage.getItem("ubicacion");
		    	let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
			    //arrPrincipal = arrPrincipal.concat(arr);
			    localStorage.setItem('datosUser', arrPrincipal);
			    $(".gfi-infoFich").html(localStorage.getItem("datosUser"))
			}
		    localStorage.setItem('lastFichada', "<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>");
      		$(".gfi-last-fich").html("<ion-badge color='primary' >E:"+horaF+":"+minF+":"+segF+"</ion-badge>")
		}else if(action == 'Sortida'){
			actionMessage = 'Sortida feta amb exit.'
			actionUser = "signout";
			this.createActionUser(this.uid.IMEI,actionUser,ubicat[0],ubicat[1]);
			if(localStorage.getItem('network') == "0"){
				let hora: string =  ";S:"+horaF+":"+minF+":"+segF+"|"+fechActual+"|"+localStorage.getItem("ubicacion");
		    	let arrPrincipal: string = localStorage.getItem("datosUser")+hora.trim();
			    //arrPrincipal = arrPrincipal.concat(arr);
			    localStorage.setItem('datosUser', arrPrincipal);
			    $(".gfi-infoFich").html(localStorage.getItem("datosUser"))
			}
			localStorage.setItem('lastFichada', "<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>");
			$(".gfi-last-fich").html("<ion-badge color='tertiary' >S:"+horaF+":"+minF+":"+segF+"</ion-badge>")
		}

		action = {
	        header: '',
	        subHeader: '',
	        message: actionMessage,
	        buttons: ['OK']
	    }

	    const alert = await this.alertController.create(action);
	    if(localStorage.getItem('network') == "1"){
    		alert.present();
    	}
	}	
}
