var EventHandler = require("./core/EventHandler.js");
var KTBSResource = require("./core/KTBS.Resource.js");
var Obsel = require("./core/Obsel.js");
var TimeWindow = require("./core/TimeWindow.js");
var Timer = require("./core/Timer.js");
var Selector = require("./core/Selector.js");
var LocalTrace = require("./core/LocalTrace.js");
var Ktbs = require("./core/KTBS.js");
var KtbsModel = require("./core/KTBS.Model.js");
var KtbsBase = require("./core/KTBS.Base.js");
var KtbsTrace = require("./core/KTBS.Trace.js");

var ImportTrace = require("./UI/Widgets/ImportTrace.js");
var IntervalTimeForm = require("./UI/Widgets/IntervalTimeForm.js");
var ListBases = require("./UI/Widgets/ListBases.js");
var ListModelInBases = require("./UI/Widgets/ListModelInBases.js");
var ListTracesInBases = require("./UI/Widgets/ListTracesInBases.js");
var ObselInspector = require("./UI/Widgets/ObselInspector.js");
var ObselTypeInspector = require("./UI/Widgets/ObselTypeInspector.js");
var ReadableTimeForm = require("./UI/Widgets/ReadableTimeForm.js");
var TimeForm = require("./UI/Widgets/TimeForm.js");
var TimeSlider = require("./UI/Widgets/TimeSlider.js");
var TraceDisplayIcons = require("./UI/Widgets/TraceDisplayIcons.js");
var TraceDisplayIconsFix = require("./UI/Widgets/TraceDisplayIconsFix.js");
var TraceDisplayIconsZoom = require("./UI/Widgets/TraceDisplayIconsZoom.js");
var TraceDisplayObselOccurrences = require("./UI/Widgets/TraceDisplayObselOccurrences.js");
var TraceDisplayText = require("./UI/Widgets/TraceDisplayText.js");
var TraceDisplayZoomContext = require("./UI/Widgets/TraceDisplayZoomContext.js");
var DisplayModel = require("./UI/Widgets/DisplayModel.js");
var WindowScale = require("./UI/Widgets/WindowScale.js");
var WindowScaleFix = require("./UI/Widgets/WindowScaleFix.js");
var WindowSlider = require("./UI/Widgets/WindowSlider.js");

var Samotraces = {
  Obsel: Obsel,
  TimeWindow: TimeWindow,
  Timer: Timer,
  Selector: Selector,
  EventHandler: EventHandler,
  LocalTrace: LocalTrace,
  Ktbs: {
    Ktbs: Ktbs,
    Resource: KTBSResource,
    Model: KtbsModel,
    Base: KtbsBase,
    Trace: KtbsTrace,
  },
  Ui: {
    Widgets: {
      ImportTrace: ImportTrace,
      IntervalTimeForm: IntervalTimeForm,
      ObselInspector: ObselInspector,
      ObselTypeInspector: ObselTypeInspector,
      ReadableTimeForm: ReadableTimeForm,
      TimeForm: TimeForm,
      TimeSlider: TimeSlider,
      TraceDisplayIcons: TraceDisplayIcons,
      TraceDisplayIconsFix: TraceDisplayIconsFix,
      TraceDisplayIconsZoom: TraceDisplayIconsZoom,
      TraceDisplayObselOccurrences: TraceDisplayObselOccurrences,
      TraceDisplayText: TraceDisplayText,
      TraceDisplayZoomContext: TraceDisplayZoomContext,
      DisplayModel: DisplayModel,
      WindowScale: WindowScale,
      WindowScaleFix: WindowScaleFix,
      WindowSlider: WindowSlider,
      Ktbs: {
        ListBases: ListBases,
        ListModelInBases: ListModelInBases,
        ListTracesInBases: ListTracesInBases,
      }
    },
  },
};

module.exports = Samotraces;
