export type Event = {
  clientName: string,
  address: string,
  cellphone: string,
  date: string,
  startHour: string,
  endHour: string,
  pricePerHour: number,
  totalPrice: number,
  totalCost: number,
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

export type Service = {
  type: string,
  providerName: string,
  cost: number,
  price: number,
  description: string,
  instalationHour: string,
  notes: string,
}

export type LoginForm = {
  username: string,
  password: string,
}