import { GPU } from "./gpu.mjs";


// The array that serves as a database while the app is running
let gpuList = [];

// Runs when the app starts, fetches all GPU objects from the gpuData JSON file
export async function getData() {
    const response = await fetch('/gpus');
    const data = await response.json();
    for (const item of data) {
        gpuList.push(new GPU(
            item['manufacturer'], 
            item['line'], 
            item['model'],
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


// Fetches a GPU object from the gpuList Array
export function getGPUFromDatabase(searchInput) {
    const gpu = gpuList.find(gpu => gpu.getModel().toLowerCase().trim() === searchInput.toLowerCase().trim());
    return gpu;
}


// Fetches all GPUs from the database
export function getGPUList() {
    return gpuList;
}


// Adds a new GPU object to the array



// Prepares a JSON format string to be written into the database file
export function formatGpuListIntoJsonString() {
    const dataList = [];
    for (const gpu of gpuList) {
        dataList.push(
            {
                manufacturer: gpu.getManufacturer(),
                line: gpu.getLine(),
                model: gpu.getModel(),
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