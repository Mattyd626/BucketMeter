import { useEffect, useRef } from "react";
import p5 from "p5";

export default function P5Sketch() {
  const sketchRef = useRef();

  useEffect(() => {
    let myP5;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(400, 400);
      };

      p.draw = () => {
        p.background(220);

        p.fill(255, 0, 0);
        p.circle(p.mouseX, p.mouseY, 50);
      };
    };

    myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return <div ref={sketchRef} />;
}