// ===========================================================
// CAMP CONFIGURATION
// ===========================================================

export const year_name = "2025";
export const camp_location = "Hanmer+Springs+TOP+10+Holiday+Park";

// ===========================================================
// DAY ROUTES (structured by day → difficulty → {name, mode, dest})
// ===========================================================

export const days = {
  mon: {
    easy: {
      name: "Hanmer Springs Environs\nEASY",
      mode: "walking",
      dest: "-42.527129,172.831639"
    },
    med: {
      name: "Mt Isobel to Jacks Pass\nMEDIUM",
      mode: "driving",
      dest: "-42.488176,172.826614"
    },
    fit: {
      name: "Mt Isobel Dog Stream Waterfall\nFIT",
      mode: "driving",
      dest: "-42.488176,172.826614"
    }
  },

  tue: {
    easy: {
      name: "Option Dog Stream Circuit\nEASY",
      mode: "walking",
      dest: "-42.527129,172.831639"
    },
    med: {
      name: "Mt Dumblane\nMEDIUM",
      mode: "driving",
      dest: "-42.488176,172.826614"
    },
    fit: {
      name: "Mt Dumblane and Tops\nFIT",
      mode: "driving",
      dest: "-42.488176,172.826614"
    }
  },

  wed: {
    easy: {
      name: "Workin Bee",
      mode: "driving",
      dest: "St+James+Walkway+Car+Park"
    },
    med: {
      name: "Workin Bee",
      mode: "driving",
      dest: "St+James+Walkway+Car+Park"
    },
    fit: {
      name: "Workin Bee",
      mode: "driving",
      dest: "St+James+Walkway+Car+Park"
    }
  },

  thu: {
    easy: {
      name: "Cannibal Gorge Track\nSluice Box\nLewis Pass Alpine walk\nEASY",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    med: {
      name: "St James Walkway\ntowards Gorge Hut\nMEDIUM",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    fit: {
      name: "Lewis Tops\nFIT",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    }
  },

  fri: {
    easy: {
      name: "St James Homestead\nPeters Track\nEASY",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    med: {
      name: "Ghost Spur Track to Rocky\nLookout and Kam Point\nMEDIUM",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    fit: {
      name: "Ghost Spur Track and Ghost\nLink to Ghost Rock\nFIT",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    }
  }
};

// ===========================================================
// MORE ITEMS (array of {name, mode, dest})
// ===========================================================

export const more = [
  {
    name: "Tuesday meal 7:15pm",
    mode: "driving",
    dest: "6 Jacks Pass Rd"
  },
  {
    name: "Friday meal 5:30pm",
    mode: "driving",
    dest: "1 Conical Hill Rd, Hanmer Springs"
  },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" }
];