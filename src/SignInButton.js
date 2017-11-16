import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import Button from 'material-ui/Button';


class SignInButton extends  Component {

  componentDidMount() {
    var auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      console.log(user);
      this.setState({user: user});
    });
  }

  handleSignOut() {
    firebase.auth().signOut();
  }

  handleSignIn() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_friends');
    provider.addScope('publish_actions');
    provider.addScope('user_managed_groups');
    provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(result.additionalUserInfo.profile);
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }
 
  render() {
    const classes = this.props.classes;
    if (this.state == null) {
      return (<div></div>);
    }
    if (this.state.user) {
      var imgURL = (this.state.user.photoURL || '/images/profile_placeholder.png');
      return (<div style={{alignItems: "center", display: "flex"}}>&nbsp;&nbsp;&nbsp;<img src={imgURL} style={{height:"20px", width:"20px"}}/>&nbsp;&nbsp;{this.state.user.displayName}&nbsp;&nbsp;<Button raised secondary={true} onClick={() => this.handleSignOut()}>登出</Button></div>);
    }
    else
    {
      return (<Button raised onClick={() => this.handleSignIn()} primary={true}>使用Facebook登入</Button>);
    }
  }
}

SignInButton.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default SignInButton;
