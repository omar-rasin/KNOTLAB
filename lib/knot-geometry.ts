// Safe math evaluation function
function evaluateExpression(expression: string, t: number): number {
  try {
    // Replace mathematical functions and constants
    const expr = expression
      .replace(/\bt\b/g, t.toString())
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/pow/g, "Math.pow")
      .replace(/abs/g, "Math.abs")
      .replace(/pi/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/\*/g, "*")

    // Use Function constructor for safe evaluation
    const func = new Function("return " + expr)
    const result = func()

    // Check for valid number
    if (typeof result !== "number" || !isFinite(result)) {
      throw new Error("Invalid result")
    }

    return result
  } catch (error) {
    console.warn(`Error evaluating expression "${expression}" at t=${t}:`, error)
    return 0
  }
}

// Parametric equations for predefined knots
const knotEquations: Record<string, any> = {
  trefoil: {
    x: "sin(t) + 2*sin(2*t)",
    y: "cos(t) - 2*cos(2*t)",
    z: "-sin(3*t)",
  },
  "figure-eight": {
    x: "(2 + cos(2*t)) * cos(3*t)",
    y: "(2 + cos(2*t)) * sin(3*t)",
    z: "sin(4*t)",
  },
  cinquefoil: {
    x: "cos(2*t) * (3 + cos(5*t))",
    y: "sin(2*t) * (3 + cos(5*t))",
    z: "sin(5*t)",
  },
  "hopf-link": {
    x: "cos(t) * (2 + cos(2*t))",
    y: "sin(t) * (2 + cos(2*t))",
    z: "sin(2*t)",
  },
  "torus-knot": {
    x: "cos(2*t) * (3 + cos(7*t))",
    y: "sin(2*t) * (3 + cos(7*t))",
    z: "sin(7*t)",
  },
}

export function generateKnotPoints(knotType: string, customEquations?: any, segments = 400): any[] {
  // This function is now simplified for server-side compatibility
  // The actual Three.js implementation is in the component
  return []
}

// Detect self-intersections in a curve (simplified)
export function detectSelfIntersections(points: any[], tolerance = 0.1): Array<{ index1: number; index2: number }> {
  return []
}
