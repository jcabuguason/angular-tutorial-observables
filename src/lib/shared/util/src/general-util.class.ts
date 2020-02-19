export const modifiedOrBlank = (str, callback) => (!!str ? callback(str) : '');

export const range = (start, end) => Array.from({ length: end + 1 - start }, (v, k) => k + start);

export const copyToClipboard = (text: string) => {
  const copyEventListener = (event: ClipboardEvent) => {
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  };
  document.addEventListener('copy', copyEventListener);
  document.execCommand('copy');
  document.removeEventListener('copy', copyEventListener);
};
