import * as React from 'react'
import { getEvent, changeEventStatus, changeDate, changeHours, changeProvider } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event, Status, Service } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import sweetalert2, { SweetAlertResult } from 'sweetalert2'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'

const BigContainer = styled.div`
  padding-bottom: 50px;
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`
const ContainerBox = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
`

const UpperDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const ArrowIcon = styled.div`
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

const EventBox = styled.div`
  margin-top: 50px;
  min-height: 80vh;
  width: 70%;
  display: flex;
  flex-direction: column;
  height: 60%;
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
`

const EventHeadingDiv = styled.div`
  display: flex;
  justify-content: space-between;
`

const EventHeading = styled.h1`
  font-family: roboto;
  font-size: 40px;
  margin-bottom: 20px;
  margin-top: 20px;
`

const DeleteEditDiv = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
`

const EditIcon = styled.i`
  font-size: 25px;
  color: green;
  display: inline-block;
  float: right;
  margin-top: 8px;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`

const EditIconCost = styled.i`
  font-size: 25px;
  color: green;
  display: inline-block;
  margin-left: 10px;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`

const ThrashIcon = styled.i`
  color: red;
  font-size: 30px;
  padding-right: 20px;
  padding-left: 10px;

  &:hover {
    transform: scale(1.08);
    cursor: pointer;
  }
`
const EventAtt = styled.h6`
  font-family: roboto;
  font-size: 20px;
  margin-top: 10px;
  padding: 0px;
  display: inline-block;
`
const ProviderAtt = styled.h6`
  font-weight: bold;
  font-family: roboto;
  font-size: 20px;
  margin-top: 20px;
  padding-left: 1.25rem;
`

const SubmitButton = styled.button`  
  margin: 10px 20px;
  width: 30%;
  font-family: roboto;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  height: 52px;
  border-radius: 3px;
  background: #0B4163;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;  
  -o-transition: all .4s;
  -moz-transition: all .4s;
  transition: all .4s;

  &:hover {
    cursor: pointer;
    background: #1a8f6e;
  }
`

const PendingButton = styled.button`  
  margin: 10px 20px;
  width: 30%;
  font-family: roboto;
  font-size: 16px;
  line-height: 1;
  color: #fff;
  height: 52px;
  border-radius: 3px;
  background: #0B4163;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;  
  -o-transition: all .4s;
  -moz-transition: all .4s;
  transition: all .4s;

  &:hover {
    cursor: pointer;
    background: #cfc740;
  }
