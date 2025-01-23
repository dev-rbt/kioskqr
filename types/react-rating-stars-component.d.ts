declare module 'react-rating-stars-component' {
  interface ReactStarsProps {
    count?: number;
    value?: number;
    char?: string;
    color?: string;
    activeColor?: string;
    size?: number;
    edit?: boolean;
    isHalf?: boolean;
    emptyIcon?: React.ReactNode;
    halfIcon?: React.ReactNode;
    filledIcon?: React.ReactNode;
    a11y?: boolean;
    onChange?: (newValue: number) => void;
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
}
