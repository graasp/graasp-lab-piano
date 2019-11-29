import React, { Component } from 'react';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class DimensionsProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
      .isRequired,
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired,
  };

  render() {
    const { children, containerWidth, containerHeight } = this.props;
    return (
      <div>
        {children({
          containerWidth,
          containerHeight,
        })}
      </div>
    );
  }
}

export default Dimensions()(DimensionsProvider);
