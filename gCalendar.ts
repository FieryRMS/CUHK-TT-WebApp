/**
 * @todo: https://developers.google.com/calendar/api/v3/reference/events
 * colorId: make sure same classes have same color; decide using CRSE_ID
 * description: can contain html; STRM_DESCR, DESCR, CATALOG_NBR, FDESCR, INSTRUCTORS, COMDESC CLASS_SECTION
 *              p.s. html causes issues sometimes. (maybe make it optional?)
 * end.dateTime: START_DT + MEETING_TIME_END
 * end.timeZone: "Asia/Hong_Kong"
 * location: LAT LNG
 * recurrence[]:  END_DT, MON, TUES, WED, THURS, FRI, SAT, SUN
 * start.dateTime: START_DT + MEETING_TIME_START
 * start.timeZone: "Asia/Hong_Kong"
 * summary: SUBJECT CATALOG_NBR FACILITY_ID SSR_COMPONENT
 *
 * unused props: K STRM CLASS_MTG_NBR BLDG_CD, CLASS_NBR SSR_COMPONENT1
 */

class CalendarHandler {
    private static *getColor(): Generator<string, string, Entry> {
        let x = {};
        let cnt = 0;
        let ids = Array.from({ length: 11 }, (_, i) => i);
        ids.sort(() => Math.random() - 0.5);
        let CRSE_ID = "-1";
        x[CRSE_ID] = "-1";

        while (true) {
            let event_record: Entry = yield x[CRSE_ID];
            CRSE_ID = event_record.CRSE_ID;
            if (!(CRSE_ID in x)) {
                x[CRSE_ID] = (ids[cnt] + 1).toString();
                cnt += 1;
                cnt %= 11;
            }
        }
    }

    private static getDescr(event_record: Entry, html: boolean): string {
        const HTMLFORMAT = `<h2>${event_record.DESCR} (${event_record.CATALOG_NBR})
    ${event_record.STRM_DESCR}</h2><p><strong>Location</strong>: ${event_record.FDESCR}
    <strong>Instructor(s)</strong>: ${event_record.INSTRUCTORS}
    <strong>Component</strong>: ${event_record.COMDESC}
    <strong>Section</strong>: ${event_record.CLASS_SECTION}</p>`;

        const PLAINFORMAT = `${event_record.DESCR} (${event_record.CATALOG_NBR})
    ${event_record.STRM_DESCR}
    Location: ${event_record.FDESCR}
    Instructor(s): ${event_record.INSTRUCTORS}
    Component: ${event_record.COMDESC}
    Section: ${event_record.CLASS_SECTION}`;

        return html ? HTMLFORMAT : PLAINFORMAT;
    }

    private static getEndDateTime(event_record: Entry): string {
        // START_DT=20240416, MEETING_TIME_END=14:30
        let year = event_record.START_DT.slice(0, 4);
        let month = event_record.START_DT.slice(4, 6);
        let day = event_record.START_DT.slice(6);
        let hour = event_record.MEETING_TIME_END.slice(0, 2);
        let minute = event_record.MEETING_TIME_END.slice(3);
        return `${year}-${month}-${day}T${hour}:${minute}:00`;
    }

    private static getRecurrence(event_record: Entry): string[] {
        const days = ["MON", "TUES", "WED", "THURS", "FRI", "SAT", "SUN"];
        let byday: string[] = [];
        for (let day of days) {
            if (event_record[day] === "Y") {
                byday.push(day.slice(0, 2));
            }
        }

        return [
            `RRULE:FREQ=WEEKLY;BYDAY=${byday.join(",")};UNTIL=${
                event_record.END_DT
            }`,
        ];
    }

    private static getStartDateTime(event_record: Entry): string {
        // START_DT=20240416, MEETING_TIME_START=13:30
        let year = event_record.START_DT.slice(0, 4);
        let month = event_record.START_DT.slice(4, 6);
        let day = event_record.START_DT.slice(6);
        let hour = event_record.MEETING_TIME_START.slice(0, 2);
        let minute = event_record.MEETING_TIME_START.slice(3);
        return `${year}-${month}-${day}T${hour}:${minute}:00`;
    }

    private static getSummary(event_record: Entry): string {
        return `${event_record.SUBJECT}${event_record.CATALOG_NBR} ${event_record.SSR_COMPONENT} ${event_record.FACILITY_ID}`;
    }

    private static getEventObject(
        event_record: Entry,
        colorId: string,
        useHtml: boolean
    ) {
        return {
            colorId: colorId,
            description: this.getDescr(event_record, useHtml),
            end: {
                dateTime: this.getEndDateTime(event_record),
                timeZone: "Asia/Hong_Kong",
            },
            location: `${event_record.LAT} ${event_record.LNG}`,
            recurrence: this.getRecurrence(event_record),
            start: {
                dateTime: this.getStartDateTime(event_record),
                timeZone: "Asia/Hong_Kong",
            },
            summary: this.getSummary(event_record),
        };
    }
    private calendarId: string;
    private colorGen: ReturnType<typeof CalendarHandler.getColor>;
    constructor(name: string) {
        this.calendarId = Calendar.Calendars.insert({ summary: name }).id;
        this.colorGen = CalendarHandler.getColor();
        this.colorGen.next();
    }
    insert(event_record: Entry, useHtml: boolean) {
        let colorId = this.colorGen.next(event_record).value;
        let event = CalendarHandler.getEventObject(event_record, colorId, useHtml);
        Calendar.Events.insert(event, this.calendarId);
    }
}
