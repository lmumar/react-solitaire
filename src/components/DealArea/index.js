import React, {Component, PropTypes } from 'react';
import styles from './styles'

class DealArea extends Component {
  constructor(props) {
    super(props)
    let ownFuncs = [ "componentWillReceiveProps", "handleMouseDown", "render" ];
    ownFuncs.forEach((elem) => {
      if (!this[elem]) {
        console.error("Attempt to self-bind \'" + elem + "\' to <DealArea> failed");
        return;
      }
      this[elem] = this[elem].bind(this);
    })
  }
  componentWillReceiveProps(nextProps) {
  }
  handleMouseDown(e) {
    // Called when the top <Card> of <DealArea> is clicked
    let { faceDown: children } = this.props;
    let childRefName = 'child-' + (children.length-1);
    let lastChild = this.refs[childRefName];
    if (!lastChild) {
      let { moveCard, faceUp } = this.props;
      faceUp.forEach((elem) => {
        let { name } = elem.props;
        let card = {
          name,
          flipped: true,
        }
        moveCard(card, 'DEAL-AREA-FACEDOWN');
      });
    }
    if (lastChild.isFlipped()) {
      // If the card is face down, flip the top three cards off the stack and move to FACEUP
      let { moveCard } = this.props;
      for (let end = children.length - 1, index = end; index > end - 3; --index) {
        let refName = 'child-'+index;
        let { name } = this.refs[refName].props;
        moveCard({name, flipped: false}, 'DEAL-AREA-FACEUP');
      }
    } else {
      // If the card is already face up, let it handle its own MouseDown
      lastChild.handleMouseDown(e);
    }
  }
  render() {
    let index = 0;
    let { faceUp, faceDown } = this.props;
    let faceDownHooked;
    if (!faceDown.length) {
      faceDownHooked = <div className={'reset'}
                            onMouseDown={this.handleMouseDown}/>
    } else {
      faceDownHooked = React.Children.map(faceDown, (child) => {
        // Add refs to all children and an onMouseDown handler to the last child
        if (index !== faceDown.length - 1) {
          return React.cloneElement(child, {
            ref: 'child-' + (index++)
          });
        }
        console.log('Hooking MouseDown onto child ', child);
        return React.cloneElement(child, {
          onMouseDown: this.handleMouseDown,
          ref: 'child-' + (index++)
        });
      });
    }
    return (
      <div className={styles}>
        <span id={'left'}>
          {faceDownHooked}
        </span>
        <span id={'right'}>
          {faceUp}
        </span>
      </div>
    )
  }
}

DealArea.propTypes = {
  faceUp: PropTypes.array.isRequired,
  faceDown: PropTypes.array.isRequired
}

export default DealArea;
