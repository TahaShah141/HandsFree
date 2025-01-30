import { useEffect, useRef, ReactNode } from "react";
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

    if (!isSwiping) {
      // Enable normal scrolling while detecting swipes
      hammer.get("swipe").set({ enable: true });
      swipeRef.current.style.touchAction = "pan-y"; // Allows vertical scrolling
    }

    // Function to calculate dynamic scroll amount based on swipe velocity
    const calculateScrollAmount = (velocity: number) => {
      const scalingFactor = 25;
      return Math.min(Math.abs(velocity * scalingFactor), 500); // Limit max scroll
    };

    hammer.on("swipeleft", (event) => onSwipeLeft(calculateScrollAmount(event.velocityX)));
    hammer.on("swiperight", (event) => onSwipeRight(calculateScrollAmount(event.velocityX)));
    hammer.on("swipeup", (event) => onSwipeUp(calculateScrollAmount(event.velocityY)));
    hammer.on("swipedown", (event) => onSwipeDown(calculateScrollAmount(event.velocityY)));

    return () => hammer.destroy();
  }, [isSwiping, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div ref={swipeRef} className={`p-2 items-center justify-center`}>
      {children}
    </div>
  );
};

export default SwipeArea;