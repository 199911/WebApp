import React, { Component } from 'react';
import Button  from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import geoString from './GeoLocationString';
/*
import {connect} from "react-redux";
import {fetchLocation} from "./actions";
import {bindActionCreators } from 'redux';
*/
import {getCurrentLocation, getGeoLocationFromStreetAddress} from './Location';

class LocationButton extends Component {
  constructor(props) {
    super(props);
    this.geolocation = null;
    this.streetAddress = null;
    if(this.props.geolocation != null) {
      this.geolocation = this.props.geolocation;
    }
    if(this.props.streetAddress != null) {
      this.streetAddress = this.props.streetAddress;
    }
    this.state = {open: false, streetAddress: this.streetAddress, geolocation: this.geolocation, disableSumbit: true};
    this.disabled = false;
    this.successCallBack = this.successCallBack.bind(this);
    this.streetAddressSuccessCallBack = this.streetAddressSuccessCallBack.bind(this);
    this.notSupportedCallBack = this.notSupportedCallBack.bind(this);
  }

  notSupportedCallBack() {
    this.disabled = true;
    console.log('Disabled');
  }

  successCallBack(pos) {
    this.geolocation = pos.coords;
    console.log("successCallBack " + this.geolocation.latitude + this.geolocation.longitude);
    this.setState({geolocation: pos.coords, disableSumbit: false});
    this.handleClose();
  }

  streetAddressSuccessCallBack(err, response) {
    if (!err) {
      console.log(response.json.results);
      var pos = { coords: 
                  {
                    latitude: response.json.results[0].geometry.location.lat,
                    longitude: response.json.results[0].geometry.location.lng
                  }
                };
      this.successCallBack(pos);
    }
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

  handleGetLocation() {
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getCurrentLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
    }
  }

  handleGetLocationFromStreetAddress() {
    if (this.disabled) {
      alert('Location not supported!');
    }
    else {
      getGeoLocationFromStreetAddress(this.state.streetAddress, this.streetAddressSuccessCallBack, this.errorCallBack);
    }
  }
  

  rest() {

  }

  handleClickOpen = () => {
    this.geolocation = null;
    this.setState({ open: true, streetAddress: "", geolocation: null, disableSumbit: true});
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.streetAddress = this.state.streetAddress;
    this.setState({ open: false });
  };
  

  render() {
    //const {fetchLocation, geoLocation} = this.props;
    const pos = this.state.geolocation;
    let locationString = null;
    if (pos != null) {
      if(this.state.streetAddress != "") {
        locationString = "位置: " + this.state.streetAddress + geoString(pos.latitude, pos.longitude);
      } else {
        locationString = "位置: " + geoString(pos.latitude, pos.longitude);   
      }  
    }
    return (
      <div>
        {locationString}
        <Button onClick={this.handleClickOpen}>輸入位置</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">輸入位置</DialogTitle>
          <DialogContent>
            <DialogContentText>
              請輸入街道地址或使用您當前的位置
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="stressAddress"
              label="街道地址"
              type="text"
              fullWidth
              value={this.state.streetAddress} onChange={event => this.setState({ streetAddress: event.target.value })}
            />
            <Button variant="raised" primary={true} onClick={() => this.handleGetLocationFromStreetAddress()}>驗證街道地址</Button>
            <Button variant="raised" primary={true} onClick={() => this.handleGetLocation()}>使用您當前的位置</Button> {locationString}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button disabled={this.state.disableSumbit} onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>        
         
      </div>);
  }
}
/*
const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation())
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LocationButton);
*/
export default LocationButton;
