import { shouldMockApis } from "./shouldMockApis"
import { ServiceToDisplay, Event, ServiceClient, Status, Service, LoginForm } from "./types"
import { successDialog, errorDialog } from "./GenericAlerts"

interface IGetServicesResponseData {
  getServices: ServiceToDisplay[];
}

interface IGetEventsResponseData {
  getEvents: Event[]
}

interface IGetEventResponseData {
  getEvent: Event
}

interface IGraphqlDataResponse <T> {
  data: T
}

interface ILoginDataResponse {
  statusCode: number,
  error: string,
  message: string,
  token: string,
}

export function redirectToLogin() {
  localStorage.clear()
  window.location.href = '/'
}

export async function loginApi(loginForm: LoginForm) : Promise<boolean> {
  if (shouldMockApis()) {
    return  true
  } else {
    try {
      const response = await fetch('http://168.62.52.177:3000/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: `${loginForm.username}`, password: `${loginForm.password}` }),
      })
      if (response.status === 401) {
        return false
      } else {
        const res: ILoginDataResponse = await response.json()
        console.log(res)
        localStorage.setItem('token', res.token)
        return true
      }
    } catch (error) {
      return error
    }
  }
}

export async function getServices() : Promise<ServiceToDisplay[]> {
  if (shouldMockApis()) { 
    const res : IGraphqlDataResponse<IGetServicesResponseData> = JSON.parse('{ "data": { "getServices": [ { "_id": "5d9f4a230aa6b346ba825b8d", "type": "Iluminacion", "description": "Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "price": 1200, "cost": 1200 }, { "_id": "5da7a583bf70f831208bbe46", "type": "Iluminacion", "description": "Iluminación paquete 2 - 4 spots led, 4 luces robóticas", "price": 0, "cost": 2000 }, { "_id": "5da7a59abf70f831208bbe47", "type": "PistaIluminada", "description": "Pista 3x3", "price": 0, "cost": 3000 } ] } }')
    return res.data.getServices
  } else {
    try {
      const response = await fetch('http://168.62.52.177:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ getServices { type description price cost } }' }),
      })
      const res : IGraphqlDataResponse<IGetServicesResponseData> = await response.json()
      return res.data.getServices
    } catch (error) {
      return error
    }
  }
}

export async function postEvent(event: Event) : Promise<void> {
  if (shouldMockApis()) { 
    console.log('Magical Post :D', event)
  } else {
    let servicesClient : ServiceClient[] = []
    for (const provider of event.providers) {
      if (provider.description === "") continue
      let serviceClient : ServiceClient = {
        service: provider.type,
        notes: provider.notes,
        installationHour: provider.instalationHour,
        priceClient: provider.priceClient,
        description: provider.description,
      }
      servicesClient.push(serviceClient)
    }
    let servicesString : string = ""
    for (const service of servicesClient) {
      let tmp = `
      {
        service: "${service.service}",
        notes: "${service.notes}",
        installationHour: "${service.installationHour}",
        priceClient: ${service.priceClient},
        description: "${service.description}",
      },
      `
      servicesString += tmp
    }
    const mutation = `mutation {
      createEvent (eventInfo: {
        clientName: "${event.clientName}",
        address: "${event.address}",
        cellphone: "${event.cellphone}",
        date: "${event.date}",
        startHour: "${event.startHour}",
        endHour: "${event.endHour}",
        totalPrice: ${event.totalPrice}
        providers: [
          ${servicesString}
        ]
      }) {
        clientName,
        _id
      }
    }` 
    const response = await fetch('http://168.62.52.177:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation })
    })
    if (response.status === 200) {
      await successDialog('Evento guardado con exito')
    } else {
      await errorDialog('Hubo un error al guardar el evento')
    }
  }
}

export async function getEvents() : Promise<Event[]> {
  if (shouldMockApis()) {
    const res : IGraphqlDataResponse<IGetEventsResponseData> = JSON.parse('{ "data":{ "getEvents":[ { "_id":"5d9f4a230aa6b346ba825b8", "clientName":"Ricardo", "address":"R", "cellphone":"1111111", "date":"2019-01-01", "startHour":"18:00", "endHour":"21:00", "pricePerHour":"500", "totalPrice":"4000", "totalCost":"3000", "status":"PENDING", "providers":[ { "type":"Iluminacion", "providerName":"proveedor iluminacion", "cost":"1000", "price":"2000", "description":"Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "instalationHour":"10:00 PM", "notes":"This is notes for iluminacion" }, { "type":"PistaIluminada", "providerName":"proveedor pista", "cost":"500", "price":"1000", "description":"Pista 3x3", "instalationHour":"9:00 PM", "notes":"This is notes for pista" } ] } ] } }')
    return res.data.getEvents
  } else {
    try {
      const response = await fetch('http://168.62.52.177:3000/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: '{ getEvents {  _id clientName date startHour endHour providers { priceClient  notes installationHour service} status  } }' }),
      })
      const res : IGraphqlDataResponse<IGetEventsResponseData> = await response.json()
      return res.data.getEvents
    } catch (error) {
      redirectToLogin()
      return error
    }
  }
}

