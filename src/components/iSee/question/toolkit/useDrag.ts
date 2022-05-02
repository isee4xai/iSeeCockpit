import { useEffect, useState } from 'react';
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

  const scrollBy = 5;

  let initialY: number;

  const getContainerfromChild: (child: HTMLElement) => HTMLElement = (child: HTMLElement) => {
    if (!child || child?.classList?.contains(containerClass)) return child;
    return getContainerfromChild(child.parentNode as HTMLElement);
  };

  const handleStartDrag = (dragEvent: React.SyntheticEvent) => {
    setHandle(getContainerfromChild(dragEvent.target as HTMLElement) ?? handle);

    if (!handle) return;

    (handle as HTMLElement).style.transform = 'translate(0px,0px)';
    initialY = handle.getBoundingClientRect().top;
    handle.style.zIndex = '99999';
  };

  const handleDrag = () => {
    if (!handle) return;

    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = handle.getAttribute('drag-index');

    document.querySelectorAll(`.${containerClass}`).forEach((element) => {
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
        translation = `calc(${handlePosition.top - handlePosition.bottom}px - 1rem)`;
      } else if (elementBounding.top > handlePosition.top && elementDragIndex < handleIndex) {
        translation = `calc(${-(handlePosition.top - handlePosition.bottom)}px + 1rem)`;
      }
      (element as HTMLElement).style.transform = `translate(0, ${translation})`;
    });

    handle.style.zIndex = '99999';
  };

  const handleStopDrag = () => {
    // param => dragEvent

    if (!handle) return;

    const handlePosition = handle.getBoundingClientRect();
    const handleIndex = parseInt(handle.getAttribute('drag-index') ?? '');
    const newArray = options.slice();

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
      (element as HTMLElement).style.zIndex = '0';
    });

    setOptions(newArray);
    setHandle(undefined);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (handle) {
        const mouseY = event.clientY;
        const windowHeight = window.innerHeight;

        if (mouseY > windowHeight - 100) window.scrollBy(0, scrollBy);
        if (mouseY < 100) window.scrollBy(0, -scrollBy);
      }
    };

    addEventListener('mousemove', handleMouseMove);
    return () => {
      removeEventListener('mousemove', handleMouseMove);
    };
  }, [handle]);

  return [options, handleStartDrag, handleDrag, handleStopDrag, setOptions];
};

export default useDrag;
