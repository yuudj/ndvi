import { Component, OnInit } from '@angular/core';
import { Paho } from 'ng2-mqtt';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hex-grid',
  templateUrl: './hex-grid.component.html',
  styleUrls: ['./hex-grid.component.scss']
})
export class HexGridComponent implements OnInit {
  private _client: Paho.MQTT.Client;
  private _baseTopic: string;
  private _isSsl: boolean = false;
  public imageData: string;
  public constructor(private domSanitizer: DomSanitizer) {
    this._baseTopic = "DAF4-48A8-";

    if (location.protocol != 'https:') {
      this._isSsl=true;
      
    } else {
      this._isSsl=true;
      
    }
    this._client = new Paho.MQTT.Client('iot.eclipse.org', this._isSsl? Number(443): Number(80) , '/ws', 'fruta1234567788');
    

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

    this._client.connect({ onSuccess: this.onConnected.bind(this), useSSL:  this._isSsl });
  }
  private onConnected(): void {
    console.log('Conected.');
    var subOptions = {
      qos: 0,
      onSuccess: this.onSuccess,
      onFailure: this.onFailure
    };
    this._client.subscribe(this._baseTopic + '/data', subOptions);
  }

  private onSuccess(invocationContext): void {
    console.log('Subscription sucess');
  }


  private onFailure(invocationContext, errorCode, errorMessage): void {
    console.error('Subscription error', errorCode, errorMessage);
  }

  ngOnInit() {
  }

}