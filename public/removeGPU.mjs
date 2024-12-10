import { getGPUList } from "./gpuManager.mjs";
import { formatGpuListIntoJsonString } from "./gpuManager.mjs";


export async function removeGPU() {
    const gpuToRemove = document.getElementById('searchInput').value.toLowerCase(); // Get the GPU name from the input field
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.innerHTML = "";
    let wasRemoved = false;

    const gpuList = getGPUList();
    const index = gpuList.findIndex(gpu => gpu.getName().toLowerCase() === gpuToRemove);

    if (index !== -1) {
        gpuList.splice(index, 1);
        wasRemoved = true;
    }

    // Removes the GPU from the gpuList
    const message = document.createElement("h2");
    if (wasRemoved) {
        message.textContent = "The GPU was removed from the database!";
    } else {
        message.textContent = "Failed to remove GPU";
    }
    messageDisplay.appendChild(message);

    // Removes the GPU from the database file "gpuData.json"
    const dataListJson = formatGpuListIntoJsonString();
    const response = await fetch('/remove_gpu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataListJson)
    });

    if (response.ok) {
        console.log('GPU removed successfully');
    } else {
        console.error('Failed to remove GPU');
    }
}