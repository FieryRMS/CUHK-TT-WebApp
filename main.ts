function doGet() {
    let template = HtmlService.createTemplateFromFile("index");
    template.expiry = expiry;
    return template.evaluate();
}

function getTermList(id: string, passw: string) {
    let res = UrlFetchApp.fetch(
        "https://campusapps.itsc.cuhk.edu.hk/store/CLASSSCHD/STT.asmx/GetTimeTable",
        {
            payload: {
                asP1: CUtils.encrypt(id),
                asP2: CUtils.encrypt(passw),
                asP3: "hk.edu.cuhk.ClassTT",
            },
        }
    );
    let data: Entry[] = JSON.parse(
        XmlService.parse(res.getContentText()).getRootElement().getText()
    );
    if (data.length === 0) {
        throw new InvalidCredentials();
    }

    UserCache.put("data", JSON.stringify(data), expiry);

    let cntmap = {};
    let termlist = [
        ...new Set(
            data.map((x) => {
                cntmap[x.STRM_DESCR] = (cntmap[x.STRM_DESCR] || 0) + 1;
                return x.STRM_DESCR;
            })
        ),
    ];
    let cntlist = termlist.map((x) => cntmap[x]);

    return { termlist, cntlist };
}

function createCalendar(terms: string[], usehtml: boolean, calname: string) {
    let data_str = UserCache.get("data");
    if (data_str === null) {
        throw new DataNotFound();
    }
    UserCache.remove("data");

    let data: Entry[] | null = JSON.parse(data_str);
    data = data.filter((x) => terms.indexOf(x.STRM_DESCR) !== -1);

    let cal = new CalendarHandler(calname);
    let total = data.length;
    let done = 0;
    UserCache.put("total", total.toString(), expiry);
    UserCache.put("done", done.toString(), expiry);
    for (let event_record of data) {
        if (
            event_record.START_DT.trim() === "" ||
            event_record.MEETING_TIME_START.trim() === "" ||
            event_record.MEETING_TIME_END.trim() === ""
        )
            continue;
        cal.insert(event_record, usehtml);
        done++;
        UserCache.put("done", done.toString(), expiry);
    }
    UserCache.remove("total");
    UserCache.remove("done");
}

function pollProgress() {
    let total = UserCache.get("total");
    let done = UserCache.get("done");
    if (total === null || done === null) {
        throw new DataNotFound();
    }

    return { total, done };
}
