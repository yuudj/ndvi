import { Component, OnInit } from '@angular/core';
import { Paho } from 'ng2-mqtt';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: { 'class': 'full-height layout-column' }
})
export class AboutComponent implements OnInit {
  private _client: Paho.MQTT.Client;
  private _baseTopic: string;
  public imageData:string;
  public constructor(private domSanitizer: DomSanitizer) {
    this._baseTopic= "DAF4-48A8";
    this._client = new Paho.MQTT.Client('iot.eclipse.org', Number(80), '/ws', 'fruta1234567788');

    this._client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost.');
    };

    this._client.onMessageArrived = (message: Paho.MQTT.Message) => {
      console.log('Message arrived.');
      try {
        this.imageData = 'data:image/jpg;base64,' + message.payloadString;  
      } catch (error) {
        
      }
      
    };

    this._client.connect({ onSuccess: this.onConnected.bind(this), useSSL: false });
  }
  private onConnected(): void {
    console.log('Conected.');
    var subOptions = {
      qos:0,
      onSuccess:this.onSuccess,
      onFailure:this.onFailure
    };
    this._client.subscribe(this._baseTopic + '/data', subOptions);
  }

  private onSuccess(invocationContext): void {
    console.log('Subscription sucess');
  }


  private onFailure(invocationContext, errorCode, errorMessage): void {
    console.error('Subscription error', errorCode,errorMessage);
  }

  ngOnInit() {
  }

}
