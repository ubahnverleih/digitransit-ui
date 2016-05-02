React               = require 'react'
Tab                 = require('material-ui/Tabs/Tab').default
GeolocationOrInput  = require "./geolocation-or-input"
EndpointActions     = require '../../action/endpoint-actions'
SearchActions       = require '../../action/search-actions'
SearchModal         = require './search-modal'
{intlShape}         = require 'react-intl'

class OneTabSearchModal extends React.Component

  @contextTypes:
    getStore: React.PropTypes.func.isRequired
    executeAction: React.PropTypes.func.isRequired
    intl: intlShape.isRequired


  componentDidUpdate: (prevProps, prevState) ->
    if @props.modalIsOpen
      setTimeout(
        (() => @refs.geolocationOrInput?.refs.searchInput.refs.autowhatever?.refs.input?.focus()),
        0) #try to focus, does not work on ios

      if !@props.endpoint
        @context.executeAction SearchActions.executeSearch, {input: "", type: "endpoint"}
      else if @props.target == 'origin'
        @context.executeAction SearchActions.executeSearch, {input: @context.getStore('EndpointStore').getOrigin()?.address || "", type: "endpoint"}
      else if @props.target == 'destination'
        @context.executeAction SearchActions.executeSearch, {input: @context.getStore('EndpointStore').getDestination()?.address || "", type: "endpoint"}

  render: ->

    searchTabLabel = if @props.customTabLabel then @props.customTabLabel else
      @context.intl.formatMessage
        id: @props.target or "origin"
        defaultMessage: @props.target or "origin"

    <SearchModal
      selectedTab="tab"
      modalIsOpen={@props.modalIsOpen}
      closeModal={@props.closeModal}>
      <Tab
        className="search-header__button--selected"
        label={searchTabLabel}
        value="tab">
        <GeolocationOrInput
          ref="geolocationOrInput"
          initialValue={@props.initialValue}
          type="endpoint"
          endpoint={@props.endpoint}
          onSuggestionSelected = {
            if @props.customOnSuggestionSelected then @props.customOnSuggestionSelected else
              (name, item) =>
                if item.type == 'CurrentLocation'
                  @context.executeAction EndpointActions.setUseCurrent, @props.target
                else
                  @context.executeAction EndpointActions.setEndpoint,
                    "target": @props.target,
                    "endpoint":
                      lat: item.geometry.coordinates[1]
                      lon: item.geometry.coordinates[0]
                      address: name
                @props.closeModal()
        }/>
    </Tab>
    </SearchModal>

module.exports = OneTabSearchModal
