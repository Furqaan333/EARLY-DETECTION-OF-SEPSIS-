console.log("predict.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const diseaseSelect = document.getElementById("disease");
  const formContainer = document.getElementById("dynamicFields");
  const form = document.getElementById("predictionForm");
  
  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  // Prevent submit without disease
  form.addEventListener("submit", (e) => {
    if (!diseaseSelect.value) {
      e.preventDefault();
      alert("Please select a disease first.");
    }
  });

  diseaseSelect.addEventListener("change", () => {
    submitBtn.disabled = true;   
    const disease = diseaseSelect.value;
    formContainer.innerHTML = "";


    if (!featureConfig[disease]) return;

    const config = featureConfig[disease];

    //BINARY FEATURES (0 / 1)
    if (config.binary && config.binary.length > 0) {
      config.binary.forEach(featureObj => {
        let optionsHTML = `<option value="">Select</option>`;

        for (const [value, label] of Object.entries(featureObj.options)) {
          optionsHTML += `<option value="${value}">${label}</option>`;
        }

        formContainer.innerHTML += `
          <div class="form-group">
            <label>${formatLabel(featureObj.name)}</label>
            <select 
              name="${featureObj.name}" 
              required
              onchange="checkAllFieldsFilled(formContainer, submitBtn)"
            >
              ${optionsHTML}
            </select>
          </div>
        `;
      });
    }

    // ORDINAL FEATURES (0–2, 1–3, etc.)
    if (config.ordinal && config.ordinal.length > 0) {
      config.ordinal.forEach(featureObj => {
        let optionsHTML = `<option value="">Select</option>`;

        for (const [value, label] of Object.entries(featureObj.options)) {
          optionsHTML += `<option value="${value}">${label}</option>`;
        }

        formContainer.innerHTML += `
          <div class="form-group">
            <label>${formatLabel(featureObj.name)}</label>
            <select name="${featureObj.name}" required>
              ${optionsHTML}
            </select>
          </div>
        `;
      });
    }

    // NUMERIC FEATURES
    if (config.numeric && config.numeric.length > 0) {
      config.numeric.forEach(feature => {
        formContainer.innerHTML += `
          <div class="form-group">
            <label>${formatLabel(feature)}</label>
            <input
              type="number"
              step="any"
              min="0"
              name="${feature}"
              placeholder="Enter value"
              required
              oninput="checkAllFieldsFilled(formContainer, submitBtn)"
            >
          </div>
        `;
      });
    }
    submitBtn.disabled = false;    
  });
});

//Utility: Label Formatter

function formatLabel(text) {
  return text
    .replace(/_/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function checkAllFieldsFilled(formContainer, submitBtn) {
  const inputs = formContainer.querySelectorAll("input, select");
  const allFilled = Array.from(inputs).every(el => el.value !== "");
  submitBtn.disabled = !allFilled;
}
