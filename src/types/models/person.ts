export interface PersonDTO {
  id: string;
  name: string;
}

/** Persisted by the API as one versioned JSON string. */
export type CustomizerDTO = string;
