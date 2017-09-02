import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader} from 'material-ui/Card';
import getLocation from './Location';
import distance from './Distance.js';
import { withStyles } from 'material-ui/styles';
import red from 'material-ui/colors/red';
import MessageDetailView from './MessageDetailView';


const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

class MessageView extends Component {
  constructor(props) {
    super(props);
    this.state = {lat: 0, lon: 0, expanded: false};
    this.successCallBack = this.successCallBack.bind(this);
  }

  componentDidMount() {
    getLocation(this.successCallBack, this.errorCallBack, this.notSupportedCallback);
  }

  notSupportedCallBack() {
    console.log('Disabled');
  }

  successCallBack(pos) {
    console.log('Your current position is:');
    console.log('Latitude : ' + pos.coords.latitude);
    console.log('Longitude: ' + pos.coords.longitude);
    console.log('More or less ' + pos.coords.accuracy + 'meters.'); 
    this.setState({ lat: pos.coords.latitude, lon: pos.coords.longitude}); 
  }

  errorCallBack(error) {
    console.warn('ERROR(${err.code}): ${err.message}');
  }

    handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  };


  render() {
    const classes = this.props.classes;
    var m = this.props.message;
    var distanceSpan = "距離: ";
    if (m.latitude) {
      if (this.state.lat) {
        var dis = distance(m.longitude,m.latitude,this.state.lon,this.state.lat);
        var dist;
        if (dis > 1)
          dist = Math.round(dis) + "km";
        else
          dist = Math.round(dis * 1000) + "m";
        distanceSpan += dist;
      }
    }
    var date = new Date(m.createdAt);
    var subtitle = '張貼於： ' + date.toGMTString() + ' ' + distanceSpan;
    return (<div>
              <Card  onClick={() => this.handleExpandClick()}>                   
                <CardHeader
                  title={m.text}
                  subheader={subtitle}>
                </CardHeader>
                <MessageDetailView message={m} key={m.key} expanded={this.state.expanded}/>                    
              </Card>
              <br/>
            </div>);
  }
}

MessageView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessageView);
//export default MessageView;