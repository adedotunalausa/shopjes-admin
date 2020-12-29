function debounce(func: any, wait: number, immediate: any) {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(this: any, ...args: any[]) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout!);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

export default debounce;