`

type State = {
  event: Event | undefined
  modal: boolean
}

interface MatchParams {
  _id: string
}

interface Props extends RouteComponentProps<MatchParams> {
}

export interface RouteComponentProps<P> {
  match: match<P>
  staticContext?: any
}

export interface match<P> {
  params: P
  isExact: boolean
  path: string
  url: string
}


export class EventC extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      event: undefined,
      modal: false,
    }
  }

  async componentDidMount() {
    let newEvent: Event = await getEvent(this.props.match.params._id)
    await this.setState({
      event: newEvent
    })
  }

  areYouSureDeleteDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Estas Seguro?',
      text: 'Cancelarás el evento',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, cancelar!',
    })
  }

  areYouSurePendingDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Estas Seguro?',
      text: 'Cambiarás un evento de cancelado a pendiente',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28A745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, aceptar!',
    })
  }

  areYouSureAcceptDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Estas Seguro?',
      text: 'Solo podras cancelar el evento despues de aceptarlo',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#28A745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, aceptar!',
    })
  }

  editDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Submit your new value',
      input: 'select',
      inputOptions: {
        twelvepm : '12:00 PM',
        onepm: "1:00 PM",
        twopm: "2:00 PM",
        threepm: "3:00 PM",
        fourpm: "4:00 PM",
        fivepm: "5:00 PM",
        sixpm: "6:00 PM",
        sevenpm: "7:00 PM",
        eightpm: "8:00 PM",
        ninepm: "9:00 PM",
        tenpm: "10:00 PM",
        elevenpm: "11:00 PM",
        twelveam: "12:00 AM",
        oneam: "1:00 AM",
        twoam: "2:00 AM"
      },
      inputPlaceholder: 'Select hour',
      showCancelButton: true,
      confirmButtonText: 'Edit!',
    })
  }

  editTextDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Submit your new value',
      input: 'text',      
      showCancelButton: true,
      confirmButtonText: 'Edit!',
    })
  }

  deleteEvent = async () => {
    const res = await this.areYouSureDeleteDialog()
    if (res.value) {
      await changeEventStatus(this.props.match.params._id, Status.CANCELLED)
    }
  }

  editDate = (event: Event) => async (_event: React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editTextDialog()
    if (editValue.value) {
      await changeDate(this.props.match.params._id, editValue.value)
      const newEvent: Event = event
      newEvent.date = editValue.value
      this.setState({
        event: newEvent
      })
    }
  }

  editStartHour = (event: Event) => async (_event: React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog() 
    const newHour = await this.getHourChanged(editValue.value)
    if (editValue.value) {
      await changeHours(this.props.match.params._id, newHour, event.endHour)
      const newEvent: Event = event
      newEvent.startHour = newHour
      this.setState({
        event: newEvent
      })
    }
  }

  getHourChanged = (hour: string) => {
    switch(hour) {
      case 'twelvepm': return '12:00 PM'; break
      case 'onepm': return '1:00 PM'; break
      case 'twopm': return '2:00 PM'; break
      case 'threepm': return '3:00 PM'; break
      case 'fourpm': return '4:00 PM'; break
      case 'fivepm': return '5:00 PM'; break
      case 'sixpm': return '6:00 PM'; break
      case 'sevenpm': return '7:00 PM'; break
      case 'eightpm': return '8:00 PM'; break
      case 'ninepm': return "9:00 PM"; break
      case 'tenpm': return "10:00 PM"; break
      case 'elevenpm': return "11:00 PM"; break
      case 'twelveam': return "12:00 AM"; break
      case 'oneam': return "1:00 AM"; break
      case 'twoam': return "2:00 AM"; break
      default: break
    }

    return ""
  }

  editProviderCost = (event: Event, provider: Service) => async (_event: React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editTextDialog()
    if (editValue.value) {
      await changeProvider(event, provider, editValue.value)
      const newEvent: Event = event
      let index: number = 0
      for (let i = 0; i < event.providers.length; i++) {
        if (event.providers[i]._id == provider._id) break
        index++
      }
      newEvent.providers[index].priceProvider = editValue.value
      this.setState({
        event: newEvent
      })
    }
  }

  editEndHour = (event: Event) => async (_event: React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog()
    const newHour = await this.getHourChanged(editValue.value)
    if (editValue.value) {
      await changeHours(this.props.match.params._id, event.startHour, newHour)
      const newEvent: Event = event
      newEvent.endHour = newHour
      this.setState({
        event: newEvent
      })
    }
  }

  pendingEvent = async () => {
    const res = await this.areYouSurePendingDialog()
    if (res.value) {
      await changeEventStatus(this.props.match.params._id, Status.PENDING)
    }
  }

  acceptEvent = async () => {
    const res = await this.areYouSureAcceptDialog()
    if (res.value) {
      await changeEventStatus(this.props.match.params._id, Status.ACCEPTED)
    }
  }

  logOut = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  render() {
    if (this.state.event === undefined) {
      return (<RingLoaderWrapper />)
    }
    const event: Event = this.state.event
    return (
      <BigContainer>
        <UpperDiv>
        <TooltipHost
            content='Events'
            calloutProps={{ gapSpace: -10 }}
            styles={{ root: { display: 'inline-block' } }}
        >
          <Link to='/events'><ArrowIcon className="fas fa-arrow-left"></ArrowIcon></Link>
        </TooltipHost>
          <TooltipHost
            content='Log out'
            calloutProps={{ gapSpace: -10 }}
            styles={{ root: { display: 'inline-block' } }}
          >
            <PowerIcon onClick={this.logOut} className='fas fa-power-off'></PowerIcon>
          </TooltipHost>
        </UpperDiv>
        <ContainerBox>
          <EventBox>
            <EventHeadingDiv>
              <h1 style={{ visibility: 'hidden' }}>yes</h1>
              <EventHeading>Event</EventHeading>
              <DeleteEditDiv>
              {event.status !== 'CANCELLED' ? 
              <TooltipHost
                content='Cancel event'
                calloutProps={{ gapSpace: 5 }}
                styles={{ root: { display: 'inline-block' } }}
              >
              <ThrashIcon onClick={this.deleteEvent} className='fas fa-trash-alt'></ThrashIcon>
              </TooltipHost> : <div></div> }                                    
              </DeleteEditDiv>
            </EventHeadingDiv>
            <div className="container">
              <ul className='list-group'>
                <li style={{ display: 'inline-block' }} className='list-group-item'>
                  <EventAtt><b>Client Name:</b> {event.clientName}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt><b>Address:</b> {event.address}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt><b>Cellphone:</b> {event.cellphone}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt><b>Date:</b> {event.date}</EventAtt>
                  <EditIcon onClick={this.editDate(event)} className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt><b>Start Hour:</b> {event.startHour}</EventAtt>
                  <EditIcon onClick={this.editStartHour(event)} className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt><b>End Hour:</b> {event.endHour}</EventAtt>
                  <EditIcon onClick={this.editEndHour(event)} className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'><EventAtt><b>Total Price:</b> ${event.totalPrice} MXN</EventAtt></li>
              </ul>
              <ProviderAtt><b>Providers:</b> </ProviderAtt>
              <ul>
                {event.providers.map(element => {
                  return (
                    <div>                      
                      <li><EventAtt>{element.service}</EventAtt></li>
                      <ul>
                        <li><EventAtt>Description: <strong>{element.description}</strong></EventAtt></li>
                        <li>
                          <EventAtt>Cost: {element.priceProvider == undefined ? "No se ha agregado un costo!" : element.priceProvider}<EditIconCost onClick={this.editProviderCost(event, element)} className='fas fa-edit'></EditIconCost></EventAtt>
                        </li>
                        <li><EventAtt>Notes: {element.notes}</EventAtt></li>
                        <li><EventAtt>Price Client: {element.priceClient}</EventAtt></li>
                      </ul>
                    </div>
                  )
                })}
              </ul>
            </div>
            
            {event.status === 'CANCELLED' ? 
            <div style={{ display: 'flex', justifyContent: 'center' }} className='text-center'>
              <SubmitButton onClick={this.acceptEvent}>Confirm Event</SubmitButton>
              <PendingButton onClick={this.pendingEvent}>Change to pending</PendingButton>
            </div> : 
            event.status === 'PENDING' ? 
            <div style={{ display: 'flex', justifyContent: 'center' }} className='text-center'>
              <SubmitButton onClick={this.acceptEvent}>Confirm Event</SubmitButton>
            </div> :
            <div></div>          
          }

          </EventBox>
        </ContainerBox>
      </BigContainer>
    )
  }
}
