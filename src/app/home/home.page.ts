import { Component,OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Storage } from '@capacitor/storage';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private storage: StorageService,private Geolocation:Geolocation) {}
  
  isLoading:Boolean= false
  date:Date =new Date()
  initLocation={
    latitude:0,
    longitude:0
  }
  keys=[]
  error:any
  temp=[]
  locations = []
  location = { latitude: '', longitude: '' }
  
  async ngOnInit():Promise<void>{

    await this.storage.keys().then(
      res => { this.keys = res.keys }
    )
    this.getGeoLocation()
  }

  getLoc(){
    this.Geolocation.getCurrentPosition().then(async (value) => {
      return value
    })
  }

  async getGeoLocation(){
    this.Geolocation.getCurrentPosition().then(async(value) => {
      this.initLocation.longitude = value.coords.longitude;
      this.initLocation.latitude = value.coords.latitude;
      this.storage.setObject(this.date.toLocaleTimeString(), this.initLocation)
      this.getLocations()
      if (this.locations) this.isLoading = false
      await this.storage.keys().then(
        res => { this.keys = res.keys }
      )
    }).catch((error) =>{ 
      if(error.code ===1){
        this.error="Please allow location to use this app"
      }
      else{
        this.error=(error.message)}})
  }
  async getLocations(){   
    await this.setKeys()
    this.isLoading = true
    for (let i of this.keys){
      await this.storage.getObject(i).then(value =>{ this.location=value})    
      let obj = { location: this.location, key: i }
      this.locations.push(obj)
      }
      return this.locations
    }
  async setKeys(){
    await this.storage.keys().then(
      res => {this.keys = res.keys}
    )
  }
  async removeKey(key:any){    
    this.storage.removeItem(key);
    this.temp=this.locations.filter(element=>element.key !== key)
    this.locations = this.temp
  }
}
