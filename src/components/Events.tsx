import * as React from 'react'
import { getEvents } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


const ContainerBox = styled.div`
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`

const EventsHeadingDiv = styled.div`
  display: block;
  justify-content: space-between;]
`

const InvDiv = styled.div`
  width: 150px;
`

const EventsHeading = styled.div`
  font-family: roboto;
  font-size: 40px;
  text-align: center;
  color: white;
  margin-bottom: 30px;
`

const FilterIconsDiv = styled.div`
  display: flex;
  justify-content: center;  
  width: 100%;  
`

const AllIconFilter = styled.i`
  margin-right: 10px;
  color: white;
  font-size: 33px;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`

const CheckIconFilter = styled.i`
  margin-right: 10px;
  color: green;
  font-size: 33px;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`

const CrossIconFilter = styled.i`
  margin-right: 10px;
  color: yellow;
  font-size: 33px;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`
const CancelIconFilter = styled.i`
  color: crimson;
  font-size: 33px;
  background: none;
  border: none;
  transition: 0.3s;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`

const UpperDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const PowerIcon = styled.div`
  color: white;
  font-size: 50px;
  margin: 20px;
  margin-bottom: 20px;

  &:hover {
    cursor: pointer;
    color: gray;   
    transform: scale(1.08); 
  }
`

const ContainerContainerEvents = styled.div`
  min-height: 73vh;
  display: flex;
  padding-top : 2.5%;  
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

const DeleteIcon = styled.i`
  color: crimson;
  font-size: 21px;
  background: none;
  border: none;
`


type State = {
  events: Event[] | undefined
  eventsToShow: Event[] | undefined
}

type Props = {
}

export class Events extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      events: undefined,
      eventsToShow: undefined,
    }
  }

  async componentDidMount() {
    let eventsNew: Event[] = await getEvents()
    let eventsToShow: Event[] = eventsNew.filter((element) => {
      return element.status !== 'CANCELLED'
    })
    this.setState({
      eventsToShow: eventsToShow,
      events: eventsNew,
    })
  }

  filterGeneric = (status: string) => {
    if (this.state.events === undefined) {
      return
    }
    let eventsToShow: Event[] = this.state.events.filter((element) => {
      return element.status === status
    })
    this.setState({
      eventsToShow: eventsToShow,
    })
  }

  filterAll = () => {
    if(this.state.events == undefined) {
      return
    }
    let eventsToShow: Event[] = this.state.events.filter((element) => {
      return (element.status === 'ACCEPTED' || element.status === 'PENDING')
    })
    this.setState({
      eventsToShow: eventsToShow,
    })
  }

  filterToAccepted = () => {
    this.filterGeneric('ACCEPTED')
  }

  filterToPending = () => {
    this.filterGeneric('PENDING')
  }

  showCancelled = () => {
    this.filterGeneric('CANCELLED')
  }

  logOut = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  render() {
    if (this.state.events === undefined || this.state.eventsToShow === undefined) {
      return (<RingLoaderWrapper />)
    }
    return (
      <div>
        <ContainerBox>
          <UpperDiv>
            <TooltipHost
              content='Log out'
              calloutProps={{ gapSpace: -10 }}
              styles={{ root: { display: 'inline-block' } }}
            >
              <PowerIcon onClick={this.logOut} className='fas fa-power-off'></PowerIcon>
            </TooltipHost>
          </UpperDiv>
          <EventsHeadingDiv>
            <InvDiv></InvDiv>
            <EventsHeading>Events</EventsHeading>            
            <FilterIconsDiv>
            <TooltipHost
                content='display all events'
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <AllIconFilter onClick={this.filterAll} className='fa fa-plus-square'></AllIconFilter>
              </TooltipHost>
              <TooltipHost
                content='display accepted events'
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <CheckIconFilter onClick={this.filterToAccepted} className='fas fa-check-circle'></CheckIconFilter>
              </TooltipHost>
              <TooltipHost
                content='display pending events'
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <CrossIconFilter onClick={this.filterToPending} className='fas fa-pause-circle'></CrossIconFilter>
              </TooltipHost>
              <TooltipHost
                content='display cancelled events'
                calloutProps={{ gapSpace: 0 }}
                styles={{ root: { display: 'inline-block' } }}
              >
                <CancelIconFilter onClick={this.showCancelled} className='fas fa-times-circle'></CancelIconFilter>
              </TooltipHost>
            </FilterIconsDiv>
          </EventsHeadingDiv>
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
              {this.state.eventsToShow.map((element: Event) => {
                return (
                  <div key={element.clientName} className='text-center'>                    
                    {element.status === 'ACCEPTED' ? <Link to={'/event/' + element._id} ><CalendarIcon className='fas fa-calendar-check'></CalendarIcon></Link> : element.status === 'PENDING' ? <Link to={'/event/' + element._id} ><CalendarIcon className='fas fa-calendar-minus'></CalendarIcon></Link> : <Link to={'/event/' + element._id} ><CalendarIcon className='fas fa-calendar-times'></CalendarIcon></Link> }
                    <ClientName>{element.clientName}</ClientName>
                    {element.status === 'ACCEPTED' ? <CheckIcon className='fas fa-check-circle'></CheckIcon> : element.status === 'PENDING' ? <CrossIcon className='fas fa-pause-circle'></CrossIcon> : <DeleteIcon className='fas fa-times-circle'></DeleteIcon>}
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
