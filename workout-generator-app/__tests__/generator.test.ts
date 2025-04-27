import { generateMainBlocks } from "../lib/generator"
import { Template } from "../lib/constants"
import type { Zone } from "../lib/types"

const TOTAL_MIN = 60         // workout minutes (10 warm-up + 5 cool-down + 45 main)
const MAIN_MIN  = TOTAL_MIN - 15

const sumDur = (arr: { duration: number }[]) =>
  arr.reduce((s, b) => s + b.duration, 0)

describe("generateMainBlocks()", () => {
  it("Endurance → single steady block", () => {
    const blocks = generateMainBlocks("Z2" as Zone, TOTAL_MIN, "Endurance" as Template)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].label).toBe("Endurance")
    expect(sumDur(blocks)).toBe(MAIN_MIN)
  })

  it("Threshold → 5' / 3' intervals", () => {
    const blocks = generateMainBlocks("Z4" as Zone, TOTAL_MIN, "Threshold" as Template)
    const expectedPairs = Math.floor(MAIN_MIN / 8) // 5+3
    expect(blocks.length).toBe(expectedPairs * 2)
    expect(blocks[0].label).toBe("Work")
    expect(blocks[1].label).toBe("Rest")
    expect(sumDur(blocks)).toBe(expectedPairs * 8)
  })

  it("VO2 Max → 0.5' / 1.5' intervals", () => {
    const blocks = generateMainBlocks("Z5" as Zone, TOTAL_MIN, "VO2 Max" as Template)
    const expectedPairs = Math.floor(MAIN_MIN / 2) // 0.5+1.5
    expect(blocks.length).toBe(expectedPairs * 2)
    expect(blocks[0].label).toBe("VO2 On")
    expect(blocks[1].label).toBe("Recovery")
    expect(sumDur(blocks)).toBeCloseTo(expectedPairs * 2, 1)
  })
})
