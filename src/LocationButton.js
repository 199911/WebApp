import React, { Component } from 'react';
import Button  from 'material-ui/Button';
import getLocation from './Location';

class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.geolocation = null
    this.disabled = false;
    this.successCallBack = this.successCallBack.bind(this);
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('Your current position is:');
    console.log('Latitude : ' + pos.coords.latitude);
    console.log('Longitude: ' + pos.coords.longitude);
    console.log('More or less ' + pos.coords.accuracy + 'meters.');  
    this.geolocation = pos.coords;
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  handleGetLocation() {
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
    }
  }


  render() {
    return (<Button raised primary={true} onClick={() => this.handleGetLocation()}>Location</Button>);
  }
}

export default LocationButton;
