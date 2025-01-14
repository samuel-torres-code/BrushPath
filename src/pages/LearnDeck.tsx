import react, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCharacterScoreData,
  getCharsFromRefs,
  getDeckFromID,
} from "../utils/FirebaseQueries";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { AuthContext } from "../utils/FirebaseContext";
import LoadingSpinner from "../components/LoadingSpinner";
import LearnCardList from "../components/learn-mode/LearnCardList";
import characterParser from "../utils/characterParser";
import Character from "../types/Character";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface LearnProps { }
type RetrievableData = {
  data: Character[] | null;
  loading: boolean;
  error: string;
};

const LearnDeck: React.FC<LearnProps> = ({ }) => {
  const [characters, setCharacters] = useState<RetrievableData>({
    data: null,
    loading: true,
    error: "",
  });

  let { id } = useParams();

  const { user, userData, getUserData } = useContext(AuthContext);

  // useLayoutEffect(() => {
  //   if (!userData) {
  //     getUserData();
  //   }
  // }, []);

  const fetchCharactersToLearn = (numCharacters: number = 30) => {
    if (!id) {
      setCharacters({ data: null, loading: false, error: "No url parameter" });
      return;
    }
    if (!userData?.email) {
      setCharacters({ data: null, loading: false, error: "No email" });
      return;
    }
    const promises = Promise.all([
      getDeckFromID(id),
      getCharacterScoreData(userData?.email),
    ]);
    promises.then(([deck, score]) => {
      let deckData = deck as { _id: string } & DocumentData;
      let scoreData = score as DocumentData[] | null;
      console.log(deckData);
      console.log(scoreData);
      if (!deckData || !deckData?.characters) {
        setCharacters({
          data: null,
          loading: false,
          error: "Deck data not found",
        });
        return;
      }
      if (scoreData === null || scoreData === undefined) {
        setCharacters({
          data: null,
          loading: false,
          error: "Error getting character score",
        });
        return;
      }
      //Filter out learned characters
      let potentialCharacters: DocumentReference[] = [];
      deckData.characters.forEach((character: DocumentReference) => {
        if (!scoreData?.some((char) => char.characterRef.id === character.id)) {
          potentialCharacters.push(character);
        }
      });

      // setCharacters({ data: potentialCharacters.slice(0,30), loading: false, error: "" });

      getCharsFromRefs(potentialCharacters, 0).then((fetchedChars) => {
        if (!fetchedChars) {
          setCharacters({
            data: null,
            loading: false,
            error: "Error fetching character data",
          });
          return;
        }
        const filteredChars = fetchedChars
          .map((character: any) => characterParser(character))
          .filter(
            (character: Character | null): character is Character =>
              character !== null
          )
          .slice(0, Math.min(numCharacters, fetchedChars.length));
        // console.log(fetchedChars);
        // debugger;
        setCharacters({ data: filteredChars, loading: false, error: "" });
      });
    });
  };

  useEffect(() => {
    if (userData) {
      fetchCharactersToLearn(7);
    }
  }, [userData]);

  let navigate = useNavigate();

  return (
    <>
      {characters.loading ? (
        <LoadingSpinner />
      ) : characters.error || characters.data == null ? (
        <p>{characters.error}</p>
      ) : characters.data.length > 0 ? (
        <LearnCardList recall={false} learn={true} characters={characters.data} />
      ) : (
        <>
          <div className="deck-title-back">
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => navigate("/")}
            >
              <ArrowBackIosNewIcon
                style={{ fontSize: "18px" }}
              ></ArrowBackIosNewIcon>
            </div>

            <p className="error-message">You've already learned all the words in this deck.</p>
          </div>
        </>
      )}
    </>
  );
};

export default LearnDeck;
