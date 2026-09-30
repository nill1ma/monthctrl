export interface Incoming {
  id: string;
  created_at: string;
  value: number | null;
  user_id: string;
  reference: string;
  origin: string;
  category_id: string | null;
  currency: string;
}
export type DetailsIncomingData = Pick<Incoming, "id" | "value" | "origin">;
export type CreateIncoming = Pick<
  Incoming,
  "value" | "origin" | "reference" | "category_id" | "currency"
>;
export type UpdateIncoming = Pick<
  Incoming,
  "id" | "value" | "origin" | "reference" | "category_id" | "currency"
>;
