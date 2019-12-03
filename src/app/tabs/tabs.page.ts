import { Component } from '@angular/core';
import * as $ from 'jquery';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

import { Device } from '@ionic-native/device/ngx';

import { AlertController } from '@ionic/angular';

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
		private alertController: AlertController
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

	ngAfterViewInit(){
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
			//$(".gfi-imei").html("Imei: "+objTlf.imei)
			//Variables globales
			var d = new Date();
			var fecha = "";
		
			localStorage.setItem('miGato', 'Juan');

			$(".gfi-date").html("Día (0"+d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear()+")")
			//Funciones globales
			$(document).on("click",".gfi-btn-action",function(){
				fecha = d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
				console.log($(this).data("type")+" -> "+fecha+" Imei:"+objTlf.imei)
			})

		});		
	}	
 
}
