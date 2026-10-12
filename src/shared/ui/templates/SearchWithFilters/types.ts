// ─────────────────────────────────────────────────────────────────────────────
// Filter configuration types using discriminated unions
// ─────────────────────────────────────────────────────────────────────────────

export type TextFilterConfig = {
  type: "text";
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
};

export type SingleSelectFilterConfig = {
  type: "singleSelect";
  key: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
};

export type MultiSelectFilterConfig = {
  type: "multiSelect";
  key: string;
  label: string;
  options: { label: string; value: string }[];
  defaultValue?: string[];
};

export type BooleanFilterConfig = {
  type: "boolean";
  key: string;
  label: string;
  defaultValue?: boolean;
};

export type DateFilterConfig = {
  type: "date";
  key: string;
  label: string;
  defaultValue?: string; // ISO 8601
};

export type NumberRangeFilterConfig = {
  type: "numberRange";
  key: string;
  label: string;
  min?: number;
  max?: number;
  defaultValue?: { min?: number; max?: number };
};

export type FilterConfig =
  | TextFilterConfig
  | SingleSelectFilterConfig
  | MultiSelectFilterConfig
  | BooleanFilterConfig
  | DateFilterConfig
  | NumberRangeFilterConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Filter value types — keyed by filter config key
// ─────────────────────────────────────────────────────────────────────────────

export type FilterValues = Record<
  string,
  string | string[] | boolean | { min?: number; max?: number } | undefined
>;

// ─────────────────────────────────────────────────────────────────────────────
// SearchWithFilters component props
// ─────────────────────────────────────────────────────────────────────────────

export type SearchWithFiltersProps = {
  placeholder?: string;
  initialQuery?: string;
  filters?: FilterConfig[];
  initialFilters?: FilterValues;
  onSearch?: (query: string, filters: FilterValues) => void;
  onQueryChange?: (query: string) => void;
  onFiltersApply?: (filters: FilterValues) => void;
  onFiltersReset?: () => void;
};