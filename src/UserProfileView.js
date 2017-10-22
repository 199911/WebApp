/*global FB*/
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import { FormText, FormControl } from 'material-ui/Form';
import LocationButton from './LocationButton';
import config from './config/default';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import InputLabel from 'material-ui/Input/InputLabel';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import geoString from './GeoLocationString';
import {getUserProfile, updateUserLocation, getUserRecords} from './UserProfile';


/* eslint-disable flowtype/require-valid-file-annotation */



const styles = {
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
};

class UserProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            userProfile: null
        };
    }    

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
    this.props.parent.handleClose();
  };

  componentDidMount() {
    console.log('UserProfile login'); 
    var auth = firebase.auth();
    console.log(auth);
    auth.onAuthStateChanged((user) => {
      if (user) {
        var userProfile = getUserProfile(user);
        var userLocation = getUserRecords(user, "locations");
        this.setState({user: user, userProfile: userProfile, userLocation: userLocation});
        console.log(userProfile);
      }
    });
    this.loadFBLoginApi();
  }
  
  loadFBLoginApi() {
    window.fbAsyncInit = function() {
            FB.init(config.fbApp);
        };
          // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); 
  }

  onSubmit() {
    this.setState({ open: false });
    this.props.parent.handleClose();
    var homeLocationLongitude = this.state.userProfile.homeLocationLongitude;
    var homeLocationLatitude = this.state.userProfile.homeLocationLatitude;
    var officeLocationLongitude = this.state.userProfile.officeLocationLongitude;
    var officeLocationLatitude = this.state.userProfile.officeLocationLatitude;

    if(this.homeLocationButton.geolocation != null) {
      homeLocationLongitude = this.homeLocationButton.geolocation.longitude;
      homeLocationLatitude = this.homeLocationButton.geolocation.latitude;
    }
    if(this.officeLocationButton.geolocation != null) {
      officeLocationLongitude = this.officeLocationButton.geolocation.longitude;
      officeLocationLatitude = this.officeLocationButton.geolocation.latitude;
    }
    
    updateUserLocation(this.state.user, officeLocationLatitude, officeLocationLongitude, homeLocationLatitude, homeLocationLongitude);
  }
  

  render() {
    const { classes } = this.props;
    var imgURL = '/images/profile_placeholder.png';
    var displayName = 'nobody';
    var publish = 0;
    var concern = 0;
    var complete = 0;
    var officeLocation = 'Not Set';
    var homeLocation = 'Not Set';
    if (this.state.user) {
        imgURL = this.state.user.photoURL;
        displayName = this.state.user.displayName
        if(this.state.userProfile != null)
        {
          console.log("UserProfile" + JSON.stringify(this.state.userProfile));          
          console.log("UserProfile Locations" + JSON.stringify(this.state.userLocation));          
          
          if(this.state.userProfile.publishMessages != null)
          {
            publish = this.state.userProfile.publishMessages.length;
          }
          if(this.state.userProfile.completeMessages != null)
          {
            complete = this.state.userProfile.completeMessages.length;
          }
          if(this.state.userProfile.concernMessages != null)
          {
            concern = this.state.userProfile.concernMessages.length;
          }                
          if(this.state.userLocation != null && this.state.userLocation.homeLocationLatitude != 0)
          {
            homeLocation = geoString(this.state.userLocation.homeLocationLatitude, this.state.userLocation.homeLocationLongitude);
          }
          if(this.state.userLocation != null && this.state.userLocation.officeLocationLatitude != 0)
          {
            officeLocation = geoString(this.state.userLocation.officeLocationLatitude, this.state.userLocation.officeLocationLongitude); 
          }
        }
    }
    return (
      <div>
        <ListItemText primary="User Profile" onClick={this.handleClickOpen}/>
        <Dialog
          fullScreen
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          transition={<Slide direction="right" />}
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography type="title" color="inherit" className={classes.flex}>
                <img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{displayName}
              </Typography>
              <Button color="contrast" onClick={() => this.onSubmit()}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="發表事件: " secondary={publish} />
            </ListItem>            
            <ListItem button>
              <ListItemText primary="關注事件" secondary={concern} />
            </ListItem>                        
            <ListItem button>
              <ListItemText primary="完成事件" secondary={complete} />
            </ListItem>                                   
            <Divider />            
            <ListItem>
              <ListItemText primary="屋企位置" secondary={homeLocation} /> 
              設定:<LocationButton ref={(locationButton) => {this.homeLocationButton = locationButton;}}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="辦公室位置" secondary={officeLocation} />
              設定:<LocationButton ref={(locationButton) => {this.officeLocationButton = locationButton;}}/>              
            </ListItem>            
          </List>
        </Dialog>
      </div>
    );
  }
}

UserProfileView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserProfileView);

