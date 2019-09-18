/**
 * Global variables, on a global object.
 * - This file is meant to be used with require() syntax for Node.js
 */

const vars = {
    //RecordType codes
    RecordType:{
        Skater:"SKR",
        Team:"TEM",
        Penalty:"PEN",
        Video:"VID",
        Phase:"PHS",
        Slideshow:"SLS"
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
            Overturned:4
        },
        StatusText:[
            "",
            "TIMEOUT",
            "INJURY",
            "UPHELD",
            "OVERTURNED"
        ],
        JamSeconds:60
    },

    Team:{
        Status:{
            Normal:0,
            Timeout:1,
            Challenge:1,
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

//export compatability based on available import
module.exports = vars;