import * as React from 'react'
import { Event, Service, ServiceToDisplay, ServiceToUI } from '../shared/types'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import styled from 'styled-components'
import { getServices } from '../shared/RestApi'

const Container = styled.div`
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
  paddingBottom: '500px';
`
const EventRegistrationContainer = styled.div`
  display: flex;
  justify-content: center;
  font-family: 'Roboto';
`
const FormRect = styled.div`
  border-radius: 4px;
  margin-top: 100px;
  margin-bottom: 100px;
  width: 70%;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  padding: 30px;
  padding-right: 50px;
  padding-left: 50px;
  position: sticky;

  @media only screen and (max-width: 700px) {
    width: 90%;
  } 
`
const HeadingForms = styled.h1`
  color: black;
  padding-top: 10px;
  padding-bottom: 10px;

  @media only screen and (max-width: 700px) {
    font-size: 30px;
  } 
`
const SubmitButton = styled.button`
  margin-top: 20px;
  width: 40%;
  font-family: roboto;
  font-size: 16px;
  line-height: 1.5;
  color: #fff;
  height: 55px;
  border-radius: 3px;
  background: #0B4163;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;
  -o-transition: all .4s;
  -moz-transition: all .4s;
  transition: all .4s;

  &:hover {
    cursor: pointer;
    background: #333333;
  }
`
const ServicesHeading = styled.h2`
  padding-top: 10px;

  @media only screen and (max-width: 700px) {
    font-size: 30px;
  } 
`
const ServiceBox = styled.div`
  padding: 15px;
  border: 3px solid #0B4163;
  margin-bottom: 20px;
  border-radius: 10px;
`
const PriceHeading = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  font-family: roboto;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 25px;
`

type State = {
  event: Event | any,
  servicesToUi: ServiceToUI[]
}

type Props = {
}

export class EventRegistration extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      event: undefined,
      servicesToUi: [],
    }
  }

  async componentDidMount() {
    let x: Event = { ...this.state.event }
    x.clientName = ''
    x.cellphone = ''
    x.address = ''
    x.date = ''
    x.startHour = ''
    x.endHour = ''
    x.pricePerHour = 0
    x.totalPrice = 0
    x.totalCost = 0
    x.providers = this.getArrServices()

    let servicesToUi: ServiceToUI[] = this.getServicesToUi()

    await this.setState({
      event: x,
      servicesToUi: servicesToUi,
    })
  }

  getServicesToUi = (): ServiceToUI[] => {
    let servicesToDisplay: ServiceToDisplay[] = getServices()
    let types: string[] = this.getTypes(servicesToDisplay)
    let servicesToUI: ServiceToUI[] = []

    types.forEach(element => {
      let serviceToUi: ServiceToUI = {
        name: element,
        selectValues: {},
      }
      servicesToUI.push(serviceToUi)
    })


    servicesToDisplay.forEach(element => {
      for (const serviceToUI of servicesToUI) {
        if (serviceToUI.name === element.type) {
          serviceToUI.selectValues[element.description] = [element.price, element.cost]
        }
      }
    })
    return servicesToUI
  }

  getArrServices = (): Service[] => {
    let servicesToDisplay: ServiceToDisplay[] = getServices()
    let types: string[] = this.getTypes(servicesToDisplay)
    let services: Service[] = []

    types.forEach(element => {
      let service: Service = {
        type: element,
        providerName: '',
        cost: 0,
        price: 0,
        description: '',
        instalationHour: '',
        notes: '',
      }
      services.push(service)
    })
    return services
  }

  getTypes = (servicesUnformatted : ServiceToDisplay[]) => {
    const uniqueTypes: string[] = [...new Set(servicesUnformatted.map((item : ServiceToDisplay) => item.type))]
    return uniqueTypes
  }

  handleInputChange  = (paramName: string) => (event: any) => {
    let newForm: any = { ...this.state.event }
    newForm[paramName] = event.target.value
    this.setState({
      event: newForm
    })    
  }

  handleDateChange = (paramName: string) => (event: any) => {
    let newForm: any = { ...this.state.event }
    newForm[paramName] = event.toLocaleDateString()
    this.setState({
      event: newForm
    })    
  }

  handleFromChange = async (e: any) => {
    let event: Event = this.state.event
    event.startHour = e.target.value
    await this.setState({
      event: event,
    })
  }

  handleToChange = async (e: any) => {
    let event: Event = this.state.event
    event.endHour = e.target.value
    await this.setState({
      event: event,
    })
  }

  handleServicePlanChange = (type: string, hashMap: {[key: string]: number[]}) => async (event: any) => {
    let newFormModel: Event = this.state.event
    for (const service of newFormModel.providers) {
      if (service.type === type) {
        service.description = event.target.value
        service.price = hashMap[event.target.value][0]
        service.cost = hashMap[event.target.value][1]
        break
      }
    }
    let priceTmp = 0
    let costTmp = 0
    for (const service of this.state.event.providers) {
      priceTmp += service.price
      costTmp += service.cost
    }
    console.log(console.log(costTmp))
    newFormModel.totalPrice = priceTmp
    newFormModel.totalCost = costTmp
    await this.setState({
      event: newFormModel,
    })
  }

  handleServiceHourChange = (type: string) => async (event: any) => {
    let newFormModel: Event = this.state.event
    for (const service of newFormModel.providers) {
      if (service.type === type) {
        service.instalationHour = event.target.value
        break
      }
    }
    await this.setState({
      event: newFormModel,
    })
  }

  handleServiceNotesChange = (type: string) => async (event: any) => {
    let newFormModel: Event = this.state.event
    for (const service of newFormModel.providers) {
      if (service.type === type) {
        service.notes = event.target.value
        break
      }
    }
    await this.setState({
      event: newFormModel,
    }) 
  }

  submittedForm = () => {
    let json = JSON.stringify(this.state.event, null, 2)
    alert(json)
  }

  render() {
    return ( 
      <Container>
        <EventRegistrationContainer>
          <FormRect>
            <HeadingForms>Registro de evento</HeadingForms>
            <form onSubmit={ this.submittedForm }>
              <div className='form-group'>
                <label>Nombre</label>
                <input onChange={ this.handleInputChange('clientName') } className='form-control' placeholder='Nombre' />
              </div>
              <div className='form-group'>
                <label>Teléfono</label>
                <input onChange={ this.handleInputChange('cellphone')} className='form-control' placeholder='Teléfono' />
              </div>
              <div className='form-group'>
                <label>Dirección de evento</label>
                <input onChange={ this.handleInputChange('address')} className='form-control' placeholder='Dirección' />
              </div>
              <div className='form-group'>
                <label>Fecha</label>
                <div>
                  <DayPickerInput inputProps={{
                    style: {
                      display: 'block',
                      width: '100%',
                      height: 'calc(2.25rem + 2px)',
                      padding: '0.375rem 0.75rem',
                      fontSize: '1rem',
                      fontWeight: '400',
                      color: '#495057',
                      backgroundColor: '#fff',
                      backgroundClip: 'padding-box',
                      border: '1px solid #ced4da',
                      borderRadius: '0.25rem',
                      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                    }
                  }}
                    format={'MM/dd/yyyy'}
                    onDayChange={ this.handleDateChange('date') } />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-4'>
                  <label>De</label>
                  <select onChange={ this.handleFromChange } className='form-control ' placeholder='Horario de evento'>
                    <option disabled selected> -- selecciona una opcion -- </option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 AM</option>
                    <option>1:00 AM</option>
                    <option>2:00 AM</option>
                  </select>
                </div>
                <div className='col-md-4'>
                  <label>A</label>
                  <select onChange={ this.handleToChange } className='form-control' placeholder='Horario de evento'>
                    <option disabled selected> -- selecciona una opcion -- </option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                    <option>10:00 PM</option>
                    <option>11:00 PM</option>
                    <option>12:00 AM</option>
                    <option>1:00 AM</option>
                    <option>2:00 AM</option>
                  </select>
                </div>
              </div>
              <ServicesHeading>Servicios</ServicesHeading>
              {
                this.state.servicesToUi.map(element => {
                  return (
                    <ServiceBox>
                      <h4>{element.name}</h4>
                      <label>Escoge un paquete</label>
                      <select onChange={ this.handleServicePlanChange(element.name, element.selectValues) } style={{ marginBottom: '10px' }} className='form-control'>
                      <option disabled selected> -- selecciona una opcion -- </option>
                        {
                          Object.keys(element.selectValues).map(element => {
                            return (
                              <option>{element}</option>
                            )
                          })
                        }
                      </select>
                      <label>Hora de instalacion</label>
                      <select onChange={ this.handleServiceHourChange(element.name) } style={{ marginBottom: '10px' }} className='form-control'>
                        <option disabled selected> -- selecciona una opcion -- </option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                        <option>6:00 PM</option>
                        <option>7:00 PM</option>
                        <option>8:00 PM</option>
                        <option>9:00 PM</option>
                        <option>10:00 PM</option>
                        <option>11:00 PM</option>
                        <option>12:00 AM</option>
                        <option>1:00 AM</option>
                        <option>2:00 AM</option>
                      </select>
                      <label>Comentarios</label>
                      <input onChange={ this.handleServiceNotesChange(element.name) } className='form-control' placeholder='El evento sera en pasto, cemento, etc' type='text'/>
                    </ServiceBox>
                  )
                })
              }
              <PriceHeading>{ this.state.event === undefined ? "" : `$ ${this.state.event.totalPrice}` }</PriceHeading>
              <div style={{ display: 'flex', justifyContent: 'center' }} className='text-center'><SubmitButton>Registrar Evento</SubmitButton></div>
            </form>
          </FormRect>
        </EventRegistrationContainer>
      </Container>
    )
  }
}
