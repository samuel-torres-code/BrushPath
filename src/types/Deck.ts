import { DocumentReference } from "firebase/firestore";

type Deck = {
    _id?: string;
    id: number;
    image: string;
    name: string;
    desc: string;
    userRef?: DocumentReference;
};

export default Deck;