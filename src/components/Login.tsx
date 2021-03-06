import * as React from 'react'
import { LoginForm } from '../shared/types'
import styled from 'styled-components'
import { Redirect } from 'react-router'
import { loginApi } from '../shared/RestApi'
import { successLogin, errorDialog } from '../shared/GenericAlerts'

const userImage = require('./../assets/img/username.png')

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
  justify-content: center;
  align-items: center;
`
const Box = styled.div`
  background-image: url(${userImage});
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 70%;
  width: 450px;
  background: #fff;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 5px 8px 8px 5px rgba(0,0,0,0.2);  

  @media only screen and (max-width: 520px) {
    width: 320px;
  } 
`
const HeadingLogin = styled.h1`
  margin-top: 15%;
  font-family: roboto;
  font-size: 30px;
  color: #333;
  line-height: 1.2;
  text-align: center;
  width: 100%;
  display: block;
  font-weight: bold;
`

const InputUsername = styled.input`
  margin-top: 8%;
  font-family: roboto;
  font-size: 18px;
  line-height: 1.2;
  color: #686868;
  display: block;
  width: 80%;
  background: #e6e6e6;
  height: 62px;
  border-radius: 3px;
  padding: 0 30px 0 65px;
`
const InputPassword = styled.input`
  margin-top: 8%;
  font-family: roboto;
  font-size: 18px;
  line-height: 1.2;
  color: #686868;
  display: block;
  width: 80%;
  background: #e6e6e6;
  height: 62px;
  border-radius: 3px;
  padding: 0 30px 0 65px;
`
const LoginBtn = styled.button`
  margin-top: 10%;
  width: 80%;
  font-family: roboto;
  font-size: 16px;
  line-height: 1.5;
  color: #fff;
  height: 62px;
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
    background: #1a8f6e;
  }
`

const LinkToRegister = styled.a`
  margin-top: 5%;
  color: #0B4163
  -o-transition: all .4s;
  -moz-transition: all .4s;
  transition: all .4s;
`


type State = {
  loginForm: LoginForm,
  loginSucces:  boolean
}

type Props = {
}

export class Login extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      loginForm: { username: '',  password: '' },
      loginSucces: false
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      window.location.href = '/#/events'
    }
  }

  handleInputChange = (paramName: 'username' | 'password') => (event: any) => {
    let newLoginForm: LoginForm = {
      username: this.state.loginForm.username,
      password: this.state.loginForm.password,
    }
    newLoginForm[paramName] = event.target.value
    this.setState({
      loginForm: newLoginForm
    })
  }

  submittedForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (await loginApi(this.state.loginForm)) {
      await successLogin('Login correcto!')
      this.setState({
        loginSucces: true
      })
    } else {
      await errorDialog('Login incorrecto, intenta de nuevo')
    }
  }


  render() {
    if (this.state.loginSucces) {
      return <Redirect to='/events' />
    }
    return (
      <form onSubmit={ this.submittedForm }>
        <Container>
          <Box>
            <HeadingLogin>Login</HeadingLogin>
            <InputUsername onChange={ this.handleInputChange('username') } placeholder='username' />
            <InputPassword type='password' onChange={ this.handleInputChange('password') } placeholder='password'></InputPassword>            
            <LoginBtn>Login</LoginBtn>
            <LinkToRegister href="#/event-registration">Quiero registrar un evento</LinkToRegister>
            <img style={{ width: '60px', marginTop: '20px' }} src={userImage} alt=""/>
          </Box>
        </Container>
      </form>
    )
  }
}