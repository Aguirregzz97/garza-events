import * as React from 'react'
const logo128 = require('../assets/img/logoGrande.png')
type State = {
}

type Props = {
}

export class InitialScreen extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className='text-center'>
          <img src={ logo128 } />
        </div>
        <h1>this is the initial screen</h1>
        <h1 style={ { color: 'black', paddingTop: '20px' } } className='text-center'>Bienvenido a ETISYS online!</h1>
      </div>
    )
  }
}
