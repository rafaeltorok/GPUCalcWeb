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

    const compareSpecsTable = document.createElement("table");
    compareSpecsTable.className = "compare-specs-table";

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
    firstGPUCores.className = "compare-specs-table-gpu-column";
    const secondGPUCores = document.createElement("td");
    secondGPUCores.textContent = secondGPU.getCores();
    secondGPUCores.className = "compare-specs-table-gpu-column";
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
    firstGPUTmus.className = "compare-specs-table-gpu-column";
    const secondGPUTmus = document.createElement("td");
    secondGPUTmus.textContent = secondGPU.getTmus();
    secondGPUTmus.className = "compare-specs-table-gpu-column";
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
    firstGPURops.className = "compare-specs-table-gpu-column";
    const secondGPURops = document.createElement("td");
    secondGPURops.textContent = secondGPU.getRops();
    secondGPURops.className = "compare-specs-table-gpu-column";
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
    firstGPUVram.className = "compare-specs-table-gpu-column";
    const secondGPUVram = document.createElement("td");
    secondGPUVram.textContent = secondGPU.getVram() + "GB " + secondGPU.getMemType();
    secondGPUVram.className = "compare-specs-table-gpu-column";
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
    firstGPUBus.className = "compare-specs-table-gpu-column";
    const secondGPUBus = document.createElement("td");
    secondGPUBus.textContent = secondGPU.getBus() + " bit";
    secondGPUBus.className = "compare-specs-table-gpu-column";
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
    firstGPUBase.className = "compare-specs-table-gpu-column";
    const secondGPUBase = document.createElement("td");
    secondGPUBase.textContent = secondGPU.getBaseClock() + " MHz";
    secondGPUBase.className = "compare-specs-table-gpu-column";
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
    firstGPUBoost.className = "compare-specs-table-gpu-column";
    const secondGPUBoost = document.createElement("td");
    secondGPUBoost.textContent = secondGPU.getBoostClock() + " MHz";
    secondGPUBoost.className = "compare-specs-table-gpu-column";
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
    firstGPUMemClock.className = "compare-specs-table-gpu-column";
    const secondGPUMemClock = document.createElement("td");
    secondGPUMemClock.textContent = secondGPU.getMemClock() + " Gbps effective";
    secondGPUMemClock.className = "compare-specs-table-gpu-column";
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
    firstGPUFP32.className = "compare-specs-table-gpu-column";
    const secondGPUFP32 = document.createElement("td");
    secondGPUFP32.textContent = secondGPU.calculateFP32(secondGPU.getBoostClock());
    secondGPUFP32.className = "compare-specs-table-gpu-column";
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
    firstGPUTexRate.className = "compare-specs-table-gpu-column";
    const secondGPUTexRate = document.createElement("td");
    secondGPUTexRate.textContent = secondGPU.calculateTextureRate(secondGPU.getBoostClock()) + " GTexel/s";
    secondGPUTexRate.className = "compare-specs-table-gpu-column";
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
    firstGPUPixRate.className = "compare-specs-table-gpu-column";
    const secondGPUPixRate = document.createElement("td");
    secondGPUPixRate.textContent = secondGPU.calculatePixelRate(secondGPU.getBoostClock()) + " GPixel/s";
    secondGPUPixRate.className = "compare-specs-table-gpu-column";
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
    firstGPUBandwidth.className = "compare-specs-table-gpu-column";
    const secondGPUBandwidth = document.createElement("td");
    secondGPUBandwidth.textContent = secondGPU.calculateBandwidth(secondGPU.getMemClock()) + " GB/s";
    secondGPUBandwidth.className = "compare-specs-table-gpu-column";
    const bandwidthDifference = document.createElement("td");
    bandwidthDifference.className = "compare-specs-table-difference-column";
    bandwidthDifference.textContent = getPercentageDifference(
        firstGPU.calculateBandwidth(firstGPU.getMemClock()), 
        secondGPU.calculateBandwidth(secondGPU.getMemClock()));

    bandwidthRow.appendChild(bandwidthHeader);
    bandwidthRow.appendChild(firstGPUBandwidth);
    bandwidthRow.appendChild(secondGPUBandwidth);
    bandwidthRow.appendChild(bandwidthDifference);

    compareSpecsTable.appendChild(compareSpecsHeader);
    compareSpecsTable.appendChild(graphicsCardRow);
    compareSpecsTable.appendChild(coresRow);
    compareSpecsTable.appendChild(tmusRow);
    compareSpecsTable.appendChild(ropsRow);
    compareSpecsTable.appendChild(vramRow);
    compareSpecsTable.appendChild(busRow);
    compareSpecsTable.appendChild(clockSpeedsRow);
    compareSpecsTable.appendChild(baseClockRow);
    compareSpecsTable.appendChild(boostClockRow);
    compareSpecsTable.appendChild(memClockRow);
    compareSpecsTable.appendChild(performanceRow);
    compareSpecsTable.appendChild(fp32Row);
    compareSpecsTable.appendChild(textureRateRow);
    compareSpecsTable.appendChild(pixelRateRow);
    compareSpecsTable.appendChild(bandwidthRow);
    gpuContainer.appendChild(compareSpecsTable);

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