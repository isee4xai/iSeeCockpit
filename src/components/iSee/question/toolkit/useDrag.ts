import { useState } from 'react';
import type React from 'react';

const useDrag: <Type>(
  baseOptions: Type[],
  containerClass?: string,
  parentClass?: string,
) => [
  Type[],
  (dragEvent: any) => void,
  (dragEvent: any) => void,
  (dragEvent: any) => void,
  (options: Type[] | ((old: Type[]) => Type[])) => void,
] = <Type>(baseOptions: Type[], containerClass = 'container', parentClass = 'option-group') => {
  const [handle, setHandle] = useState<HTMLElement>();
  const [options, setOptions] = useState<Type[]>(baseOptions);
  let initialY: number;

  const getContainerfromChild: (child: HTMLElement, container: string) => HTMLElement = (
    child: HTMLElement,
    container,
  ) => {
    if (!child || child?.classList?.contains(container)) return child;
    return getContainerfromChild(child.parentNode as HTMLElement, container);
  };

  const handleStartDrag = (dragEvent: React.SyntheticEvent) => {
    if (!handle)
      setHandle(getContainerfromChild(dragEvent.target as HTMLElement, containerClass) ?? handle);

    if (!handle) return;

    (handle as HTMLElement).style.transform = 'translate(0px,0px)';
    initialY = handle.getBoundingClientRect().top;
    handle.style.zIndex = '99999';
  };

  const handleDrag = () => {
    if (!handle) return;

    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = handle.getAttribute('drag-index');
    const handleParent = getContainerfromChild(handle, parentClass);

    handleParent.querySelectorAll(`.${containerClass}`).forEach((element) => {
      const elementDragIndex = element.getAttribute('drag-index');
      const elementBounding = element.getBoundingClientRect();

      if (handleIndex == null) return;
      if (element.getAttribute('drag-index') === handleIndex) return;
      if (!elementDragIndex) return;

      (element as HTMLElement).style.zIndex = '0';
      (element as HTMLElement).style.transition = '.3s';
      let translation = '0';

      if (elementBounding.top < handlePosition.top && elementDragIndex > handleIndex) {
        // translation = -100;
        translation = `calc(${handlePosition.top - handlePosition.bottom}px)`;
      } else if (elementBounding.top > handlePosition.top && elementDragIndex < handleIndex) {
        translation = `calc(${-(handlePosition.top - handlePosition.bottom)}px)`;
      }
      (element as HTMLElement).style.transform = `translate(0, ${translation})`;
    });

    handle.style.zIndex = '99999';
  };

  const handleStopDrag = () => {
    if (!handle) return;

    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = parseInt(handle.getAttribute('drag-index') ?? '');
    const newArray = options.slice();
    const handleParent = getContainerfromChild(handle, parentClass);
    if (handleIndex === null || isNaN(handleIndex)) return;
    if (handlePosition.top === initialY) return;

    let containerList = 0;
    if (handleParent) {
      handleParent.querySelectorAll(`.${containerClass}`).forEach((element) => {
        if (element.getBoundingClientRect().top < handlePosition.top) containerList++;

        (element as HTMLElement).style.transition = '0s';
        (element as HTMLElement).style.transform = 'translate(0px,0px)';
        (element as HTMLElement).style.zIndex = '0';
      });
    }

    newArray.splice(handleIndex, 1);
    newArray.splice(containerList, 0, options[handleIndex]);

    setOptions(newArray);
    setHandle(undefined);
  };

  return [options, handleStartDrag, handleDrag, handleStopDrag, setOptions];
};

export default useDrag;
