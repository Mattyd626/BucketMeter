import { useEffect, useRef } from "react";
import p5 from "p5";
import { useGetQuantityQuery } from "../services/waterApi.js";

export default function P5Sketch() {
  const sketchRef = useRef();
  const quantityRef = useRef(0);

  const { data } = useGetQuantityQuery(undefined, {
    pollingInterval: 2000,
  });

  // Update quantity without recreating p5
  useEffect(() => {
    quantityRef.current = data?.quantity || 0;
  }, [data]);

  useEffect(() => {
    let myP5;

    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.style("display", "block");
      };

      p.draw = () => {
        p.background(220);

        const quantity = quantityRef.current;

        const mappedHeight =
          400 - (quantity / 10000) * 400;

        // Water
        p.fill(0, 0, 255);
        p.rect(
          0,
          mappedHeight,
          400,
          400 - mappedHeight
        );

        // Mouse circle
        p.fill(255, 0, 0);
        p.circle(p.mouseX, p.mouseY, 50);
      };
    };

    myP5 = new p5(sketch, sketchRef.current);

    return () => {
      myP5.remove();
    };
  }, []);

  return (
    <div
      ref={sketchRef}
      style={{
        width: "400px",
        height: "400px",
      }}
    />
  );
}