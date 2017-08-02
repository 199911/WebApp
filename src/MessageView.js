import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBlock, CardTitle, CardSubtitle, Button } from 'reactstrap';
import * as firebase from 'firebase';
import ProgressiveCardImg from './ProgressiveCardImg';

class MessageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var m = this.props.message;
    console.log(m);
    var locationSpan = (<span>N/A</span>);
    if (m.latitude) {
      locationSpan = (<span>{m.latitude}, {m.longitude}</span>);
    }
    var photoUrl = '/images/profile_placeholder.png';
    if (m.photoUrl) {
      photoUrl = m.photoUrl;
    }
    return (<div>
              <Card>
                <CardBlock>
                  <CardSubtitle>Geo: {locationSpan}</CardSubtitle>
                  <CardText>Summary: {m.text}</CardText>
          
                </CardBlock>
                <ProgressiveCardImg top gs_src={m.imageUrl}/>
                <CardBlock>
                  <CardSubtitle><img src={photoUrl}/>{m.name}</CardSubtitle>
                </CardBlock>
              </Card>
              <br/>
            </div>);
  }
}

export default MessageView;
