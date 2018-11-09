# Generate Jest Tests from TypeScript

**Is this library for you?**

Perhaps. Does one or more of the following apply to you?

- You think writing tests is important but don't like the boilerplate.
- Your PR is failing CI because you have dropped below the minimum level of code coverage and you need to get that number up quick.
- You have started using Typescript and have wondered to yourself, "Is there anything TypeScript can't do?"

## Getting Started

### Installing

1. Clone this repository
2. `cd generate-test`
3. `npm link`

### Usage

1. Find a tsx file (let's pretent its called source.tsx) and run `generate-test source.tsx`
2. You will find the generated file in the same directory

## Examples

**What does it do?**

It uses the TypeScript compiler to analyze a file with a function or class that returns a React Component and generates a test file for you. That's cool. But what is even cooler is that, if you provide the types of the props, then it will generate the default props using those types. You gotta admit, that's pretty cool.

How about some examples? You have a React class component that has well-typed props, like this:

```TypeScript
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
```

And it generates a test file like this:

```TypeScript
import { Screen } from './data.tsx'

describe('<Screen />', () => {

  const defaultScreenProps = { name: 'example', sex: 'Male' }

  const newComponent = (props) => shallow(
    <Screen
        {...defaultScreenProps}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})
```

"But, wait!", you say, "I prefer stateless components." That's no problem.

```TypeScript
export const CoolButton = ({
  onPress,
  disabled,
}: {
  onPress: () => null
  disabled: boolean
}) => (
  <TouchableHighlight disabled={disabled} onPress={onPress}>
    <View>
      <Text>Press Me</Text>
    </View>
  </TouchableHighlight>
)
```

This input will give you.

```TypeScript
import { CoolButton } from './data.tsx'

  describe('<CoolButton />', () => {

    const defaultCoolButtonProps = { onPress: () => {}, disabled: true }

  const newComponent = (props) => shallow(
    <CoolButton
        {...defaultCoolButtonProps}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})
```

This was a function expression, but it will work with a function statement as well. "But what about a non-React function?", you asked? I am glad you asked...

```TypeScript
const nonReactFunction = (max: number) => {
  return Math.floor(Math.random() * max)
}
```

You will get this test generated for you.

```TypeScript
import { nonReactFunction } from './data.tsx'

describe('nonReactFunction', () => {
  it('does the thing', () => {
    const result = nonReactFunction(20)

    expect(result).toBeTruthy()
  })
})
```

## Contributing

All PRs and Issues and any other kind of input are most welcome.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
