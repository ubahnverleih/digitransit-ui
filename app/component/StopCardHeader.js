import PropTypes from 'prop-types';
import React from 'react';
import CardHeader from './CardHeader';
import ComponentUsageExample from './ComponentUsageExample';
import InfoIcon from './InfoIcon';

class StopCardHeader extends React.Component {
  getDescription() {
    let description = '';

    if (
      this.context.config.stopCard.header.showDescription &&
      this.props.stop.desc
    ) {
      description += this.props.stop.desc;
    }

    if (
      this.context.config.stopCard.header.showDistance &&
      this.props.distance
    ) {
      description += ` // ${Math.round(this.props.distance)} m`;
    }

    return description;
  }

  render() {
    if (!this.props.stop) {
      return false;
    }

    return (
      <CardHeader
        className={this.props.className}
        headingStyle={this.props.headingStyle}
        name={this.props.stop.name}
        description={this.getDescription()}
        code={
          this.context.config.stopCard.header.showStopCode &&
          this.props.stop.code
            ? this.props.stop.code
            : null
        }
        icons={this.props.icons}
      />
    );
  }
}

StopCardHeader.propTypes = {
  stop: PropTypes.object,
  distance: PropTypes.number,
  className: PropTypes.string,
  headingStyle: PropTypes.string,
  icons: PropTypes.arrayOf(PropTypes.node),
};

StopCardHeader.contextTypes = {
  config: PropTypes.object.isRequired,
};

const exampleStop = {
  code: '4611',
  gtfsId: 'HSL:1541157',
  name: 'Kaivonkatsojanpuisto',
  desc: 'Kaivonkatsojantie',
};

const exampleIcons = [<InfoIcon stop={exampleStop} key="example" />];

StopCardHeader.displayName = 'StopCardHeader';

StopCardHeader.description = () =>
  <div>
    <ComponentUsageExample description="basic">
      <StopCardHeader stop={exampleStop} distance={345.6} />
    </ComponentUsageExample>
    <ComponentUsageExample description="with icons">
      <StopCardHeader
        stop={exampleStop}
        distance={345.6}
        icons={exampleIcons}
      />
    </ComponentUsageExample>
  </div>;

export default StopCardHeader;
