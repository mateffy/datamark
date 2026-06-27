import { describe, test, expect } from "bun:test";
import { MeetingNotesFormat, meetingNotesMarkdown } from "./meeting-notes";

describe("meeting-notes example", () => {
  test("parses title and date", () => {
    const result = MeetingNotesFormat.parse(meetingNotesMarkdown);
    expect(result.title).toBe("Sprint Planning — 2026-06-20");
    expect(result.date).toBe("2026-06-20");
  });

  test("parses attendees", () => {
    const result = MeetingNotesFormat.parse(meetingNotesMarkdown);
    expect(result.attendees).toHaveLength(3);
    expect(result.attendees[0]).toBe("Alice (Engineering)");
  });

  test("parses agenda", () => {
    const result = MeetingNotesFormat.parse(meetingNotesMarkdown);
    expect(result.agenda).toHaveLength(3);
    expect(result.agenda[0]).toBe("Review last sprint");
  });

  test("parses action items with owners", () => {
    const result = MeetingNotesFormat.parse(meetingNotesMarkdown);
    expect(result.actionItems).toHaveLength(3);
    expect(result.actionItems[0].owner).toBe("Alice");
    expect(result.actionItems[0].text).toBe("Set up CI pipeline");
    expect(result.actionItems[0].completed).toBe(false);
    expect(result.actionItems[1].completed).toBe(true);
  });

  test("round-trips through stringify", () => {
    const data = MeetingNotesFormat.parse(meetingNotesMarkdown);
    const md = MeetingNotesFormat.stringify(data);
    expect(md).toContain("# Sprint Planning");
    expect(md).toContain("Alice: Set up CI pipeline");
  });
});
