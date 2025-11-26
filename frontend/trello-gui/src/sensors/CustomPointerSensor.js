import { PointerSensor as LibPointerSensor } from '@dnd-kit/core';

function shouldHandleEvent(element) {
  let current = element;
  while (current && current instanceof HTMLElement) {
    const dataset = current.dataset;
    if (dataset && dataset.noDnd && dataset.noDnd !== 'false') {
      // Any ancestor flagged with data-no-dnd disables drag entirely
      return false;
    }
    current = current.parentElement;
  }
  return true;
}

function focusIfInteractive(target) {
  if (!(target instanceof HTMLElement)) return;
  const tag = target.tagName;
  const isInteractive =
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable;
  if (isInteractive && typeof target.focus === 'function') {
    target.focus();
  }
}

export class CustomPointerSensor extends LibPointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: (event) => {
        const target = event?.target;
        // Ensure clicks on inputs still focus before drag logic
        focusIfInteractive(target);
        // Allow drag unless an ancestor opts out via data-no-dnd
        return shouldHandleEvent(target);
      },
    },
  ];
}

export default CustomPointerSensor;
