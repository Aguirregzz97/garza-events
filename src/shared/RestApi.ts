import { shouldMockApis } from "./shouldMockApis";

export function getServices() {
  let res : any
  if (shouldMockApis()) {
    res = '{ "data": { "getServices": [ { "_id": "5d9f4a230aa6b346ba825b8d", "type": "Iluminacion", "description": "Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "price": 1200, "cost": 1200 }, { "_id": "5da7a583bf70f831208bbe46", "type": "Iluminacion", "description": "Iluminación paquete 2 - 4 spots led, 4 luces robóticas", "price": 0, "cost": 2000 }, { "_id": "5da7a59abf70f831208bbe47", "type": "PistaIluminada", "description": "Pista 3x3", "price": 0, "cost": 3000 } ] } }' 
    res = JSON.parse(res)
    return res.data.getServices
  } else {
    console.log('here goes fetch')
  }
}

export function getEvents() {
  let res : any
  if (shouldMockApis()) {
    res = '{ "data": { "getEvents": [ { "clientName": "Ricardo", "address": "R", "cellphone": "1111111", "date": "2019-01-01", "startHour": "18:00", "endHour": "21:00", "pricePerHour": "500", "totalPrice": "4000", "totalCost": "3000", "providers": [ { "type": "Iluminacion", "providerName": "proveedor iluminacion", "cost": "1000", "price": "2000", "description": "Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "instalationHour": "10:00 PM", "notes": "This is notes for iluminacion" }, { "type": "PistaIluminada", "providerName": "proveedor pista", "cost": "500", "price": "1000", "description": "Pista 3x3", "instalationHour": "9:00 PM", "notes": "This is notes for pista" } ] }, { "clientName": "Andres", "address": "Camino de los bengalies", "cellphone": "8110223115", "date": "2019-01-01", "startHour": "18:00", "endHour": "21:00", "pricePerHour": "500", "totalPrice": "4000", "totalCost": "3000", "providers": [ { "type": "Iluminacion", "providerName": "proveedor iluminacion", "cost": "1000", "price": "2000", "description": "Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "instalationHour": "10:00 PM", "notes": "This is notes for iluminacion" }, { "type": "PistaIluminada", "providerName": "proveedor pista", "cost": "500", "price": "1000", "description": "Pista 3x3", "instalationHour": "9:00 PM", "notes": "This is notes for pista" } ] } ] } }' 
    res = JSON.parse(res)
    return res.data.getEvents
  } else {
    console.log('here goes fetch')
  }
}
