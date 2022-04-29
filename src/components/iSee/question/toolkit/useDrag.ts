import { useState } from 'react';
import type React from 'react';

const useDrag: <Type>(
  baseOptions: Type[],
  containerClass?: string,
) => [
  Type[],
  (dragEvent: any) => void,
  (dragEvent: any) => void,
  (dragEvent: any) => void,
  (options: Type[] | ((old: Type[]) => Type[])) => void,
] = <Type>(baseOptions: Type[], containerClass = 'container') => {
  const [options, setOptions] = useState<Type[]>(baseOptions);
  const [handle, setHandle] = useState<HTMLElement>();

  let initialY: number;
  let initialZ: string;

  const getContainerfromChild: (child: HTMLElement) => HTMLElement = (child: HTMLElement) => {
    if (!child || child?.classList?.contains(containerClass)) return child;
    return getContainerfromChild(child.parentNode as HTMLElement);
  };

  const handleStartDrag = (dragEvent: React.SyntheticEvent) => {
    setHandle(getContainerfromChild(dragEvent.target as HTMLElement) ?? handle);

    console.log('drag - start ', handle);

    if (!handle) return;

    (handle as HTMLElement).style.transform = 'translate(0px,0px)';
    initialZ = (handle?.parentNode as HTMLElement)?.style?.zIndex;
    initialY = handle.getBoundingClientRect().top;
    handle.style.zIndex = '99999';
  };

  const handleDrag = () => {
    //param => dragEvent

    console.log('im fine');
    if (!handle) return;
    console.log('im not fine');
    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = handle.getAttribute('drag-index');

    document.querySelectorAll(`.${containerClass}`).forEach((element) => {
      const elementDragIndex = element.getAttribute('drag-index');
      const elementBounding = element.getBoundingClientRect();

      if (handleIndex == null) return;
      if (element.getAttribute('drag-index') === handleIndex) return;
      if (!elementDragIndex) return;

      (element as HTMLElement).style.transition = '.3s';
      let translation = 0;

      if (elementBounding.top < handlePosition.top && elementDragIndex > handleIndex) {
        translation = -100;
      } else if (elementBounding.top > handlePosition.top && elementDragIndex < handleIndex) {
        translation = 100;
      }
      (element as HTMLElement).style.transform = `translate(0, ${translation}%)`;
    });
  };

  const handleStopDrag = () => {
    // param => dragEvent

    if (!handle) return;

    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = parseInt(handle.getAttribute('drag-index') ?? '');
    const newArray = options.slice();

    if (handle) handle.style.zIndex = initialZ;
    if (handleIndex === null || isNaN(handleIndex)) return;
    if (handlePosition.top === initialY) return;

    const containerList: HTMLElement[] = [];
    document
      .querySelectorAll(`.${containerClass}`)
      .forEach((e) => containerList.push(e as HTMLElement));

    const newIndex = containerList.filter(
      (e) => e.getBoundingClientRect().top < handlePosition.top,
    ).length;

    newArray.splice(handleIndex, 1);
    newArray.splice(newIndex, 0, options[handleIndex]);

    document.querySelectorAll(`.${containerClass}`).forEach((element) => {
      (element as HTMLElement).style.transition = '0s';
      (element as HTMLElement).style.transform = 'translate(0px,0px)';
    });

    setOptions(newArray);
  };

  return [options, handleStartDrag, handleDrag, handleStopDrag, setOptions];
};

export default useDrag;
