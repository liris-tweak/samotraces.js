var EventHandler = require("./core/EventHandler.js");
var KTBSResource = require("./core/KTBS.Resource.js");
var Obsel = require("./core/Obsel.js");
var TimeWindow = require("./core/TimeWindow.js");
var Timer = require("./core/Timer.js");
var Selector = require("./core/Selector.js");
var LocalTrace = require("./core/LocalTrace.js");
var KTBS = require("./core/KTBS.js");
var KTBSModel = require("./core/KTBS.Model.js");
var KTBSBase = require("./core/KTBS.Base.js");
var KTBSTrace = require("./core/KTBS.Trace.js");

var Samotraces = {
  Obsel: Obsel,
  TimeWindow: TimeWindow,
  Timer: Timer,
  Selector: Selector,
  EventHandler: EventHandler,
  LocalTrace: LocalTrace,
  KTBS: {
    KTBS: KTBS,
    Resource: KTBSResource,
    Model: KTBSModel,
    Base: KTBSBase,
    Trace: KTBSTrace,
  },
};

module.exports = Samotraces;
