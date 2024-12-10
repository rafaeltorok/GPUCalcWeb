export function createGPUContainer(gpu, coreClock, memClock) {
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