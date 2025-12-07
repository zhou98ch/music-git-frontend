import React from "react";
import type { Take } from "../common/types";

export const SelectedTakePanel: React.FC<{ take: Take }> = ({ take }) => {
  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Take-Details</h3>

      <div>
        <strong>Aufgenommen:</strong>{" "}
        {new Date(take.recordedTime).toLocaleString()}
      </div>
      <div><strong>Bewertung:</strong> {take.evaluation}</div>

      {take.description && (
        <div style={{ marginTop: "8px" }}>
          <strong>Notiz:</strong> {take.description}
        </div>
      )}
    </div>
  );
};
