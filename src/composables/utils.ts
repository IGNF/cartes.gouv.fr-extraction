export function useNormalizeString(str : string) {
    if (str)
        return str
          .normalize("NFD")                // décompose les accents
          .replace(/[\u0300-\u036f]/g, "") // supprime les accents
          .toLowerCase()                  // met en minuscule
          .trim();                        // optionnel : enlève espaces inutiles
    else return ""
}