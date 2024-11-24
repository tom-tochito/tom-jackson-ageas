## Getting Started

First, clone the repo and install the dependencies:

```bash
npm install
```

Then, start the development server:

```bash
npm run dev
```

To run the tests:

```bash
npm run test
```

The app will be running on [http://localhost:5173](http://localhost:5173)

# Weather Forecast App

This web app was built with React and TypeScript and shows a detailed 5-day weather forecasts based on the city you search for. The app uses the Open-Meteo API to fetch realtime weather data, which is then mapped and displayed.

The UI has a smart search bar with location auto-complete, and each weather card displays comprehensive information regarding the weather. The weather conditions are represented by custom SVG icons that match the current weather state.

CSS Modules was used for styling and smooth animations - cards animate on hover with subtle elevation changes, and weather data transitions smoothly when new locations are selected. The app is fully responsive so can work nicely on all devices and adds accessibility features.

I used TypeScript for type safety, CSS Modules for style encapsulation, and Vitest and jest for testing.

Hope you enjoy using it and looking forward to your feedback!


