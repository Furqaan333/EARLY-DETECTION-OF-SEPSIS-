const featureConfig = {
  // PNEUMONIA
  pneumonia: {

    binary: [
      {
        name: "Gender",
        options: {
          0: "Female",
          1: "Male"
        }
      },
      {
        name: "Confusion",
        options: {
          0: "No",
          1: "Yes"
        }
      }
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

      {
        name: "Age",
        label: "Age (0-120 Years)",
        min: 0,
        max: 120,
        step: 1
      },

      {
        name: "oxygen_saturation",
        label: "Oxygen Saturation (50-100 %)",
        min: 50,
        max: 100,
        step: 1
      },

      {
        name: "wbc_count",
        label: "WBC Count (1000-30000)",
        min: 1000,
        max: 30000,
        step: 1,
        unit: "cells/μL"
      },

      {
        name: "body_temperature",
        label: "Body Temperature (30-45 °C)",
        min: 30,
        max: 45,
        step: 0.1
      },

      {
        name: "heart_rate",
        label: "Heart Rate (30-220 bpm)",
        min: 30,
        max: 220,
        step: 1
      },

      {
        name: "respiratory_rate",
        label: "Respiratory Rate (5-60)",
        min: 5,
        max: 60,
        step: 1
      },

      {
        name: "systolic_bp",
        label: "Systolic BP (50-250 mmHg)",
        min: 50,
        max: 250,
        step: 1
      },

      {
        name: "platelets",
        label: "Platelets (1000-1000000)",
        min: 1000,
        max: 1000000,
        step: 1
      }
    ]
  },

  // UTI
  uti: {

    binary: [
      {
        name: "nausea",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "frequent_urination",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "painful_urination",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "burning_urination",
        options: {
          0: "No",
          1: "Yes"
        }
      }
    ],

    ordinal: [],

    numeric: [

      {
        name: "temperature",
        label: "Temperature (30-45 °C)",
        min: 30,
        max: 45,
        step: 0.1
      },

      {
        name: "heart_rate",
        label: "Heart Rate (30-220 bpm)",
        min: 30,
        max: 220,
        step: 1
      },

      {
        name: "respiratory_rate",
        label: "Respiratory Rate (5-60)",
        min: 5,
        max: 60,
        step: 1
      },

      {
        name: "systolic_bp",
        label: "Systolic BP (50-250 mmHg)",
        min: 50,
        max: 250,
        step: 1
      },

      {
        name: "platelets",
        label: "Platelets (1000-1000000)",
        min: 1000,
        max: 1000000,
        step: 1
      },

      {
        name: "wbc",
        label: "WBC Count (1000-30000)",
        min: 1000,
        max: 30000,
        step: 0.1,
        unit: "cells/μL"

      }
    ]
  },

  // ABDOMINAL INFECTION
   abdominal: {

    binary: [
      {
        name: "sex",
        options: {
          0: "Female",
          1: "Male"
        }
      },
      {
        name: "migratory_pain",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "lower_right_abd_pain",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "coughing_pain",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "nausea",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "loss_of_appetite",
        options: {
          0: "No",
          1: "Yes"
        }
      }
    ],

    ordinal: [],

    numeric: [

      {
        name: "age",
        label: "Age (0-120 Years)",
        min: 0,
        max: 120,
        step: 1
      },

      {
        name: "bmi",
        label: "BMI (10-80)",
        min: 10,
        max: 80,
        step: 0.1
      },

      {
        name: "body_temperature",
        label: "Body Temperature (30-45 °C)",
        min: 30,
        max: 45,
        step: 0.1
      },

      {
        name: "wbc_count",
        label: "WBC Count (0-50)",
        min: 0,
        max: 50,
        step: 0.1
      },

      {
        name: "crp",
        label: "CRP (0-500 mg/L)",
        min: 0,
        max: 500,
        step: 0.1
      },

      {
        name: "heart_rate",
        label: "Heart Rate (30-220 bpm)",
        min: 30,
        max: 220,
        step: 1
      },

      {
        name: "respiratory_rate",
        label: "Respiratory Rate (5-60)",
        min: 5,
        max: 60,
        step: 1
      },

      {
        name: "systolic_bp",
        label: "Systolic BP (50-250 mmHg)",
        min: 50,
        max: 250,
        step: 1
      },

      {
        name: "platelets",
        label: "Platelets (1000-1000000)",
        min: 1000,
        max: 1000000,
        step: 1
      }
    ]
  },

  // SSTI
  ssti: {

    binary: [
      {
        name: "fever",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "fatigue",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "difficulty_breathing",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "gender",
        options: {
          0: "Female",
          1: "Male"
        }
      },
      {
        name: "skin_inflammation",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "local_pain",
        options: {
          0: "No",
          1: "Yes"
        }
      },
      {
        name: "pus_or_abscess",
        options: {
          0: "No",
          1: "Yes"
        }
      }
    ],

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

    numeric: [

      {
        name: "age",
        label: "Age (0-120 Years)",
        min: 0,
        max: 120,
        step: 1
      },

      {
        name: "heart_rate",
        label: "Heart Rate (30-220 bpm)",
        min: 30,
        max: 220,
        step: 1
      },

      {
        name: "respiratory_rate",
        label: "Respiratory Rate (5-60)",
        min: 5,
        max: 60,
        step: 1
      },

      {
        name: "systolic_bp",
        label: "Systolic BP (50-250 mmHg)",
        min: 50,
        max: 250,
        step: 1
      },

      {
        name: "platelets",
        label: "Platelets (1000-1000000)",
        min: 1000,
        max: 1000000,
        step: 1
      }
    ]
  }

};