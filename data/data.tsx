import React, { Component } from 'react'

// type Props = { name: string }

class View extends React.Component<{
  func: () => void
  name: string
  count: number
  isFunny: boolean
}> {
  render() {
    return <div>{this.props.name}</div>
  }
}
