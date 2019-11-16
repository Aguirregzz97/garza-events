import * as React from 'react'
import { RingLoader } from 'react-spinners'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
  background: linear-gradient(20deg, rgba(11,65,99,1) 20%, rgba(11,90,100,1) 65%, rgba(11,110,100,1) 100%);
  padding-top: 30px;
`

type State = {
}

type Props = {
}

export class RingLoaderWrapper extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <Container>
        <div className='text-center' style={ { width: '200px', margin: 'auto' } }>
          <RingLoader
            color='white'
            size={ 200 } />
        </div>
        <h1 className='text-center' style={ { color: 'white', fontSize: '30px', marginTop: '20px' } }>Garza Events</h1>
      </Container>
    )
  }
}
