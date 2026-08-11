export const ET_TIMEZONE = 'America/New_York'

/**
 * Ondo GM session boundaries in minutes-of-day, Eastern Time (per Ondo docs:
 * premarket 4:01-9:29, regular 9:31-15:59, postmarket 16:01-19:59, overnight
 * 20:05-3:55). Overnight wraps midnight so it appears as two slots.
 */
export const SESSION_BOUNDS_ET = {
  overnightEarly: { start: 0, end: 235 },
  premarket: { start: 241, end: 569 },
  regular: { start: 571, end: 959 },
  postmarket: { start: 961, end: 1199 },
  overnightLate: { start: 1205, end: 1440 },
} as const

/**
 * Schematic bar geometry from the design: a 190px reference bar with 22px
 * caps (overnight tails), 4px gaps and three equal middle segments. The
 * timeline renders segments with the same flex proportions, so percentages
 * computed against this reference hold at any rendered width.
 */
const REFERENCE_BAR_WIDTH = 190
const CAP_WIDTH = 22
const SEGMENT_GAP = 4
const MIDDLE_SEGMENT_WIDTH =
  (REFERENCE_BAR_WIDTH - 2 * CAP_WIDTH - 4 * SEGMENT_GAP) / 3

const toPct = (px: number): number => (px / REFERENCE_BAR_WIDTH) * 100

interface TimelineSlot {
  startMinute: number
  endMinute: number
  startPct: number
  endPct: number
}

const buildTimelineSlots = (): TimelineSlot[] => {
  const slots: TimelineSlot[] = []
  let cursor = 0
  const push = (
    bounds: { start: number; end: number },
    widthPx: number,
  ): void => {
    slots.push({
      startMinute: bounds.start,
      endMinute: bounds.end,
      startPct: toPct(cursor),
      endPct: toPct(cursor + widthPx),
    })
    cursor += widthPx + SEGMENT_GAP
  }
  push(SESSION_BOUNDS_ET.overnightEarly, CAP_WIDTH)
  push(SESSION_BOUNDS_ET.premarket, MIDDLE_SEGMENT_WIDTH)
  push(SESSION_BOUNDS_ET.regular, MIDDLE_SEGMENT_WIDTH)
  push(SESSION_BOUNDS_ET.postmarket, MIDDLE_SEGMENT_WIDTH)
  push(SESSION_BOUNDS_ET.overnightLate, CAP_WIDTH)
  return slots
}

const TIMELINE_SLOTS = buildTimelineSlots()

/**
 * Position (0-100) of the "now" marker on the schematic bar for a given
 * ET minute-of-day. Inside a session the position interpolates linearly
 * within that session's slot; inside a transition gap it sits midway
 * between the surrounding slots.
 */
export const computeTimelineMarkerPct = (etMinuteOfDay: number): number => {
  for (const slot of TIMELINE_SLOTS) {
    if (etMinuteOfDay >= slot.startMinute && etMinuteOfDay <= slot.endMinute) {
      const sessionProgress =
        (etMinuteOfDay - slot.startMinute) / (slot.endMinute - slot.startMinute)
      return slot.startPct + sessionProgress * (slot.endPct - slot.startPct)
    }
  }
  for (let i = 0; i < TIMELINE_SLOTS.length - 1; i++) {
    const current = TIMELINE_SLOTS[i]
    const next = TIMELINE_SLOTS[i + 1]
    if (etMinuteOfDay > current.endMinute && etMinuteOfDay < next.startMinute) {
      return (current.endPct + next.startPct) / 2
    }
  }
  return 100
}

export interface EtNowInfo {
  minuteOfDay: number
  weekday: string
}

export const getEtNowInfo = (date: Date): EtNowInfo => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ET_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'short',
  }).formatToParts(date)
  const findPart = (type: string) =>
    parts.find(part => part.type === type)?.value || ''
  const hour = parseInt(findPart('hour'), 10) % 24
  const minute = parseInt(findPart('minute'), 10)
  return {
    minuteOfDay: hour * 60 + minute,
    weekday: findPart('weekday'),
  }
}

export const formatMinuteOfDay = (minuteOfDay: number): string => {
  const normalized = ((minuteOfDay % 1440) + 1440) % 1440
  const hour24 = Math.floor(normalized / 60)
  const minute = normalized % 60
  const period = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`
}

export type LocalSessionRanges = Record<
  'premarket' | 'regular' | 'postmarket' | 'overnight',
  string
>

/**
 * Session hour ranges converted from ET to the viewer's local time, for the
 * timeline hover tooltips (e.g. "5:01 AM → 10:29 AM" for a UTC-3 viewer).
 */
export const buildLocalSessionRanges = (date: Date): LocalSessionRanges => {
  const localMinuteOfDay = date.getHours() * 60 + date.getMinutes()
  const etMinuteOfDay = getEtNowInfo(date).minuteOfDay
  const offset = localMinuteOfDay - etMinuteOfDay
  const range = (bounds: { start: number; end: number }): string =>
    `${formatMinuteOfDay(bounds.start + offset)} → ${formatMinuteOfDay(bounds.end + offset)}`
  return {
    premarket: range(SESSION_BOUNDS_ET.premarket),
    regular: range(SESSION_BOUNDS_ET.regular),
    postmarket: range(SESSION_BOUNDS_ET.postmarket),
    overnight: range({
      start: SESSION_BOUNDS_ET.overnightLate.start,
      end: SESSION_BOUNDS_ET.overnightEarly.end,
    }),
  }
}
