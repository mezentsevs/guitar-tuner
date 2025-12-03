import {
    DetectionStatus,
    DetectionThresholds,
    FrequencyConstants,
    Note,
    StandardFrequencies,
    TuningId,
    type Tuning,
} from '@/types/tuner';

export const PresetTunings: Tuning[] = [
    {
        id: TuningId.Standard,
        name: 'Standard',
        strings: [
            { note: Note.E, frequency: StandardFrequencies.E2 },
            { note: Note.A, frequency: StandardFrequencies.A2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.B, frequency: StandardFrequencies.B3 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
        ],
    },
    {
        id: TuningId.DropD,
        name: 'Drop D',
        strings: [
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.A, frequency: StandardFrequencies.A2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.B, frequency: StandardFrequencies.B3 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
        ],
    },
    {
        id: TuningId.DADGAD,
        name: 'DADGAD',
        strings: [
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.A, frequency: StandardFrequencies.A2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.A, frequency: StandardFrequencies.A3 },
            { note: Note.D, frequency: StandardFrequencies.D4 },
        ],
    },
    {
        id: TuningId.OpenG,
        name: 'Open G',
        strings: [
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.B, frequency: StandardFrequencies.B3 },
            { note: Note.D, frequency: StandardFrequencies.D4 },
        ],
    },
    {
        id: TuningId.OpenD,
        name: 'Open D',
        strings: [
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.A, frequency: StandardFrequencies.A2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.FSharp, frequency: StandardFrequencies.FSharp3 },
            { note: Note.A, frequency: StandardFrequencies.A3 },
            { note: Note.D, frequency: StandardFrequencies.D4 },
        ],
    },
    {
        id: TuningId.DropC,
        name: 'Drop C',
        strings: [
            { note: Note.C, frequency: StandardFrequencies.C2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
            { note: Note.C, frequency: StandardFrequencies.C3 },
            { note: Note.F, frequency: StandardFrequencies.F3 },
            { note: Note.A, frequency: StandardFrequencies.A3 },
            { note: Note.D, frequency: StandardFrequencies.D4 },
        ],
    },
    {
        id: TuningId.HalfStepDown,
        name: '½ Step Down',
        strings: [
            { note: Note.EFlat, frequency: StandardFrequencies.Eb2 },
            { note: Note.AFlat, frequency: StandardFrequencies.Ab2 },
            { note: Note.DFlat, frequency: StandardFrequencies.Db3 },
            { note: Note.GFlat, frequency: StandardFrequencies.Gb3 },
            { note: Note.BFlat, frequency: StandardFrequencies.Bb3 },
            { note: Note.EFlat, frequency: StandardFrequencies.Eb4 },
        ],
    },
    {
        id: TuningId.OpenC,
        name: 'Open C',
        strings: [
            { note: Note.C, frequency: StandardFrequencies.C2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
            { note: Note.C, frequency: StandardFrequencies.C3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.C, frequency: StandardFrequencies.C4 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
        ],
    },
    {
        id: TuningId.Bass4,
        name: 'Bass (4)',
        strings: [
            { note: Note.E, frequency: StandardFrequencies.E1 },
            { note: Note.A, frequency: StandardFrequencies.A1 },
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
        ],
    },
    {
        id: TuningId.Bass5,
        name: 'Bass (5)',
        strings: [
            { note: Note.B, frequency: StandardFrequencies.B0 },
            { note: Note.E, frequency: StandardFrequencies.E1 },
            { note: Note.A, frequency: StandardFrequencies.A1 },
            { note: Note.D, frequency: StandardFrequencies.D2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
        ],
    },
    {
        id: TuningId.UkuleleSoprano,
        name: 'Ukulele (S)',
        strings: [
            { note: Note.G, frequency: StandardFrequencies.G4 },
            { note: Note.C, frequency: StandardFrequencies.C4 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.A, frequency: StandardFrequencies.A4 },
        ],
    },
    {
        id: TuningId.UkuleleConcert,
        name: 'Ukulele (C)',
        strings: [
            { note: Note.G, frequency: StandardFrequencies.G4 },
            { note: Note.C, frequency: StandardFrequencies.C4 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.A, frequency: StandardFrequencies.A4 },
        ],
    },
    {
        id: TuningId.UkuleleTenor,
        name: 'Ukulele (T)',
        strings: [
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.C, frequency: StandardFrequencies.C4 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.A, frequency: StandardFrequencies.A4 },
        ],
    },
    {
        id: TuningId.UkuleleBaritone,
        name: 'Ukulele (B)',
        strings: [
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
            { note: Note.B, frequency: StandardFrequencies.B3 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
        ],
    },
    {
        id: TuningId.Balalaika,
        name: 'Balalaika',
        strings: [
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.A, frequency: StandardFrequencies.A4 },
        ],
    },
    {
        id: TuningId.Domra,
        name: 'Domra',
        strings: [
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.A, frequency: StandardFrequencies.A4 },
            { note: Note.D, frequency: StandardFrequencies.D5 },
        ],
    },
    {
        id: TuningId.Shamisen,
        name: 'Shamisen',
        strings: [
            { note: Note.B, frequency: StandardFrequencies.B3 },
            { note: Note.E, frequency: StandardFrequencies.E4 },
            { note: Note.B, frequency: StandardFrequencies.B4 },
        ],
    },
    {
        id: TuningId.Oud,
        name: 'Oud',
        strings: [
            { note: Note.C, frequency: StandardFrequencies.C2 },
            { note: Note.F, frequency: StandardFrequencies.F2 },
            { note: Note.A, frequency: StandardFrequencies.A2 },
            { note: Note.D, frequency: StandardFrequencies.D3 },
            { note: Note.G, frequency: StandardFrequencies.G3 },
        ],
    },
    {
        id: TuningId.Sitar,
        name: 'Sitar',
        strings: [
            { note: Note.C, frequency: StandardFrequencies.C2 },
            { note: Note.G, frequency: StandardFrequencies.G2 },
            { note: Note.C, frequency: StandardFrequencies.C3 },
        ],
    },
];

export function frequencyToNote(frequency: number): { note: Note; cents: number } {
    const C0: number = FrequencyConstants.C0;
    const h: number = Math.round(12 * Math.log2(frequency / C0));
    const noteIndex: number = h % 12;
    const baseNotes: Note[] = [
        Note.C,
        Note.CSharp,
        Note.D,
        Note.DSharp,
        Note.E,
        Note.F,
        Note.FSharp,
        Note.G,
        Note.GSharp,
        Note.A,
        Note.ASharp,
        Note.B,
    ];
    const note: Note = baseNotes[noteIndex]!;

    const exactFrequency: number = C0 * Math.pow(2, h / 12);
    const cents: number = Math.round(1200 * Math.log2(frequency / exactFrequency));

    return { note, cents };
}

export function getDetectionStatus(cents: number): DetectionStatus {
    if (cents < DetectionThresholds.InTuneLow) {
        return DetectionStatus.TooLow;
    }

    if (cents > DetectionThresholds.InTuneHigh) {
        return DetectionStatus.TooHigh;
    }

    return DetectionStatus.InTune;
}

export function centsToPercentage(cents: number): number {
    return Math.min(100, Math.max(0, (cents + DetectionThresholds.CentRange) * 2));
}
