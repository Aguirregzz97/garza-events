import * as React from 'react'
import { InitialScreen } from './InitialScreen'

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
        <InitialScreen />
    )
  }
}
