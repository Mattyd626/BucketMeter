import { useEffect, useRef } from "react";
import p5 from "p5";
import { useGetQuantityQuery } from "../services/waterApi.js";

export default function P5Sketch() {
  const sketchRef = useRef();
  const quantityRef = useRef(0);

  const { data } = useGetQuantityQuery(undefined, {
    pollingInterval: 2000,
  });

  useEffect(() => {
    quantityRef.current = data?.quantity || 0;
  }, [data]);

  useEffect(() => {
    let myP5;

    const sketch = (p) => {
      let quantity = 0;
      p.setup = () => {
        const canvas = p.createCanvas(400, 400);
        canvas.style("display", "block");
      };

      p.draw = () => {
        p.clear();
        quantity = p.lerp(quantity,quantityRef.current,0.1);

        const mappedHeight =
          400 - (quantity / 10000) * 400;

        p.fill(0, 0, 255);
        p.noStroke();
        p.beginShape(p.QUAD_STRIP);

        var waveSize = p.map(quantity,0.0,10000.0,0.0,1.2) * 500.0;

        for(var i = 0; i < 101; i++){
          var x = p.map(i,0,100,0,p.width);
          var h = p.map(p.map(p.noise(i/32.0+p.millis()/200.0),0,1,quantity-waveSize,quantity+waveSize),0,10000,0,p.height);
          p.vertex(x,p.height-h);
          p.vertex(x,p.height);
        }
        p.endShape();
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