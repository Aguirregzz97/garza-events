import * as React from 'react'
// tslint:disable-next-line:import-name
import ReactTable, { Column, RowInfo } from 'react-table'
import 'react-table/react-table.css'

interface IReactTableData<T> {
  pageSize: number
  sortedRows: T[]
}

interface IState {
  currentTablePage: number
}

interface IProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClicked?: (original: T) => void
  currentRow?: T
  highlightSelectedRow: boolean
  onTableViewChanged?: () => void
  getId: (row: T) => string
  onRowDoubleClicked?: (row: T) => void
  onRowEnterDown?: (row: T) => void
  onSortedRowsUpdated?: (sortedRows: T[]) => void
}

export class ReactTableWrapper<T> extends React.Component<IProps<T>, IState> {
  public reactTable = React.createRef<ReactTable<T>>()
  public reactTableDiv = React.createRef<HTMLDivElement>()
  constructor(props: IProps<T>) {
    super(props)
    this.state = {
      currentTablePage: 0,
    }
  }

  componentDidMount() {
    if (this.props.onSortedRowsUpdated) {
      this.props.onSortedRowsUpdated(this.props.data)
    }

    if (!this.reactTableDiv.current) {
      return
    }
    this.reactTableDiv.current.focus()
  }

  // tslint:disable-next-line:no-any
  getTrGroupProps = (_state: any, rowInfo: RowInfo, _column?: Column, _instance?: any) => {
    if (!rowInfo) {
      return undefined
    }

    let isCurrentRowSelected = false
    if (this.props.currentRow) {
      isCurrentRowSelected = this.props.getId(rowInfo.original) === this.props.getId(this.props.currentRow)
    }

    return {
      // tslint:disable-next-line:no-any
      onClick: (_e: any, _handleOriginal: any) => {
        if (this.props.onRowClicked) {
          this.props.onRowClicked(rowInfo.original)
        }
      },
      // tslint:disable-next-line:no-any
      onDoubleClick: (_e: any, _handleOriginal: any) => {
        if (!this.props.onRowDoubleClicked) {
          return
        }
        this.props.onRowDoubleClicked(rowInfo.original)
      },
      style: {
        cursor: 'pointer',
        background: isCurrentRowSelected && this.props.highlightSelectedRow ? '#4682B4' : 'white',
        color: isCurrentRowSelected && this.props.highlightSelectedRow ? 'white' : 'black',
      },
    }
  }

  onPageChange = (page: number) => {
    this.setState({
      currentTablePage: page,
    })
  }

  scrollToCurrentRow = () => {
    if (!this.props.currentRow) {
      return
    }
    const current = this.reactTable.current
    if (current) {
      const reactTable = current
      // tslint:disable-next-line:no-any
      // const page = (reactTable.state as any).page
      // tslint:disable-next-line:no-any
      const pageSize = (reactTable.state as any).pageSize
      // tslint:disable-next-line:no-any
      const sortedData = ((reactTable as any).getResolvedState() as any).sortedData
      // const startIdx = page * pageSize
      // const currentData = allData.slice(startIdx, startIdx + pageSize).map((item) => item._original)
      // tslint:disable-next-line:no-console
      let currentIndex: number = 0
      for (const row of sortedData) {
        const original: T = row._original
        if (original) {
          const id = this.props.getId(original)
          const currentId = this.props.getId(this.props.currentRow)
          if (id === currentId) {
            this.setState({
              currentTablePage: Math.floor(currentIndex / pageSize),
            })
          }
        }
        currentIndex += 1
      }
    }
  }

  public getTableData(): IReactTableData<T> | undefined {
    const current = this.reactTable.current
    if (!current) {
      return undefined
    }

    // tslint:disable-next-line:no-any
    // const page = (current.state as any).page
    // tslint:disable-next-line:no-any
    const pageSize = (current.state as any).pageSize
    // tslint:disable-next-line:no-any
    const sortedData: any[] = ((current as any).getResolvedState() as any).sortedData
    const sortedRows: T[] = []
    for (const data of sortedData) {
      sortedRows.push(data._original)
    }

    return {
      pageSize,
      sortedRows,
    }
  }

  resetToFirstPage = () => {
    this.setState({
      currentTablePage: 0,
    })

    if (this.props.onSortedRowsUpdated) {
      const reactTableData = this.getTableData()
      if (reactTableData) {
        this.props.onSortedRowsUpdated(reactTableData.sortedRows)
      }
    }
  }

  getDiff = (pageSize: number, key: string) => {
    switch (key) {
      case 'ArrowDown':
        return 1
      case 'ArrowUp':
        return -1
      case 'ArrowRight':
        return pageSize
      case 'ArrowLeft':
        return -pageSize
      default:
        throw new Error('Tecla no soportada')
    }
  }

  onTableKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const reactTableData = this.getTableData()
    if (!this.props.currentRow || !reactTableData) {
      return
    }
    let currentIndex: number = -1
    for (let i = 0; i < reactTableData.sortedRows.length; i += 1) {
      if (this.props.getId(reactTableData.sortedRows[i]) === this.props.getId(this.props.currentRow)) {
        currentIndex = i
        break
      }
    }
    if (e.key === 'Enter') {
      if (!this.props.onRowEnterDown) {
        return
      }
      this.props.onRowEnterDown(reactTableData.sortedRows[currentIndex])
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dif: number = this.getDiff(reactTableData.pageSize, e.key)
      const nextIndex = Math.max(Math.min(currentIndex + dif, reactTableData.sortedRows.length - 1), 0)
      const nextPage = Math.floor(nextIndex / reactTableData.pageSize)
      if (this.props.onRowClicked) {
        this.props.onRowClicked(reactTableData.sortedRows[nextIndex])
      }
      this.setState({
        currentTablePage: nextPage,
      })
    }
  }

  render() {
    return (
      <div ref={ this.reactTableDiv } role='group' tabIndex={ 0 } onKeyDown={ this.onTableKeyDown } style={ { paddingBottom: '20px' } }>
        <ReactTable<T>
          page={ this.state.currentTablePage }
          onPageChange={ this.onPageChange }
          data={ this.props.data }
          filterable={ true }
          // defaultFilterMethod={(filter, row) =>
          //   String(row[filter.id]) === filter.value}
          columns={ this.props.columns }
          defaultPageSize={ 8 }
          className='-striped -highlight'
          pageSizeOptions={ [8, 12, 16, 20, 24] }
          getTrGroupProps={ this.getTrGroupProps }
          // onPageSizeChange={ this.resetToFirstPage }
          onSortedChange={ this.resetToFirstPage }
          // onExpandedChange={ this.resetToFirstPage }
          onFilteredChange={ this.resetToFirstPage }
          // onResizedChange={ this.resetToFirstPage }
          ref={ this.reactTable } />
      </div>
    )
  }
}
