import React, { Component } from 'react';
import * as firebase from 'firebase';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import PlaceIcon from 'material-ui-icons/Place';
import WorkIcon from 'material-ui-icons/Work';
import HomeIcon from 'material-ui-icons/Home';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import LocationButton from '../LocationButton';
import Dialog, { 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {connect} from "react-redux";
import { withStyles } from 'material-ui/styles';
import timeOffsetStringInChinese from '../TimeString';
import geoString from '../GeoLocationString';
import { deleteAddress, upsertAddress } from '../actions';
import  {constant, addressEnum} from '../config/default';


const styles = theme => ({
    fab: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
    },
});

class AddressView extends Component {
    constructor(props) {
        super(props);
        var text = "";
        var geolocation = null;
        var streetAddress = null;  
        var type = addressEnum.other;      
        if(this.props.address != null) {
            var c = this.props.address;
            text = c.text;
            geolocation = {latitude :c.geolocation.latitude,
                longitude: c.geolocation.longitude};
            streetAddress = c.streetAddress;
            type = c.type;
        }        
        this.state = {
            popoverOpen: false,
            text: text,
            geolocation: geolocation,
            streetAddress: streetAddress,
            type: type
        };
    }

    handleRequestOpen(evt) {
        evt.preventDefault();
        var text = "";
        var geolocation = null;
        var streetAddress = null; 
        var type = addressEnum.other;        
        if(this.props.address != null) {
            var c = this.props.address;
            text = c.text;
            geolocation = {latitude :c.geolocation.latitude,
                            longitude: c.geolocation.longitude};
            streetAddress = c.streetAddress;
            type = c.type;
        }        
        this.setState({
            popoverOpen: true,
            text: text,
            geolocation: geolocation,
            streetAddress: streetAddress,
            type: type
        });
      }
    
    handleRequestClose() {
        this.setState({
          popoverOpen: false,
        });
    }; 
    
    onSubmit() {
        const { user } = this.props;
        if (user.user) {
          var key = null;
          if (this.props.address != null) {
              key = this.props.address.id;
          }
          this.props.upsertAddress(user.user, key, this.state.type, this.state.text, this.locationButton.geolocation, this.locationButton.streetAddress);
          this.setState({popoverOpen: false});
   
        }
    }

    onDelete() {
      const { user } = this.props;
      if (user.user) {
        var key = null;
        if (this.props.address != null) {
            key = this.props.address.id;
        }
        if (key == null)
          return;
        this.props.deleteAddress(user.user, key);
      }  
      this.setState({popoverOpen: false});
    }
    


    render() {
        const { classes, theme } = this.props;
        let addressButtonHtml = null;
        let titleText = constant.updateAddressLabel;
        let geolocation = null;
        let streetAddress = null;
        let type = addressEnum.other;  
        let icons = <PlaceIcon />;
        if(this.props.address != null) {
            var c = this.props.address;
            var text = c.text;
            streetAddress = c.streetAddress;
            type = c.type;
            var locationString = constant.addressNotSet;
            switch(type) {
                case addressEnum.home:
                    icons = <HomeIcon />;
                    break;
                case addressEnum.office:
                    icons = <WorkIcon />;
                    break;
            }
            if(c.geolocation != null) {
                geolocation = {latitude :c.geolocation.latitude,
                    longitude: c.geolocation.longitude};
                if(c.streetAddress != null) {
                    locationString =  c.streetAddress + " (" + geoString(c.geolocation.latitude, c.geolocation.longitude) + ")";
                } else {
                    locationString = "近" + geoString(c.geolocation.latitude, c.geolocation.longitude);      
                } 
            }
            addressButtonHtml = <ListItem button onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <ListItemIcon>
                                        {icons}
                                    </ListItemIcon>
                                    <ListItemText primary={text} secondary={locationString} />
                                </ListItem>
        } else {
            titleText = constant.addAddressLabel;
            addressButtonHtml = <Button variant="fab" color="primary" className={classes.fab} raised={true} onClick={(evt) => this.handleRequestOpen(evt)}>
                                    <AddIcon />
                                </Button>
        }
        return(<span>
                    {addressButtonHtml}
                    <Dialog open={this.state.popoverOpen} onClose={() => this.handleRequestClose()} aria-labelledby="form-dialog-title" unmountOnExit>
                        <DialogTitle id="form-dialog-title">{titleText}</DialogTitle>
                        <DialogContent>
                            {icons}
                            <TextField autoFocus required id="message" fullWidth margin="normal" helperText="名稱" value={this.state.text} onChange={event => this.setState({ text: event.target.value })}/>
                            <LocationButton autoFocus geolocation={geolocation} streetAddress={streetAddress} ref={(locationButton) => {this.locationButton = locationButton;}}/>                   
                        </DialogContent>  
                        <DialogActions>
                            <Button color="secondary" onClick={() => this.onDelete()} >刪除</Button>
                            <Button color="primary" onClick={() => this.handleRequestClose()} >取消</Button>
                            <Button color="primary" onClick={() => this.onSubmit()}>提交</Button> 
                        </DialogActions>          
                    </Dialog>
                </span>);
    }
}

AddressView.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    filter : state.filter,
    geolocation: state.geolocation,
    user: state.user,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteAddress:
      (user, key) =>
        dispatch(deleteAddress(user, key)),
    upsertAddress:
      (user, key, type, text, geolocation, streetAddress) =>
        dispatch(upsertAddress(user, key, type, text, geolocation, streetAddress)),
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddressView));
