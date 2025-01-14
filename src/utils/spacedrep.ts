import { networkInterfaces } from "os";
import { Timestamp } from "firebase/firestore";
type ReviewItem = {
    id: string;
    repetition: number;
    interval: number;
    easeFactor: number;
    nextReviewDate: Date;
};

// class SpacedRepetitionSystem {
//     items: ReviewItem[];

//     constructor() {
//         this.items = [];
//     }

//     addItem(id: string): void {
//         const newItem: ReviewItem = {
//             id: id,
//             repetition: 0,
//             interval: 0,
//             easeFactor: 1.25,
//             nextReviewDate: new Date(),
//         };
//         this.items.push(newItem);
//     }

//     reviewItem(id: string, quality: number): void {
//         const item = this.items.find(item => item.id === id);
//         if (!item) return;

//         if (quality >= 3) {
//             if (item.repetition === 0) {
//                 item.interval = 1;
//             } else if (item.repetition === 1) {
//                 item.interval = 6;
//             } else {
//                 item.interval = Math.ceil(item.interval * item.easeFactor);
//             }
//             item.repetition++;
//         } else {
//             item.repetition = 0;
//             item.interval = 1;
//         }

//         item.easeFactor = Math.max(1.3, item.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
//         item.nextReviewDate = (new Date(Date.now() + item.interval * 24 * 60 * 60 * 1000))

//         // console.log(`Next review for item ${item.id} is in ${item.interval} days.`);
//         // console.log(item.nextReviewDate)
//     }
// }

const reviewItem = (id:string, quality:number, repetition:number=0, interval:number=0, easeFactor:number = 1.25, nextReviewDate:Date = new Date()) => {

        if (quality >= 3) {
            if (repetition === 0) {
                interval = 1;
            } else if (repetition === 1) {
                interval = 6;
            } else {
                interval = Math.ceil(interval * easeFactor);
            }
            repetition++;
        } else {
            repetition = 0;
            interval = 1;
        }

        easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);
        return {repetition, interval, easeFactor, nextReviewDate:Timestamp.fromDate(nextReviewDate)};
}

// // Usage example
// const spaceSystem= new SpacedRepetitionSystem();
// spaceSystem.addItem('1');
// spaceSystem.reviewItem('1', 5); // User remembered the item well
// spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered
// spaceSystem.reviewItem('1', 5); // User remembered the item well
// spaceSystem.reviewItem('1', 0); // Lower quality response, but still remembered
// spaceSystem.reviewItem('1', 5); // User remembered the item well
// spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered
// spaceSystem.reviewItem('1', 5); // Lower quality response, but still remembered

export {reviewItem} ;