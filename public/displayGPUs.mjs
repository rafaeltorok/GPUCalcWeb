import { getGPUList } from "./gpuManager.mjs";
import { createGPUContainer } from "./createTablesContainers.mjs";


export function displayGPUs() {
    const dataDisplay = document.getElementById("data-display");
    const gpuList = getGPUList();  // Fetches the gpuList array from gpuManager.mjs

    // Ensure data is an array of objects
    if (Array.isArray(gpuList)) {
        // Clear previous content
        dataDisplay.innerHTML = "";

        // Iterate over each GPU object
        gpuList.forEach(gpu => {
            // Create a container for each GPU entry
            const gpuContainer = createGPUContainer(gpu, gpu.getBoostClock(), gpu.getMemClock());
            dataDisplay.appendChild(gpuContainer);
        });
    } else {
        console.error("Expected an array of GPU objects.");
        dataDisplay.textContent = "Error: Data is not an array.";
    }
}