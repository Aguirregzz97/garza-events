import * as React from 'react'
import { FormModel } from '../shared/types'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css'
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox'
import './../assets/scss/mobileForms.scss'

type State = {
  formModel: FormModel | any,
  startHour: string,
  endHour: string,
  iluminacion1: boolean,
  iluminacion2: boolean,
}

type Props = {
}

export class EventRegistration extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      formModel: undefined,
      startHour: '',
      endHour: '',
      iluminacion1: false,
      iluminacion2: false,
    }
  }

  componentDidMount() {
    let x: FormModel = { ...this.state.formModel }
    x.clientName = ''
    x.clientPhone = ''
    x.clientAddress = ''
    x.eventDate = ''
    x.eventSchedule = ''
    x.danceFloor = ''
    x.loungeEquipment = false
    x.ilumination = ''
    x.instalationSchedule = ''
    x.specialNotes = ''
    this.setState({
      formModel: x
    })
  }

  handleInputChange  = (paramName: string) => (event: any) => {
    let newForm: any = { ...this.state.formModel }
    newForm[paramName] = event.target.value
    this.setState({
      formModel: newForm
    })    
  }

  handleDateChange = (paramName: string) => (event: any) => {
    let newForm: any = { ...this.state.formModel }
    newForm[paramName] = event.toLocaleDateString()
    this.setState({
      formModel: newForm
    })    
  }

  handleFromChange = (paramName: string) => async (event: any) => {
    await this.setState({
      startHour: event.target.value
    }, async () => {
      let newForm: any = { ...this.state.formModel }
      if (this.state.endHour != '') {
        newForm[paramName] = `${this.state.startHour} to ${this.state.endHour}`
        await this.setState({
          formModel: newForm
        })
      }
    }) 
  }

  handleToChange = (paramName: string) => async (event: any) => {
    await this.setState({
      endHour: event.target.value
    }, async () => {
      let newForm: any = { ...this.state.formModel }
      if (this.state.startHour != '') {
        newForm[paramName] = `${this.state.startHour} to ${this.state.endHour}`
        await this.setState({
          formModel: newForm
        })
      }
    })  
  }

  handleSalitasChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean): void  => {
    console.log(ev)
    let newForm: FormModel = { ...this.state.formModel }
    newForm.loungeEquipment = isChecked
    this.setState({
      formModel: newForm
    })
  }

  handleIluminacion1Change = async ()  => {
    this.setState({
      iluminacion1: !this.state.iluminacion1,
      iluminacion2: false
    }, async () => {
      let newForm: FormModel = { ...this.state.formModel }
      if (this.state.iluminacion1) {
        newForm.ilumination = 'paquete 1'
      } else {
        newForm.ilumination = ''
      }
      await this.setState({
        formModel: newForm
      })
    })
  }

  handleIluminacion2Change = async ()  => {
    await this.setState({
      iluminacion1: false,
      iluminacion2: !this.state.iluminacion2
    }, async () => {
      let newForm: FormModel = { ...this.state.formModel }
      if (this.state.iluminacion2) {
        newForm.ilumination = 'paquete 2'
      } else {
        newForm.ilumination = ''
      }
      await this.setState({
        formModel: newForm
      })
    })
  }

  submittedForm = () => {
    let json = JSON.stringify(this.state.formModel)
    alert(json)
  }

  render() {
    return (
      <div>
        <div id='blue-bar'></div>
        <div id='event-registration-container'>
          <div id='form-rect'>
            <h1 id='title-forms' style={{ color: 'black', paddingTop: '10px', paddingBottom: '10px' }}>Registro de evento</h1>
            <form onSubmit={ this.submittedForm }>
              <div className='form-group'>
                <label>Nombre</label>
                <input onChange={ this.handleInputChange('clientName') } className='form-control' placeholder='Nombre' />
              </div>
              <div className='form-group'>
                <label>Teléfono</label>
                <input onChange={ this.handleInputChange('clientPhone')} className='form-control' placeholder='Teléfono' />
              </div>
              <div className='form-group'>
                <label>Dirección de evento</label>
                <input onChange={ this.handleInputChange('clientAddress')} className='form-control' placeholder='Dirección' />
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
                    onDayChange={ this.handleDateChange('eventDate') } />
                </div>
              </div>
              <div className='form-row'>
                <div className='col-md-4'>
                  <label>De</label>
                  <select onChange={ this.handleFromChange('eventSchedule') } className='form-control ' placeholder='Horario de evento'>
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
                  <select onChange={ this.handleToChange('eventSchedule') } className='form-control ' placeholder='Horario de evento'>
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
              <div className='form-row'>
                <div className='col-md-4'>
                  <label style={{ marginTop: '20px' }}>Pista de baile</label>
                  <select onChange={ this.handleInputChange('danceFloor') } id='inputState' className='form-control'>
                    <option>ninguna</option>
                    <option>3x3</option>
                    <option>3x4</option>
                    <option>4x4</option>
                    <option>4x5</option>
                    <option>5x5</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <Checkbox inputProps={{ style: { marginTop: '15px' } }} label='Salitas Lounge' onChange={ this.handleSalitasChange } />
              </div>
              <div className='form-group'>
                <h5 style={{ marginTop: '20px' }}>Iluminación</h5>
                <p className='packageDesc'>Paquete 1: $1000 - 2 spots LED, 2 luces robóticas</p>
                <p className='packageDesc'>Paquete 2: $2000 - 4 spots LED, 4 luces robóticas</p>
                <Checkbox inputProps={{ style: { marginTop: '15px',  } }} label='paquete 1' onChange={ this.handleIluminacion1Change } checked={ this.state.iluminacion1 }/>
                <Checkbox inputProps={{ style: { marginTop: '15px', marginBottom: '20px'  } }} label='paquete 2' onChange={ this.handleIluminacion2Change } checked={ this.state.iluminacion2 }/>
              </div>
              <div className='form-group'>
                <label>Hora de instalación</label>
                <select onChange={ this.handleInputChange('instalationSchedule') } className='form-control' placeholder='Hora de instalacion'>
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
              <div className='form-group'>
                <label>Notas especiales (comentarios)</label>
                <input onChange={ this.handleInputChange('specialNotes') } className='form-control' placeholder='El evento sera sobre pasto, concreto, etc' />
              </div>
              <div className='text-center'><button className='btn btn-primary' id='submit-btn'>Submit</button></div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
