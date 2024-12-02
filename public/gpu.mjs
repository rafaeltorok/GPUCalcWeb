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

    calculateFP32(coreClock) {
        let fp32Performance = 0;
        if (this.getName().toLowerCase().includes("rx 7")) {
            fp32Performance = ((this.getCores() * coreClock * 4) / 1000000).toFixed(2);
        } else {
            fp32Performance = ((this.getCores() * coreClock * 2) / 1000000).toFixed(2);
        }
        return (fp32Performance < 1) ? (fp32Performance * 1000) + " GFLOPS" : fp32Performance + " TFLOPS";
    }

    calculateTextureRate(coreClock) {
        return ((this.getTmus() * coreClock) / 1000).toFixed(2);
    }

    calculatePixelRate(coreClock) {
        return ((this.getRops() * coreClock) / 1000).toFixed(2);
    }

    calculateBandwidth(memClock) {
        return ((this.getBus() * memClock) / 8).toFixed(2);
    }
}