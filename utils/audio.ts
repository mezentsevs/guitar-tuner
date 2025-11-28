import { FrequencyConstants, DetectionThresholds, AudioSettings } from '@/types/tuner'

export class AudioProcessor {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private dataArray: Float32Array | null = null
  private stream: MediaStream | null = null

  async initialize(): Promise<void> {
    try {
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = AudioSettings.FftSize
      this.dataArray = new Float32Array(this.analyser.frequencyBinCount)
      
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.microphone = this.audioContext.createMediaStreamSource(this.stream)
      this.microphone.connect(this.analyser)
    } catch (error) {
      throw new Error('Microphone access denied')
    }
  }

  getFrequency(): number | null {
    if (!this.analyser || !this.dataArray) return null

    /**
     * Using any is justified here due to TypeScript and Web Audio API type incompatibility
     * Web Audio API expects Float32Array<ArrayBuffer> but TypeScript's DOM types
     * define it as accepting Float32Array<ArrayBufferLike>. This is a known type
     * definition issue that doesn't affect runtime behavior.
     * We control the Float32Array creation and know it's correct at runtime.
     */
    this.analyser.getFloatTimeDomainData(this.dataArray as any)
    
    const sampleRate: number = this.audioContext?.sampleRate || 44100
    return this.autoCorrelate(this.dataArray, sampleRate)
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number | null {
    const size: number = buffer.length
    const maxSamples: number = Math.floor(size / DetectionThresholds.MaxSamplesDivisor)
    let bestOffset: number = -1
    let bestCorrelation: number = 0
    let rms: number = 0
    let foundGoodCorrelation: boolean = false

    for (let i = 0; i < size; i++) {
      const val: number = buffer[i]
      rms += val * val
    }
    rms = Math.sqrt(rms / size)
    if (rms < FrequencyConstants.RmsThreshold) return null

    let lastCorrelation: number = 1
    for (let offset = DetectionThresholds.InitialOffset; offset < maxSamples; offset++) {
      let correlation: number = 0

      for (let i = 0; i < maxSamples; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset])
      }

      correlation = 1 - correlation / maxSamples
      if (correlation > FrequencyConstants.GoodCorrelationThreshold && correlation > lastCorrelation) {
        foundGoodCorrelation = true
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestOffset = offset
        }
      } else if (foundGoodCorrelation) {
        break
      }
      lastCorrelation = correlation
    }

    if (bestCorrelation > FrequencyConstants.CorrelationThreshold) {
      return sampleRate / bestOffset
    }

    return null
  }

  stop(): void {
    this.stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    this.audioContext?.close()
  }
}

export class ReferenceAudio {
  private audioContext: AudioContext | null = null

  playFrequency(frequency: number, duration: number = AudioSettings.ReferenceNoteDuration): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext()
    }

    const oscillator: OscillatorNode = this.audioContext.createOscillator()
    const gainNode: GainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = AudioSettings.OscillatorType

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + AudioSettings.GainRampDuration)
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
  }
}
