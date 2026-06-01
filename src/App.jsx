import { Button } from "@mui/material";
import P5Sketch from "./components/P5Sketch";
import { useSetEmptyMutation } from "./services/waterApi";

function App() {

  const [triggerEmpty] = useSetEmptyMutation({});

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "auto",
          height: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <Button
          sx={{
            background: "#173586"
          }}
          onClick={() => {
            triggerEmpty();
          }}
        >{"Empty 🪣"}</Button>
        <P5Sketch />
      </div>
    </div>
  );
}

export default App;