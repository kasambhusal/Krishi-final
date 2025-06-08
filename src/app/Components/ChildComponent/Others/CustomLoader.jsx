"use client"

const CustomLoader = ({ size = 20, color = "#22c55e", className = "" }) => {
  const borderWidth = Math.max(2, size / 10)

  return (
    <div
      className={`inline-block rounded-full animate-spin ${className}`}
      style={{
        width: size,
        height: size,
        border: `${borderWidth}px solid ${color}20`,
        borderTop: `${borderWidth}px solid ${color}`,
      }}
      role="status"
      aria-label="Loading"
    />
  )
}

export default CustomLoader
