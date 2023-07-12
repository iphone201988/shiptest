import React, { Component } from 'react';
import Popconfirm from '../feedback/popconfirm';
import Button from '../uielements/button';
import notification from '../notification';

// Button to remove an item from an array. We pass the item's index in the array

export default class extends Component {
  render() {
    const {name, index, popMethod } = this.props;
    return (
        <Popconfirm
            title={`Are you sure to remove ${name}?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              popMethod(index);
            }}
        >
          <Button icon="close" type="button" className="isoDeleteBtn" />
        </Popconfirm>
    );
  }
}
