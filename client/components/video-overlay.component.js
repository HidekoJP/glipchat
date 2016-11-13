import {_} from 'meteor/underscore';
import * as Actions from '../actions/actions';
import Colors from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Radium from 'radium';
import React from 'react';

const ding = new Audio('/audio/ding.mp3');

const styles = {
  css: {
    'transition': 'background-color 1s ease-in-out',
    'backgroundColor': 'rgba(0,0,0,0)',
    'height': '100%',
    'left': 0,
    'position': 'absolute',
    'top': 0,
    'width': '100%',
    'zIndex': 1,
    ':hover': {},
  },

  mute: {
    // styles for local mute icon (user mutes a peer)
    css: {
      'backgroundColor': 'transparent',
      'float': 'right',
      'opacity': 0,
      'position': 'absolute',
      'right': '5px',
      'top': '5px',
      'transition': 'opacity 1s ease-in-out',
      'zIndex': 3,
    },

    // styles for remote mute icon (peer mutes themself)
    remote: {
      css: {
        bottom: '5px',
        height: '40px',
        padding: 0,
        textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
        top: 'initial',
        width: '40px',
      },
    },

    visible: {
      css: {
        opacity: 1,
      },
    },
  },

  shade: {
    css: {
      backgroundColor: 'rgba(0,0,0,.7)',
    },
  },
};

export class VideoOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shade: false,
      shadeTimer: null,
    };
  }

  componentDidMount() {
    // play ding on entry
    // TODO: this might get weird if you're the 4th person to enter -- do you get 4 dings?
    if (this.props.id !== 'local') {
      ding.play();
    }
  }

  toggleAudio() {
    const {id} = this.props;
    if(id === 'local') {
      this.props.dispatch(Actions.toggleLocalAudio());
    } else {
      this.props.dispatch(Actions.toggleRemoteAudio(id));
    }
  }

  render() {
    return (
      <div
        key='overlay'
        style={[
          styles.css,
          (Radium.getState(this.state, 'overlay', ':hover') || this.state.shade) && styles.shade.css,
        ]}
        onClick={this.props.setPrimaryStream}>
        <FloatingActionButton
          onClick={this.toggleAudio.bind(this)}
          style={_.extend({},
            styles.mute.css,
            (Radium.getState(this.state, 'overlay', ':hover') ||
            !this.props.isAudioEnabled || this.state.shade) ?
              styles.mute.visible.css : {})
          }
          mini={true}
          primary={false}>
          <FontIcon
            className='material-icons'
            color={Colors.fullWhite}>mic_off
          </FontIcon>
        </FloatingActionButton>
        <IconButton style={_.extend({},
            styles.mute.css,
            styles.mute.remote.css,
            (!!this.props.isRemoteEnabled && !this.props.isRemoteEnabled.audio) ?
              styles.mute.visible.css : {})
          }
          mini={true}
          primary={false}>
          <FontIcon
            className='material-icons'
            color={Colors.fullWhite}>mic_off
          </FontIcon>
        </IconButton>
      </div>
    );
  }
};

VideoOverlayComponent.propTypes = {
  params: React.PropTypes.object,
  isRemoteEnabled: React.PropTypes.shape({
    audio: React.PropTypes.bool,
    video: React.PropTypes.bool,
  }),
  isAudioEnabled: React.PropTypes.bool,
};

export default Radium(VideoOverlayComponent);