console.log("predict.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    const diseaseSelect =
        document.getElementById("disease");

    const formContainer =
        document.getElementById("dynamicFields");

    const form =
        document.getElementById("predictionForm");

    const submitBtn =
        form.querySelector("button[type='submit']");

    submitBtn.disabled = true;

    // Prevent submit without disease
    form.addEventListener("submit", (e) => {

        if (!diseaseSelect.value) {

            e.preventDefault();

            alert(
                "Please select a disease first."
            );

            return;
        }

        // Final validation before submit
        const invalidField =
            validateNumericFields();

        if (invalidField) {

            e.preventDefault();

            alert(invalidField);

            return;
        }

    });

    diseaseSelect.addEventListener("change", () => {

        submitBtn.disabled = true;

        const disease =
            diseaseSelect.value;

        formContainer.innerHTML = "";

        if (!featureConfig[disease]) {
            return;
        }

        const config =
            featureConfig[disease];

        // BINARY FEATURES
        if (
            config.binary &&
            config.binary.length > 0
        ) {

            config.binary.forEach(featureObj => {

                let optionsHTML =
                    `<option value="">Select</option>`;

                for (
                    const [value, label]
                    of Object.entries(
                        featureObj.options
                    )
                ) {

                    optionsHTML += `
                        <option value="${value}">
                            ${label}
                        </option>
                    `;
                }

                formContainer.innerHTML += `
                    <div class="form-group">

                        <label>
                            ${formatLabel(
                                featureObj.name
                            )}
                        </label>

                        <select
                            name="${featureObj.name}"
                            required
                        >
                            ${optionsHTML}
                        </select>

                    </div>
                `;
            });
        }

        // ORDINAL FEATURES
        if (
            config.ordinal &&
            config.ordinal.length > 0
        ) {

            config.ordinal.forEach(featureObj => {

                let optionsHTML =
                    `<option value="">Select</option>`;

                for (
                    const [value, label]
                    of Object.entries(
                        featureObj.options
                    )
                ) {

                    optionsHTML += `
                        <option value="${value}">
                            ${label}
                        </option>
                    `;
                }

                formContainer.innerHTML += `
                    <div class="form-group">

                        <label>
                            ${formatLabel(
                                featureObj.name
                            )}
                        </label>

                        <select
                            name="${featureObj.name}"
                            required
                        >
                            ${optionsHTML}
                        </select>

                    </div>
                `;
            });
        }

        // NUMERIC FEATURES
        if (
            config.numeric &&
            config.numeric.length > 0
        ) {

            config.numeric.forEach(feature => {

                formContainer.innerHTML += `

                    <div class="form-group">

                        <label>
                            ${feature.label}
                        </label>

                        <input
                            type="number"
                            name="${feature.name}"
                            min="${feature.min}"
                            max="${feature.max}"
                            step="${feature.step}"
                            required
                            placeholder="Enter value"
                        >

                    </div>

                `;
            });
        }

        // Attach listeners
        attachValidationListeners();

        submitBtn.disabled = false;

    });

});

// LABEL FORMATTER
function formatLabel(text) {

    return text
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            char => char.toUpperCase()
        );
}

// VALIDATION LISTENERS
function attachValidationListeners() {

    const inputs =
        document.querySelectorAll(
            "#dynamicFields input[type='number']"
        );

    inputs.forEach(input => {

        input.addEventListener(
            "input",
            validateSingleField
        );

    });

}


// SINGLE FIELD VALIDATION
function validateSingleField(event) {

    const input =
        event.target;

    const value =
        Number(input.value);

    const min =
        Number(input.min);

    const max =
        Number(input.max);

    input.setCustomValidity("");

    if (input.value === "") {
        return;
    }

    if (value < min) {

        input.setCustomValidity(
            `Minimum value is ${min}`
        );

    }

    else if (value > max) {

        input.setCustomValidity(
            `Maximum value is ${max}`
        );

    }

    input.reportValidity();

}

// FORM VALIDATION
function validateNumericFields() {

    const numericFields =
        document.querySelectorAll(
            "#dynamicFields input[type='number']"
        );

    for (const field of numericFields) {

        const value =
            Number(field.value);

        const min =
            Number(field.min);

        const max =
            Number(field.max);

        if (
            field.value === ""
        ) {

            return `${field.previousElementSibling.textContent} is required.`;
        }

        if (
            value < min ||
            value > max
        ) {

            return `${field.previousElementSibling.textContent} must be between ${min} and ${max}.`;
        }
    }

    return null;
}