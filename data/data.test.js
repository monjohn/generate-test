import { View } from './'

const defaultProps = 
  { name: 'example', sex: 'Male' }  


const newComponent = (props) => shallow(
    <Printing
        {...defaultProps}
        {...props}
    />
)

const component = newComponent()
describe('<View />', () => {
  it('renders', () => {
    expect(component).toMatchSnapshot()
  })
})

 