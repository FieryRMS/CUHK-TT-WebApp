type EntryKeys =
    | "K"
    | "STRM"
    | "STRM_DESCR"
    | "DESCR"
    | "CRSE_ID"
    | "SUBJECT"
    | "CATALOG_NBR"
    | "SSR_COMPONENT"
    | "START_DT"
    | "END_DT"
    | "MEETING_TIME_START"
    | "MEETING_TIME_END"
    | "MON"
    | "TUES"
    | "WED"
    | "THURS"
    | "FRI"
    | "SAT"
    | "SUN"
    | "FACILITY_ID"
    | "SSR_COMPONENT1"
    | "CLASS_SECTION"
    | "FDESCR"
    | "BLDG_CD"
    | "LAT"
    | "LNG"
    | "INSTRUCTORS"
    | "COMDESC";
type Entry = Record<EntryKeys, string> & {
    CLASS_NBR: number;
    CLASS_MTG_NBR: number;
};

var UserCache = CacheService.getUserCache();
const expiry = 300;
const progress_expiry = 10;

class InvalidCredentials extends Error {
    constructor(message = "") {
        super(message);
        this.name = "InvalidCredentials";
        this.message = "Invalid credentials;";
        if (message != "") this.message += " " + message;
    }
}

class DataNotFound extends Error {
    constructor(message = "") {
        super(message);
        this.name = "DataNotFound";
        this.message = "Data has possibly expired or deleted. lifetime=" + expiry + "s;";
        if (message != "") this.message += " " + message;
    }
}
