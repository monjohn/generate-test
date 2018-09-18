import { Screen, VerySpecialButton } from './'
  
describe('<Screen />', () => {
  const defaultScreenProps = 
  { name: 'example', sex: 'Male' }  


  const newComponent = (props) => shallow(
    <Screen
        {...defaultProps}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})

 
describe('<VerySpecialButton />', () => {
  const defaultVerySpecialButtonProps = 
  {}  


  const newComponent = (props) => shallow(
    <VerySpecialButton
        {...defaultProps}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})

 