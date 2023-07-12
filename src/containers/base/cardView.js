import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Card, Button } from 'antd';
import  firebase  from 'helpers/firebase/index.js';
import Card from '../DataGrid/customCard'

class CardView extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // Fetch cards from Firestore and update the Redux store
    firebase.collection('cards').onSnapshot(snapshot => {
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'FETCH_CARDS_SUCCESS', payload: cards });
    });
  }

  render() {
    const { cards } = this.props;
    return (
      <div>
        {cards.map(card => (
         <><Card card={card} /></>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cards: state.cards,
});

export default connect(mapStateToProps)(CardView);
