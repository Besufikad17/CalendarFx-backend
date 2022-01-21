const ab = require('abushakir');
const gcConvertor = require('../controller/util/util');

const gcToec = gcConvertor.gregorianToEthiopic;
const EtDatetime = ab.EtDatetime;
const ETC = ab.ETC;
const Bahirehasab = ab.BahireHasab;
const convertor = ab.ConvertToEthiopic;

const now = new EtDatetime();
const now_etc = new ETC(now.date.year, now.date.month, now.date.day);
const now_bah = new Bahirehasab(now.date.year);



const holidays = {
    "አዲስ አመት": "መስከረም 1 ",
    "መስቀል": "መስከረም 17 ",
    "መውሊድ": "ጥቅምት 29 ",
    "ገና": "ታኅሳስ 29 ",
    "ጥምቀት": "ጥር 11 ",
    "አደዋ": "የካቲት 23 ",
    "የሰራተኞች ቀን": "ሚያዝያ 23 ",
    "የአርበኞች ቀን": "ሚያዝያ 27 ",
    "ትንሳኤ": now_bah.getSingleBealOrTsom('ትንሳኤ').month + " " + now_bah.getSingleBealOrTsom('ትንሳኤ').date,
    "ስቅለት": now_bah.getSingleBealOrTsom('ስቅለት').month + " " + now_bah.getSingleBealOrTsom('ስቅለት').date,
    "ኢደ አል አደሃ": "ኃምሌ 23 ",
}


const apiController = {};


apiController.getCurrentDate = (req,res) => {
    res.send(now.date);
}

apiController.getPreviousYear = (req,res) => {
    res.json(now_etc.prevYear.year);
}

apiController.getNextYear = (req,res) => {
    res.json(now_etc.nextYear.year);
}

apiController.getPreviousMonth = (req,res) => {
    res.json(now_etc.prevMonth.month);
}

apiController.getNextMonth = (req,res) => {
    res.json(now_etc.nextMonth.month);
}

apiController.getEvange = (req,res) => {
    res.json(now_bah.getEvangelist(true));
}

apiController.getAllHolidays = (req,res) => {
    res.send(holidays);
}

apiController.toGeez = (req,res) => {
    const { number } = req.params;

    if(!number){
        res.json({ msg: "missing field!!"});
    }else{
        res.json(convertor(parseInt(number)))
    }
}

apiController.toEC = (req,res) => {
    const { year, month, day } = req.body;

    if(!year || !month || !day){
        res.json({ msg: "missing field!!"});
    }else{
        const result = gcToec(year, month, day);
        res.json(result);
    }

}


module.exports = apiController;