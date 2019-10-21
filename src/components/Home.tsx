import * as React from 'react'
import { Login } from './Login'

type State = {
}

type Props = {
}

export class Home extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <Login />
    )
  }
}
