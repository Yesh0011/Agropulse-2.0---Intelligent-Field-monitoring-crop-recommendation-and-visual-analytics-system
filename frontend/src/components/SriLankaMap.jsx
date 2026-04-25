import { useEffect, useRef, useState } from "react";

function SriLankaMap({ selectedDistrict, onSelect }) {
  const objectRef = useRef(null);
  const [hovered, setHovered] = useState("");

useEffect(() => {
  const objectEl = objectRef.current;
  if (!objectEl) return;

  const applyMapLogic = () => {
    const svgDoc = objectEl.contentDocument;
    if (!svgDoc) return;

    const svg = svgDoc.querySelector("svg");

    if (!svg) return;

    // 🔥 GLOBAL CLICK HANDLER (KEY FIX)
    svg.addEventListener("click", (e) => {
      let target = e.target;

      // climb up until path
      while (target && target.tagName !== "path") {
        target = target.parentNode;
      }

      if (!target) return;

      const districtName = target.getAttribute("name");

      if (!districtName) return;

      console.log("Clicked:", districtName);

      onSelect(districtName);
    });

    // 🎨 STYLE UPDATE
    const paths = svgDoc.querySelectorAll("path[name]");

    paths.forEach((path) => {
      const name = path.getAttribute("name");

      const isSelected = name === selectedDistrict;

      path.style.fill = isSelected ? "#16a34a" : "#bbf7d0";
      path.style.stroke = "#064e3b";
      path.style.strokeWidth = "1.5";
      path.style.cursor = "pointer";
      path.style.transition = "0.25s ease";

      path.onmouseenter = () => {
        setHovered(name);
        path.style.fill = "#22c55e";
      };

      path.onmouseleave = () => {
        setHovered("");
        path.style.fill =
          name === selectedDistrict ? "#16a34a" : "#bbf7d0";
      };
    });
  };

  objectEl.addEventListener("load", applyMapLogic);
  applyMapLogic();

  return () => {
    objectEl.removeEventListener("load", applyMapLogic);
  };
}, [selectedDistrict]);
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.title}>🗺️ Select District</h3>

      <p style={styles.selected}>
        Selected: <b>{hovered || selectedDistrict}</b>
      </p>

      <object
        ref={objectRef}
        type="image/svg+xml"
        data="/maps/srilanka.svg"
        style={styles.map}
      />
    </div>
  );
}

export default SriLankaMap;

const styles = {
  wrapper: {
    marginTop: 30,
    padding: 24,
    borderRadius: 24,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(187,247,208,0.3)",
    textAlign: "center",
    position: "relative",
    zIndex: 2
  },

  title: {
    margin: 0,
    color: "#ecfdf5",
    fontWeight: 900
  },

  selected: {
    margin: "10px 0 16px",
    color: "#bbf7d0",
    fontWeight: 700
  },

  map: {
    width: "100%",
    maxWidth: "420px",
    height: "640px",
    display: "block",
    margin: "0 auto",
    border: "none"
  }
};