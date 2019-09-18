/**
 * Global variables, on a global object.
 * - This file is meant to be used with 'import' syntax.
 * (Usuall for React components)
 */

const vars = {
    //RecordType codes
    RecordType:{
        Skater:"SKR",
        Team:"TEM",
        Penalty:"PEN",
        Video:"VID",
        Phase:"PHS",
        Slideshow:"SLS",
        Anthem:"ANT",
        Sponsor:"SPN",
        Peer:"PER"
    },

    //Clocks
    Clock:{
        Status:{
            Ready:0,
            Running:1,
            Stopped:2
        },
        Warning:10,
        Danger:5,
        Types:{
            Clock:"C",
            Stopwatch:"W"
        }
    },

    Scoreboard:{
        Status:{
            Normal:0,
            Timeout:1,
            Injury:2,
            Upheld:3,
            Overturned:4,
            Review:5
        },
        StatusText:[
            "",
            "OFFICIAL TIMEOUT",
            "INJURY TIMEOUT",
            "UPHELD",
            "OVERTURNED",
            "OFFICIAL REVIEW"
        ],
        JamSeconds:60
    },

    Team:{
        Status:{
            Normal:0,
            Timeout:1,
            Challenge:2,
            Injury:3,
            LeadJammer:4,
            PowerJam:5
        },
        StatusText:[
            "",
            "TIMEOUT",
            "CHALLENGE",
            "INJURY",
            "LEAD JAMMER",
            "POWER JAM"
        ]
    },

    Video:{
        Status:{
            Ready:0,
            Playing:1,
            Paused:2,
            Stopped:3,
            AutoPlay:4
        }
    }
}

export default vars;