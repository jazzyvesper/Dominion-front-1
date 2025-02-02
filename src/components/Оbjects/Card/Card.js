import React from "react";
import "./Card.css";
import CardFeatures from "../CardFeatures/CardFeatures";
import { useParams } from 'react-router-dom';
import ImageBlocks from './ImageBlocks'

function Card(props) {
  let { id } = useParams();
  let cards = props.cards;
  const card = cards.find(f => f._id === id);
  //const [cardData, setCardData] = React.useState()
  let localData = JSON.parse(localStorage.getItem('cards'))
  const newcard = props.cards.length > 0 ? card : localData
    
  React.useEffect(()=>{
    if(cards.length > 0) {
      localStorage.setItem("cards", JSON.stringify(card))
    }
  }, [cards])

    //редактирование карточки
    function handleEditCard() {
      props.onCardEdit(newcard)
    }


  return (
    <main className="desc">
      <button onClick={handleEditCard} type="button" className='popup__edit'></button>
      <div className="desc__block">
        <ImageBlocks onCardClick={props.onCardClick} image={newcard.image}/>
        <div className="desc__list">
          <CardFeatures card={newcard} />
        </div>
      </div>
      <div>
        <h2 className="desc__title">Описание:</h2>
        <p className="desc__text">{newcard.description}</p>
      </div>
    </main>
  );
}

export default Card;
