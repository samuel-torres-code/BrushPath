import React, { useContext, useEffect } from "react";
import "../styles/styles.css";
import HomeStats from "../components/HomeStats";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { useParams } from "react-router";
import { AuthContext } from "../utils/FirebaseContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../utils/Firebase";
import characterParser from "../utils/characterParser";
import Character from "../types/Character";
import SingleWordView from "./SingleWord";

interface HomeProps {
  message: string;
  user: string;
}

const decks = [
     {
        id: 0,
        coverImage: "../sample_deck.png",
        name: "JLPT N5",
      },
      {
        id: 1,
        coverImage: "../deck-covers/sample1.jpeg",
        name: "JLPT N4",
      },
      {
        id: 2,
        coverImage: "../deck-covers/sample2.jpeg",
        name: "JLPT N3",
      }
]


const charData = {
  readings: [
    { type: 'ja_on', value: 'ボク' },
    { type: 'ja_kun', value: 'ほう' },
    { type: 'ja_kun', value: 'ほお' },
    { type: 'ja_kun', value: 'えのき' }
  ],
  nanori: [],
  radicals: [ { rad_type: 'classical', value: '75' } ],
  grade: '8',
  jlpt: '1',
  freq: '1626',
  codepoints: [
    { cp_type: 'ucs', value: '6734' },
    { cp_type: 'jis208', value: '1-43-49' }
  ],
  compounds: { '素朴': [ 'simple', 'artless', 'naive', 'unsophisticated' ] },
  meanings: [ 'crude', 'simple', 'plain', 'docile' ],
  stroke_count: '6',
  literal: '朴'
}


const Home: React.FC<HomeProps> = (props) => {
  const handleDeckClick = (deckId:any) => {
    console.log('Deck clicked:', deckId);
  };
  //const {user} = useParams<any>();
  const {user} = useContext(AuthContext);

  const character : Character = characterParser(charData);

  return (
    <div className="home-page">
      <h2 className="home-greeting">
        {props.message}, {user?.displayName}
      </h2>
      {/* <HomeStats /> */}
      <HomeStudyPrompt
        newUser={false}
        suggestedDeck={{
          id: 0,
          coverImage: "../sample_deck.png",
          name: "JLPT N5"
        }}
      />
    <h2>Recent Decks</h2>
    <DeckList decks={decks} onDeckClick={handleDeckClick}></DeckList>
    </div>
  );
};

export default Home;
