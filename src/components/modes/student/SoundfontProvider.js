// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from 'react';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';

class SoundfontProvider extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(['mp3', 'ogg']),
    soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
    audioContext: PropTypes.instanceOf(window.AudioContext).isRequired,
    render: PropTypes.func.isRequired,
  };

  static defaultProps = {
    format: 'mp3',
    soundfont: 'MusyngKite',
    instrumentName: 'acoustic_grand_piano',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    };
  }

  componentDidMount() {
    const { instrumentName } = this.props;
    this.loadInstrument(instrumentName);
  }

  componentDidUpdate(prevProps) {
    const { instrumentName } = this.props;
    if (prevProps.instrumentName !== instrumentName) {
      this.loadInstrument(instrumentName);
    }
  }

  loadInstrument = instrumentName => {
    // Re-trigger loading state
    this.setState({
      instrument: null,
    });
    const { format, audioContext, soundfont, hostname } = this.props;
    Soundfont.instrument(audioContext, instrumentName, {
      format,
      soundfont,
      nameToUrl: (name, sf, fmt) => {
        return `${hostname}/${sf}/${name}-${fmt}.js`;
      },
    }).then(instrument => {
      this.setState({
        instrument,
      });
    });
  };

  playNote = midiNumber => {
    const { audioContext } = this.props;
    const { activeAudioNodes, instrument } = this.state;
    audioContext.resume().then(() => {
      const audioNode = instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  stopNote = midiNumber => {
    const { audioContext } = this.props;
    const { activeAudioNodes } = this.state;
    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, activeAudioNodes, {
          [midiNumber]: null,
        }),
      });
    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    const { audioContext } = this.props;
    const { activeAudioNodes } = this.state;
    audioContext.resume().then(() => {
      const nodes = Object.values(activeAudioNodes);
      nodes.forEach(node => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {},
      });
    });
  };

  render() {
    const { render } = this.props;
    const { instrument } = this.state;
    return render({
      isLoading: !instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
    });
  }
}

export default SoundfontProvider;
