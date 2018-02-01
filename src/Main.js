import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

class Main extends Component {
  constructor(props) {
    super(props);
    let params = (new URL(document.location)).searchParams;
    this.eventId = params.get("eventid");
    this.userId = params.get("userid");
    this.eventNumber = params.get("eventnumber");
    this.distance = params.get("distance");
    if(this.eventNumber == null) {
      this.eventNumber = 20;
    }
    // distance in KM
    if(this.distance == null) {
      this.distance = 1;
    }    
    this.updateLocation = this.updateLocation.bind(this);
    this.props.updateLocationCallback(this.updateLocation);
  }

  handleClick() {
    this.openDialog();
  };

  updateLocation(locationString, longitude, latitude) {
    console.log('Main: ' + longitude + "," + latitude);
    this.updateLocationCallback(locationString, longitude, latitude);
  }


  render() {

    let pubilcProfileHtml = null;
    let messageHtml = null;
    console.log("Query UserID: " + this.userId + " eventID: " + this.eventId);
    if(this.userId != null) {
      pubilcProfileHtml = <PublicProfile id={this.userId}/>;
    } else {
      messageHtml = <div><MessageList uuid={this.eventId} eventNumber={this.eventNumber} distance={this.distance} updateLocationCallback={updateLocationCallback => this.updateLocationCallback = updateLocationCallback}/><PostMessageView/></div>;
    }
    return (
      <div>
        <br/>
          {pubilcProfileHtml}
          {messageHtml}
      </div>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
