import { generateMainBlocks } from "../lib/generator"
import type { Zone } from "../lib/types"
import { Template } from "../lib/constants"

const TOTAL_MIN = 60               // 10′ warm-up + 45′ main + 5′ cool
const MAIN_MIN  = TOTAL_MIN - 15   // = 45

const sum = (arr: { duration: number }[]) =>
  arr.reduce((s, b) => s + b.duration, 0)

describe("generateMainBlocks()", () => {
  it("Endurance → single steady block", () => {
    const blocks = generateMainBlocks("Z2" as Zone, TOTAL_MIN, "Endurance" as Template)
    expect(blocks).toHaveLength(1)
    expect(blocks[0].label).toBe("Endurance")
    expect(sum(blocks)).toBe(MAIN_MIN)
  })

  it("Threshold → 5′/3′ intervals", () => {
    const blocks = generateMainBlocks("Z4" as Zone, TOTAL_MIN, "Threshold" as Template)
    const expectedPairs = Math.floor(MAIN_MIN / 8)      // 5 + 3
    expect(blocks.length).toBe(expectedPairs * 2)
    expect(blocks[0].label).toBe("Work")
    expect(blocks[1].label).toBe("Rest")
    expect(sum(blocks)).toBe(expectedPairs * 8)
  })

  it("VO2 Max → 0.5′/1.5′ intervals", () => {
    const blocks = generateMainBlocks("Z5" as Zone, TOTAL_MIN, "VO2 Max" as Template)
    const expectedPairs = Math.floor(MAIN_MIN / 2)      // 0.5 + 1.5
    expect(blocks.length).toBe(expectedPairs * 2)
    expect(blocks[0].label).toBe("VO2 On")
    expect(blocks[1].label).toBe("Recovery")
    expect(sum(blocks)).toBeCloseTo(expectedPairs * 2, 5)
  })
})