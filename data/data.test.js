import { View } from '././data/data.tsx'

const defaultProps = {
  func: undefined,
  name: 'example',
  count: 87,
  isFunny: true,
}

const newComponent = props => shallow(<Printing {...defaultProps} {...props} />)

const component = newComponent()
describe('<View />', () => {
  it('renders', () => {
    expect(component).toMatchSnapshot()
  })
})
