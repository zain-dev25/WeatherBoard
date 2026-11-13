export function iconUrl(iconCode) {
  // OWM icon codes are directly usable on their CDN
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}