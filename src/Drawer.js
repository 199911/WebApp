
import React, { Component } from 'react';
import * as firebase from 'firebase';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import InboxIcon from 'material-ui-icons/Inbox';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';
import UserProfileView from './UserProfileView'
import {connect} from "react-redux";
import Divider from 'material-ui/Divider';
import {fetchLocation, setHomeLocation, setOfficeLocation} from "./actions";
const currentLocationLabel = "現在位置";
const officeLocationLabel = "辦公室位置";
const homeLocationLabel = "屋企位置";


class DrawerMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    this.setState({open: !this.state.open});
  }

  handleClose(){
    this.setState({open: false});
  }

  userProfileClick(){
    this.handleClose();
    this.openUserProfileDialog();
  }

  currentClick() {
    this.props.fetchLocation();
    this.handleClose();
  }  

  homeClick() {
    this.props.setHomeLocation();
    this.handleClose();
  }  

  officeClick() {
    this.props.setOfficeLocation();
    this.handleClose();
  }  

  render() {
    let userSection = (<div></div>);

    const { user } = this.props;

    if (user) {
      var imgURL = (user.photoURL || '/images/profile_placeholder.png');
      userSection = (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{user.displayName}&nbsp;&nbsp;</div>);

    }

    return (
      <div>
        <IconButton onClick={() => this.handleToggle()}>
          <Icon>menu</Icon>
        </IconButton>
        <UserProfileView ref={(userProfileView) => {this.userProfileView = userProfileView;}} openDialog={openDialog => this.openUserProfileDialog = openDialog}/>        
        <Drawer
          open={this.state.open}
          onRequestClose={() => this.handleClose()}          
        >
          <div>
            <List>
              <ListItem>
              {userSection}
              </ListItem>
            </List>
            <Divider/>
            <List disablePadding>
              
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={currentLocationLabel} onClick={() => this.currentClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="關注" onClick={() => this.handleClose()}/>
              </ListItem>              
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={homeLocationLabel} onClick={() => this.homeClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={officeLocationLabel} onClick={() => this.officeClick()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Ladder" onClick={() => this.handleClose()}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="User Profile" onClick={() => this.userProfileClick()}/>
              </ListItem>                                                        
            </List>
          </div>                  
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    geoLocation : state.geoLocation,
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocation: () => dispatch(fetchLocation()),
    setOfficeLocation: () => dispatch(setOfficeLocation()),
    setHomeLocation: () => dispatch(setHomeLocation())
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
