export enum DetectionStatus {
    TooLow = 'tooLow',
    TooHigh = 'tooHigh',
    InTune = 'inTune',
    Unstable = 'unstable',
}

export enum Note {
    C = 'C',
    CSharp = 'C#',
    DFlat = 'Db',
    D = 'D',
    DSharp = 'D#',
    EFlat = 'Eb',
    E = 'E',
    F = 'F',
    FSharp = 'F#',
    GFlat = 'Gb',
    G = 'G',
    GSharp = 'G#',
    AFlat = 'Ab',
    A = 'A',
    ASharp = 'A#',
    BFlat = 'Bb',
    B = 'B',
    CFlat = 'Cb',
    ESharp = 'E#',
    FFlat = 'Fb',
    BSharp = 'B#',
}

export enum TuningId {
    Standard = 'standard',
    DropD = 'drop-d',
    DADGAD = 'dadgad',
    OpenG = 'open-g',
    OpenD = 'open-d',
    DropC = 'drop-c',
    HalfStepDown = 'half-step-down',
    OpenC = 'open-c',
    Bass4 = 'bass-4',
    Bass5 = 'bass-5',
    UkuleleSoprano = 'ukulele-soprano',
    UkuleleConcert = 'ukulele-concert',
    UkuleleTenor = 'ukulele-tenor',
    UkuleleBaritone = 'ukulele-baritone',
    Balalaika = 'balalaika',
    Domra = 'domra',
    Shamisen = 'shamisen',
    Oud = 'oud',
    Sitar = 'sitar',
}

export interface GuitarString {
    note: Note;
    frequency: number;
}

export interface Tuning {
    id: TuningId | string;
    name: string;
    strings: GuitarString[];
}

export const NoteNames: Note[] = [
    Note.C,
    Note.CSharp,
    Note.DFlat,
    Note.D,
    Note.DSharp,
    Note.EFlat,
    Note.E,
    Note.F,
    Note.FSharp,
    Note.GFlat,
    Note.G,
    Note.GSharp,
    Note.AFlat,
    Note.A,
    Note.ASharp,
    Note.BFlat,
    Note.B,
    Note.CFlat,
    Note.ESharp,
    Note.FFlat,
    Note.BSharp,
];

export const FrequencyConstants = {
    A4: 440,
    C0: 16.35,
    MinDetection: 1,
    MaxDetection: 2000,
    RmsThreshold: 0.008,
    CorrelationThreshold: 0.15,
    GoodCorrelationThreshold: 0.8,
    MinConfidence: 0.6,
    WindowSize: 7,
    MedianFilterSize: 7,
    BandpassMin: 1,
    BandpassMax: 2000,
    MinGuitarFrequency: 1,
    MaxGuitarFrequency: 2000,
    StuckFrequencyThreshold: 0.95,
    CentsPerOctave: 1200,
} as const;

export const DetectionThresholds = {
    InTuneLow: -20,
    InTuneHigh: 20,
    CentRange: 50,
    MaxSamplesDivisor: 2.5,
    InitialOffset: 6,
    ConfidenceDecay: 0.1,
    PeakProminence: 1.5,
    HarmonicRatio: 0.3,
    MinFrequencyGuitar: 1,
    MaxFrequencyGuitar: 2000,
    NoiseRejection: 0.4,
    OctaveTolerance: 0.15,
    StagnationReset: 0.1,
    DynamicRange: 0.3,
} as const;

export const StandardFrequencies = {
    B0: 30.87,
    E1: 41.2,
    A1: 55.0,
    CFlat2: 61.74,
    B1: 61.74,
    BSharp2: 69.3,
    C2: 65.41,
    FFlat2: 82.41,
    E2: 82.41,
    D2: 73.42,
    DSharp2: 77.78,
    DFlat2: 77.78,
    Eb2: 77.78,
    ESharp2: 87.31,
    F2: 87.31,
    G2: 98.0,
    Ab2: 103.83,
    GSharp2: 103.83,
    GFlat2: 103.83,
    A2: 110.0,
    C3: 130.81,
    Db3: 138.59,
    CSharp3: 138.59,
    DFlat3: 138.59,
    D3: 146.83,
    F3: 174.61,
    Gb3: 185.0,
    FSharp3: 185.0,
    GFlat3: 185.0,
    G3: 196.0,
    A3: 220.0,
    Bb3: 233.08,
    ASharp3: 233.08,
    BFlat3: 233.08,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    DSharp4: 311.13,
    Eb4: 311.13,
    EFlat4: 311.13,
    E4: 329.63,
    G4: 392.0,
    B4: 493.88,
    A4: 440.0,
    D5: 587.33,
} as const;

export const AudioSettings = {
    FftSize: 8192,
    OscillatorType: 'sine' as OscillatorType,
    GainRampDuration: 0.1,
    ReferenceNoteDuration: 2000,
    MinGain: 0.001,
    MaxGain: 0.3,
    SampleRate: 44100,
} as const;

export const TuningPresets = {
    CustomPrefix: 'custom-',
    DefaultStringCount: 6,
} as const;
