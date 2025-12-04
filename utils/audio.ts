import { FrequencyConstants, DetectionThresholds, AudioSettings } from '@/types/tuner';

export class AudioProcessor {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private microphone: MediaStreamAudioSourceNode | null = null;
    private dataArray: Float32Array | null = null;
    private stream: MediaStream | null = null;
    private lastValidFrequency: number | null = null;
    private confidence: number = 0;
    private frequencyBuffer: number[] = [];
    private readonly bufferSize: number = FrequencyConstants.MedianFilterSize;

    async initialize(): Promise<void> {
        try {
            this.audioContext = new AudioContext();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = AudioSettings.FftSize;
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);

            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    noiseSuppression: true,
                    echoCancellation: true,
                    autoGainControl: false,
                },
            });
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
            this.microphone.connect(this.analyser);
        } catch {
            throw new Error('Microphone access denied');
        }
    }

    getFrequency(): number | null {
        if (!this.analyser || !this.dataArray) {
            return null;
        }

        // Using any is justified here due to TypeScript and Web Audio API type incompatibility
        // Web Audio API expects Float32Array<ArrayBuffer> but TypeScript's DOM types
        // define it as accepting Float32Array<ArrayBufferLike>. This is a known type
        // definition issue that doesn't affect runtime behavior.
        // We control the Float32Array creation and know it's correct at runtime.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.analyser.getFloatTimeDomainData(this.dataArray as any);
        const sampleRate: number = this.audioContext?.sampleRate || AudioSettings.SampleRate;

        const rawFrequency: number | null = this.autoCorrelate(this.dataArray, sampleRate);

        if (!rawFrequency) {
            this.confidence = Math.max(0, this.confidence - DetectionThresholds.ConfidenceDecay);
            return this.confidence > DetectionThresholds.NoiseRejection
                ? this.lastValidFrequency
                : null;
        }

        const validatedFrequency: number | null = this.validateFrequency(rawFrequency);

        if (validatedFrequency) {
            this.confidence = Math.min(1, this.confidence + 0.25);
            this.lastValidFrequency = validatedFrequency;
            this.frequencyBuffer.push(validatedFrequency);

            if (this.frequencyBuffer.length > this.bufferSize) {
                this.frequencyBuffer.shift();
            }

            const result: number = this.calculateRobustMedian();
            return Number.isFinite(result) ? result : null;
        }

        this.confidence = Math.max(0, this.confidence - DetectionThresholds.ConfidenceDecay);
        return this.confidence > DetectionThresholds.NoiseRejection
            ? this.lastValidFrequency
            : null;
    }

    private autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
        const size: number = buffer.length;
        const maxSamples: number = Math.floor(size / DetectionThresholds.MaxSamplesDivisor);
        const correlations: number[] = new Array(maxSamples).fill(0);

        let rms: number = 0;
        for (let i = 0; i < size; i++) {
            const val: number = buffer[i]!;
            rms += val * val;
        }
        rms = Math.sqrt(rms / size);

        if (rms < FrequencyConstants.RmsThreshold || !Number.isFinite(rms)) {
            return null;
        }

        for (let offset = DetectionThresholds.InitialOffset; offset < maxSamples; offset++) {
            let correlation: number = 0;
            let norm1: number = 0;
            let norm2: number = 0;

            for (let i = 0; i < maxSamples; i++) {
                correlation += buffer[i]! * buffer[i + offset]!;
                norm1 += buffer[i]! * buffer[i]!;
                norm2 += buffer[i + offset]! * buffer[i + offset]!;
            }

            correlation = correlation / (Math.sqrt(norm1 * norm2) + 0.001);
            correlations[offset] = correlation;
        }

        let bestOffset: number = -1;
        let bestCorrelation: number = FrequencyConstants.CorrelationThreshold;

        for (let offset = DetectionThresholds.InitialOffset; offset < maxSamples; offset++) {
            if (correlations[offset]! > bestCorrelation) {
                bestCorrelation = correlations[offset]!;
                bestOffset = offset;
            }
        }

        if (bestOffset > 0 && bestCorrelation > FrequencyConstants.GoodCorrelationThreshold) {
            return this.refineFrequency(bestOffset, correlations, sampleRate);
        }

        return null;
    }

    private refineFrequency(
        bestOffset: number,
        correlations: number[],
        sampleRate: number,
    ): number {
        const x0: number = bestOffset - 1;
        const x1: number = bestOffset;
        const x2: number = bestOffset + 1;

        if (x0 < 0 || x2 >= correlations.length) {
            const freq: number = sampleRate / bestOffset;
            return Number.isFinite(freq) ? freq : 0;
        }

        const y0: number = correlations[x0]!;
        const y1: number = correlations[x1]!;
        const y2: number = correlations[x2]!;

        if (
            y1 > y0 * DetectionThresholds.PeakProminence &&
            y1 > y2 * DetectionThresholds.PeakProminence
        ) {
            const denominator: number = 2 * (y2 - 2 * y1 + y0 + 0.001);
            if (Math.abs(denominator) > 0.0001) {
                const peakOffset: number = x1 - (y2 - y0) / denominator;
                const result: number = sampleRate / Math.max(peakOffset, 1);
                return Number.isFinite(result) ? result : 0;
            }
        }

        const freq: number = sampleRate / bestOffset;
        return Number.isFinite(freq) ? freq : 0;
    }

    private validateFrequency(frequency: number): number | null {
        if (
            !Number.isFinite(frequency) ||
            frequency < FrequencyConstants.MinDetection ||
            frequency > FrequencyConstants.MaxDetection
        ) {
            return null;
        }

        if (frequency < 1) {
            return null;
        }

        return frequency;
    }

    private calculateRobustMedian(): number {
        if (this.frequencyBuffer.length === 0) {
            return 0;
        }

        const validFrequencies: number[] = this.frequencyBuffer.filter(
            f =>
                Number.isFinite(f) &&
                f >= FrequencyConstants.MinDetection &&
                f <= FrequencyConstants.MaxDetection,
        );

        if (validFrequencies.length === 0) {
            return 0;
        }

        if (validFrequencies.length === 1) {
            return validFrequencies[0]!;
        }

        const sorted: number[] = [...validFrequencies].sort((a, b) => a - b);
        const mid: number = Math.floor(sorted.length / 2);
        const median: number =
            sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;

        if (!Number.isFinite(median)) {
            return validFrequencies[validFrequencies.length - 1]!;
        }

        const tolerance: number = median < 100 ? 0.25 : 0.15;
        const tightValues: number[] = validFrequencies.filter(
            freq => Math.abs(freq - median) < Math.max(median * tolerance, 15),
        );

        if (tightValues.length === 0) {
            return median;
        }

        if (tightValues.length === 1) {
            return tightValues[0]!;
        }

        let weightedSum: number = 0;
        let weightSum: number = 0;

        for (let i = 0; i < tightValues.length; i++) {
            const recencyWeight: number = Math.exp(-i * 0.4);
            const proximityWeight: number = Math.exp(
                -Math.abs(tightValues[i]! - median) / (median * 0.3),
            );
            const weight: number = recencyWeight * proximityWeight;

            weightedSum += tightValues[i]! * weight;
            weightSum += weight;
        }

        const result: number = weightedSum / (weightSum + 0.001);
        return Number.isFinite(result) ? result : median;
    }

    stop(): void {
        this.stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        this.audioContext?.close();
    }
}

export class ReferenceAudio {
    private audioContext: AudioContext | null = null;

    private static readonly LOW_FREQUENCY_THRESHOLD = 100;
    private static readonly OCTAVE_MULTIPLIER = 4;

    playFrequency(
        frequency: number,
        duration: number = AudioSettings.ReferenceNoteDuration,
        volume: number = AudioSettings.MaxGain,
    ): void {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        const oscillator: OscillatorNode = this.audioContext.createOscillator();
        const gainNode: GainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const playbackFrequency =
            frequency < ReferenceAudio.LOW_FREQUENCY_THRESHOLD
                ? frequency * ReferenceAudio.OCTAVE_MULTIPLIER
                : frequency;

        oscillator.frequency.setValueAtTime(playbackFrequency, this.audioContext.currentTime);
        oscillator.type = AudioSettings.OscillatorType;

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
            volume,
            this.audioContext.currentTime + AudioSettings.GainRampDuration,
        );
        gainNode.gain.exponentialRampToValueAtTime(
            AudioSettings.MinGain,
            this.audioContext.currentTime + duration / 1000,
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
}
