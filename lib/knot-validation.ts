import type { KnotEquations } from "@/components/advanced-knot-visualizer"

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// List of allowed mathematical functions and operators
const allowedTokens = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sinh",
  "cosh",
  "tanh",
  "sqrt",
  "pow",
  "abs",
  "floor",
  "ceil",
  "round",
  "exp",
  "log",
  "log10",
  "pi",
  "e",
  "t", // parameter variable
  "+",
  "-",
  "*",
  "/",
  "^",
  "(",
  ")",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  " ", // whitespace
]

export function validateKnotEquations(equations: KnotEquations): ValidationResult {
  const errors: string[] = []

  // Basic validation
  Object.entries(equations).forEach(([axis, equation]) => {
    if (!equation || typeof equation !== "string" || equation.trim() === "") {
      errors.push(`${axis.toUpperCase()} equation cannot be empty`)
    }
  })

  // Validate each equation
  Object.entries(equations).forEach(([axis, equation]) => {
    const axisErrors = validateSingleEquation(equation as string, axis)
    errors.push(...axisErrors)
  })

  // Check for periodicity (equations should ideally be periodic)
  const periodicityWarnings = checkPeriodicity(equations)
  errors.push(...periodicityWarnings)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

function validateSingleEquation(equation: string, axis: string): string[] {
  const errors: string[] = []

  if (!equation || equation.trim() === "") {
    errors.push(`${axis.toUpperCase()} equation cannot be empty`)
    return errors
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/i,
    /function\s*\(/i,
    /=>/,
    /\bthis\b/,
    /\bwindow\b/,
    /\bdocument\b/,
    /\balert\b/,
    /\bconsole\b/,
    /\bsetTimeout\b/,
    /\bsetInterval\b/,
  ]

  dangerousPatterns.forEach((pattern) => {
    if (pattern.test(equation)) {
      errors.push(`${axis.toUpperCase()} equation contains potentially dangerous code`)
    }
  })

  // Check for balanced parentheses
  let parenCount = 0
  for (const char of equation) {
    if (char === "(") parenCount++
    if (char === ")") parenCount--
    if (parenCount < 0) {
      errors.push(`${axis.toUpperCase()} equation has unbalanced parentheses`)
      break
    }
  }
  if (parenCount !== 0) {
    errors.push(`${axis.toUpperCase()} equation has unbalanced parentheses`)
  }

  // Test evaluation at a few points
  try {
    for (const testT of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      const result = evaluateEquationSafely(equation, testT)
      if (!isFinite(result)) {
        errors.push(`${axis.toUpperCase()} equation produces invalid values`)
        break
      }
    }
  } catch (error) {
    errors.push(`${axis.toUpperCase()} equation cannot be evaluated: ${error}`)
  }

  return errors
}

function evaluateEquationSafely(equation: string, t: number): number {
  // Replace mathematical functions and the parameter
  const expr = equation
    .replace(/\bt\b/g, t.toString())
    .replace(/\bsin\b/g, "Math.sin")
    .replace(/\bcos\b/g, "Math.cos")
    .replace(/\btan\b/g, "Math.tan")
    .replace(/\bsqrt\b/g, "Math.sqrt")
    .replace(/\bpow\b/g, "Math.pow")
    .replace(/\babs\b/g, "Math.abs")
    .replace(/\bpi\b/g, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\^/g, "**") // Convert ^ to ** for exponentiation

  // Use Function constructor for evaluation (safer than eval)
  const func = new Function("return " + expr)
  return func()
}

function checkPeriodicity(equations: KnotEquations): string[] {
  const warnings: string[] = []

  try {
    // Check if f(0) ≈ f(2π) for each equation
    const tolerance = 0.01

    Object.entries(equations).forEach(([axis, equation]) => {
      const value0 = evaluateEquationSafely(equation, 0)
      const value2Pi = evaluateEquationSafely(equation, 2 * Math.PI)

      if (Math.abs(value0 - value2Pi) > tolerance) {
        warnings.push(`${axis.toUpperCase()} equation may not be periodic (curve might not close)`)
      }
    })
  } catch (error) {
    // If we can't evaluate, we've already caught this in the main validation
  }

  return warnings
}

// Additional validation for mathematical correctness
export function validateMathematicalProperties(equations: KnotEquations): ValidationResult {
  const errors: string[] = []

  try {
    // Generate a few points to check basic properties
    const testPoints: Array<{ x: number; y: number; z: number }> = []

    for (let i = 0; i < 10; i++) {
      const t = (i / 10) * 2 * Math.PI
      const x = evaluateEquationSafely(equations.x, t)
      const y = evaluateEquationSafely(equations.y, t)
      const z = evaluateEquationSafely(equations.z, t)

      testPoints.push({ x, y, z })
    }

    // Check if all points are the same (degenerate case)
    const firstPoint = testPoints[0]
    const allSame = testPoints.every(
      (p) =>
        Math.abs(p.x - firstPoint.x) < 0.001 &&
        Math.abs(p.y - firstPoint.y) < 0.001 &&
        Math.abs(p.z - firstPoint.z) < 0.001,
    )

    if (allSame) {
      errors.push("Equations produce a degenerate curve (all points are the same)")
    }

    // Check for extremely large values
    const maxValue = 1000
    testPoints.forEach((point, index) => {
      if (Math.abs(point.x) > maxValue || Math.abs(point.y) > maxValue || Math.abs(point.z) > maxValue) {
        errors.push("Equations produce extremely large values that may cause rendering issues")
        return
      }
    })
  } catch (error) {
    errors.push("Cannot validate mathematical properties due to evaluation errors")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
