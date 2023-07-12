import React from 'react';
import { ContentHolderWrapper } from './contentHolder.style';

export default props => (
  <ContentHolderWrapper style={props.style}>
    {props.children}
  </ContentHolderWrapper>
);
