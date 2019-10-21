import * as React from 'react'
import { getEvents } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ContainerBox = styled.div`
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`

const HomeIcon = styled.div`
  color: white;
  font-size: 65px;
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

  &:hover {
    cursor: pointer;
  }
`

const EventItem = styled.h5`
  font-family: roboto;
  font-size: 20px;
  font-weight: bold;
`

type State = {
  events: Event[] | undefined
}

type Props = {
}

export class Events extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      events: undefined
    }
  }

  async componentDidMount() {
    let eventsNew: Event[] = getEvents()
    await this.setState({
      events: eventsNew
    })
  }

  render() {
    if (this.state.events === undefined) {
      return ( <RingLoaderWrapper /> )
    }
    return (
      <div>
        {console.log(this.state.events)}
        <ContainerBox>
          <Link to='/'><HomeIcon className="fas fa-home"></HomeIcon></Link>
          <ContainerContainerEvents>
            <ContainerEvents>
              <EventsHeading>Eventos</EventsHeading>
              {this.state.events.map((element: Event) => {
                return (
                  <div style={{ width: '80%' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{element.clientName}</h3>
                    <EventBox>
                      <EventItem>Direccion:</EventItem>
                      <h5>{element.address}</h5>
                      <EventItem>Celular:</EventItem>
                      <h5>{element.cellphone}</h5>
                      <EventItem>Fecha:</EventItem>
                      <h5>{element.date}</h5>
                      <EventItem>Hora de inicio:</EventItem>
                      <h5>{element.startHour}</h5>
                      <EventItem>Hora de fin:</EventItem>
                      <h5>{element.endHour}</h5>
                      <EventItem>Costo total:</EventItem>
                      <h5>{element.totalCost}</h5>
                      <EventItem>Precio total:</EventItem>
                      <h5>{element.totalPrice}</h5>
                    </EventBox>
                  </div>
                )
              })}
            </ContainerEvents>
          </ContainerContainerEvents>
        </ContainerBox>
      </div>
    )
  }
}
