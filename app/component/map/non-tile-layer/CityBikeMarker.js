import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import provideContext from 'fluxible-addons-react/provideContext';
import { intlShape } from 'react-intl';
import { routerShape, locationShape } from 'react-router';

import CityBikePopup from '../popups/CityBikePopup';
import Icon from '../../Icon';
import GenericMarker from '../GenericMarker';
import { station as exampleStation } from '../../ExampleData';
import ComponentUsageExample from '../../ComponentUsageExample';
import CityBikeRoute from '../../../route/CityBikeRoute';
import { isBrowser } from '../../../util/browser';
import Loading from '../../Loading';

let L;

/* eslint-disable global-require */
// TODO When server side rendering is re-enabled,
//      these need to be loaded only when isBrowser is true.
//      Perhaps still using the require from webpack?
if (isBrowser) {
  L = require('leaflet');
}
/* eslint-enable global-require */

const CityBikePopupWithContext = provideContext(CityBikePopup, {
  intl: intlShape.isRequired,
  router: routerShape.isRequired,
  location: locationShape.isRequired,
  route: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
});

// Small icon for zoom levels <= 15
const smallIconSvg = `
  <svg viewBox="0 0 8 8">
    <circle class="stop-small" cx="4" cy="4" r="3" stroke-width="1"/>
  </svg>
`;

class CityBikeMarker extends React.Component {
  static description = (
    <div>
      <p>Renders a citybike marker</p>
      <ComponentUsageExample description="">
        <CityBikeMarker
          key={exampleStation.id}
          map="leaflet map here"
          station={exampleStation}
        />
      </ComponentUsageExample>
    </div>
  );

  static displayName = 'CityBikeMarker';

  static propTypes = {
    station: PropTypes.object.isRequired,
    transit: PropTypes.bool,
  };

  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired,
    router: routerShape.isRequired,
    location: locationShape.isRequired,
    route: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    config: PropTypes.object.isRequired,
  };

  getIcon = zoom =>
    !this.props.transit && zoom <= this.context.config.stopsSmallMaxZoom
      ? L.divIcon({
          html: smallIconSvg,
          iconSize: [8, 8],
          className: 'citybike cursor-pointer',
        })
      : L.divIcon({
          html: Icon.asString('icon-icon_citybike', 'city-bike-medium-size'),
          iconSize: [20, 20],
          className: 'citybike cursor-pointer',
        });

  render() {
    if (!isBrowser) {
      return false;
    }
    return (
      <GenericMarker
        position={{
          lat: this.props.station.lat,
          lon: this.props.station.lon,
        }}
        getIcon={this.getIcon}
        id={this.props.station.stationId}
      >
        <Relay.RootContainer
          Component={CityBikePopup}
          route={new CityBikeRoute({ stationId: this.props.station.stationId })}
          renderLoading={() =>
            <div className="card" style={{ height: '12rem' }}>
              <Loading />
            </div>}
          renderFetched={data =>
            <CityBikePopupWithContext {...data} context={this.context} />}
        />
      </GenericMarker>
    );
  }
}

export default Relay.createContainer(CityBikeMarker, {
  fragments: {
    station: () => Relay.QL`
      fragment on BikeRentalStation {
        lat
        lon
        stationId
      }
    `,
  },
});
