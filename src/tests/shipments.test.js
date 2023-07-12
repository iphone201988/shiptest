import React from 'react';
import AppRouter from '../CarrierApp/AppRouter';
import Enzyme, { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Adapter from 'enzyme-adapter-react-16';
import { experimentalLocalIjToH3 } from 'h3-js';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

Enzyme.configure({ adapter: new Adapter() });

describe('Shipment Create Quote', () => {
  it('renders the home page of shippers', () => {
    
  })
  it('renders the quote page', () => {
    const store = mockStore();
    const wrapper = shallow(<AppRouter store={store}/>);
    expect(shallowToJson(wrapper).toMatchSnapshot());
  });
  it('correctly displays the post new load component', () => {

  });
  it('creates the quote request', () => {

  });
})