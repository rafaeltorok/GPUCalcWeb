export class GPU {
    #manufacturer;
    #gpuline;
    #gpuname;
    #cores;
    #tmus;
    #rops;
    #vram;
    #bus;
    #memtype;
    #baseclock;
    #boostclock;
    #memclock;

    constructor(manufacturer, gpuline, gpuname, cores, tmus, rops, vram, bus, memtype, baseclock, boostclock, memclock) {
        this.#manufacturer = manufacturer;
        this.#gpuline = gpuline;
        this.#gpuname = gpuname;
        this.#cores = cores;
        this.#tmus = tmus;
        this.#rops = rops;
        this.#vram = vram;
        this.#bus = bus;
        this.#memtype = memtype;
        this.#baseclock = baseclock;
        this.#boostclock = boostclock;
        this.#memclock = memclock;
    }

    getManufacturer() {
        return this.#manufacturer;
    }

    getLine() {
        return this.#gpuline;
    }

    getName() {
        return this.#gpuname;
    }

    getCores() {
        return this.#cores;
    }

    getTmus() {
        return this.#tmus;
    }

    getRops() {
        return this.#rops;
    }

    getVram() {
        return this.#vram;
    }

    getBus() {
        return this.#bus;
    }

    getMemType() {
        return this.#memtype;
    }

    getBaseClock() {
        return this.#baseclock;
    }

    getBoostClock() {
        return this.#boostclock;
    }

    getMemClock() {
        return this.#memclock
    }

    fp32(gpu, clock) {
        let floatingPointsPerformance = 0;
        if (gpu.getName().toLowerCase().includes("rx 7")) {
            floatingPointsPerformance = ((gpu.getCores() * clock * 4) / 1000000).toFixed(2);
        } else {
            floatingPointsPerformance = ((gpu.getCores() * clock * 2) / 1000000).toFixed(2);
        }

        if (floatingPointsPerformance < 1) {
            return (floatingPointsPerformance * 1000) + " GFLOPS";
        }
        return floatingPointsPerformance + " TFLOPS";
    }

    texRate(gpu, clock) {
        return ((gpu.getTmus() * clock) / 1000).toFixed(2);
    }

    pixRate(gpu, clock) {
        return ((gpu.getRops() * clock) / 1000).toFixed(2);
    }

    bandwidth(gpu, memClock) {
        return ((gpu.getBus() * memClock) / 8).toFixed(2);
    }
}