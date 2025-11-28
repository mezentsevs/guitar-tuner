import { AudioProcessor, ReferenceAudio } from '@/utils/audio'

export function useAudio() {
  const audioProcessor = ref<AudioProcessor | null>(null)
  const referenceAudio = ref<ReferenceAudio | null>(null)
  const isInitialized = ref<boolean>(false)

  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return

    audioProcessor.value = new AudioProcessor()
    referenceAudio.value = new ReferenceAudio()
    
    try {
      await audioProcessor.value.initialize()
      isInitialized.value = true
    } catch (error) {
      throw error
    }
  }

  const getCurrentFrequency = (): number | null => {
    return audioProcessor.value?.getFrequency() || null
  }

  const playReferenceNote = (frequency: number): void => {
    referenceAudio.value?.playFrequency(frequency)
  }

  const stop = (): void => {
    audioProcessor.value?.stop()
    isInitialized.value = false
  }

  onUnmounted((): void => {
    stop()
  })

  return {
    initialize,
    getCurrentFrequency,
    playReferenceNote,
    stop,
    isInitialized: readonly(isInitialized)
  }
}
