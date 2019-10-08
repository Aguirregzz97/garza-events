import * as React from 'react'
import { LoginForm } from '../shared/types'
import './../assets/scss/mobileForms.scss'

type State = {
  loginForm: LoginForm | any,
}

type Props = {

}

export class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      loginForm: undefined,
    }
  }

  componentDidMount() {
    let user: LoginForm = { ...this.state.loginForm }
    user.username = ''
    user.password = ''
    this.setState({
      loginForm: user
    })
  }

  handleInputChange = (paramName: string) => (event: any) => {
    let newLoginForm: any = { ...this.state.loginForm }
    newLoginForm[paramName] = event.target.value
    this.setState({
      loginForm: newLoginForm
    })
  }

  submittedForm = (event: any) => {
    event.preventDefault()
    let json = JSON.stringify(this.state.loginForm)
    alert(json)
  }


  render() {
    return (
      <div>
        <div id='blue-bar'></div>
          <div id='event-registration-container'>
            <div id='form-rect'>
             <h1 id='title-forms' style={{ color: 'black', paddingTop: '10px', paddingBottom: '10px' }}>Inicio de sesión</h1>
              <form onSubmit={ this.submittedForm }>
                <div className='form-group'>
                 <label>Usuario</label>
                  <input onChange={this.handleInputChange('username')} className='form-control' placeholder='Usuario' />
                </div>
                <div className='form-group'>
                 <label>Contraseña</label>
                  <input type="password" onChange={this.handleInputChange('password')} className='form-control' placeholder='Contraseña' />
                </div>
                <div className='text-center'><button className='btn btn-primary' id='submit-btn'>Submit</button></div>
              </form>
            </div>
          </div>
        </div>
    )
  }
}