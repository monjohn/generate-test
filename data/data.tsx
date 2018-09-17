import React, { Component } from 'react'

type Name = string
type Sex = 'Male' | 'Female'
type Props = { name: string; sex: Sex }

class View extends React.Component<Props> {
  render() {
    return <div>{this.props.name}</div>
  }
}
