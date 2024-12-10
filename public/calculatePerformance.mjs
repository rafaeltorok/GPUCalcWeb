import { getGPUFromDatabase } from "./gpuManager.mjs";
import { createGPUContainer } from "./createTablesContainers.mjs";


export function calculatePerformance() {
    const dataDisplay = document.getElementById("data-display");
    const gpuDataDisplay = document.getElementById("gpu-data-display");

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gpu = getGPUFromDatabase(searchInput);

    if (gpu) {
        gpuDataDisplay.innerHTML = "";  // Removes any previous GPU table
        let coreClockInputField = document.getElementById("coreClockInputField");
        let memClockInputField = document.getElementById("memClockInputField");
        let clockFieldsButton = document.getElementById("clockFieldsButton");

        if (!coreClockInputField || !memClockInputField || !clockFieldsButton) {
            coreClockInputField = document.createElement("input");
            memClockInputField = document.createElement("input");
            clockFieldsButton = document.createElement("button");
            
            coreClockInputField.id = "coreClockInputField";
            memClockInputField.id = "memClockInputField";
            clockFieldsButton.id = "clockFieldsButton";

            coreClockInputField.setAttribute("placeholder", "Core clock (in MHz)");
            memClockInputField.setAttribute("placeholder", "Memory clock (in Gbps)");
            clockFieldsButton.textContent = "Calculate";

            dataDisplay.appendChild(coreClockInputField);
            dataDisplay.appendChild(memClockInputField);
            dataDisplay.appendChild(clockFieldsButton);
        }

        clockFieldsButton.disabled = false;  // If the GPU was found, allows the user to use this button
        dataDisplay.appendChild(gpuDataDisplay);
        const gpuContainer = createGPUContainer(gpu, gpu.getBoostClock(), gpu.getMemClock());
        gpuDataDisplay.appendChild(gpuContainer);

        clockFieldsButton.addEventListener("click", () => {
            gpuDataDisplay.innerHTML = "";  // Removes the previous GPU table to create a new one with the updated values
            let clockSpeed = parseInt(coreClockInputField.value)
            let memClock = parseFloat(memClockInputField.value);

            // Validate that the inputs are valid numbers, if not, use the default values
            if (isNaN(clockSpeed) || 
            clockSpeed === null || 
            clockSpeed <= 0) {
                clockSpeed = gpu.getBoostClock();
            }

            if (isNaN(memClock) || 
            memClock === null || 
            memClock <= 0) {
                memClock = gpu.getMemClock();
            }

            const gpuContainer = createGPUContainer(gpu, clockSpeed, memClock);
            gpuDataDisplay.appendChild(gpuContainer);
        });
    } else {
        gpuDataDisplay.innerHTML = "";  // Clears the screen before displaying the message
        const message = document.createElement("h2");
        message.textContent = "GPU was not found on the database. Please use the \"Add GPU\" button";
        gpuDataDisplay.appendChild(message);
        clockFieldsButton.disabled = true;
    }
}