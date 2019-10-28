import * as React from 'react'
import { getEvent } from '../shared/RestApi'
import { Event } from '../shared/types'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ContainerBox = styled.div`
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`

const BackIcon = styled.div`
  color: white;
  font-size: 35px;
  margin: 20px;
  margin-bottom: 30px;

  &:hover {
    cursor: pointer;
  }
`

const ContainerContainerEvents = styled.div`
  display: flex;
  justify-content: center;
`

const ContainerEvents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
`

const EventsHeading = styled.h1`
  font-family: roboto;
  font-size: 40px;
  padding-top: 20px;
  padding-bottom: 10px;
`


const EventBox = styled.div`
  margin-bottom: 20px;
  padding-top: 10px;
  padding-left: 20px;
  padding-bottom: 10px;
  width: 100%;
  border: 3px #0B4163 solid;
  border-radius: 3px;
`

const EventItem = styled.h5`
  font-family: roboto;
  font-size: 20px;
  font-weight: bold;
`

type State = {
  event: Event | undefined
}

type Props = {

}

export class EventDetails extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props)
    this.state = {
      event: undefined
    }
  }

  async componentDidMount() {
    let eventSelected: Event = getEvent()
    await this.setState({
      event: eventSelected
    })
  }

  render() {
    if (this.state.event === undefined) {
      return ( <RingLoaderWrapper /> )
    }
    return ( 
      <div>
      {console.log(this.state.event)}
        <ContainerBox>
          <Link to='/events'><BackIcon className='fas fa-arrow-left'></BackIcon></Link>
          <ContainerContainerEvents>
            <ContainerEvents>
              <EventsHeading>Evento</EventsHeading>                                           
                  <div style={{ width: '80%' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{this.state.event.clientName}</h3>
                    {console.log(this.state.event.clientName)}                    
                    <EventBox>
                      <EventItem>Direccion:</EventItem>
                      <h5>{this.state.event.address}</h5>
                      <EventItem>Celular:</EventItem>
                      <h5>{this.state.event.cellphone}</h5>
                      <EventItem>Fecha:</EventItem>
                      <h5>{this.state.event.date}</h5>
                      <EventItem>Hora de inicio:</EventItem>
                      <h5>{this.state.event.startHour}</h5>
                      <EventItem>Hora de fin:</EventItem>
                      <h5>{this.state.event.endHour}</h5>
                      <EventItem>Costo total:</EventItem>
                      <h5>{this.state.event.totalCost}</h5>
                      <EventItem>Precio total:</EventItem>
                      <h5>{this.state.event.totalPrice}</h5>
                    </EventBox>
                  </div>              
            </ContainerEvents>
          </ContainerContainerEvents>
        </ContainerBox>
      </div>
    )
  }
}