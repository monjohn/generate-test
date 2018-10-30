import { Screen, VerySpecialButton } from './data.tsx'
  
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

 
  describe('<VerySpecialButton />', () => {
  
    const defaultVerySpecialButtonProps = { onPress: () => {}, title: 'example' }  

  const newComponent = (props) => shallow(
    <VerySpecialButton
        {...defaultVerySpecialButtonProps}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})

 