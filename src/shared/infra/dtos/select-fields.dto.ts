export class SelectFields {
  selectFields: string;
}

export const hydratesSelectFields = <T>(selectFields: string): T[] => {
  return selectFields ? (selectFields.split(',') as T[]) : [];
};
