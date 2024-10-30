export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iPhone|iPad|iPod|blackberry|windows phone|mobile/i.test(
    userAgent
  );
}
