// ===========================================================
// CAMP CONFIGURATION
// ===========================================================

export const year_name = "2026";
export const camp_location = "-38.9931004,175.8131507";

// ===========================================================
// DAY ROUTES (structured by day → difficulty → {name, mode, dest})
// ===========================================================

export const days = {
  mon: {
    easy: {
      name: "Taranaki Falls, Silica Rapids & Meads Wall\nTongariro National Park (Whakapapa area)\nEASY/MED [$13/$38]",
      mode: "driving",
      dest: "-39.199563, 175.542822"
    },
    med: {
      name: "Taranaki Falls and Lower Tama Lake\nTongariro National Park (Whakapapa area)\nMEDIUM [$13/$38]",
      mode: "driving",
      dest: "-39.199563, 175.542822"
    },
    fit: {
      name: "Whakapapaiti Valley Track\nTongariro National Park (Whakapapa area)\nFIT [$15/$44]",
      mode: "driving",
      dest: "-39.198388, 175.537557"
    }
  },

  tue: {
    easy: {
      name: "Waihohonu Historic Hut\nTongariro National Park (eastern)\nEASY/MED [$9/$28]",
      mode: "driving",
      dest: "-42.527129,172.831639"
    },
    med: {
      name: "Waihohonu Historic Hut & Ohinepango Springs\nTongariro National Park (eastern)\nMEDIUM [$9/$28]",
      mode: "driving",
      dest: "-42.488176,172.826614"
    },
    fit: {
      name: "Waihohonu, Ohinepango Springs, Historic Hut -> Oturere Hut\nTongariro National Park (eastern)\nFIT [$9/$28]",
      mode: "driving",
      dest: "-42.488176,172.826614"
    }
  },

  wed: {
    easy: {
      name: "Workin Bee\n[$3/$10]",
      mode: "driving",
      dest: "-38.913342, 175.899195"
    },
    med: {
      name: "Workin Bee\n[$3/$10]",
      mode: "driving",
      dest: "-38.913342, 175.899195"
    },
    fit: {
      name: "Workin Bee\n[$3/$10]",
      mode: "driving",
      dest: "-38.913342, 175.899195"
    }
  },

  thu: {
    easy: {
      name: "Pillars of Hercules, Tree Trunk Gorge (part)\nand Kaimanawa Forest Loop\nEASY/EASY MED [$6/$17]",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    med: {
      name: "Tree Trunk Gorge,  Pillars of Hercules\nKaimanawa Forest Park + optional loop\nMEDIUM [$6/$17]",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    },
    fit: {
      name: "Urchin Tops, Kaimanawa Forest Park\nFIT [$6/$17]",
      mode: "driving",
      dest: "-42.37368053104093,172.37790006192594"
    }
  },

  fri: {
    easy: {
      name: "Tongariro River Trail\n(Turangi to Red Hut Bridge)\nEASY/EASY MED",
      mode: "walking",
      dest: "-38.993835, 175.815055"
    },
    med: {
      name: "Rotopounamu & Tongariro River Trail\n(Turangi to Red Hut Bridge)\nMEDIUM [$3/$10]",
      mode: "driving",
      dest: "-39.016742, 175.732029"
    },
    fit: {
      name: "Tama Lakes & Taranaki Falls\nTongariro National Park (Whakapapa)\nFIT [$13/$38]",
      mode: "driving",
      dest: "-39.199570, 175.542789"
    }
  }
};

// ===========================================================
// MORE ITEMS (array of {name, mode, dest})
// ===========================================================

export const more = [
  {
    name: "Scoria Flat [Monday Fit]",
    mode: "driving",
    dest: "-39.230715, 175.548709"
  },
  { name: "[Sun] Turangi Bridge Bar/Restaurant 6:45",
    mode: "walking",
    dest: "-38.986765, 175.817857"
  },
  { name: "[Tue] Riverside Restaurant & Bar 6:45pm",
    mode: "walking",
    dest: "-38.992267, 175.810113"
  },
  { name: "Rotopounamu Track",
    mode: "driving",
    dest: "-39.016742, 175.732029"
  },
  { name: "Tokaanu Thermal Pools",
    mode: "driving",
    dest: "-38.967157, 175.764838"
  },
  { name: "Pihanga Medical Centre, Turangi",
    mode: "driving",
    dest: "-38.988081, 175.807477"
  },
  { name: "Taupo Hospital",
    mode: "driving",
    dest: "-38.698788, 176.097192"
  },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" },
  { name: "", mode: "", dest: "" }
];