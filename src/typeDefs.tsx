export type AutocompleteProps = Partial<AutocompleteOptions<BaseItem>> & {
    className?: string;
  };
  
export type SetInstantSearchUiStateOptions = {
query: string;
};

export type HitProps = {
hit: Hit;
sendEvent: SendEventForHits;
};