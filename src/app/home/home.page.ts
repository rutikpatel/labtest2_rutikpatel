import { Component,OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private storage:StorageService) {}
  
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
    // this.getLocations()
    this.getGeoLocation()

  }

  async getGeoLocation(){
    let status = await navigator.permissions.query({ name: 'geolocation' }).then()

    console.log(status.state);
    if(status.state === 'denied'){
      this.error = "Please allow the geolocation to use this app"
    }
    
    if (navigator.geolocation) {
      
      navigator.geolocation.getCurrentPosition(async(position) => {
        this.initLocation.longitude = position.coords.longitude;
        this.initLocation.latitude = position.coords.latitude;
        this.storage.setObject(this.date.toLocaleTimeString(), this.initLocation)
        this.getLocations()
        if(this.locations) this.isLoading =false
        await this.storage.keys().then(
          res => { this.keys = res.keys }
        )
      });
    }else {
      this.error = "Something went wrong"
    }
  }
  
  async getLocations(){   
    await this.setKeys()
    this.isLoading = true
    for (let i of this.keys){
      this.storage.getObject(i).then(value =>{ this.location.latitude=(value.latitude),this.location.longitude=value.longitude})    
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
    console.log(this.locations.length);
    
    this.storage.removeItem(key);
    this.temp=this.locations.filter(element=>element.time !== key)
    this.locations = this.temp
    
    // await this.storage.keys().then(
    //   res => { this.keys = res.keys }
    // )

  }
}
