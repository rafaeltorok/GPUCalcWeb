import { getGPUFromDatabase } from "./gpuManager.mjs";


export function compareSpecs() {
    const dataDisplay = document.getElementById("data-display");
    const gpuDataDisplay = document.getElementById("gpu-data-display");
    gpuDataDisplay.innerHTML = "";  // Removes the previous GPU tables before displaying new ones

    const searchInputFirst = document.getElementById('searchInputFirst').value.toLowerCase();
    const searchInputSecond = document.getElementById('searchInputSecond').value.toLowerCase();
    const firstGPU = getGPUFromDatabase(searchInputFirst);
    const secondGPU = getGPUFromDatabase(searchInputSecond);

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


export function createCompareSpecsContainer(firstGPU, secondGPU) {
    const gpuContainer = document.createElement("div");
    gpuContainer.className = "compare-specs-container";

    // Sets the font color to the name header of the GPU in the left side of the comparison
    let firstGpuModelHeaderClass;
    if (
        firstGPU.getManufacturer().toLowerCase().trim() === "nvidia" ||
        firstGPU.getLine().toLowerCase().trim() === "geforce"
    ) {
        firstGpuModelHeaderClass = "gpu-compare-nvidia";
    } else if (
        firstGPU.getManufacturer().toLowerCase().trim() == "amd" ||
        firstGPU.getLine().toLowerCase().trim() === "radeon"
    ) {
        firstGpuModelHeaderClass = "gpu-compare-amd";
    } else if (
        firstGPU.getManufacturer().toLowerCase().trim() == "intel" ||
        firstGPU.getLine().toLowerCase().trim() === "arc"
    ) {
        firstGpuModelHeaderClass = "gpu-compare-intel";
    } else {
        firstGpuModelHeaderClass = "gpu-compare-header";
    }

    // Sets the font color to the name header of the GPU in the right side of the comparison
    let secondGpuModelHeaderClass;
    if (
        secondGPU.getManufacturer().toLowerCase().trim() == "nvidia" ||
        secondGPU.getLine().toLowerCase().trim() === "geforce"
    ) {
        secondGpuModelHeaderClass = "gpu-compare-nvidia";
    } else if (
        secondGPU.getManufacturer().toLowerCase().trim() == "amd" ||
        secondGPU.getLine().toLowerCase().trim() === "radeon"
    ) {
        secondGpuModelHeaderClass = "gpu-compare-amd";
    } else if (
        secondGPU.getManufacturer().toLowerCase().trim() == "intel" ||
        secondGPU.getLine().toLowerCase().trim() === "arc"
    ) {
        secondGpuModelHeaderClass = "gpu-compare-intel";
    } else {
        secondGpuModelHeaderClass = "gpu-compare-header";
    }

    const compareSpecsTable = document.createElement("table");
    compareSpecsTable.className = "compare-specs-table";

    // Creates the first line in the table containing both GPU names and the % difference
    const compareSpecsMainRow = document.createElement("tr");
    compareSpecsMainRow.classList.add("compare-specs-table-headers");

    // Creates each one of the main headers for the table
    const modelHeader = document.createElement("th");
    modelHeader.textContent = "Name";
    modelHeader.classList.add("compare-specs-table-headers");
    const firstModel = document.createElement("td");
    firstModel.textContent = firstGPU.getModel();
    firstModel.classList.add(firstGpuModelHeaderClass);
    const secondModel = document.createElement("td");
    secondModel.textContent = secondGPU.getModel();
    secondModel.classList.add(secondGpuModelHeaderClass);
    const percentageDifferenceHeader = document.createElement("td");
    percentageDifferenceHeader.textContent = "Difference (in %)";
    percentageDifferenceHeader.className = "compare-specs-table-difference-column";

    compareSpecsMainRow.appendChild(modelHeader);
    compareSpecsMainRow.appendChild(firstModel);
    compareSpecsMainRow.appendChild(secondModel);
    compareSpecsMainRow.appendChild(percentageDifferenceHeader);
    compareSpecsTable.appendChild(compareSpecsMainRow);

    // The graphics card specifications first division of the table
    createTableDivisionHeader(compareSpecsTable, "GRAPHICS CARD");

    // Cores row
    createTableRow(compareSpecsTable,
        "Cores",
        firstGPU.getCores(),
        secondGPU.getCores(),
        getPercentageDifference(firstGPU.getCores(), secondGPU.getCores())
    );

    // TMUs row
    createTableRow(compareSpecsTable,
        "TMUs",
        firstGPU.getTmus(),
        secondGPU.getTmus(),
        getPercentageDifference(firstGPU.getTmus(), secondGPU.getTmus())
    );

    // ROPs row
    createTableRow(compareSpecsTable,
        "ROPs",
        firstGPU.getRops(),
        secondGPU.getRops(),
        getPercentageDifference(firstGPU.getRops(), secondGPU.getRops())
    );

    // VRAM row
    createTableRow(compareSpecsTable,
        "VRAM",
        firstGPU.getVram(),
        secondGPU.getVram(),
        getPercentageDifference(firstGPU.getVram(), secondGPU.getVram())
    );

    // Bus Width row
    createTableRow(compareSpecsTable,
        "Bus Width",
        firstGPU.getBus(),
        secondGPU.getBus(),
        getPercentageDifference(firstGPU.getBus(), secondGPU.getBus())
    );

    // The clock speeds division of the table
    createTableDivisionHeader(compareSpecsTable, "CLOCK SPEEDS");

    // Base Clock row
    createTableRow(compareSpecsTable,
        "Base Clock",
        firstGPU.getBaseClock(),
        secondGPU.getBaseClock(),
        getPercentageDifference(firstGPU.getBaseClock(), secondGPU.getBaseClock())
    );

    // Boost Clock row
    createTableRow(compareSpecsTable,
        "Boost Clock",
        firstGPU.getBoostClock(),
        secondGPU.getBoostClock(),
        getPercentageDifference(firstGPU.getBoostClock(), secondGPU.getBoostClock())
    );

    // Memory Clock row
    createTableRow(compareSpecsTable,
        "Memory Clock",
        firstGPU.getMemClock(),
        secondGPU.getMemClock(),
        getPercentageDifference(firstGPU.getMemClock(), secondGPU.getMemClock())
    );

    // The theoretical performance division of the table
    createTableDivisionHeader(compareSpecsTable, "THEORETICAL PERFORMANCE");

    // FP32 row
    createTableRow(compareSpecsTable,
        "FP32(float)",
        firstGPU.calculateFP32(firstGPU.getBoostClock()),
        secondGPU.calculateFP32(secondGPU.getBoostClock()),
        getFP32PercentageDifference(firstGPU, secondGPU)
    );

    // Texture Rate row
    createTableRow(compareSpecsTable,
        "Texture Rate",
        firstGPU.calculateTextureRate(firstGPU.getBoostClock()) + " GTexel/s",
        secondGPU.calculateTextureRate(secondGPU.getBoostClock()) + " GTexel/s",
        getPercentageDifference(
            firstGPU.calculateTextureRate(firstGPU.getBoostClock()), 
            secondGPU.calculateTextureRate(secondGPU.getBoostClock()))
    );

    // Pixel Rate row
    createTableRow(compareSpecsTable,
        "Pixel Rate",
        firstGPU.calculatePixelRate(firstGPU.getBoostClock()) + " GPixel/s",
        secondGPU.calculatePixelRate(secondGPU.getBoostClock()) + " GPixel/s",
        getPercentageDifference(
            firstGPU.calculatePixelRate(firstGPU.getBoostClock()), 
            secondGPU.calculatePixelRate(secondGPU.getBoostClock()))
    );

    // Bandwidth row
    createTableRow(compareSpecsTable,
        "Bandwidth",
        firstGPU.calculateBandwidth(firstGPU.getMemClock()) + " GB/s",
        secondGPU.calculateBandwidth(secondGPU.getMemClock()) + " GB/s",
        getPercentageDifference(
            firstGPU.calculateBandwidth(firstGPU.getMemClock()), 
            secondGPU.calculateBandwidth(secondGPU.getMemClock()))
    );
    
    gpuContainer.appendChild(compareSpecsTable);
    return gpuContainer;
}


function createTableDivisionHeader(compareSpecsTable, headerContent) {
    const row = document.createElement("tr");
    const header = document.createElement("th");
    header.textContent = headerContent;
    header.classList.add("compare-specs-table-headers");
    header.colSpan = 4;
    row.appendChild(header);
    compareSpecsTable.appendChild(row);
}


function createTableRow(
    compareSpecsTable,
    headerContent,
    firstGPUContent,
    secondGPUContent,
    differenceContent
) {
    const row = document.createElement("tr");
    const header = document.createElement("th");
    header.textContent = headerContent;
    const firstGPUData = document.createElement("td");
    firstGPUData.textContent = firstGPUContent;
    firstGPUData.className = "compare-specs-table-gpu-column";
    const secondGPUData = document.createElement("td");
    secondGPUData.textContent = secondGPUContent;
    secondGPUData.className = "compare-specs-table-gpu-column";
    const differenceData = document.createElement("td");
    differenceData.className = "compare-specs-table-difference-column";
    differenceData.textContent = differenceContent;

    row.appendChild(header);
    row.appendChild(firstGPUData);
    row.appendChild(secondGPUData);
    row.appendChild(differenceData);
    compareSpecsTable.appendChild(row);
}


// Support method for the createCompareSpecsContainer() function
function getPercentageDifference(firstGPUValue, secondGPUValue) {
    if (!firstGPUValue || firstGPUValue === 0) return 'N/A';

    const difference = ((secondGPUValue - firstGPUValue) / firstGPUValue) * 100;
    const rounded = difference.toFixed();

    return difference > 0 ? `+${rounded}%` : `${rounded}%`;
}

// Support method for the createCompareSpecsContainer() function
function getFP32PercentageDifference(firstGPU, secondGPU) {
    const getFP32 = (gpu) => {
        const model = gpu.getModel().toLowerCase();
        const isRadeon = model.includes("rx 7") || model.includes("rx 9");
        const multiplier = isRadeon ? 4 : 2;

        return (gpu.getCores() * gpu.getBoostClock() * multiplier) / 1_000_000;
    };

    const firstFP32 = getFP32(firstGPU);
    const secondFP32 = getFP32(secondGPU);

    const difference = ((secondFP32 - firstFP32) / firstFP32) * 100;

    const rounded = difference.toFixed();
    return difference > 0 ? `+${rounded}%` : `${rounded}%`;
}