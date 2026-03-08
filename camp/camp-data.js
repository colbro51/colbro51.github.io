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
      dest: "-39.199563,175.542822"
    },
    med: {
      name: "Taranaki Falls and Lower Tama Lake\nTongariro National Park (Whakapapa area)\nMEDIUM [$13/$38]",
      mode: "driving",
      dest: "-39.199563,175.542822"
    },
    fit: {
      name: "Whakapapaiti Valley Track\nTongariro National Park (Whakapapa area)\nFIT [$15/$44]",
      mode: "driving",
      dest: "-39.198388,175.537557"
    }
  },

  tue: {
    easy: {
      name: "Waihohonu Historic Hut\nTongariro National Park (eastern)\nEASY/MED [$9/$28]",
      mode: "driving",
      dest: "-39.226842,175.734876"
    },
    med: {
      name: "Waihohonu Historic Hut & Ohinepango Springs\nTongariro National Park (eastern)\nMEDIUM [$9/$28]",
      mode: "driving",
      dest: "-39.226842,175.734876"
    },
    fit: {
      name: "Waihohonu, Ohinepango Springs, Historic Hut -> Oturere Hut\nTongariro National Park (eastern)\nFIT [$9/$28]",
      mode: "driving",
      dest: "-39.226842,175.734876"
    }
  },

  wed: {
    easy: {
      name: "Working Bee\nEASY, MEDIUM, FIT [$3/$10]",
      mode: "driving",
      dest: "-38.913342,175.899195"
    },
    med: {
      name: "Afternoon option\nRotopounamu Track\n[$3/$10]",
      mode: "driving",
      dest: "-39.016742,175.732029"
    },
    fit: {
      name: "Afternoon option\nTokaanu Thermal Pools\n[$2/$5]",
      mode: "driving",
      dest: "-38.967157,175.764838"
    }
  },

  thu: {
    easy: {
      name: "Pillars of Hercules, Tree Trunk Gorge (part)\nand Kaimanawa Forest Loop\nEASY/EASY MED [$6/$17]",
      mode: "driving",
      dest: "-39.137072,175.826227"
    },
    med: {
      name: "Tree Trunk Gorge,  Pillars of Hercules\nKaimanawa Forest Park + optional loop\nMEDIUM [$6/$17]",
      mode: "driving",
      dest: "-39.137072,175.826227"
    },
    fit: {
      name: "Urchin Tops, Kaimanawa Forest Park\nFIT [$6/$17]",
      mode: "driving",
      dest: "-39.137072,175.826227"
    }
  },

  fri: {
    easy: {
      name: "Tongariro River Trail\n(Turangi to Red Hut Bridge)\nEASY/EASY MED",
      mode: "walking",
      dest: "-38.993835,175.815055"
    },
    med: {
      name: "Rotopounamu & Tongariro River Trail\n(Turangi to Red Hut Bridge)\nMEDIUM [$3/$10]",
      mode: "driving",
      dest: "-39.016742,175.732029"
    },
    fit: {
      name: "Tama Lakes & Taranaki Falls\nTongariro National Park (Whakapapa)\nFIT [$13/$38]",
      mode: "driving",
      dest: "-39.199570,175.542789"
    }
  }
};

// ===========================================================
// MORE ITEMS (array of {name, mode, dest})
// ===========================================================

export const more = [
  { name: "[Sun] Turangi Bridge Bar/Restaurant 6:45",
    mode: "walking",
    dest: "-38.986765,175.817857"
  },
  { name: "[Tue] Riverside Restaurant & Bar 6:45pm",
    mode: "walking",
    dest: "-38.99220150,175.81051783"
  },
  { name: "Meads Wall, Whakapapa Skifield",
    mode: "driving",
    dest: "-39.236363,175.555634"
  },
  { name: "Silica Rapids Walk Lower Exit",
    mode: "driving",
    dest: "-39.203554,175.540324"
  },
  { name: "Silicon Rapids Walk Upper Entry",
    mode: "driving",
    dest: "-39.214174,175.542560"
  },
  { name: "Scoria Flat [Monday Fit]",
    mode: "driving",
    dest: "-39.23109,175.541548"
  },
  { name: "Treetrunk Gorge Track\n[$7/$20]",
    mode: "driving",
    dest: "-39.172907,175.805952"
  },
  { name: "Waihaha Hut Walking Track\n[$15/$44]",
    mode: "driving",
    dest: "-38.700408,175.682094"
  },
  { name: "Pihanga Medical Centre, Turangi",
    mode: "driving",
    dest: "-38.988081,175.807477"
  },
  { name: "Taupo Hospital",
    mode: "driving",
    dest: "-38.698803,176.097125"
  }
];