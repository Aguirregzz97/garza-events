import * as React from 'react'
import { getEvents } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { SpringGrid, makeResponsive } from 'react-stonecutter'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


const ContainerBox = styled.div`
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`
const EventsHeading = styled.div`
  font-family: roboto;
  font-size: 40px;
  text-align: center;
  color: white;
  margin-bottom: 30px;
`

const HomeIcon = styled.div`
  color: white;
  font-size: 65px;
  margin: 20px;
  margin-bottom: 20px;

  &:hover {
    cursor: pointer;
  }
`

const ContainerContainerEvents = styled.div`
  min-height: 100vh;
  display: flex;
  padding-left: 5%;
  padding-right: 5%;
`

const CalendarIcon = styled.i`
  color: white;
  font-size: 110px;
  padding-right: '5px';
  padding-left: '5px';
  transition: 0.3s;
  background: none;
  border: none;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
    color: gray;
  }
`
const ClientName = styled.h4`
  color: white;
  padding-top: 5px;
  font-size: 20px;
`

const CheckIcon = styled.i`
  color: green;
  font-size: 20px;
  background: none;
  border: none;
`

const CrossIcon = styled.i`
  color: yellow;
  font-size: 21px;
  background: none;
  border: none;
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
    let eventsNew: Event[] = await getEvents()
    this.setState({
      events: eventsNew
    })
  }

  render() {
    if (this.state.events === undefined) {
      return (<RingLoaderWrapper />)
    }
    return (
      <div>
        <ContainerBox>
          <Link to='/'><HomeIcon className="fas fa-home"></HomeIcon></Link>
          <EventsHeading>Events</EventsHeading>
          <ContainerContainerEvents>
            <GridPage
              component='ul'
              columns={5}
              columnWidth={180}
              gutterWidth={15}
              gutterHeight={20}
              itemHeight={190}
              springConfig={{ stiffness: 150, damping: 22 }}
            >
              {this.state.events.filter((element: Event) => {
                if (element.status === 'CANCELLED') {
                  return false
                }
                return true
              }).map((element: Event) => {
                return (
                  <div key={element.clientName} className='text-center'>
                    <Link to={'/event/' + element._id} ><CalendarIcon className='fas fa-calendar-day'></CalendarIcon></Link>
                    <ClientName>{element.clientName}</ClientName>
                    {element.status === 'ACCEPTED' ? <CheckIcon className='fas fa-check-circle'></CheckIcon> : <CrossIcon className='fas fa-pause-circle'></CrossIcon>}
                  </div>
                )
              })}
            </GridPage>
          </ContainerContainerEvents>
        </ContainerBox>
      </div>
    )
  }
}
