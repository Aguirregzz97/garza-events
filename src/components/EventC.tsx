import * as React from 'react'
import { getEvent, changeEventStatus, changeDate, changeHours, changeProvider } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event, Status, Service } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import sweetalert2, { SweetAlertResult } from 'sweetalert2'

const BigContainer = styled.div`
  padding-bottom: 50px;
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
`
const ContainerBox = styled.div`
  display: flex;
  justify-content: center;
  min-height: 100vh;
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
  margin-top: 20px;
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
  margin-bottom: 20px;
  -o-transition: all .4s;
  -moz-transition: all .4s;
  transition: all .4s;

  &:hover {
    cursor: pointer;
    background: #333333;
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
    // const _id = this.props.match.params._id
    let newEvent: Event = await getEvent(this.props.match.params._id)
    await this.setState({
      event: newEvent
    })
  }

  areYouSureDeleteDialog = async (): Promise<SweetAlertResult> => {
    return await sweetalert2({
      title: 'Estas Seguro?',
      text: 'No vas a poder revertir esto',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, borrar!',
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

  // editDate = (dar : string) => async (_event : React.MouseEvent<HTMLElement>) => {
  //   const editValue = await this.editDialog()
  //   await editEventItem(this.props.match.params._id, item, editValue.value)
  // }

  editDate = (event: Event) => async (_event : React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog()
    if (editValue.value) {
      await changeDate(this.props.match.params._id, editValue.value)
      const newEvent : Event = event
      newEvent.date = editValue.value
      this.setState({
        event: newEvent
      })
    }
  }

  editStartHour = (event: Event) => async (_event : React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog()
    if (editValue.value) {
      await changeHours(this.props.match.params._id, editValue.value, event.endHour)
      const newEvent : Event = event
      newEvent.startHour = editValue.value
      this.setState({
        event: newEvent
      })
    }
  }

  editProviderCost = (event: Event, provider: Service) => async (_event : React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog()
    if (editValue.value) {
      await changeProvider(event, provider, editValue.value)
      const newEvent : Event = event
      let index : number = 0
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
 
  editEndHour = (event: Event) => async (_event : React.MouseEvent<HTMLElement>) => {
    const editValue = await this.editDialog()
    if (editValue.value) {
      await changeHours(this.props.match.params._id, event.startHour, editValue.value)
      const newEvent : Event = event
      newEvent.endHour = editValue.value
      this.setState({
        event: newEvent
      })
    }
  }

  acceptEvent = async () => {
    const res = await this.areYouSureAcceptDialog()
    if (res.value) {
      await changeEventStatus(this.props.match.params._id, Status.ACCEPTED)
    }
  }

  render() {
    if (this.state.event === undefined) {
      return ( <RingLoaderWrapper /> )
    }
    const event: Event = this.state.event
    return (
      <BigContainer>
          <Link to='/'><HomeIcon className="fas fa-home"></HomeIcon></Link>
        <ContainerBox>
          <EventBox>
            <EventHeadingDiv>
              <h1 style={{ visibility: 'hidden' }}>yes</h1>
              <EventHeading>Event</EventHeading>
              <DeleteEditDiv>
                <ThrashIcon onClick={ this.deleteEvent } className='fas fa-trash-alt'></ThrashIcon>
              </DeleteEditDiv>
            </EventHeadingDiv>
              <ul className='list-group'>
                <li style={{ display: 'inline-block' }} className='list-group-item'>
                  <EventAtt>Client Name: {event.clientName}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Address: {event.address}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Cellphone: {event.cellphone}</EventAtt>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Date: {event.date}</EventAtt>
                  <EditIcon onClick={ this.editDate(event) } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Start Hour: {event.startHour}</EventAtt>
                  <EditIcon onClick={ this.editStartHour(event) } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>End Hour: {event.endHour}</EventAtt>
                  <EditIcon onClick={ this.editEndHour(event) } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'><EventAtt>Price Per Hour: {event.pricePerHour}</EventAtt></li>
                <li className='list-group-item'><EventAtt>Total Price: {event.totalPrice}</EventAtt></li>
                <li className='list-group-item'><EventAtt>Total Cost: {event.totalCost}</EventAtt></li>
              </ul>
              <ProviderAtt>Providers: </ProviderAtt>
                <ul>
                  {event.providers.map(element => {
                    return (
                      <div>
                        <li><EventAtt>{element.service}</EventAtt></li>
                        <ul>
                          <li>
                            <EventAtt>Cost: {element.priceProvider == undefined ? "No se ha agregado un costo!" : element.priceProvider}<EditIconCost onClick={ this.editProviderCost(event, element) } className='fas fa-edit'></EditIconCost></EventAtt>
                          </li>
                          <li><EventAtt>Notes: {element.notes}</EventAtt></li>
                          <li><EventAtt>Price Client: {element.priceClient}</EventAtt></li>
                        </ul>
                      </div>
                    )
                  })}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'center' }} className='text-center'><SubmitButton onClick={this.acceptEvent}>Confirm Event</SubmitButton></div>
          </EventBox>
        </ContainerBox>
      </BigContainer>
    )
  }
}
