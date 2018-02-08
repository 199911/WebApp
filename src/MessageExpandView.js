import * as firebase from 'firebase';
import React, { Component } from 'react';
import { CardActions, CardContent, CardMedia} from 'material-ui/Card';
import ProgressiveCardImg from './ProgressiveCardImg';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import ForumIcon from 'material-ui-icons/Forum';
import EmailIcon from 'material-ui-icons/Email';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import MessageDetailView from './MessageDetailView';
import {updateMessageConcernUser} from './MessageDB';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import yellow from 'material-ui/colors/yellow';
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
  height: '80%',
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
  bottom: {
    position: 'fixed',
    bottom:'0%',
    height:'10vh',
    backgroundColor: theme.palette.primary['400'],
    width: '100%'
  },
  card: {
    maxWidth: 400,
  },
  media: {
    height: 960,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
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
    display: 'flex',
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


class MessageExpandView extends Component {
  constructor(props) {
    super(props);
    this.state = {favor: false};
  }

  componentDidMount() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    if(user)
    {
      isConcernMessage(user, uuid).then((favor) => {
        this.setState({favor: favor});
      });
    }
  }
  

  handleFavorClick() {
    var user = this.props.user;
    var uuid = this.props.uuid;
    console.log("uuid: " +  uuid);
    if(user)
    {
      toggleConcernMessage(user, uuid).then((favor) => {
        updateMessageConcernUser(uuid, user, favor).then(() => {
          this.setState({ favor: favor });
        });
      });
    }
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

  favorColor() {
    var favorColor = 'primary';
    if(this.state.favor)
    {
      favorColor = 'accent';
    }
    return favorColor;
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

          <Button color="secondary" fab style={buttonStyle}>
          <EmailIcon
            size={'3.3em'}
            round />

         </Button>
        </EmailShareButton>
      </div>
    );
  }

  renderForum(facebookURL) {
    const {classes} = this.props;
    return (
      <div className={classes.someNetwork}>
        <Button fab href={facebookURL} data-scheme='fb://profile/10000' style={forumButtonStyle}>
          <ForumIcon />
        </Button>
      </div>
    );
  }

  renderFavorite() {
    const {classes} = this.props;
    return (

      <div className={classes.someNetwork}>
        <Button
          color={this.favorColor()}
          onClick={() => this.handleFavorClick()}
          aria-label="Add to favorites"
          fab
          style={buttonStyle}
        >
          <FavoriteIcon />
        </Button>
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
          <Button fab style={buttonStyle}>
            <WhatsappIcon round size={'3.3em'} />
          </Button>
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
            <Button
               onClick={() => this.handleFavorClick()}
               aria-label="Add to favorites"
               fab
               style={buttonStyle}
            >
              <FacebookIcon round size={'3.3em'} />
            </Button>
          </FacebookShareButton>
          <FacebookShareCount
            url={shareUrl}
            className={classes.someNetworkShareCount}>
            {count => count}
          </FacebookShareCount>
      </div>
    );
  
  }


  render() {
    const classes = this.props.classes;
    var m = this.facebookQuote(this.props.message);
    var hashtag = this.facebookHashTag(this.props.message.tag);
    var shareUrl = window.location.protocol + "//" + window.location.hostname + "/?eventid=" + this.props.uuid;
/*
    if(this.props.message.publicImageURL != null) {
      m = m + " " + hashtag + " " + shareUrl;
      shareUrl = this.props.message.publicImageURL; 
    }
*/    
    

    var facebookURL = "https://facebook.com/" + m.fbpost;
    return(
      <div className={classes.bottom}>
      <CardActions disableActionSpacing>
        { this.renderFavorite() }
        { this.renderFacebook(shareUrl, m, hashtag) }
        { this.renderWhatsapp(shareUrl, m) }          
        { this.renderEmail(shareUrl, m) }
        { this.renderForum(facebookURL) }
        <div className={classes.flexGrow} />
    </CardActions>
    </div>);                       
  }
}

export default withStyles(styles) (MessageExpandView);
