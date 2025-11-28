export enum DetectionStatus {
  TooLow = 'tooLow',
  TooHigh = 'tooHigh',
  InTune = 'inTune',
  Unstable = 'unstable',
}

export enum Note {
  C = 'C',
  CSharp = 'C#',
  D = 'D',
  DSharp = 'D#',
  E = 'E',
  F = 'F',
  FSharp = 'F#',
  G = 'G',
  GSharp = 'G#',
  A = 'A',
  ASharp = 'A#',
  B = 'B',
}

export enum TuningId {
  Standard = 'standard',
  DropD = 'drop-d',
  HalfStepDown = 'half-step-down',
  DropC = 'drop-c',
  OpenG = 'open-g',
}

export interface GuitarString {
  note: Note
  frequency: number
}

export interface Tuning {
  id: TuningId | string
  name: string
  strings: GuitarString[]
}

export const NoteNames: Note[] = [
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
]

export const FrequencyConstants = {
  A4: 440,
  C0: 16.35,
  MinDetection: 50,
  MaxDetection: 1000,
  RmsThreshold: 0.01,
  CorrelationThreshold: 0.01,
  GoodCorrelationThreshold: 0.9,
} as const

export const DetectionThresholds = {
  InTuneLow: -20,
  InTuneHigh: 20,
  CentRange: 50,
  MaxSamplesDivisor: 2,
  InitialOffset: 4,
} as const

export const StandardFrequencies = {
  E2: 82.41,
  A2: 110.0,
  D3: 146.83,
  G3: 196.0,
  B3: 246.94,
  E4: 329.63,
  D2: 73.42,
  DSharp2: 77.78,
  GSharp2: 103.83,
  CSharp3: 138.59,
  FSharp3: 185.0,
  ASharp3: 233.08,
  DSharp4: 311.13,
  C2: 65.41,
  G2: 98.0,
  C3: 130.81,
  F3: 174.61,
  A3: 220.0,
  D4: 293.66,
} as const

export const AudioSettings = {
  FftSize: 2048,
  OscillatorType: 'sine' as OscillatorType,
  GainRampDuration: 0.1,
  ReferenceNoteDuration: 2000,
  MinGain: 0.001,
  MaxGain: 0.3,
} as const

export const TuningPresets = {
  CustomPrefix: 'custom-',
  DefaultStringCount: 6,
} as const
