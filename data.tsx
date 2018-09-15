import React, { Component } from 'react'

// type Props = { name: string }

class View extends React.Component<{
  func: () => void
  myobject: { a: string }
  name: string
  numbers: number[]
  tuple: [string, number]
}> {
  render() {
    return <div>{this.props.name}</div>
  }
}
