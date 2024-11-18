export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /android|iPhone|iPad|iPod|blackberry|windows phone|mobile/i.test(
    userAgent
  );
}
