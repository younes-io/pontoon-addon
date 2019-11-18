import React from 'react';
import { shallow } from 'enzyme';
import { TourDialogContent } from './TourDialogContent';

describe('<TourDialogContent>', () => {

  it('renders full section', () => {
    const wrapper = shallow(
      <TourDialogContent
        localeTeam='cs'
        sections={[
          {
            id: 'identifier',
            title: 'TITLE',
            image: 'mock.jpg',
            imageClass: 'right',
            text: 'Lorem Ipsum',
            buttonText: 'Lipsum...',
            buttonOnClick: () => {},
          }
        ]}
      />
    );

    expect(wrapper.find('li.active').hasClass('identifier')).toBe(true);
    expect(wrapper.find('li.active').text()).toBe('TITLE');
    expect(wrapper.find('section').hasClass('identifier')).toBe(true);
    expect(wrapper.find('section h2').text()).toBe('TITLE');
    expect(wrapper.find('section p').text()).toBe('Lorem Ipsum');
    expect(wrapper.find('section .image.right')).toHaveLength(1);
    expect(wrapper.find('button').hasClass('identifier')).toBe(true);
    expect(wrapper.find('button').text()).toBe('Lipsum...');
  });

  it('renders minimal section', () => {
    const wrapper = shallow(
      <TourDialogContent
        localeTeam='cs'
        sections={[
          {
            id: 'identifier',
            title: 'TITLE',
            text: 'Lorem Ipsum',
          }
        ]}
      />
    );

    expect(wrapper.find('li.active').hasClass('identifier')).toBe(true);
    expect(wrapper.find('li.active').text()).toBe('TITLE');
    expect(wrapper.find('section').hasClass('identifier')).toBe(true);
    expect(wrapper.find('section h2').text()).toBe('TITLE');
    expect(wrapper.find('section p').text()).toBe('Lorem Ipsum');
    expect(wrapper.find('section .image')).toHaveLength(0);
    expect(wrapper.find('section img')).toHaveLength(0);
    expect(wrapper.find('button')).toHaveLength(0);
  });

  it('navigation switches sections on click', () => {
    const wrapper = shallow(
      <TourDialogContent
        localeTeam='cs'
        sections={[
          {
            id: 'id1',
            title: 'TITLE 1',
            text: 'Lorem Ipsum 1',
          },
          {
            id: 'id2',
            title: 'TITLE 2',
            text: 'Lorem Ipsum 2',
          }
        ]}
      />
    );

    expect(wrapper.find('li.active').hasClass('id1')).toBe(true);
    expect(wrapper.find('li.active').text()).toBe('TITLE 1');
    expect(wrapper.find('section').hasClass('id1')).toBe(true);
    expect(wrapper.find('section h2').text()).toBe('TITLE 1');
    expect(wrapper.find('section p').text()).toBe('Lorem Ipsum 1');

    wrapper.find('li.id2').simulate('click');

    expect(wrapper.find('li.active').hasClass('id2')).toBe(true);
    expect(wrapper.find('li.active').text()).toBe('TITLE 2');
    expect(wrapper.find('section').hasClass('id2')).toBe(true);
    expect(wrapper.find('section h2').text()).toBe('TITLE 2');
    expect(wrapper.find('section p').text()).toBe('Lorem Ipsum 2');
  });

  it('for English users activates the settings section', () => {
    const wrapper = shallow(
      <TourDialogContent
        localeTeam='en-US'
        sections={[
          {
            id: 'identifier',
            title: 'TITLE',
            text: 'Lorem Ipsum',
          },
          {
            id: 'addonSettings',
            title: 'SETTINGS',
            text: 'Settings',
          }
        ]}
      />
    );

    expect(wrapper.find('li.active').hasClass('addonSettings')).toBe(true);
    expect(wrapper.find('li.active').text()).toBe('SETTINGS');
    expect(wrapper.find('section').hasClass('addonSettings')).toBe(true);
    expect(wrapper.find('section h2').text()).toBe('SETTINGS');
    expect(wrapper.find('section p').text()).toBe('Settings');
  });

});
