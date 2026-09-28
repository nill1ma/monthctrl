export interface Incoming {
  id: string;
  created_at: string;
  value: number | null;
  user_id: string;
  reference: string;
  origin: string;
}
export type DetailsIncomingData = Pick<Incoming, "id" | "value" | "origin">;
export type CreateIncoming = Pick<Incoming, "value" | "origin" | "reference">;
export type UpdateIncoming = Pick<
  Incoming,
  "id" | "value" | "origin" | "reference"
>;
