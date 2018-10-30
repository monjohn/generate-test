import React, { Component } from 'react'
import { View } from 'react-native'

type Name = string
type Sex = 'Male' | 'Female'
type Props = { name: string; sex: Sex }

class Screen extends Component<Props> {
  render() {
    return <div>{this.props.name}</div>
  }
}

const VerySpecialButton = ({
  onPress,
}: {
  onPress: () => null
  title: string
}) => <View />
