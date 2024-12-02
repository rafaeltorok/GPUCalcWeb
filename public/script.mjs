import { GPU } from "./gpu.mjs";

// Attach event listener to the "Add GPU" button
const addGPUButton = document.getElementById('addButton');
addGPUButton.addEventListener('click', addGPU);

// Attach event listener to the "List All" button
const listAllButton = document.getElementById('listAllButton');
listAllButton.addEventListener('click', displayGPUs);

// Show the search box when the "Search" button is clicked
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', showSearchBox);

// Show the search box when the "Calculate Performance" button is clicked
const calcPerfButton = document.getElementById('calcPerfButton');
calcPerfButton.addEventListener('click', showSearchBoxCalcPerf);

// Attach event listener to the "Remove GPU" button
const removeGPUButton = document.getElementById('removeButton');
removeGPUButton.addEventListener('click', showSearchRemoveGPU);

// Attach event listener to the "Remove GPU" button
const compareSpecsButton = document.getElementById('compareSpecsButton');
compareSpecsButton.addEventListener('click', showCompareSpecs);

let gpuList = [];

async function addGPU() {
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
    const dataDisplay = document.getElementById("dataDisplay");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpuDataDisplay";

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

function searchGPU() {
    const dataDisplay = document.getElementById("dataDisplay");
    const gpuDataDisplay = document.getElementById("gpuDataDisplay");
    gpuDataDisplay.innerHTML = "";  // Removes the previous GPU table before displaying a new one

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gpu = getFromDatabase(searchInput);

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

function displayGPUs() {
    const dataDisplay = document.getElementById("dataDisplay");

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

function showSearchBoxCalcPerf() {
    clearScreen();
    const dataDisplay = document.getElementById("dataDisplay");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpuDataDisplay";

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

function calculatePerformance() {
    const dataDisplay = document.getElementById("dataDisplay");
    const gpuDataDisplay = document.getElementById("gpuDataDisplay");
    gpuDataDisplay.innerHTML = "";  // Removes the previous GPU table before displaying a new one

    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const gpu = getFromDatabase(searchInput);

    if (gpu) {
        let clockSpeed = parseInt(prompt("Enter the core clock (in MHz)"))
        let memClock = parseFloat(prompt("Enter the memory speed (in GHz)"));

        // Validate that the inputs are valid numbers, if not, use the default values
        if (isNaN(clockSpeed) || 
        clockSpeed === null || 
        clockSpeed < 0) {
            clockSpeed = gpu.getBoostClock();
        }

        if (isNaN(memClock) || 
        memClock === null || 
        memClock < 0) {
            memClock = gpu.getMemClock();
        }

        const gpuContainer = createGPUContainer(gpu, clockSpeed, memClock);
        gpuDataDisplay.appendChild(gpuContainer);
    } else {
        const message = document.createElement("h2");
        message.textContent = "GPU was not found on the database. Please use the \"Add GPU\" button";
        gpuDataDisplay.appendChild(message);
    }
    dataDisplay.appendChild(gpuDataDisplay);
}

function showCompareSpecs() {
    clearScreen();
    const dataDisplay = document.getElementById("dataDisplay");
    const searchBox = document.createElement("div");
    
    // Creates a container to hold the GPU data table
    const gpuDataDisplay = document.createElement("div");
    gpuDataDisplay.id = "gpuDataDisplay";

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

function compareSpecs() {
    const dataDisplay = document.getElementById("dataDisplay");
    const gpuDataDisplay = document.getElementById("gpuDataDisplay");
    gpuDataDisplay.innerHTML = "";  // Removes the previous GPU tables before displaying new ones

    const searchInputFirst = document.getElementById('searchInputFirst').value.toLowerCase();
    const searchInputSecond = document.getElementById('searchInputSecond').value.toLowerCase();
    const firstGPU = getFromDatabase(searchInputFirst);
    const secondGPU = getFromDatabase(searchInputSecond);

    if (firstGPU && secondGPU) {
        const compareContainer = createCompareSpecsContainer(firstGPU, secondGPU);
        gpuDataDisplay.appendChild(compareContainer);
    } else {
        const message = document.createElement("h2");
        message.textContent = "One of the GPUs was not found on the database. Please use the \"Add GPU\" button";
        gpuDataDisplay.appendChild(message);
    }
    dataDisplay.appendChild(gpuDataDisplay);
}

function showSearchRemoveGPU() {
    clearScreen();
    const dataDisplay = document.getElementById("dataDisplay");
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

async function removeGPU() {
    const gpuToRemove = document.getElementById('searchInput').value.toLowerCase(); // Get the GPU name from the input field
    const messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.innerHTML = "";
    let wasRemoved = false;

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


/* 
    The following support methods are for the Node.js and JavaScript parts of the code
*/
// Run when the app starts, fetches all GPU objects from the gpuData JSON file
async function getData() {
    const response = await fetch('/gpus');
    const data = await response.json();
    for (const item of data) {
        gpuList.push(new GPU(
            item['manufacturer'], 
            item['gpuline'], 
            item['gpuname'],
            item['cores'],
            item['tmus'],
            item['rops'],
            item['vram'],
            item['bus'],
            item['memtype'],
            item['baseclock'],
            item['boostclock'],
            item['memclock']
        ));
    }
}

function clearScreen() {
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = "";
}

// Fetches a GPU object from the gpuList Array
function getFromDatabase(searchInput) {
    const gpu = gpuList.find(gpu => gpu.getName().toLowerCase().trim() === searchInput.toLowerCase().trim());
    return gpu;
}

// Prepares a JSON format string to be written into the database file
function formatGpuListIntoJsonString() {
    const dataList = [];
    for (const gpu of gpuList) {
        dataList.push(
            {
                manufacturer: gpu.getManufacturer(),
                gpuline: gpu.getLine(),
                gpuname: gpu.getName(),
                cores: gpu.getCores(),
                tmus: gpu.getTmus(),
                rops: gpu.getRops(),
                vram: gpu.getVram(),
                bus: gpu.getBus(),
                memtype: gpu.getMemType(),
                baseclock: gpu.getBaseClock(),
                boostclock: gpu.getBoostClock(),
                memclock: gpu.getMemClock()
            }
        );
    }
    return dataList;
}


/* 
    The following support methods are for the HTML content 
*/
function createGPUContainer(gpu, coreClock, memClock) {
    const gpuContainer = document.createElement("div");
    gpuContainer.className = "gpu-container";

    const gpuNameHeader = document.createElement("h2");
    if (gpu.getManufacturer().toLowerCase().trim() == "nvidia") {
        gpuNameHeader.className = "gpu-name-header-nvidia";
    } else if (gpu.getManufacturer().toLowerCase().trim() == "amd") {
        gpuNameHeader.className = "gpu-name-header-amd";
    } else if (gpu.getManufacturer().toLowerCase().trim() == "intel") {
        gpuNameHeader.className = "gpu-name-header-intel";
    } else {
        gpuNameHeader.className = "gpu-name-header";
    }
    gpuNameHeader.textContent = gpu.getManufacturer() + " " + gpu.getLine() + " " + gpu.getName();

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";

    // Append all tables to the wrapper
    tableWrapper.appendChild(createGraphicsCardTable(gpu));
    tableWrapper.appendChild(createClockSpeedsTable(gpu, coreClock, memClock));
    tableWrapper.appendChild(createPerformanceTable(gpu, coreClock, memClock));

    gpuContainer.appendChild(gpuNameHeader);
    gpuContainer.appendChild(tableWrapper);

    return gpuContainer;
}

function createGraphicsCardTable(gpu) {
    const table = document.createElement("table");

    const header = createTableHeader("GRAPHICS CARD");
    const body = document.createElement("tbody");
    body.innerHTML = `
        <tr><td>Cores:</td><td>${gpu.getCores()}</td></tr>
        <tr><td>TMUs:</td><td>${gpu.getTmus()}</td></tr>
        <tr><td>ROPs:</td><td>${gpu.getRops()}</td></tr>
        <tr><td>VRAM:</td><td>${gpu.getVram()} GB ${gpu.getMemType()}</td></tr>
        <tr><td>Bus Width:</td><td>${gpu.getBus()} bit</td></tr>
    `;

    table.appendChild(header);
    table.appendChild(body);

    return table;
}

function createClockSpeedsTable(gpu, coreClock, memClock) {
    const table = document.createElement("table");

    const header = createTableHeader("CLOCK SPEEDS");
    const body = document.createElement("tbody");
    body.innerHTML = `
        <tr><td>Base Clock:</td><td>${gpu.getBaseClock()} MHz</td></tr>
        <tr><td>Boost Clock:</td><td>${coreClock} MHz</td></tr>
        <tr><td>Memory Clock:</td><td>${memClock} Gbps effective</td></tr>
    `;

    table.appendChild(header);
    table.appendChild(body);

    return table;
}

function createPerformanceTable(gpu, coreClock, memClock) {
    const table = document.createElement("table");

    const header = createTableHeader("THEORETICAL PERFORMANCE");
    const body = document.createElement("tbody");
    body.innerHTML = `
        <tr><td>FP32 (float):</td><td>${gpu.calculateFP32(coreClock)}</td></tr>
        <tr><td>Texture Rate:</td><td>${gpu.calculateTextureRate(coreClock)} GTexel/s</td></tr>
        <tr><td>Pixel Rate:</td><td>${gpu.calculatePixelRate(coreClock)} GPixel/s</td></tr>
        <tr><td>Bandwidth:</td><td>${gpu.calculateBandwidth(memClock)} GB/s</td></tr>
    `;

    table.appendChild(header);
    table.appendChild(body);

    return table;
}

function createTableHeader(title) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = "2";
    headerCell.textContent = title;
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);

    return thead;
}

function createCompareSpecsContainer(firstGPU, secondGPU) {
    const gpuContainer = document.createElement("div");
    gpuContainer.className = "compare-specs-container";

    // Sets the font color to the name header of the GPU in the left side of the comparison
    let firstGPUNameHeaderClass;
    if (firstGPU.getManufacturer().toLowerCase().trim() == "nvidia") {
        firstGPUNameHeaderClass = "gpu-compare-header-nvidia";
    } else if (firstGPU.getManufacturer().toLowerCase().trim() == "amd") {
        firstGPUNameHeaderClass = "gpu-compare-header-amd";
    } else if (firstGPU.getManufacturer().toLowerCase().trim() == "intel") {
        firstGPUNameHeaderClass = "gpu-compare-header-intel";
    } else {
        firstGPUNameHeaderClass = "gpu-compare-header";
    }

    // Sets the font color to the name header of the GPU in the right side of the comparison
    let secondGPUNameHeaderClass;
    if (secondGPU.getManufacturer().toLowerCase().trim() == "nvidia") {
        secondGPUNameHeaderClass = "gpu-compare-header-nvidia";
    } else if (secondGPU.getManufacturer().toLowerCase().trim() == "amd") {
        secondGPUNameHeaderClass = "gpu-compare-header-amd";
    } else if (secondGPU.getManufacturer().toLowerCase().trim() == "intel") {
        secondGPUNameHeaderClass = "gpu-compare-header-intel";
    } else {
        secondGPUNameHeaderClass = "gpu-compare-header";
    }

    const table = document.createElement("table");

    // Creates the first line in the table containing both GPU names and the % difference
    const compareSpecsHeader = document.createElement("tr");
    compareSpecsHeader.classList.add("compare-specs-table-headers");

    // Creates each one of the main headers for the table
    const gpuNameHeader = document.createElement("th");
    gpuNameHeader.textContent = "Name";
    gpuNameHeader.classList.add("compare-specs-table-headers");
    const firstGPUName = document.createElement("td");
    firstGPUName.textContent = firstGPU.getName();
    firstGPUName.classList.add(firstGPUNameHeaderClass);
    const secondGPUName = document.createElement("td");
    secondGPUName.textContent = secondGPU.getName();
    secondGPUName.classList.add(secondGPUNameHeaderClass);
    const percentageDifferenceHeader = document.createElement("td");
    percentageDifferenceHeader.textContent = "Difference (in %)";
    percentageDifferenceHeader.className = "compare-specs-table-difference-column";

    compareSpecsHeader.appendChild(gpuNameHeader);
    compareSpecsHeader.appendChild(firstGPUName);
    compareSpecsHeader.appendChild(secondGPUName);
    compareSpecsHeader.appendChild(percentageDifferenceHeader);

    // The graphics card specifications first division of the table
    const graphicsCardRow = document.createElement("tr");
    const graphicsCardHeader = document.createElement("th");
    graphicsCardHeader.textContent = "GRAPHICS CARD";
    graphicsCardHeader.classList.add("compare-specs-table-headers");
    graphicsCardHeader.colSpan = 4;
    graphicsCardRow.appendChild(graphicsCardHeader);

    const coresRow = document.createElement("tr");
    const coresHeader = document.createElement("th");
    coresHeader.textContent = "Cores";
    const firstGPUCores = document.createElement("td");
    firstGPUCores.textContent = firstGPU.getCores();
    firstGPUCores.className = "gpu-column";
    const secondGPUCores = document.createElement("td");
    secondGPUCores.textContent = secondGPU.getCores();
    secondGPUCores.className = "gpu-column";
    const coresDifference = document.createElement("td");
    coresDifference.className = "compare-specs-table-difference-column";
    coresDifference.textContent = getPercentageDifference(firstGPU.getCores(), secondGPU.getCores());

    coresRow.appendChild(coresHeader);
    coresRow.appendChild(firstGPUCores);
    coresRow.appendChild(secondGPUCores);
    coresRow.appendChild(coresDifference)

    const tmusRow = document.createElement("tr");
    const tmusHeader = document.createElement("th");
    tmusHeader.textContent = "TMUs";
    const firstGPUTmus = document.createElement("td");
    firstGPUTmus.textContent = firstGPU.getTmus();
    firstGPUTmus.className = "gpu-column";
    const secondGPUTmus = document.createElement("td");
    secondGPUTmus.textContent = secondGPU.getTmus();
    secondGPUTmus.className = "gpu-column";
    const tmusDifference = document.createElement("td");
    tmusDifference.className = "compare-specs-table-difference-column";
    tmusDifference.textContent = getPercentageDifference(firstGPU.getTmus(), secondGPU.getTmus());

    tmusRow.appendChild(tmusHeader);
    tmusRow.appendChild(firstGPUTmus);
    tmusRow.appendChild(secondGPUTmus);
    tmusRow.appendChild(tmusDifference);

    const ropsRow = document.createElement("tr");
    const ropsHeader = document.createElement("th");
    ropsHeader.textContent = "ROPs";
    const firstGPURops = document.createElement("td");
    firstGPURops.textContent = firstGPU.getRops();
    firstGPURops.className = "gpu-column";
    const secondGPURops = document.createElement("td");
    secondGPURops.textContent = secondGPU.getRops();
    secondGPURops.className = "gpu-column";
    const ropsDifference = document.createElement("td");
    ropsDifference.className = "compare-specs-table-difference-column";
    ropsDifference.textContent = getPercentageDifference(firstGPU.getRops(), secondGPU.getRops());

    ropsRow.appendChild(ropsHeader);
    ropsRow.appendChild(firstGPURops);
    ropsRow.appendChild(secondGPURops);
    ropsRow.appendChild(ropsDifference);

    const vramRow = document.createElement("tr");
    const vramHeader = document.createElement("th");
    vramHeader.textContent = "VRAM";
    const firstGPUVram = document.createElement("td");
    firstGPUVram.textContent = firstGPU.getVram() + "GB " + firstGPU.getMemType();
    firstGPUVram.className = "gpu-column";
    const secondGPUVram = document.createElement("td");
    secondGPUVram.textContent = secondGPU.getVram() + "GB " + secondGPU.getMemType();
    secondGPUVram.className = "gpu-column";
    const vramDifference = document.createElement("td");
    vramDifference.className = "compare-specs-table-difference-column";
    vramDifference.textContent = getPercentageDifference(firstGPU.getVram(), secondGPU.getVram());

    vramRow.appendChild(vramHeader);
    vramRow.appendChild(firstGPUVram);
    vramRow.appendChild(secondGPUVram);
    vramRow.appendChild(vramDifference);

    const busRow = document.createElement("tr");
    const busHeader = document.createElement("th");
    busHeader.textContent = "Bus Width";
    const firstGPUBus = document.createElement("td");
    firstGPUBus.textContent = firstGPU.getBus() + " bit";
    firstGPUBus.className = "gpu-column";
    const secondGPUBus = document.createElement("td");
    secondGPUBus.textContent = secondGPU.getBus() + " bit";
    secondGPUBus.className = "gpu-column";
    const busDifference = document.createElement("td");
    busDifference.className = "compare-specs-table-difference-column";
    busDifference.textContent = getPercentageDifference(firstGPU.getBus(), secondGPU.getBus());

    busRow.appendChild(busHeader);
    busRow.appendChild(firstGPUBus);
    busRow.appendChild(secondGPUBus);
    busRow.appendChild(busDifference);

    const clockSpeedsRow = document.createElement("tr");
    const clockSpeedsHeader = document.createElement("th");
    clockSpeedsHeader.textContent = "CLOCK SPEEDS";
    clockSpeedsHeader.classList.add("compare-specs-table-headers");
    clockSpeedsHeader.colSpan = 4;
    clockSpeedsRow.appendChild(clockSpeedsHeader);

    const baseClockRow = document.createElement("tr");
    const baseClockHeader = document.createElement("th");
    baseClockHeader.textContent = "Base Clock";
    const firstGPUBase = document.createElement("td");
    firstGPUBase.textContent = firstGPU.getBaseClock() + " MHz";
    firstGPUBase.className = "gpu-column";
    const secondGPUBase = document.createElement("td");
    secondGPUBase.textContent = secondGPU.getBaseClock() + " MHz";
    secondGPUBase.className = "gpu-column";
    const baseClockDifference = document.createElement("td");
    baseClockDifference.className = "compare-specs-table-difference-column";
    baseClockDifference.textContent = getPercentageDifference(firstGPU.getBaseClock(), secondGPU.getBoostClock());

    baseClockRow.appendChild(baseClockHeader);
    baseClockRow.appendChild(firstGPUBase);
    baseClockRow.appendChild(secondGPUBase);
    baseClockRow.appendChild(baseClockDifference);

    const boostClockRow = document.createElement("tr");
    const boostClockHeader = document.createElement("th");
    boostClockHeader.textContent = "Boost Clock";
    const firstGPUBoost = document.createElement("td");
    firstGPUBoost.textContent = firstGPU.getBoostClock() + " MHz";
    firstGPUBoost.className = "gpu-column";
    const secondGPUBoost = document.createElement("td");
    secondGPUBoost.textContent = secondGPU.getBoostClock() + " MHz";
    secondGPUBoost.className = "gpu-column";
    const boostClockDifference = document.createElement("td");
    boostClockDifference.className = "compare-specs-table-difference-column";
    boostClockDifference.textContent = getPercentageDifference(firstGPU.getBoostClock(), secondGPU.getBoostClock());

    boostClockRow.appendChild(boostClockHeader);
    boostClockRow.appendChild(firstGPUBoost);
    boostClockRow.appendChild(secondGPUBoost);
    boostClockRow.appendChild(boostClockDifference);

    const memClockRow = document.createElement("tr");
    const memClockHeader = document.createElement("th");
    memClockHeader.textContent = "Mem Clock";
    const firstGPUMemClock = document.createElement("td");
    firstGPUMemClock.textContent = firstGPU.getMemClock() + " Gbps effective";
    firstGPUMemClock.className = "gpu-column";
    const secondGPUMemClock = document.createElement("td");
    secondGPUMemClock.textContent = secondGPU.getMemClock() + " Gbps effective";
    secondGPUMemClock.className = "gpu-column";
    const memClockDifference = document.createElement("td");
    memClockDifference.className = "compare-specs-table-difference-column";
    memClockDifference.textContent = getPercentageDifference(firstGPU.getMemClock(), secondGPU.getMemClock());
    
    memClockRow.appendChild(memClockHeader);
    memClockRow.appendChild(firstGPUMemClock);
    memClockRow.appendChild(secondGPUMemClock);
    memClockRow.appendChild(memClockDifference);

    const performanceRow = document.createElement("tr");
    const performanceHeader = document.createElement("th");
    performanceHeader.textContent = "THEORETICAL PERFORMANCE";
    performanceHeader.classList.add("compare-specs-table-headers");
    performanceHeader.colSpan = 4;
    performanceRow.appendChild(performanceHeader);

    const fp32Row = document.createElement("tr");
    const fp32Header = document.createElement("th");
    fp32Header.textContent = "FP32 (float)";
    const firstGPUFP32 = document.createElement("td");
    firstGPUFP32.textContent = firstGPU.calculateFP32(firstGPU.getBoostClock());
    firstGPUFP32.className = "gpu-column";
    const secondGPUFP32 = document.createElement("td");
    secondGPUFP32.textContent = secondGPU.calculateFP32(secondGPU.getBoostClock());
    secondGPUFP32.className = "gpu-column";
    const fp32Difference = document.createElement("td");
    fp32Difference.className = "compare-specs-table-difference-column";
    fp32Difference.textContent = getFP32PercentageDifference(firstGPU, secondGPU);

    fp32Row.appendChild(fp32Header);
    fp32Row.appendChild(firstGPUFP32);
    fp32Row.appendChild(secondGPUFP32);
    fp32Row.appendChild(fp32Difference);

    const textureRateRow = document.createElement("tr");
    const textureRateHeader = document.createElement("th");
    textureRateHeader.textContent = "Texture Rate";
    const firstGPUTexRate = document.createElement("td");
    firstGPUTexRate.textContent = firstGPU.calculateTextureRate(firstGPU.getBoostClock()) + " GTexel/s";
    firstGPUTexRate.className = "gpu-column";
    const secondGPUTexRate = document.createElement("td");
    secondGPUTexRate.textContent = secondGPU.calculateTextureRate(secondGPU.getBoostClock()) + " GTexel/s";
    secondGPUTexRate.className = "gpu-column";
    const textureRateDifference = document.createElement("td");
    textureRateDifference.className = "compare-specs-table-difference-column";
    textureRateDifference.textContent = getPercentageDifference(
        firstGPU.calculateTextureRate(firstGPU.getBoostClock()), 
        secondGPU.calculateTextureRate(secondGPU.getBoostClock()));

    textureRateRow.appendChild(textureRateHeader);
    textureRateRow.appendChild(firstGPUTexRate);
    textureRateRow.appendChild(secondGPUTexRate);
    textureRateRow.appendChild(textureRateDifference);

    const pixelRateRow = document.createElement("tr");
    const pixelRateHeader = document.createElement("th");
    pixelRateHeader.textContent = "Pixel Rate";
    const firstGPUPixRate = document.createElement("td");
    firstGPUPixRate.textContent = firstGPU.calculatePixelRate(firstGPU.getBoostClock()) + " GPixel/s";
    firstGPUPixRate.className = "gpu-column";
    const secondGPUPixRate = document.createElement("td");
    secondGPUPixRate.textContent = secondGPU.calculatePixelRate(secondGPU.getBoostClock()) + " GPixel/s";
    secondGPUPixRate.className = "gpu-column";
    const pixelRateDifference = document.createElement("td");
    pixelRateDifference.className = "compare-specs-table-difference-column";
    pixelRateDifference.textContent = getPercentageDifference(
        firstGPU.calculatePixelRate(firstGPU.getBoostClock()), 
        secondGPU.calculatePixelRate(secondGPU.getBoostClock()));

    pixelRateRow.appendChild(pixelRateHeader);
    pixelRateRow.appendChild(firstGPUPixRate);
    pixelRateRow.appendChild(secondGPUPixRate);
    pixelRateRow.appendChild(pixelRateDifference);

    const bandwidthRow = document.createElement("tr");
    const bandwidthHeader = document.createElement("th");
    bandwidthHeader.textContent = "Bandwidth";
    const firstGPUBandwidth = document.createElement("td");
    firstGPUBandwidth.textContent = firstGPU.calculateBandwidth(firstGPU.getMemClock()) + " GB/s";
    firstGPUBandwidth.className = "gpu-column";
    const secondGPUBandwidth = document.createElement("td");
    secondGPUBandwidth.textContent = secondGPU.calculateBandwidth(secondGPU.getMemClock()) + " GB/s";
    secondGPUBandwidth.className = "gpu-column";
    const bandwidthDifference = document.createElement("td");
    bandwidthDifference.className = "compare-specs-table-difference-column";
    bandwidthDifference.textContent = getPercentageDifference(
        firstGPU.calculateBandwidth(firstGPU.getMemClock()), 
        secondGPU.calculateBandwidth(secondGPU.getMemClock()));

    bandwidthRow.appendChild(bandwidthHeader);
    bandwidthRow.appendChild(firstGPUBandwidth);
    bandwidthRow.appendChild(secondGPUBandwidth);
    bandwidthRow.appendChild(bandwidthDifference);

    table.appendChild(compareSpecsHeader);
    table.appendChild(graphicsCardRow);
    table.appendChild(coresRow);
    table.appendChild(tmusRow);
    table.appendChild(ropsRow);
    table.appendChild(vramRow);
    table.appendChild(busRow);
    table.appendChild(clockSpeedsRow);
    table.appendChild(baseClockRow);
    table.appendChild(boostClockRow);
    table.appendChild(memClockRow);
    table.appendChild(performanceRow);
    table.appendChild(fp32Row);
    table.appendChild(textureRateRow);
    table.appendChild(pixelRateRow);
    table.appendChild(bandwidthRow);
    gpuContainer.appendChild(table);

    return gpuContainer;
}

// Support method for the createCompareSpecsContainer() function
function getPercentageDifference(firstGPUValue, secondGPUValue) {
    const percentageDifference = ((firstGPUValue / secondGPUValue) * 100) - 100;
    return percentageDifference > 0 ? `+${percentageDifference.toFixed()}%` : `${percentageDifference.toFixed()}%`;
}

// Support method for the createCompareSpecsContainer() function
function getFP32PercentageDifference(firstGPU, secondGPU) {
    const getFP32 = (gpu) => {
        return (gpu.getName().toLowerCase().includes("rx 7")) ? 
            (gpu.getCores() * gpu.getBoostClock() * 4) / 1000000 : 
            (gpu.getCores() * gpu.getBoostClock() * 2) / 1000000;
    };

    const firstFP32Performance = getFP32(firstGPU);
    const secondFP32Performance = getFP32(secondGPU);
    
    const percentageDifference = ((firstFP32Performance / secondFP32Performance) * 100) - 100;
    return percentageDifference > 0 ? `+${percentageDifference.toFixed()}%` : `${percentageDifference.toFixed()}%`;
}

function main() {
    getData();
}

main();