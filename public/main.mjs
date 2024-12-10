// GPUCalcWeb v2.0
import { GPU } from "./gpu.mjs";
import { getData, getGPUList } from "./gpuManager.mjs";
import { searchGPU } from "./searchGPU.mjs";
import { displayGPUs } from "./displayGPUs.mjs";
import { calculatePerformance } from "./calculatePerformance.mjs";
import { compareSpecs } from "./compareSpecs.mjs";
import { removeGPU } from "./removeGPU.mjs";


// Attach event listener to the "Add GPU" button
const addGPUButton = document.getElementById('add-button');
addGPUButton.addEventListener('click', showAddGPU);

// Attach event listener to the "Display GPUs" button
const displayGPUsButton = document.getElementById('display-gpus-button');
displayGPUsButton.addEventListener('click', displayGPUs);

// Show the search box when the "Search" button is clicked
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', showSearchBox);

// Show the search box when the "Calculate Performance" button is clicked
const calcPerfButton = document.getElementById('calc-performance-button');
calcPerfButton.addEventListener('click', showCalcPerf);

// Attach event listener to the "Remove GPU" button
const removeGPUButton = document.getElementById('remove-button');
removeGPUButton.addEventListener('click', showRemoveGPU);

// Attach event listener to the "Remove GPU" button
const compareSpecsButton = document.getElementById('compare-specs-button');
compareSpecsButton.addEventListener('click', showCompareSpecs);

async function showAddGPU() {
    const gpu = {
        manufacturer: prompt('Enter Manufacturer'),
        gpuline: prompt('Enter Line'),
        gpuname: prompt('Enter Name'),
        cores: parseInt(prompt('Enter Cores')),
        tmus: parseInt(prompt('Enter TMUs')),
        rops: parseInt(prompt('Enter ROPs')),
        vram: parseInt(prompt('Enter VRAM (GB)')),
        bus: parseInt(prompt('Enter Bus Width (bit)')),
        memtype: prompt('Enter Memory Type').toUpperCase(),
        baseclock: parseInt(prompt('Enter Base Clock (MHz)')),
        boostclock: parseInt(prompt('Enter Boost Clock (MHz)')),
        memclock: parseFloat(prompt('Enter Memory Clock (GHz)'))
    }

    const gpuList = getGPUList();
    gpuList.push(new GPU(
        gpu.manufacturer,
        gpu.gpuline,
        gpu.gpuname,
        gpu.cores,
        gpu.tmus,
        gpu.rops,
        gpu.vram,
        gpu.bus,
        gpu.memtype,
        gpu.baseclock,
        gpu.boostclock,
        gpu.memclock
    ));

    const response = await fetch('/add_gpu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gpu)
    });

    if (response.ok) {
        console.log('GPU added successfully');
    } else {
        console.error('Failed to add GPU');
    }
}

function showSearchBox() {
    clearScreen();
    const dataDisplay = document.getElementById("data-display");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpu-data-display";

    const searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.setAttribute("placeholder", "Enter GPU name");
    
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.addEventListener("click", searchGPU);

    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchButton);
    dataDisplay.appendChild(searchBox);
    dataDisplay.appendChild(gpuDataDisplay);
}


function showCalcPerf() {
    clearScreen();
    const dataDisplay = document.getElementById("data-display");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpu-data-display";

    const searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.setAttribute("placeholder", "Enter GPU name");
    
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.addEventListener("click", calculatePerformance);

    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchButton);
    dataDisplay.appendChild(searchBox);
    dataDisplay.appendChild(gpuDataDisplay);
}


function showCompareSpecs() {
    clearScreen();
    const dataDisplay = document.getElementById("data-display");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpu-data-display";

    const searchInputFirst = document.createElement("input");
    searchInputFirst.id = "searchInputFirst";
    searchInputFirst.setAttribute("placeholder", "Enter GPU name");

    const searchInputSecond = document.createElement("input");
    searchInputSecond.id = "searchInputSecond";
    searchInputSecond.setAttribute("placeholder", "Enter GPU name");

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.addEventListener("click", compareSpecs);

    searchBox.appendChild(searchInputFirst);
    searchBox.appendChild(searchInputSecond);
    searchBox.appendChild(searchButton);
    dataDisplay.appendChild(searchBox);
    dataDisplay.appendChild(gpuDataDisplay);
}

function showRemoveGPU() {
    clearScreen();
    const dataDisplay = document.getElementById("data-display");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the message
    const messageDisplay = document.createElement("div");
    messageDisplay.id = "messageDisplay";

    const searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.setAttribute("placeholder", "Enter GPU name");
    
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.addEventListener("click", removeGPU);

    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchButton);
    dataDisplay.appendChild(searchBox);
    dataDisplay.appendChild(messageDisplay);
}


// Clears the screen when choosing another menu option
function clearScreen() {
    const dataDisplay = document.getElementById("data-display");
    dataDisplay.innerHTML = "";
}


function main() {
    getData();
}

main();