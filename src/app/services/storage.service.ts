import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Plugins } from '@capacitor/core';

const {storage} =Plugins
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() { }

    async keys(){
        const keys = await Storage.keys()
        return keys
    }
    async setObject(key: string, value: any) {
        await Storage.set({key, value: JSON.stringify(value)});
    }
    async getObject(key: string) {
        const location = await Storage.get({ key });      
        return JSON.parse(location.value);
    }

    async removeItem(key: string) {
        await Storage.remove({ key });
    }

    async clear() {
        await Storage.clear();
    }
}