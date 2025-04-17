export function createGPUContainer(gpu, coreClock, memClock) {
    const gpuContainer = document.createElement("div");
    const gpuModelHeader = document.createElement("h2");
    
    if (
        gpu.getManufacturer().toLowerCase().trim() == "nvidia" ||
        gpu.getLine().toLowerCase().trim() == "geforce"
    ) {
        gpuContainer.classList.add("gpu-container", "model-nvidia");
    } else if (
        gpu.getManufacturer().toLowerCase().trim() == "amd" ||
        gpu.getLine().toLowerCase().trim() == "radeon"
    ) {
        gpuContainer.classList.add("gpu-container", "model-amd");
    } else if (
        gpu.getManufacturer().toLowerCase().trim() == "intel" ||
        gpu.getLine().toLowerCase().trim() == "arc"
    ) {
        gpuContainer.classList.add("gpu-container", "model-intel");
    } else {
        gpuContainer.classList.add("gpu-container");
    }
    gpuModelHeader.textContent = gpu.getManufacturer() + " " + gpu.getLine() + " " + gpu.getModel();

    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-wrapper";

    // Append all tables to the wrapper
    tableWrapper.appendChild(createGraphicsCardTable(gpu));
    tableWrapper.appendChild(createClockSpeedsTable(gpu, coreClock, memClock));
    tableWrapper.appendChild(createPerformanceTable(gpu, coreClock, memClock));

    gpuContainer.appendChild(gpuModelHeader);
    gpuContainer.appendChild(tableWrapper);

    return gpuContainer;
}


function createGraphicsCardTable(gpu) {
    const table = document.createElement("table");

    const header = createTableHeader("GRAPHICS CARD");
    const body = document.createElement("tbody");
    body.innerHTML = `
        <tr><th>Cores:</td><td>${gpu.getCores()}</td></tr>
        <tr><th>TMUs:</td><td>${gpu.getTmus()}</td></tr>
        <tr><th>ROPs:</td><td>${gpu.getRops()}</td></tr>
        <tr><th>VRAM:</td><td>${gpu.getVram()} GB ${gpu.getMemType()}</td></tr>
        <tr><th>Bus Width:</td><td>${gpu.getBus()} bit</td></tr>
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
        <tr><th>Base Clock:</td><td>${gpu.getBaseClock()} MHz</td></tr>
        <tr><th>Boost Clock:</td><td>${coreClock} MHz</td></tr>
        <tr><th>Memory Clock:</td><td>${memClock} Gbps effective</td></tr>
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
        <tr><th>FP32 (float):</td><td>${gpu.calculateFP32(coreClock)}</td></tr>
        <tr><th>Texture Rate:</td><td>${gpu.calculateTextureRate(coreClock)} GTexel/s</td></tr>
        <tr><th>Pixel Rate:</td><td>${gpu.calculatePixelRate(coreClock)} GPixel/s</td></tr>
        <tr><th>Bandwidth:</td><td>${gpu.calculateBandwidth(memClock)} GB/s</td></tr>
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