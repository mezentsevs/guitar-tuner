import {
    DetectionStatus,
    DetectionThresholds,
    FrequencyConstants,
    Note,
    NoteNames,
    StandardFrequencies,
    TuningId,
    type Tuning,
} from '@/types/tuner';

export const PresetTunings: Tuning[] = [
    {
        id: TuningId.Standard,
        name: 'Standard E',
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
        id: TuningId.HalfStepDown,
        name: '½ Step Down',
        strings: [
            { note: Note.DSharp, frequency: StandardFrequencies.DSharp2 },
            { note: Note.GSharp, frequency: StandardFrequencies.GSharp2 },
            { note: Note.CSharp, frequency: StandardFrequencies.CSharp3 },
            { note: Note.FSharp, frequency: StandardFrequencies.FSharp3 },
            { note: Note.ASharp, frequency: StandardFrequencies.ASharp3 },
            { note: Note.DSharp, frequency: StandardFrequencies.DSharp4 },
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
];

export function frequencyToNote(frequency: number): { note: Note; cents: number } {
    const C0: number = FrequencyConstants.C0;
    const h: number = Math.round(12 * Math.log2(frequency / C0));
    const noteIndex: number = h % 12;
    const note: Note = NoteNames[noteIndex]!;

    const exactFrequency: number = C0 * Math.pow(2, h / 12);
    const cents: number = Math.round(1200 * Math.log2(frequency / exactFrequency));

    return { note, cents };
}

export function getDetectionStatus(cents: number): DetectionStatus {
    if (cents < DetectionThresholds.InTuneLow) return DetectionStatus.TooLow;
    if (cents > DetectionThresholds.InTuneHigh) return DetectionStatus.TooHigh;
    return DetectionStatus.InTune;
}

export function centsToPercentage(cents: number): number {
    return Math.min(100, Math.max(0, (cents + DetectionThresholds.CentRange) * 2));
}
