import { useEffect, useRef } from "react";
import p5 from "p5";
import { useGetQuantityQuery } from "../services/waterApi.js"

export default function P5Sketch() {
  const sketchRef = useRef();

  const {
    data,
    error,
    isLoading,
  } = useGetQuantityQuery(undefined, {
    pollingInterval: 2000,
  });

  const quantity = data?.quantity_ml || 0;
  console.log(quantity);
  
  const mappedHeight = 400.0 - quantity/10000.0*400.0;
  useEffect(() => {
    let myP5;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(400, 400);
      };

      p.draw = () => {
        p.background(220);

        p.fill(0,0,255);
        p.rect(0,mappedHeight,400,400-mappedHeight);
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