import { PresetTunings, frequencyToNote, getDetectionStatus } from '@/utils/frequency'
import { type Tuning, TuningPresets, FrequencyConstants, DetectionStatus } from '@/types/tuner'
import { useAudio } from './useAudio'

export function useTuner() {
  const { initialize, getCurrentFrequency, playReferenceNote, isInitialized } = useAudio()
  
  const currentTuning = ref<Tuning>(PresetTunings[0]!)
  const customTunings = ref<Tuning[]>([])
  const activeStringIndex = ref<number>(0)
  
  const currentFrequency = ref<number>(0)
  const currentNote = ref<string>('')
  const deviation = ref<number>(0)
  const isListening = ref<boolean>(false)
  const detectionStatus = ref<DetectionStatus>(DetectionStatus.Unstable)
  
  let animationFrameId: number

  const allTunings = computed((): Tuning[] => [...PresetTunings, ...customTunings.value])

  const activeString = computed((): Tuning['strings'][0] => currentTuning.value.strings[activeStringIndex.value])

  const startListening = async (): Promise<void> => {
    if (!isInitialized.value) {
      await initialize()
    }
    isListening.value = true
    analyzeAudio()
  }

  const stopListening = (): void => {
    isListening.value = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }

  const analyzeAudio = (): void => {
    if (!isListening.value) return

    const frequency: number | null = getCurrentFrequency()
    
    if (frequency && frequency > FrequencyConstants.MinDetection && frequency < FrequencyConstants.MaxDetection) {
      currentFrequency.value = frequency
      const { note, cents } = frequencyToNote(frequency)
      currentNote.value = note
      deviation.value = cents
      detectionStatus.value = getDetectionStatus(cents)
    }

    animationFrameId = requestAnimationFrame(analyzeAudio)
  }

  const selectString = (index: number): void => {
    activeStringIndex.value = index
    currentFrequency.value = 0
    deviation.value = 0
    detectionStatus.value = DetectionStatus.Unstable
  }

  const playActiveString = (): void => {
    playReferenceNote(activeString.value.frequency)
  }

  const addCustomTuning = (tuning: Tuning): void => {
    customTunings.value.push({
      ...tuning,
      id: `${TuningPresets.CustomPrefix}${Date.now()}`
    })
  }

  const selectTuning = (tuningId: string): void => {
    const tuning: Tuning | undefined = allTunings.value.find((t: Tuning) => t.id === tuningId)
    if (tuning) {
      currentTuning.value = tuning
      selectString(0)
    }
  }

  onUnmounted((): void => {
    stopListening()
  })

  return {
    currentTuning: readonly(currentTuning),
    allTunings: readonly(allTunings),
    activeStringIndex: readonly(activeStringIndex),
    currentFrequency: readonly(currentFrequency),
    currentNote: readonly(currentNote),
    deviation: readonly(deviation),
    isListening: readonly(isListening),
    detectionStatus: readonly(detectionStatus),
    activeString: readonly(activeString),
    
    startListening,
    stopListening,
    selectString,
    playActiveString,
    addCustomTuning,
    selectTuning
  }
}
