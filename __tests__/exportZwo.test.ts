import { buildZwoXml } from "../lib/exportZwo"
import { WorkoutBlock } from "../lib/types"

describe('buildZwoXml', () => {
  it('generates valid Zwift XML for a sample workout', () => {
    const blocks: WorkoutBlock[] = [
      { label: 'Warm-up', duration: 5, ftp: 0.5, color: '' },
      { label: 'Work',    duration: 10, ftp: 1.0, color: '' },
      { label: 'Cool-down', duration: 5, ftp: 0.5, color: '' },
    ]
    const ftp = 200
    const xml = buildZwoXml('Test', blocks, ftp)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<workout_file>')
    expect(xml).toContain('<name>Test</name>')
    // Warm-up: 5min = 300s at 100W
    expect(xml).toContain('<Warmup Duration="300" PowerLow="100" PowerHigh="100" />')
    // Work: 10min = 600s at 200W
    expect(xml).toContain('<SteadyState Duration="600" PowerLow="200" PowerHigh="200" />')
    // Cool-down: same as warm-up
    expect(xml).toContain('<Cooldown Duration="300" PowerLow="100" PowerHigh="100" />')
    expect(xml).toContain('</workout_file>')
  })
})