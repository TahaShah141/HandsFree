import { ReactNode, useEffect, useRef } from "react";

import Hammer from "hammerjs";

interface SwipeAreaProps {
  children: ReactNode;
  onSwipeLeft: (amount: number) => void;
  onSwipeRight: (amount: number) => void;
  onSwipeUp: (amount: number) => void;
  onSwipeDown: (amount: number) => void;
  isSwiping: boolean;
}

const SwipeArea: React.FC<SwipeAreaProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  isSwiping
}) => {
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swipeRef.current) return;

    const hammer = new Hammer(swipeRef.current);
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL });

    // if (!isSwiping) {
    //   // Enable normal scrolling while detecting swipes
    //   hammer.get("swipe").set({ enable: true });
    //   swipeRef.current.style.touchAction = "pan-y"; // Allows vertical scrolling
    // }

    // Function to calculate dynamic scroll amount based on velocity and distance
    const calculateScrollAmount = (velocity: number, distance: number) => {
      if (!isSwiping) return 0;
      
      const d = Math.abs(distance)
      const v = Math.abs(velocity/2)

      if (d < 200) return d/3;
      else return d*v + 20; // Limit max scroll
    };

    hammer.on("swipeleft", (event) => onSwipeLeft(calculateScrollAmount(event.velocityX, event.deltaX)));
    hammer.on("swiperight", (event) => onSwipeRight(calculateScrollAmount(event.velocityX, event.deltaX)));
    hammer.on("swipeup", (event) => onSwipeUp(calculateScrollAmount(event.velocityY, event.deltaY)));
    hammer.on("swipedown", (event) => onSwipeDown(calculateScrollAmount(event.velocityY, event.deltaY)));

    return () => hammer.destroy();
  }, [isSwiping, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div ref={swipeRef} className="mx-8 bg-black items-center justify-center">
      {children}
    </div>
  );
};

export default SwipeArea;