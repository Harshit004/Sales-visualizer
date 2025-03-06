import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#0ea5e9",
        borderRadius: "8px",
      }}
    >
      S
    </div>,
    {
      width: 32,
      height: 32,
    },
  )
}

