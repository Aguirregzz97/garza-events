import * as React from 'react'
import { RingLoader } from 'react-spinners'

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
      <div>
        <div className='text-center' style={ { width: '200px', margin: '30px auto' } }>
          <RingLoader
            color='rgba(10,65,99,1)'
            size={ 200 } />
        </div>
        <h1 className='text-center' style={ { color: 'rgba(10,65,99,1)', fontSize: '30px', marginTop: '20px' } }>Garza Events</h1>
      </div>
    )
  }
}
