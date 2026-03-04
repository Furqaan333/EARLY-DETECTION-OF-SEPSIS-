const featureConfig = {
  pneumonia: {
    binary: [
      {
        name: "Gender",
        options: { 0: "Female", 1: "Male" }
      },
      {
        name: "Confusion",
        options: { 0: "No", 1: "Yes" }
      },
    ],

    ordinal: [
      {
        name: "Cough",
        options: {
          0: "None",
          1: "Mild",
          2: "Severe"
        }
      },
      {
        name: "Fever",
        options: {
          0: "Normal",
          1: "Low",
          2: "Moderate",
          3: "High"
        }
      },
      {
        name: "Shortness_of_breath",
        options: {
          1: "Mild",
          2: "Moderate",
          3: "Severe"
        }
      },
      {
        name: "Chest_pain",
        options: {
          1: "Mild",
          2: "Moderate",
          3: "Severe"
        }
      },
      {
        name: "Fatigue",
        options: {
          1: "Mild",
          2: "Moderate",
          3: "Severe"
        }
      }
  ],


    numeric: [
      "Age",
      "oxygen_saturation",
      "wbc_count",
      "body_temperature",
      "heart_rate",
      "respiratory_rate",
      "systolic_bp",
      "platelets"
    ]
  }
};


  featureConfig.uti = {
    binary: [
      {
        name: "nausea",
        options: { 0: "No", 1: "Yes" }
      },
      {
        name: "frequent_urination",
        options: { 0: "No", 1: "Yes" }
      },
      {
        name: "painful_urination",
        options: { 0: "No", 1: "Yes" }
      },
      {
        name: "burning_urination",
        options: { 0: "No", 1: "Yes" }
      },
    ],

    ordinal: [],

    numeric: [
      "temperature",
      "heart_rate",
      "respiratory_rate",
      "systolic_bp",
      "platelets",
      "wbc"
    ]
  };

  featureConfig.abdominal = {

  // 🔹 Binary features (0 / 1)
  binary: [
    {
      name: "sex",
      options: { 0: "Female", 1: "Male" }
    },
    {
      name: "migratory_pain",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "lower_right_abd_pain",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "coughing_pain",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "nausea",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "loss_of_appetite",
      options: { 0: "No", 1: "Yes" }
    },
  ],

  // Ordinal features
  // None in abdominal dataset
  ordinal: [],

  //Numeric features (continuous values)
  numeric: [
    "age",
    "bmi",
    "body_temperature",
    "wbc_count",
    "crp",
    "heart_rate",
    "respiratory_rate",
    "systolic_bp",
    "platelets"
  ]
};

  featureConfig.ssti = {

  // Binary features (0 / 1)
  binary: [
    {
      name: "fever",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "fatigue",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "difficulty_breathing",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "gender",
      options: { 0: "Female", 1: "Male" }
    },
    {
      name: "skin_inflammation",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "local_pain",
      options: { 0: "No", 1: "Yes" }
    },
    {
      name: "pus_or_abscess",
      options: { 0: "No", 1: "Yes" }
    }
  ],

  // Ordinal features (ordered categories)
  ordinal: [
    {
      name: "blood_pressure",
      options: {
        0: "Low",
        1: "Normal",
        2: "High"
      }
    },
    {
      name: "cholesterol_level",
      options: {
        0: "Normal",
        1: "Borderline",
        2: "High"
      }
    }
  ],

  // Numeric features (continuous)
  numeric: [
    "age",
    "heart_rate",
    "respiratory_rate",
    "systolic_bp",
    "platelets"
  ]
};
