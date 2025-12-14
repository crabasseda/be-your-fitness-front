export interface Feedback {
  _id: string;
  trainer_id: { name: string; surname: string };
  athlete_id: string;
  message: string;
  createdAt: string;
}
