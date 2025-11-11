function pad(num: number) {
  return ('0' + num).slice(-2);
}

export default function mmss(secs: number) {
  let minutes = Math.floor(secs / 60);
  secs = secs % 60;
  return `${pad(minutes)}:${pad(secs)}`;
}
