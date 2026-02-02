"use client";

type OutfitType = "casual" | "street" | "formal" | "sporty";

interface ClothingControlsProps {
  currentOutfit: OutfitType;
  onOutfitChange: (outfit: OutfitType) => void;
  rotationSpeed: number;
  onRotationSpeedChange: (speed: number) => void;
  selectedItem: string | null;
  onItemSelect: (item: string | null) => void;
}

export function ClothingControls({
  currentOutfit,
  onOutfitChange,
  rotationSpeed,
  onRotationSpeedChange,
  selectedItem,
  onItemSelect
}: ClothingControlsProps) {
  const outfits: { id: OutfitType; name: string; emoji: string; desc: string }[] = [
    { id: "casual", name: "Casual", emoji: "👟", desc: "Everyday comfort" },
    { id: "street", name: "Street", emoji: "🔥", desc: "Urban style" },
    { id: "formal", name: "Formal", emoji: "🎩", desc: "Business ready" },
    { id: "sporty", name: "Sporty", emoji: "⚡", desc: "Active wear" }
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      zIndex: 1000
    }}>
      <div style={{
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minWidth: "400px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "12px"
        }}>
          <div>
            <h3 style={{
              margin: 0,
              color: "white",
              fontFamily: "system-ui",
              fontSize: "18px",
              fontWeight: "600"
            }}>
              Wardrobe System 👔
            </h3>
            <p style={{
              margin: "4px 0 0 0",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "system-ui",
              fontSize: "12px"
            }}>
              Click items to inspect • Drag to rotate
            </p>
          </div>
          
          {selectedItem && (
            <button
              onClick={() => onItemSelect(null)}
              style={{
                background: "rgba(255, 51, 102, 0.9)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "system-ui",
                fontWeight: "600"
              }}
            >
              ✕ Clear Selection
            </button>
          )}
        </div>

        <div>
          <label style={{
            display: "block",
            color: "rgba(255,255,255,0.8)",
            fontFamily: "system-ui",
            fontSize: "14px",
            marginBottom: "8px",
            fontWeight: "500"
          }}>
            Select Outfit Style
          </label>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "8px"
          }}>
            {outfits.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => onOutfitChange(outfit.id)}
                style={{
                  background: currentOutfit === outfit.id 
                    ? "linear-gradient(135deg, #ff3366, #ff6b6b)" 
                    : "rgba(255,255,255,0.1)",
                  color: "white",
                  border: currentOutfit === outfit.id 
                    ? "2px solid #ff3366" 
                    : "2px solid transparent",
                  padding: "12px 8px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontFamily: "system-ui",
                  fontSize: "13px",
                  fontWeight: currentOutfit === outfit.id ? "600" : "400",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span style={{ fontSize: "24px" }}>{outfit.emoji}</span>
                <span>{outfit.name}</span>
                <span style={{ 
                  fontSize: "10px", 
                  opacity: 0.7,
                  fontWeight: "normal"
                }}>
                  {outfit.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
          }}>
            <label style={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Rotation Speed
            </label>
            <span style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "system-ui",
              fontSize: "12px"
            }}>
              {rotationSpeed.toFixed(1)}x
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => onRotationSpeedChange(parseFloat(e.target.value))}
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.2)",
              outline: "none",
              WebkitAppearance: "none",
              cursor: "pointer"
            }}
          />
        </div>

        {selectedItem && (
          <div style={{
            background: "rgba(255, 51, 102, 0.15)",
            border: "1px solid rgba(255, 51, 102, 0.3)",
            borderRadius: "12px",
            padding: "12px"
          }}>
            <div style={{
              color: "#ff3366",
              fontFamily: "system-ui",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "4px"
            }}>
              Currently Inspecting
            </div>
            <div style={{
              color: "white",
              fontFamily: "system-ui",
              fontSize: "16px",
              textTransform: "capitalize"
            }}>
              {selectedItem}
            </div>
          </div>
        )}
      </div>

      <div style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center"
      }}>
        {["jacket", "shirt", "pants", "sneakers"].map((item) => (
          <button
            key={item}
            onClick={() => onItemSelect(item)}
            style={{
              background: selectedItem === item 
                ? "rgba(255, 51, 102, 0.9)" 
                : "rgba(0,0,0,0.6)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontFamily: "system-ui",
              fontSize: "12px",
              textTransform: "capitalize",
              fontWeight: selectedItem === item ? "600" : "400"
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
