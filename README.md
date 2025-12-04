# Guitar tuner

## Note on Future Development

Please be aware that this application is in active development. While the core tuning functionality and basic features have been thoroughly tested, the project is continuously evolving with planned improvements and additional capabilities. Future updates may introduce enhanced audio processing algorithms, support for more instruments, advanced visualization features, and refined user experience. If you encounter any issues, have suggestions for improvements, or would like to contribute to the project, your input is greatly appreciated - feel free to open an issue or pull request, and we can work together to make this tuner even better. Thank you for your understanding and support.

## About 'Guitar tuner'

This is a guitar tuner, written in and for educational and demonstrational purposes.

An online professional guitar tuner with real-time audio analysis - works directly in the browser without additional software installation. Provides precise tuning through microphone, intuitive interface, and support for various tunings.

Based on tech stack:
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML),
- [TypeScript](https://www.typescriptlang.org),
- [Nuxt](https://nuxt.com),
- [Vue](https://vuejs.org),
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS),
- [TailwindCss](https://tailwindcss.com).

## Features & Capabilities

### Core Tuning Modes
- Standard Guitar Tuning: EADGBE (6-string)
- Alternative Guitar Tunings: Drop D, DADGAD, Open G, Open D, Drop C, ½ Step Down, Open C
- Bass Guitar Support: 4-string and 5-string bass tunings
- Ukulele Tunings: Soprano, Concert, Tenor, and Baritone variations
- World Instruments: Balalaika, Domra, Shamisen, Oud, Sitar tunings
- Custom Tunings: Create, edit and save custom tunings for any string instrument

### Professional Features
- Real-Time Audio Analysis: Web Audio API with autocorrelation algorithm for precise frequency detection
- Visual Tuning Indicators: Color-coded feedback (blue - low, green - in tune, red - high)
- Cent-Based Precision: Deviation display in cents with moving indicator
- Reference Audio: Listen to correct pitch for each string
- Multi-Band Support: Configurable custom tunings
- Theme System: Light/dark modes
- Local Storage: All settings and custom tunings saved locally

### Advanced Algorithms
- Adaptive Frequency Detection: Different buffer sizes and thresholds for low/high frequencies
- Intelligent Success Detection: Plays confirmation sound after stable tuning
- Noise Filtering: Advanced signal processing with RMS thresholding
- Smooth Averaging: Weighted moving average for stable readings
- Octave Handling: Smart reference note generation across frequency ranges

## Getting Started (Nuxt Minimal Starter)

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Usage Scenarios

### Primary Use Cases
- Standard Guitar Tuning: Quick tuning of 6-string guitar in EADGBE
- Alternative Tunings: Switch between popular alternative guitar tunings
- Other Instruments: Tune bass guitars, ukuleles, and world instruments
- Custom Tunings: Create and use custom tunings for non-standard instruments
- Performance Use: Quick tuning checks during rehearsal or performance

### Technical Specifications
- Frequency Range: 0-2000 Hz detection
- Precision: ±1 cent resolution
- Audio Processing: 4096-point FFT with autocorrelation
- Responsive Design: Mobile-first adaptive interface
- Browser Support: Modern browsers with Web Audio API support
- Zero Installation: Works entirely in browser

## Technical Implementation

### Audio Processing
- Web Audio API: Microphone input and frequency analysis
- Autocorrelation Algorithm: Precise fundamental frequency detection
- Reference Tone Generation: Clean sine wave reference tones
- Noise Reduction: RMS-based silence detection

### State Management
- Reactive Composables: Modular state management with useTuner()
- Local Persistence: Automatic saving of custom tunings and preferences
- Real-Time Updates: Continuous audio analysis with requestAnimationFrame

### UI/UX Design
- Responsive Grid: Adaptive string layout for 1-10+ strings
- Visual Feedback: Color-coded status indicators
- Smooth Animations: CSS transitions for all interactive elements
- Accessibility: Semantic HTML and ARIA labels

## Browser Compatibility

Requires a modern browser with:
- [Web Audio API support](https://caniuse.com/audio-api)
- MediaDevices.getUserMedia()
- ES2022+ JavaScript features
- CSS Grid and Flexbox

Recommended browsers:
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

## Screenshots

<img width="1920" height="1200" alt="2025-12-03_20-04-25" src="https://github.com/user-attachments/assets/e04963e1-f184-4fc6-bdd7-9a3329cef2b1" />
<img width="1920" height="1200" alt="2025-12-03_20-05-32" src="https://github.com/user-attachments/assets/454ce8d4-56ff-4c89-8630-1f0d4e7ab853" />
<img width="1920" height="1200" alt="2025-12-03_20-06-51" src="https://github.com/user-attachments/assets/c8f109da-bef5-4e7d-a706-0d7a8def6bea" />
<img width="1920" height="1200" alt="2025-12-03_20-07-41" src="https://github.com/user-attachments/assets/88f8250a-90db-4923-b5d8-5e8c9126df70" />
<img width="1920" height="1200" alt="2025-12-03_20-10-03" src="https://github.com/user-attachments/assets/13f67113-2e28-4224-a6cd-2fd15b94112a" />
<img width="1920" height="1200" alt="2025-12-03_20-18-52" src="https://github.com/user-attachments/assets/ef6a0de0-1647-462d-ac6b-1b392db87708" />
<img width="1920" height="1200" alt="2025-12-03_23-21-33" src="https://github.com/user-attachments/assets/1b67ba25-f076-421c-affc-483e325b74ff" />
<img width="1920" height="1200" alt="2025-12-03_23-24-47" src="https://github.com/user-attachments/assets/1405ef8c-e659-41c8-a1d4-509dea4cecbd" />
<img width="1920" height="1200" alt="2025-12-03_23-29-11" src="https://github.com/user-attachments/assets/68b59c5e-b9d6-429e-ad6e-8c1a15e402b3" />
<img width="1920" height="1200" alt="2025-12-03_23-30-42" src="https://github.com/user-attachments/assets/47ee5bfa-7548-4454-8191-ba93ed60e32d" />
<img width="1920" height="1200" alt="2025-12-03_23-37-55" src="https://github.com/user-attachments/assets/c3979a3e-137f-499c-80d6-8ccd39e9f10f" />
<img width="1920" height="1200" alt="2025-12-03_23-40-12" src="https://github.com/user-attachments/assets/70076bb6-837c-4930-a119-612a3b375384" />
<img width="1920" height="1200" alt="2025-12-03_23-41-48" src="https://github.com/user-attachments/assets/5460fcab-c449-4da7-a5d7-c618652a0df6" />
<img width="1920" height="1200" alt="2025-12-03_23-43-20" src="https://github.com/user-attachments/assets/c2be48b6-6998-4f2d-8c33-ec21305769c2" />
<img width="1920" height="1200" alt="2025-12-03_23-45-27" src="https://github.com/user-attachments/assets/158298dd-6f43-4821-8046-fa19c4221678" />
<img width="1920" height="1200" alt="2025-12-03_23-46-40" src="https://github.com/user-attachments/assets/4b1e174b-14c5-4b7d-ae40-57f029009359" />

## License

The 'Guitar tuner' is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
