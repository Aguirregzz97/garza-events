  export type Event = {
  _id: string,
  clientName: string,
  address: string,
  cellphone: string,
  date: string,
  startHour: string,
  endHour: string,
  pricePerHour: number,
  totalPrice: number,
  totalCost: number,
  status: string,
  providers: Service[],
}

export type ServiceToUI = {
  name: string,
  selectValues: {[key: string]: number[]}
}

export type ServiceToDisplay = {
  type: string,
  description: string,
  price: number,
  cost: number,
}

export type ServiceClient = {
  priceClient: number,
  service: string,
  notes: string,
  installationHour: string,
  description: string,
}

export type Service = {
  _id: string,
  type: string,
  priceProvider: number,
  priceClient: number,
  description: string,
  instalationHour: string,
  notes: string,
  service: string,
}

export type LoginForm = {
  username: string,
  password: string,
}

export enum Status {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED'
}