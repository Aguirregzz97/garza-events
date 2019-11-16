import * as React from 'react'
import { getEvent, deleteEvent, editEventItem } from '../shared/RestApi'
import { RingLoaderWrapper } from '../shared/RingLoaderWrapper'
import { Event, Status } from '../shared/types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import sweetalert2, { SweetAlertResult } from 'sweetalert2'

const BigContainer = styled.div`
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

  deleteEvent = async () => {
    const res = await this.areYouSureDeleteDialog()
    if (res.value) {
      await deleteEvent(this.props.match.params._id, Status.CANCELLED)
    }
  }

  editItem = (item : string) => async (_event : React.MouseEvent<HTMLElement>) => {
    await editEventItem(this.props.match.params._id, item)
  }

  render() {
    if (this.state.event === undefined) {
      return ( <RingLoaderWrapper /> )
    }
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
                  <EventAtt>Client Name: {this.state.event.clientName}</EventAtt>
                  <EditIcon onClick={ this.editItem('clientName') } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Address: {this.state.event.address}</EventAtt>
                  <EditIcon onClick={ this.editItem('address') } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Cellphone: {this.state.event.cellphone}</EventAtt>
                  <EditIcon onClick={ this.editItem('cellphone') } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>Start Hour: {this.state.event.startHour}</EventAtt>
                  <EditIcon onClick={ this.editItem('startHour') } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'>
                  <EventAtt>End Hour: {this.state.event.endHour}</EventAtt>
                  <EditIcon onClick={ this.editItem('endHour') } className='fas fa-edit'></EditIcon>
                </li>
                <li className='list-group-item'><EventAtt>Price Per Hour: {this.state.event.pricePerHour}</EventAtt></li>
                <li className='list-group-item'><EventAtt>Total Price: {this.state.event.totalPrice}</EventAtt></li>
                <li className='list-group-item'><EventAtt>Total Cost: {this.state.event.totalCost}</EventAtt></li>
              </ul>
              <ProviderAtt>Providers: </ProviderAtt>
                <ul>
                  {this.state.event.providers.map(element => {
                    return (
                      <li><EventAtt>{element.service}</EventAtt></li>
                    )
                  })}
                </ul>
          </EventBox>
        </ContainerBox>
      </BigContainer>
    )
  }
}
