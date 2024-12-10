import { getGPUFromDatabase } from "./gpuManager.mjs";
import { createGPUContainer } from "./createTablesContainers.mjs";


export function searchGPU() {
    const dataDisplay = document.getElementById("data-display");
    const gpuDataDisplay = document.getElementById("gpu-data-display");
    gpuDataDisplay.innerHTML = "";  // Removes the previous GPU table before displaying a new one

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gpu = getGPUFromDatabase(searchInput);

    if (gpu) {
        const gpuContainer = createGPUContainer(gpu, gpu.getBoostClock(), gpu.getMemClock());
        gpuDataDisplay.appendChild(gpuContainer);
    } else {
        const message = document.createElement("h2");
        message.textContent = "GPU was not found on the database. Please use the \"Add GPU\" button";
        gpuDataDisplay.appendChild(message);
    }
    dataDisplay.appendChild(gpuDataDisplay);
}