export async function getEvent(id: string) {
  if (shouldMockApis()) {
    const res : IGraphqlDataResponse<IGetEventResponseData> = JSON.parse('{ "data": { "getEvent": { "_id": "5d9f4a230aa6b346ba825b8d", "clientName": "Ricardo", "address": "R", "cellphone": "1111111", "date": "2019-01-01", "startHour": "18:00", "endHour": "21:00", "pricePerHour": "500", "totalPrice": "4000", "totalCost": "3000", "providers": [ { "type": "Iluminacion", "service": "proveedor iluminacion", "cost": "1000", "price": "2000", "description": "Iluminación paquete 1 - 2 spots led, 2 luces robóticas", "instalationHour": "10:00 PM", "notes": "This is notes for iluminacion" }, { "type": "PistaIluminada", "service": "proveedor pista", "cost": "500", "price": "1000", "description": "Pista 3x3", "instalationHour": "9:00 PM", "notes": "This is notes for pista" } ] } } }')
    return res.data.getEvent
  } else {
    try {
      const response = await fetch('http://168.62.52.177:3000/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: `{ getEvent(eventID: \"${id}\") { _id clientName date startHour endHour cellphone address totalPrice providers { _id priceClient notes installationHour service priceProvider description } status } }` }),
      })
      const res : IGraphqlDataResponse<IGetEventResponseData> = await response.json()
      return res.data.getEvent
    } catch (error) {
      redirectToLogin()
      return error
    }
  }
}

export async function changeEventStatus(id: string, newStatus: Status) : Promise<void> {
  if (shouldMockApis()) {
    console.log('Magic change status :D', id)
  } else {
    let mutation : string = `mutation {
      changeEventStatus(eventID: "${id}", newStatus: ${newStatus})
      { _id clientName }
    }`
    const response = await fetch('http://168.62.52.177:3000/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mutation })
    })
    if (response.status === 200) {
      if (newStatus == Status.CANCELLED) {
        await successDialog('Evento borrado con exito')
      } else {
        await successDialog('Evento aceptado!')
      }
    } else {
      await errorDialog('Hubo un error al borrar el evento')
      redirectToLogin()
    }
  }
}

export async function changeDate(id: string, newDate: string) : Promise<void> {
  if (shouldMockApis()) {
    console.log('Magic edit date :D', id)
  } else {
    let mutation : string = `mutation {
      changeDate(eventID: "${id}", startDateNew: "${newDate}") {
        _id
        clientName
      }
    }`
    const response = await fetch('http://168.62.52.177:3000/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mutation })
    })
    if (response.status == 200) {
      await successDialog('Fecha editada correctamente')
    } else {
      await errorDialog('Hubo un error al editar la fecha')
      redirectToLogin()
    }
  }
}


export async function changeHours(id: string, newStartHour: string, newEndHour: string) : Promise<void> {
  if (shouldMockApis()) {
    console.log('Magic edit hours :D', id)
  } else {
    let mutation : string = `mutation {
      changeHours(
        eventID: "${id}"
        startHourNew: "${newStartHour}"
        endHourNew: "${newEndHour}"
      ) {
        _id
        clientName
      }
    }`
    const response = await fetch('http://168.62.52.177:3000/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mutation })
    })
    if (response.status == 200) {
      await successDialog('Horas editadas correctamente')
    } else {
      await errorDialog('Hubo un error al editar las horas')
      redirectToLogin()
    }
  }
}

export async function changeProvider(event: Event, provider: Service, newCost: number) {
  if (shouldMockApis()) {
    console.log('Magic edit Provider :D', event)
  } else {
    let mutation = `mutation {
      changeProvider(
        eventID: "${event._id}"
        providerID: "${provider._id}"
        providerInfo: {
          priceProvider: ${newCost}
        }
      ) { _id clientName }
    }`
    const response = await fetch('http://168.62.52.177:3000/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `${localStorage.getItem('token')}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mutation })
    })
    if (response.status == 200) {
      await successDialog('Proveedor editado correctamente')
    } else {
      await errorDialog('Hubo un error al editar el proveedor')
      redirectToLogin()
    }
  }
}