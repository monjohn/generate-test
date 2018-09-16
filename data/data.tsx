import React, { Component } from 'react'

// type Name = 'First' | 'Last'
type Props = { name: string }

class View extends React.Component<Props> {
  render() {
    return <div>{this.props.name}</div>
  }
}
