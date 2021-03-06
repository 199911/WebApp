import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import ForumIcon from 'material-ui-icons/Forum';
import EmailIcon from 'material-ui-icons/Email';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import Typography from 'material-ui/Typography';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import MessageDetailView from './MessageDetailView';
import {updateMessageConcernUser} from './MessageDB';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import yellow from 'material-ui/colors/yellow';
import purple from 'material-ui/colors/purple';


import {
  isConcernMessage, 
  toggleConcernMessage
} from './UserProfile';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const someNetwork = {
  verticalAlign: "top",
  display: "inline-block",
  marginRight: "1em",
  textAlign: "center",
};

const buttonStyle = {
  width: '3.3em',
  height: '3.3em',
};

const forumButtonStyle = {
  ...buttonStyle,
  backgroundColor: yellow[500],
};



const styles = theme => ({
  shareButton: {
    margin: 0,
    backgroundColor: purple[500],
  },
  avatar: {
    backgroundColor: red[500],
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  someNetwork: someNetwork,
  someNetworkShareCount: {
    color: 'white',
    marginLeft: '0.3em',
    fontSize: '1.0em',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  someNetworkShareButton: {
    cursor: "pointer",
  },
  facebook: {
    ...someNetwork,
  },
  container: {
    display: 'flex',
    height: '5rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const {
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
} = ShareButtons;

const {
  FacebookShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');

class ShareDrawer extends React.Component {
  state = {
    bottom: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  facebookHashTag(tags) {
    var tagsLength = 0
    if(tags != null) {
      tagsLength = tags.length;
    }
    var tagString = '';
    for (var i = 0; i < tagsLength; i++) {
      tagString += "#"+tags[i] + " ";
    }
    console.log("HashTag String:" + tagString);
    return tagString;

  }

  facebookQuote(message) {
/*
                "<meta property=\"og:title\"              content=\"" + message.text + "\" />" +
                "<meta property=\"og:description\"        content=\"Location"  +  "" + "\" />";
*/
    var quote = message.text;
    return quote;    
  }

  renderEmail(shareUrl, m) {
    const {classes} = this.props;
    return (
      <div className={classes.someNetwork}>
        <EmailShareButton
          url={shareUrl}
          subject={m}
          body={shareUrl}
          className={classes.someNetworkShareButton}>
          <EmailIcon
            style={{width: '4.5rem', height: '4.5rem'}}
            color="secondary"
            round />
        </EmailShareButton>
      </div>
    );
  }

  renderWhatsapp(shareUrl, m) {
    const {classes} = this.props;
    return (
      <div className={classes.someNetwork}>
        <WhatsappShareButton
          url={shareUrl}
          title={m}
          separator=":: "
          className={classes.someNetworkShareButton}
        >
          <WhatsappIcon round size={'3.3em'} />
        </WhatsappShareButton>
      </div>
    );

  }

  renderFacebook(shareUrl, m, hashtag) {
    const {classes} = this.props;
    return (
      <div className={classes.facebook}>
        <FacebookShareButton
          url={shareUrl}
          quote={m}
          hashtag={hashtag}
          className={classes.someNetworkShareButton}>
          <FacebookIcon round size={'3.3em'} />
        </FacebookShareButton>
      </div>
    );
  
  }



  render() {
    const { classes } = this.props;
    var m = this.facebookQuote(this.props.message);
    var hashtag = this.facebookHashTag(this.props.message.tag);
    var shareUrl = window.location.protocol + "//" + window.location.hostname + "/?eventid=" + this.props.message.key;
 
    return (
      <span>
        <Button
          variant="fab"
          color="primary"
          className={classes.shareButton}
          raised={true}
          onClick={this.toggleDrawer('bottom', true)}
        >
          <ShareIcon />
        </Button>
        <Drawer
          anchor="bottom"
          open={this.state.bottom}
          onClose={this.toggleDrawer('bottom', false)}
        >
          <AppBar position="static">
            <Toolbar>
              <Typography variant="title" color="inherit">
                分享
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            tabIndex={0}
            role="button"
            className={classes.container}
            onClick={this.toggleDrawer('bottom', false)}
            onKeyDown={this.toggleDrawer('bottom', false)}
          >
            { this.renderFacebook(shareUrl, m, hashtag) }
            { this.renderWhatsapp(shareUrl, m) }
            { this.renderEmail(shareUrl, m) }
          </div>
        </Drawer>
      </span>
    );
  }
}

ShareDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShareDrawer);
