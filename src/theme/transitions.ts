export const themeTransition = {
  transitionProperty: ["backgroundColor", "borderColor"] as (
    | "backgroundColor"
    | "borderColor"
  )[],
  transitionDuration: 250,
  transitionTimingFunction: "ease-in-out" as const,
};

export const themeTextTransition = {
  transitionProperty: ["color"] as ("color")[],
  transitionDuration: 250,
  transitionTimingFunction: "ease-in-out" as const,
};