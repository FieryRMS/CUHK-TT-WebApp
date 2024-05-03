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
        this.message =
            "Data has possibly expired or deleted. lifetime=" + expiry + "s;";
        if (message != "") this.message += " " + message;
    }
}

const BuildingMap = {
    AB: "Academic Building",
    ARC: "Lee Shau Kee Architecture Building",
    AMEW: "Art Museum East Wing",
    BATC: "MBA Town Centre\n(1/F, Bank of America Tower, 12 Harcourt Road, Central, HK)",
    BMS: "Basic Medical Sciences Building",
    CCCC: "Chung Chi College Chapel",
    CCT: "Chung Chi College Theology Building",
    CKB: "Chen Kou Bun Building",
    "CK TSE": "C.K. Tse Room (C.C. Library)",
    CML: "Ch'ien Mu Library",
    CWC: "C.W. Chu College",
    CYT: "Cheng Yu Tung Building",
    ELB: "Esther Lee Building",
    ERB: "William M.W. Mong Engineering Building",
    FYB: "Wong Foo Yuan Building",
    HCA: "Pi-Ch'iu Building",
    HCF: "Sir Philip Haddon-Cave Sports Field",
    HKSP: "Hong Kong Science And Technology Parks Corporation",
    HTB: "Ho Tim Building",
    HTC: "Haddon-Cave Tennis Court # 6, 7",
    HYS: "Hui Yeung Shing Building",
    ICS: "Institute of Chinese Studies",
    KHB: "Fung King Hey Building",
    KKB: "Leung Kau Kui Building",
    KSB: "Kwok Sports Building",
    "KSB SQ": "Squash Court, Kwok Sports Building",
    LDS: "Li Dak Sum Building",
    LHC: "Y.C. Liang Hall",
    LKC: "Li Koon Chun Hall, Sino Building",
    LN: "Lingnan Stadium, Chung Chi College",
    "LPN LT": "Lai Chan Pui Ngong Lecture Theatre (in Y.C. Liang Hall)",
    LSB: "Lady Shaw Building",
    LSK: "Lee Shau Kee Building",
    MCO: "Morningside College Seminar Room",
    MMW: "Mong Man Wai Building",
    NAA: "Cheng Ming Building, New Asia College",
    NAG: "New Asia College Gymnasium",
    NAH: "Humanities Building, New Asia College",
    "NA TT": "Table Tennis Room, New Asia College",
    PWH: "Prince of Wales Hospital",
    RRS: "Sir Run Run Shaw Hall",
    SB: "Sino Building",
    SC: "Science Centre",
    SCE: "Science Centre East Block",
    SCSH: "Multi-purpose Sports Hall, Shaw College",
    SCTT: "Table Tennis Room, Shaw College",
    SHB: "Ho Sin-Hang Engineering Building",
    SP: "Swimming Pool",
    "SWC LT": "Lecture Theatre, Shaw College",
    SWH: "Swire Hall, Fung King Hey Building",
    TC: "Tennis Court # 3, 4, 5",
    "TYW LT": "T.Y. Wong Hall, Ho Sin-Hang Engineering Building",
    UCA: "Tsang Shiu Tim Building, United College",
    UCC: "T.C. Cheng Building, United College",
    UCG: "United College Gymnasium",
    "UC TT": "Table Tennis Room, United College",
    UG: "University Gymnasium",
    USC: "University Sports Centre",
    "USC TT": "Table Tennis Room, University Sports Centre",
    WLS: "Wen Lan Tang, Shaw College",
    WMY: "Wu Ho Man Yuen Building",
    WS1: "Lee W.S. College South Block",
    YIA: "Yasumoto International Academic Park",
};
