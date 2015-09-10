(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SamotracesCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventHandler = require("./core/EventHandler.js");
var KTBSResource = require("./core/KTBS.Resource.js");
var Obsel = require("./core/Obsel.js");
var Ktbs = require("./core/KTBS.js");
var KtbsModel = require("./core/KTBS.Model.js");
var KtbsBase = require("./core/KTBS.Base.js");
var KtbsTrace = require("./core/KTBS.Trace.js");


var Samotraces = {
  Obsel: Obsel,
  EventHandler: EventHandler,
  Ktbs: {
    Ktbs: Ktbs,
    Resource: KTBSResource,
    Model: KtbsModel,
    Base: KtbsBase,
    Trace: KtbsTrace,
  },
};

module.exports = Samotraces;

},{"./core/EventHandler.js":2,"./core/KTBS.Base.js":3,"./core/KTBS.Model.js":4,"./core/KTBS.Resource.js":6,"./core/KTBS.Trace.js":7,"./core/KTBS.js":8,"./core/Obsel.js":9}],2:[function(require,module,exports){
/**
 * @mixin
 * @description
 * The EventHandler Object is not a class. However, it is
 * designed for other classes to inherit of a predefined
 * Observable behaviour. For this reason, this function is
 * documented as a Class.
 *
 * In order to use create a class that "inherits" from the
 * "EventHandler class", one must run the following code in
 * the constructor:
 * <code>
 * Samotraces.EventHandler.call(this);
 * </code>
 *
 * @property {Object} callbacks
 *     Hash matching callbacks to event_types.
 */
var EventHandler = (function() {
  /**
  	 * Triggers all the registred callbacks.
  	 * @memberof Samotraces.EventHandler.prototype
  	 * @param {String} event_type
  	 *     The type of the triggered event.
  	 * @param {Object} object
  	 *     Object sent with the message to the listeners (see
  	 *     {@link Samotraces.EventHandler#on}).
  	 */
  function trigger(event_type, object) {
    var e = { type: event_type, data: object };
    if (this.callbacks[event_type]) {
      this.callbacks[event_type].map(function(f) { f(e); });
    }
    /*
    		this.callbacks[event_type].forEach(function(callback) {
    			callback(e);
    		});
    		*/
  }
  /**
  	 * Adds a callback for the specified event
  	 * @memberof Samotraces.EventHandler.prototype
  	 * @param {String} event_type
  	 *     The type of the event to listen to.
  	 * @param {Function} callback
  	 *     Callback to call when the an event of type
  	 *     event_type is triggered. Note: the callback
  	 *     can receive one argument that contains
  	 *     details about the triggered event.
  	 *     This event argument contains two fields:
  	 *     event.type: the type of event that is triggered
  	 *     event.data: optional data that is transmitted with the event
  	 */
  function on(event_type, callback) {
    if ({}.toString.call(callback) !== '[object Function]') {
      console.log(callback);
      throw "Callback for event " + event_type + " is not a function";
    }
    this.callbacks[event_type] = this.callbacks[event_type] || [];
    this.callbacks[event_type].push(callback);
  }

  return function(events) {
    // DOCUMENTED ABOVE
    this.callbacks = this.callbacks || {};
    this.trigger = trigger;
    this.on = on;
    /**
    		 * EventConfig is a shortname for the
    		 * {@link Samotraces.EventHandler.EventConfig}
    		 * object.
    		 * @typedef EventConfig
    		 * @see Samotraces.EventHandler.EventConfig
    		 */
    /**
    		 * The EventConfig object is used for configurating the
    		 * functions to call events are triggered by an EventHandler Object.
    		 * Each attribute name of the EventConfig corresponds
    		 * to a type of event listened to, and each
    		 * value is the function to trigger on this event.
    		 * @typedef Samotraces.EventHandler.EventConfig
    		 * @type {Object.<string, function>}
    		 * @property {function} eventName - Function to trigger on this event.
    		 */
    function callback(e) { fun(e.data); }
    for (var event_name in events) {
      		if (event.hasOwnProperty(event_name)) {
        		var fun = events[event_name];
        		this.on(event_name, callback);
      		}
    }
    return this;
  };
})();

module.exports = EventHandler;

},{}],3:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");

/**
 * @class Javascript KTBS.Base Object that is bound to a KTBS.
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Base is a Javascript KTBS base
 * object that is bound to a KTBS. This Object implements the KTBS API.
 * Methods are available to get the
 * list of traces available in the KTBS base. Access a
 * specific trace, etc.
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the Base to load.
 * @param {String}	[id]	ID of the Base to load.
 */
var Base = function Base(uri, id) {
  // KTBS.Base is a Resource
  if (id === undefined) { id = uri; }
  KTBSResource.call(this, id, uri, 'Base', "");
  this.traces = [];
  this.models = [];
  this.force_state_refresh();
};

Base.prototype = {
  get: function(id) {},
  /**
  	 * Gets the list of traces available in the base.
  	 * @returns {Array.<String>} Array of the ID of the traces available in the Base.
  	 */
  list_traces: function() {
    return this.traces;
  },
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_models: function() {
    return this.models;
  },
  /**
  	 * Create a stored trace in the KTBS
  	 * @param id {String} ID of the created trace
  	 * @param [model] {Model} Model of the trace
  	 * @param [origin] {Origin} Origin of the trace
  	 * @param [default_subject] {String} Default subject of the trace
  	 * @param [label] {String} Label of the trace
  	 */
  create_stored_trace: function(id, model, origin, default_subject, label) {
    var new_trace = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"StoredTrace",
      "@id":		id + "/"
    };
    new_trace.hasModel = (model === undefined  || model ===  null)?"http://liris.cnrs.fr/silex/2011/simple-trace-model":model;
    new_trace.origin = (origin === undefined || origin ===  null )?"1970-01-01T00:00:00Z":origin;
    //			if(origin==undefined) new_trace.origin = origin;
    if (default_subject === undefined) new_trace.default_subject = default_subject;
    if (label === undefined) new_trace.label = label;
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(new_trace),
      success: this.force_state_refresh.bind(this),
      error: function(jqXHR, textStatus, error) {
        console.log('query error');
        console.log([jqXHR, textStatus, error]);
      }
    });
  },

  /**
  	 * Create a stored trace in the KTBS
  	 * @param id {String} ID of the created trace
  	 * @param [model] {Model} Model of the trace
  	 * @param [origin] {Origin} Origin of the trace
  	 * @param [default_subject] {String} Default subject of the trace
  	 * @param [label] {String} Label of the trace
  	 */
  create_model: function(id) {
      var doc = {
      '@context': 'http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context',
      '@graph': [{
        '@id': id,
        '@type': 'TraceModel',
        'inBase': './',
        'hasUnit': 'millisecond'
      }]
    };
    var new_model_data = JSON.stringify(doc);
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: new_model_data,
      success: this.force_state_refresh.bind(this),
      error: function(jqXHR, textStatus, error) {
        console.log('query error');
        console.log([jqXHR, textStatus, error]);
      }
    });
  },



  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_computed_trace: function(id, method, parameters, sources, label) {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  //create_model: function(id, parents, label) {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_method: function(id, parent, parameters, label) {},
  ///////////
  /**
  	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  	 * @private
  	 */
  _on_state_refresh_: function(data) {
    //	console.log(data);
    this._check_change_('label', data["http://www.w3.org/2000/01/rdf-schema#label"], 'base:update');
    this._check_change_('traces', data.contains, 'base:update');
  },
  /////////// ADDED / API
  /**
  	 * Gets a trace from its ID
  	 * @param id {String} ID of the trace to get.
  	 * @return {Samotraces.KTBS.Trace} The retrieved Trace.
  	 */
  get_trace: function(id) {
    return new Samotraces.KTBS.Trace(this.uri + id + '/', id);
  },
  ////////////
};

module.exports = Base;

},{"./KTBS.Resource.js":6}],4:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var EventHandler = require("./EventHandler.js");

/**
 * @summary Trace object that is synchronised to a KTBS.
 * @class Javascript Model Object that is bound to a KTBS Model.
 * @author Benoît Mathern / DERBEL Fatma
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Modelis a Javascript Trace object
 * that is bound to a KTBS Model. This Object implements the KTBS API.
 * Methods are available to get
 * the Liste of type of Obsels from the KTBS Model, .
 *
 *
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the KTBS trace to load.
 * @param {String}	[id]	ID of the KTBS trace to load.
 */


var Model = function(uri, id) {
  if (id === undefined) { id = uri; }
  EventHandler.call(this);
  KTBSResource.call(this, id, uri, 'Model', "");
  this.list_Types_Obsles = []
  this.force_state_refresh();

};

Model.prototype = {

  _on_state_refresh_: function(data) {
    var etag = this.get_etag();
    this.trigger('Model:get');
    this.list_Types_Obsles = this.list_obsels(data["@graph"]);
  },
  list_obsels: function(data) {
    ListeObselType = [];
    var M = this;
    data.forEach(function(el, key) {
      var obs = {attributes: []};
      if (el["@type"] == "ObselType")      {
        obs.id = el["@id"];
        obs.type = el["@id"].substr(1);
        obs.coche = false;
        //obs[key] = el[key]
        if (el['hasSuperObselType'])        {
          obs.hasSuperObselType = el['hasSuperObselType']
        }
        ListeObselType.push(obs);
        //M.trigger('Model:Draw_obsel', obs);
        //console.log ('triger')
      }      else if (el["@type"] == "AttributeType")      {
        obs = M.GetObselType(el["hasAttributeObselType"], ListeObselType);
        el['coche'] = false;
        obs.attributes.push(el);

      }

    });
    ListeObselType.forEach(function(o) {
      if (o.hasSuperObselType)      {

        o.attributes = M.getAttributes (o.hasSuperObselType[0])
      }

    })

    M.trigger('Model:listeType', ListeObselType);
    return ListeObselType;

  },

  GetObselType: function(id, ListeObselType)  {
    var obs = [];
    ListeObselType.forEach(function(o)    {

      if (o["id"] == id)      {

        obsR = o;

      }

    }
    )
    return obsR;
  },

  getAttributes: function(ident)  {

    ListeObselType.forEach(function(o)    {

      if (o.id === ident)   {
        Att = o.attributes
      }

    }
    )
    return Att;
  },

  put_model: function(modeldata) {
    this.force_state_refresh();
    var that = this;
    return new Promise(function(resolve, reject) {
      that.on ('Model:get', function(){
       var etag = that.etag;

    // PUT
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('If-Match', etag);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          console.log('OKOKOK');
          resolve(new Samotraces.Ktbs.Model(that.id));
        } else {
          reject(xhr);
        }
      }
    };
    xhr.onerror = function() {
      reject(Error('There was a network error.'));
    };
    xhr.send(modeldata);

  })
  });
}
};

module.exports = Model;

},{"./EventHandler.js":2,"./KTBS.Resource.js":6}],5:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var Obsel = require("./Obsel.js");

/**
 * @class Samotraces.KTBS.Obsel is part of the Samotraces.KTBS implementation.
 * @augments Samotraces.Obsel
 * @augments Samotraces.KTBS.Resource
 * @todo TODO update set_methods
 * -> sync with KTBS instead of local change
 */
var KTBSObsel = function(param) {
  KTBSResource.call(this, param.id, param.uri, 'Obsel', param.label || "");

  this._private_check_error(param, 'trace');
  this._private_check_error(param, 'type');
  this._private_check_default(param, 'begin',	Date.now());
  this._private_check_default(param, 'end',		this.begin);
  this._private_check_default(param, 'attributes',	{});
  this._private_check_undef(param, 'relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'source_obsels',		[]);
}

KTBSObsel.prototype = Obsel.prototype;

/*
Samotraces.KTBS.Obsel.prototype.get_ktbs_status = function() {
	return this.ktbs_status
};
*/

module.exports = KTBSObsel;

},{"./KTBS.Resource.js":6,"./Obsel.js":9}],6:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");
var $ = require("jquery");

/**
 * @summary Resource Objects that is synchronised to a kTBS
 * @description Resource Objects are KTBS objects. All resources
 * have an uri, an id and an optional label
 * @class Resource Objects have an uri, an id and an optional label
 * @param {String} id Id of the Resource
 * @param {String} url URI of the Resource
 * @param {String} type Type of the Resource ('KTBS','Base',
 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel')
 * @param {label} [label] Label of the Resource
 */
var KTBSResource = (function() {
  /**
  	 * @summary Returns the resource type of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource type ('KTBS','Base',
  	 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel').
  	 */
  function get_resource_type() {
    "use strict";
    return this.type;
  }

  function getAbsoluteURLFromRlative(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
  }
  // RESOURCE API
  /**
  	 * @summary Returns the ID of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource ID.
  	 */
  function get_id() { return this.id; }
    /**
  	 * @summary Returns the URI of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource URI.
  	 */
  function get_uri() { return this.uri.replace('./', ''); }
  /**
   * @summary Returns the URI of the Resource.
   * @memberof Samotraces.KTBS.Resource.prototype
   * @returns {String} Resource URI.
   */
function get_etag() { return this.etag; }
    /**
  	 * @summary Forces the Resource to synchronise with the KTBS.
  	 * @memberof Samotraces.KTBS.Resource.prototype
     * @param {Object} options 
     *  'options._on_state_refresh_': true|false
     *   enable or disable the old behavior of calling _on_state_refresh_ on the resource after synchronise completes
  	 * @description
  	 * Forces the Resource to synchronise with the KTBS.
  	 * This method triggers a Ajax query that will
  	 * trigger the _on_state_refresh_ method of the Resource
  	 * on success.
  	 */
  function force_state_refresh(options, success, reject) {
    success = success || function () {};
    reject = reject || function () {};
    options = options || {'_on_state_refresh_': true}; // For backward compatibility

    var url = this.uri;
    var trc = this ;
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      error: function(XHR, textStatus, errorThrown) {

        if (XHR.status === '401') {
          console.log (XHR.getAllResponseHeaders());
          var Link = XHR.getResponseHeader('Link');
          var D = Link.split (',');
          for (var i = 0;i < D.length;i++)          {
            var SousD = D[i].split(';');
            var link;
            var URLSuccess;
            if (SousD[1] === " rel=oauth_resource_server")            {
              link = SousD[0].substr(1, SousD[0].length - 2);
            }
            if (SousD[1] === " rel=successful_login_redirect")            {
              URLSuccess = SousD[0].substr(2, SousD[0].length - 3);
            }
          }
          window.open (link) ;
        }
        reject(XHR);
      },
      success: function (data, textStatus, xhr){
        trc.etag = xhr.getResponseHeader('ETag');
        success(data);
        if (options._on_state_refresh_) {
          trc._on_state_refresh_(data);
        }
      }
    });
  }
    /**
  	 * @summary Forces the Resource to synchronise
  	 * with at a given refreshing rate.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @description
  	 * Forces the Resource to synchronise with the KTBS
  	 * every period seconds.
  	 * @param {Number} period Time in seconds between two synchronisations.
  	 */


  function start_auto_refresh(period) {
    var a = this.auto_refresh_id?this.stop_auto_refresh():null;
    this.auto_refresh_id = window.setInterval(this.force_state_refresh.bind(this), period * 1000);
  }
  /**
  	 * @summary Stops the autorefresh synchronisation
  	 * of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @description
  	 * Stops the autorefresh synchronisation of
  	 * the Resource.
  	 */
  function stop_auto_refresh() {
    if (this.auto_refresh_id) {
      window.clearInterval(this.auto_refresh_id);
      delete(this.auto_refresh_id);
    }
  }
  //		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function get_read_only() {}
  /**
  	 * @summary Delete the resource from the KTBS
  	 * @todo IMPROVE THIS METHOD SO THAT PROPER EVENT IS RAISED
  	 *     WHEN A RESOURCE IS DELETED.
  	 */
  function remove() {
    function refresh_parent() {
      //TROUVER UN MOYEN MALIN DE RAFRAICHIR LA LISTE DES BASES DU KTBS...
    }
    $.ajax({
      url: this.uri,
      type: 'DELETE',
      success: refresh_parent.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        throw "Cannot delete " + this.get_resource_type() + " " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
      }
    });
  }
  /**
  	 * @summary Returns the label of the Resource
  	 */
  function get_label() { return this.label; }
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function set_label() {}
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function reset_label() {}

  // ADDED FUNCTIONS
  /**
  	 * Method used to check if the distant value is different
  	 * from the current local value (and update the local value
  	 * if there is a difference.
  	 * @private
  	 * @param local_field {String} Name of the field of the this
  	 *     object containing the information to check.
  	 * @param distant {Value} Value of the distant information.
  	 * @param message_if_changed {String} Message to trigger if
  	 *     the information has been updated.
  	 */
  function _check_change_(local_field, distant, message_if_changed) {
    // TODO check if this is the wanted behaviour:
    // If distant is undefined -> what to do?
    if (distant !== undefined && this[local_field] !== distant) {
      this[local_field] = distant;
      this.trigger(message_if_changed);
    }
  }

  return function(id, uri, type, label) {
    // a Resource is an EventHandler
    Samotraces.EventHandler.call(this);
    // DOCUMENTED ABOVE
    // ATTRIBUTES
    this.id = id;
    this.uri = uri;
    this.label = label;
    this.type = type;
    // API METHODS
    this.get_id = get_id;
    this.get_uri = get_uri;
    this.force_state_refresh = force_state_refresh;
    this.get_read_only = get_read_only;
    this.remove = remove;
    this.get_label = get_label;
    this.set_label = set_label;
    this.reset_label = reset_label;
    this.get_etag = get_etag;
    // helper
    this.get_resource_type = get_resource_type;
    this._check_change_ = _check_change_;
    this.start_auto_refresh = start_auto_refresh;
    this.stop_auto_refresh = stop_auto_refresh;
    this.getAbsoluteURLFromRlative=getAbsoluteURLFromRlative;
    return this;
  };
})();


module.exports = KTBSResource;

},{"./EventHandler.js":2,"jquery":"jquery"}],7:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSObsel = require("./KTBS.Obsel.js");
var $ = require("jquery");

/**
 * @summary Trace object that is synchronised to a KTBS.
 * @class Javascript Trace Object that is bound to a KTBS trace.
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Trace is a Javascript Trace object
 * that is bound to a KTBS trace. This Object implements the KTBS API.
 * Methods are available to get
 * the Obsels from the KTBS trace, create new Obsels, etc.
 *
 * Note: this Trace object does not implement all the methods
 * available in the KTBS API yet.
 * For instance, this class do not support transformations.
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the KTBS trace to load.
 * @param {String}	[id]	ID of the KTBS trace to load.
 */
var KTBSTrace = function Trace(uri, id) {
  // KTBS.Trace is a Resource
  "use strict";
  if (id === undefined) { id = uri; }
  KTBSResource.call(this, id, uri, 'Base', "");

  this.temp = {}; // attribute used to store actions made by the user on the trace while not knowing if they are allowed. e.g., create_obsel, when we don't know yet if the Trace is a StoredTrace because the KTBS didn't reply yet.
  this.default_subject = "";
  this.model_uri = "";
  this.obsel_list_uri = uri + "@obsels";
  this.base_uri = "";
  this.origin = "";
  //this.origin_offset = (new Date(0)).getMilliseconds();
  this.obsel_list = []; this.traceSet = [];
  this.force_state_refresh();
};

KTBSTrace.prototype = {
  /////////// OFFICIAL API
  /**
  	 * @description
  	 * Gets the base where the trace is stored.
  	 * @returns {String} URI of the base where the trace is stored.
  	 */
  get_base: function() {
    "use strict";
    return this.getAbsoluteURLFromRlative(this.get_uri(),this.base_uri);
  },
  /**
  	 * @description
  	 * Gets the model of the trace.
  	 * @returns {Model} Model of the trace.
  	 * @todo DEFINE WHAT IS A MODEL
  	 */
  get_model: function() {
    "use strict";

    return this.getAbsoluteURLFromRlative(this.get_uri(),this.model_uri);
 },
  /**
  	 * @description
  	 * Gets the origin of the trace.
  	 * @returns {Origin} Origin of the trace.
  	 * @todo DEFINE WHAT IS AN ORIGIN
  	 */
  get_origin: function() { "use strict"; return this.origin; },
  //get_origin_offset: function() { return this.origin_offset; },
  /*ktbs_origin_to_ms: function(ktbs_date_str) {
  		var Y = ktbs_date_str.substr(0,4);
  		var M = ktbs_date_str.substr(5,2) - 1;
  		var D = ktbs_date_str.substr(8,2);
  		var h = ktbs_date_str.substr(11,2);
  		var m = ktbs_date_str.substr(14,2);
  		var s = ktbs_date_str.substr(17,2);
  		var ms = ktbs_date_str.substr(20,3);
  		return Date.UTC(Y,M,D,h,m,s,ms);
  	},*/
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_source_traces: function() {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_transformed_traces: function() {},
  /**
  	 * @description
  	 * Returns the list of obsels in an optional time interval.
  	 * If no minimum time and no maximum time constraint are
  	 * defined, returns the whole list of obsels.
  	 * If one of the two constraints are defined, then returns
  	 * obsels matching the time constraints.
  	 *
  	 * Note: if an obsel overlaps with the start or the end
  	 * constraint, then it will be included (for instance an
  	 * obsel that starts before the start constraint and ends
  	 * after that constraint will be included).
  	 *
  	 * Note: the list returned by this method is the
  	 * list of Obsels that are loaded locally.
  	 * When this method is called, a query to the KTBS
  	 * is made to know if there are other Obsels matching
  	 * the query. If so, these other obsels will be loaded
  	 * in the local copy of the trace and a
  	 * {@link Samotraces.Trace#trace:create:obsel|trace:create:obsel}
  	 * event or a
  	 * {@link Samotraces.Trace#trace:update|trace:update}
  	 * event will be triggered to notify that other
  	 * Obsels have been loaded.
  	 * @param {Number} [begin] Minimum time constraint
  	 * @param {Number} [end] Maximum time constraint
  	 * @param {Boolean} [reverse=false] Returns the obsel list in
  	 *     reverse chronological order if true and in normal
  	 *     chronological order if false.
  	 * @returns {Array.<Obsel>} List of relevant obsels
  	 * @todo REVERSE IS NOT YET TAKEN INTO ACCOUNT
  	 */
  // TODO add an optional CALLBACK???
  list_obsels: function(begin, end, reverse) {
    "use strict";
    this.obsel_list_uri = this.uri + "@obsels";
    if (this.obsel_list_uri === "") {
      console.log("Error in KTBS:Trace:list_obsels() unknown uri");
      return false;
    }

    var OBJ = this;

    //		$.getJSON(this.obsel_list_uri,this._on_refresh_obsel_list_.bind(this));
    var OBJ = this;
    $.ajax({
      url: this.obsel_list_uri,//+'.json',
      type: 'GET',
      dataType: 'json',
      data: {minb: begin, maxb: end, reverse: reverse},
      xhrFields: { withCredentials: true },
      error: function(XHR) {
        if (XHR.status === '401') {
          var linkheader = XHR.getResponseHeader('Link');
          var d = linkheader.split (',');
          for (var i = 0;i < d.length;i++)          {
            var sousD = d[i].split(';');
            if (sousD[1] === " rel=oauth_resource_server")            {
              var link = sousD[0].substr(1, sousD[0].length - 2);

            }

            if (sousD[1] === " rel=successful_login_redirect")            {
              //	var	URLSuccess = sousD[0].substr(2,sousD[0].length-3);
            }
          }
          window.open (link) ;
        }
      },
      success: function(data) {	if (data.obsels.length > 0)	{OBJ.Before_on_refresh_obsel_list_ (data);}	}
    });
    return this.obsel_list.filter(function(o) {
      if (end && o.get_begin() > end) { return false; }
      if (begin && o.get_end() < begin) { return false; }
      return true;
    });
  },

  Before_on_refresh_obsel_list_: function(dataRecu) {
    "use strict";
    // par paquet
    this.trigger('trace:Config', dataRecu);
    var i = 0;
    var end = Number(i) + Number(100);

    if (dataRecu.obsels) {
      this._on_refresh_obsel_list_group(dataRecu.obsels, i, end);
    }
    else {
      this._on_refresh_obsel_list_group(dataRecu, i, end);
    }


  },
  _on_refresh_obsel_list_group: function(dataRecu, i, end) {
    "use strict";
    var count = 0;
    var d = dataRecu.length ;
    var dataToDraw = dataRecu.slice (i, end);
    console.log ('_on_refresh_obsel_list_group');
      for (var j=0 ;  j < dataToDraw.length; j++){
        this._parse_get_obsel_(dataToDraw[j]);
        if (j === dataToDraw.length -1){
          this.trigger('trace:updateT');
          var i = Number(i) + dataToDraw.length + Number(1);
          var end = (Number(i) + Number(100) > d)?dataRecu.length : Number(i) + Number(100)
          if (i <= d)  {
              this._on_refresh_obsel_list_group(dataRecu, i, end);
            } else {
              this.trigger('trace:updateCompleted');
            }
        }
      }
  },

  _on_refresh_obsel_list_: function(data) {
    "use strict";
    var count = 0;

    data.forEach(function(el) {
      count ++;
      this._parse_get_obsel_(el);
      if (count === data.length)      {this.trigger('trace:updateT', this);}
    }, this);


  },

  get_Last_obsel: function() {
    "use strict";
    var obs;
    var max = 0;
    this.obsel_list.forEach(function(o) {
      if (o.get_begin() > max) { obs = o; }
    });
    return obs;
  },
  get_First_obsel: function() {
    "use strict";
    var obs;
    var min1 = 9999999999999;
    this.obsel_list.forEach(function(o) {
      if (o.get_begin() < min1) { obs = o; }
    });
    return obs;
  },
  get_List_obsel_ParType: function(obselType) {
    "use strict";
    var liste = [];

    this.obsel_list.forEach(function(o) {
      if (o.type === obselType) { liste.push(o); }
    });
    return liste;
  },


  /**
  	 * @summary Forces the local obsel list to be synchronised
  	 * with the KTBS at a given refreshing rate.
  	 * @param {Number} period Time in seconds between two synchronisations.
  	 */
  start_auto_refresh_obsel_list: function(period) {
    "use strict";
    var a = this.auto_refresh_obsel_list_id?this.stop_auto_refresh_obsel_list():null;
    this.auto_refresh_obsel_list_id = window.setInterval(this.list_obsels.bind(this), period * 1000);
  },
  /**
  	 * @summary Stops the autorefresh synchronisation
  	 * of the obsel list.
  	 */
  stop_auto_refresh_obsel_list: function() {
    "use strict";
    if (this.auto_refresh_obsel_list_id) {
      window.clearInterval(this.auto_refresh_id);
      delete(this.auto_refresh_id);
    }
  },

  /**
  	 * Retrieve an obsel in the trace from its ID.
  	 * If the obsel does not exist locally, returns
  	 * undefined and send a query to the KTBS
  	 * (which will result in adding this obsel locally
  	 * if it exists on the KTBS).
  	 * @param {String} id ID of the Obsel to retrieve
  	 * @returns {Obsel} Obsel that corresponds to this ID
  	 *     or undefined if the obsel was not found.
  	 * @todo TODO add an optional CALLBACK
  	 */
  get_obsel: function(id) {
    "use strict";
    var obs;
    this.obsel_list.forEach(function(o) {
      if (o.get_id() === id) { obs = o; }
    });
    if (obs === undefined) {
      // sends a query to find the obsel
      jQuery.ajax({
        // TODO ideally JSON... When KTBS supports it!
        url: this.uri + id,
        dataType: 'json',
        type: 'GET',
        success: this._parse_get_obsel_.bind(this),
      });
    }
    return obs;
  },
  /**
  	 * Callback for queries where an obsel is expected as a result
  	 * Parses the JSON data from the KTBS to create a new Obsel locally
  	 * if it doesn't exist already.
  	 * @private
  	 */
  _parse_get_obsel_: function(data, textStatus, jqXHR) {
    "use strict";
    var obs = {
      attributes: {}
    };

    // OBSEL ID
    obs.id = data["@id"];
    if (this.type === "ComputedTrace") {obs.id = obs.type + "_" + obs.id;}
    if (obs.id.substr(0, 2) === "./") { obs.id = obs.id.substr(2); }

    // OBSEL TRACE
    // data.hasTrace;
    obs.trace = this;

    // OBSEL TYPE
    // data["@type"]; // TODO BUG KTBS -> USE "m:type" instead
    // data["m:type"];
    obs.type = data["@type"].substr(2);

    if (data.hasOwnProperty('http://www.w3.org/2000/01/rdf-schema#label')) {
      obs.label = data['http://www.w3.org/2000/01/rdf-schema#label'];
    }
    //obs.begin = data.begin;
    //obs.end = data.end;
    var d = new Date (this.origin);
    obs.begin = d.getTime() + data.begin ;
    obs.end = d.getTime() + data.end;

    // DELETING PROPERTIES THAT HAVE ALREADY BEEN COPIED
    delete data["@id"];
    delete data.hasTrace;
    delete data["@type"];
    delete data.begin;
    delete data.end;
    delete data['http://www.w3.org/2000/01/rdf-schema#label'];
    //delete data["m:type"];


    // ATTRIBUTES
    for (var attr in data) {
      if (attr.substr(0, 2) === "m:") { // TODO this is not generic!!!!
        obs.attributes[attr.substr(2)] = data[attr];
      }
    }
    //console.log(data,obs);
    var o = new KTBSObsel(obs);
    if (!this._check_obsel_loaded_(o)) { // TODO first approximation
      this.trigger('trace:create_obsel', o);
    }
  },

  ///////////
  /**
  	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  	 * @private
  	 */
  _on_state_refresh_: function(data) {
    //		console.log(data);
    "use strict";
    this._check_and_update_trace_type_(data['@type']);
    this._check_change_('default_subject', data.hasDefaultSubject, '');
    this._check_change_('model_uri', data.hasModel, 'trace:model');
    this._check_change_('obsel_list_uri', data.hasObselList, 'trace:update');
    this._check_change_('base_uri', data.inBase, 'trace:base');
    this._check_change_('origin', data.origin, 'trace:update');
    this._check_change_('label', data.label, 'trace:update');
    this.trigger('trace:updateData', data);
    //this._check_change_('origin_offset',this.ktbs_origin_to_ms(data.origin),'');
  },
  _update_method_: function(trace_type, method_name) {
    "use strict";
    this[method_name] = this[trace_type + "_methods"][method_name];
    if (this.temp[method_name] !== undefined) {
      this.temp[method_name].forEach(function(param) {
        this[method_name](param);
      }, this);
    }
  },
  _check_and_update_trace_type_: function(type) {
    "use strict";
    if (this.type !== type) {
      for (var method_name in this[type + "_methods"]) {
        if (this[type + "_methods"].hasOwnProperty(method_name))        {this._update_method_(type, method_name);}
      }
      this.type = type;
    }
  },
  ///////////
  /*	_on_refresh_obsel_list_: function(data) {
  //		console.log(data);
  		var id, label, type, begin, end, attributes, obs;
  		var new_obsel_loaded = false;
  		data.obsels.forEach(function(el,key) {
  			this._parse_get_obsel_(el);
  /*
  			var attr = {};
  			attr.id = el['@id'];
  			attr.trace = this;
  			attr.label = el['http://www.w3.org/2000/01/rdf-schema#label'] || undefined;
  			attr.type = el['@type'];
  			attr.begin = el['begin'];
  			attr.end = el['end'];
  			attr.attributes = el;
  			delete(attr.attributes['@id']);
  			delete(attr.attributes['http://www.w3.org/2000/01/rdf-schema#label']);
  			delete(attr.attributes['@type']);
  			delete(attr.attributes['begin']);
  			delete(attr.attributes['end']);
  			obs = new Samotraces.KTBS.Obsel(attr);

  			if(! this._check_obsel_loaded_(obs)) {
  				new_obsel_loaded = true;
  			}
*/
  //},this);
  /*		if(new_obsel_loaded) {
  			this.trigger('trace:update',this.traceSet);
  		}
*/
  //},*/
  _check_obsel_loaded_: function(obs) {
    "use strict";
    if (this.obsel_list.some(function(o) {
      return o.get_id() === obs.get_id(); // first approximation: obsel has the same ID => it is already loaded... We don't check if the obsel has changed!
    })) {
      return true;
    } else {
      this.obsel_list.push(obs);
      return false;
    }
  },
  StoredTrace_methods: {
    set_model: function(model) {},
    set_origin: function(origin) {
      "use strict";
      this.origin = origin;
      //	this.origin_offset = (new Date(origin)).getMilliseconds();
      // TODO sync with KTBS
    },
    get_default_subject: function() {
      "use strict";
      return this.default_subject;
    },
    set_default_subject: function(subject) {},
    create_obsel: function(params) {
      // LOCAL TRACE
      //var obs = new Samotraces.Obsel(obsel_params);
      // KTBS BOGUE
      "use strict";
      var json_obsel = {
        "@context":	[
        "http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
               { "m": "http://liris.cnrs.fr/silex/2011/simple-trace-model#" }
        ],
        "@type":	"m:" + params.type, // fixed: "SimpleObsel", // TODO KTBS BUG TO FIX
        hasTrace:	"",
        subject:	params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),
        //"m:type":	params.type
      };
      //console.log(params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),params.hasOwnProperty("subject"),params.subject,this.get_default_subject());
      if (params.hasOwnProperty("begin")) { json_obsel.begin = params.begin; }
      if (params.hasOwnProperty("end")) { json_obsel.begin = params.end;}
      if (params.hasOwnProperty("attributes")) {
        for (var attr in params.attributes) {
          if (params.attributes.hasOwnProperty(attr))          {json_obsel["m:" + attr] = params.attributes[attr];}
        }
      }
      function _on_create_obsel_success_(data, textStatus, jqXHR) {
        /*
        				var url = jqXHR.getResponseHeader('Location');
        				var url_array = url.split('/');
        				*/

        var url_array = data.split('/');
        var obsel_id = url_array[url_array.length - 1];
        //this.get_obsel(obsel_id);
        // Optimisation: do not do a GET query to get the OBSEL
        // The Obsel parameters are already known in param
        // We just need to add the ID.
        params.id = obsel_id;
        params.trace = this;
        var o = new KTBSObsel(params);
        if (!this._check_obsel_loaded_(o)) {
          this.trigger('trace:create_obsel', o);
        }
      }
      $.ajax({
        url: this.uri,
        type: 'POST',
        contentType: 'application/json',
        success: _on_create_obsel_success_.bind(this),
        data: JSON.stringify(json_obsel)
      });
    }
  },

  ComputedTrace_methods: {
    set_method: function(method) {},
    list_parameters: function(include_inherited) {},
    get_parameter: function(key) {},
    set_parameter: function(key, value) {},
    del_parameter: function(key) {}
  },

  // TEMPORARY METHODS
  create_obsel: function(obsel_params) {
    "use strict";
    if (!this.create_obsel.hasOwnProperty('create_obsel')) {
      this.temp.create_obsel = [];
    }
    this.temp.create_obsel.push (obsel_params);
  },

};

module.exports = KTBSTrace;

},{"./KTBS.Obsel.js":5,"./KTBS.Resource.js":6,"jquery":"jquery"}],8:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSBase = require("./KTBS.Base.js");
var $ = require("jquery");

/**
* @summary Javascript KTBS Object that is bound to a KTBS.
* @class Javascript KTBS Object that is bound to a KTBS.
* @author Benoît Mathern
* @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
* @constructor
* @augments Samotraces.EventHandler
* @augments Samotraces.KTBS.Resource
* @description
* Samotraces.KTBS is a Javascript KTBS object that
* is bound to a KTBS. This Object implemetns the KTBS API.
* Methods are available to get the list of bases
* available in the KTBS. Access a specific base, etc.
*
* @param {String}	uri	URI of the KTBS to load.
*/
var KTBS = function KTBS(uri) {
  // KTBS is a Resource
  "use strict";
  KTBSResource.call(this, uri, uri, 'KTBS', "");
  this.bases = [];
  this.builtin_methods = [];
  this.force_state_refresh();
};

KTBS.prototype = {
  /////////// OFFICIAL API
  /**
  * @todo METHOD NOT IMPLEMENTED
*/
  list_builtin_methods: function() {},
  /**
  * @todo METHOD NOT IMPLEMENTED
*/
  get_builtin_method: function() {},
  /**
  * Returns the array of the URI of the bases contained in the KTBS
  * @returns {Array<String>} Array of URI of bases.
*/
  list_bases: function() {
    "use strict";
    return this.bases;
  },
  /**
  * @summary Returns the KTBS.Base with the given ID.
  * @returns Samotraces.KTBS.Base Base corresponding to the given ID
  * @param id {String} URI of the base
*/
  get_base: function(id) {
    "use strict";
    return new KTBSBase(this.uri + id, id);
  },
  /**
  * Create a new base.
  * @param id {String} URI of the base (optional)
  * @param label {String} Label of the base (optional)
*/
  create_base: function(id, label) {
    "use strict";
    var new_base = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"Base",
      "@id":		id + "/",
      "label":	label
    };
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(new_base),
      success: this.force_state_refresh.bind(this),
      error: function(jqXHR, textStatus, error) {
        console.log('query error');
        console.log([jqXHR, textStatus, error]);
      }
    });
  },
  ///////////
  /**
  * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  * @private
*/
  _on_state_refresh_: function(data) {
    "use strict";
    this._check_change_('bases', data.hasBase, 'ktbs:update');
    this._check_change_('builtin_methods', data.hasBuildinMethod, 'ktbs:update');
  },
};

module.exports = KTBS;

},{"./KTBS.Base.js":3,"./KTBS.Resource.js":6,"jquery":"jquery"}],9:[function(require,module,exports){
var $ = require("jquery");

/**
* Obsel is a shortname for the
* {@link Samotraces.Obsel}
* object.
* @typedef Obsel
* @see Samotraces.Obsel
*/

/**
* ObselParam is an object that contains parameters
* necessary to create a new obsel.
* This type of object is used in several methods
* such as the Obsel constructor, or the
* Trace.create_obsel method.
* The optional porperties varies depending on the
* method called.
* @typedef ObselParam
* @property {String} [id] Id of the obsel
* @property {Trace} [trace] Trace of the obsel
* @property {String} [type] Type of the obsel
* @property {Number} [begin] Timestamp of when the obsel starts
* @property {Number} [end] Timestamp of when the obsel ends
* @property {Object} [attributes] Attributes of the obsel.
* @property {Array<Relation>} [relations] Relations from this obsel.
* @property {Array<Relation>} [inverse_relations] Relations to this obsel.
* @property {Array<Obsel>} [source_obsels] Source obsels of the obsel.
* @property {String} [param.label] Label of the obsel.
* @todo FIXME DEFINE WHAT IS A RELATION
*/

/**
* @summary JavaScript Obsel class
* @class JavaScript Obsel class
* @param {ObselParam} param Parameters of the obsel
* @param {String} param.id Identifier of the obsel.
* @param {Trace} param.Trace Trace of the obsel.
* @param {String} param.type Type of the obsel.
* @param {Number} [param.begin=Date.now()] Timestamp of when the obsel starts
* @param {Number} [param.end=param.begin] Timestamp of when the obsel ends
* @param {Object} [param.attributes] Attributes of the obsel.
* @param {Array<Relation>} [param.relations] Relations from this obsel.
* @param {Array<Relation>} [param.inverse_relations] Relations to this obsel.
* @param {Array<Obsel>} [param.source_obsels] Source obsels of the obsel.
* @param {String} [param.label] Label of the obsel.
* @todo FIXME RELATIONS ARE NOT YET SUPPORTED
*/

var Obsel = function Obsel(param) {
  "use strict";
  this._private_check_error(param, 'id');
  this._private_check_error(param, 'trace');
  this._private_check_error(param, 'type');
  this._private_check_default(param, 'begin',	Date.now());
  this._private_check_default(param, 'end',		this.begin);
  this._private_check_default(param, 'attributes',	{});
  this._private_check_undef(param, 'relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'source_obsels',		[]);
  this._private_check_undef(param, 'label',		"");
};

Obsel.prototype = {
  // ATTRIBUTES
  attributes: {},
  relations: [],
  inverse_relations: [],
  source_obsels: [],
  label: "",
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * set the attribute of the same name with the default
  * value.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @param value Default value
  * @private
*/
  _private_check_default: function(param, attr, value) {
  "use strict";
  this[attr] = (param[attr] !== undefined)?param[attr]:value;
},
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * nothing happens.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @private
*/
  _private_check_undef: function(param, attr) {
  "use strict";
  if (param[attr] !== undefined) {
    this[attr] = param[attr];
  }
},
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * throw an error.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @private
*/
  _private_check_error: function(param, attr) {
  "use strict";
  if (param[attr] !== undefined) {
    this[attr] = param[attr];
  } else {
    throw "Parameter " + attr + " required.";
  }
},
  // RESOURCE
  /**
  * @summary
  * Remove the obsel from its trace.
  * @description
  * Remove the obsel from its trace.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:remove_obsel} event
*/
  remove: function() {
  "use strict";
  this.get_trace().remove_obsel(this);
},
  /**
  * @summary
  * Returns the id of the Obsel.
  * @returns {String} Id of the obsel.
*/
  get_id: function() {
  "use strict";
  return this.id;
},
  /**
  * @summary
  * Returns the label of the Obsel.
  * @returns {String} Label of the obsel.
*/
  get_label: function() {
  "use strict";
  return this.label;
},
  /**
  * @summary
  * Sets the label of the Obsel.
  * @param {String} Label of the obsel.
*/
  set_label: function(lbl) {
    "use strict";
  this.label = lbl; },
  /**
  * @summary
  * Sets the label of the Obsel to the empty string.
*/
  reset_label: function() {
  "use strict";
this.label = ""; },
  // OBSEL
  /**
  * @summary
  * Returns the trace the Obsel belongs to.
  * @returns {Trace} Trace the Obsel belongs to.
*/
  get_trace: 		function() {
  "use strict";
return this.trace; },
  /**
  * @summary
  * Returns the type of the Obsel.
  * @returns {String} Type of the obsel.
  * @todo TODO differs from KTBS API -> express it clearly
*/
  get_type: function() {
  "use strict";
return this.type; },
  /**
  * Returns the time when the Obsel starts.
  * @returns {Number} Time when the Obsel starts.
*/
  get_begin: 		function() {
    //return this.get_trace().get_origin_offset() + this.begin;
    "use strict";
    return this.begin;
  },
  /**
  * @summary
  * Returns the time when the Obsel ends.
  * @returns {Number} Time when the Obsel ends.
*/
  get_end: 		function() {
    //return this.get_trace().get_origin_offset() + this.end;
    "use strict";
    return this.end;
  },
  /**
  * @summary
  * Sets the type of the Obsel.
  * @description
  * Sets the type of the Obsel.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {String} type Type of the obsel.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_obsel_type: function(type) {
    "use strict";
    this.type = type;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Sets the time when the Obsel starts.
  * @description
  * Sets the time when the Obsel starts.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {Number} begin Time when the Obsel starts.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_begin: function(begin) {
    "use strict";
    this.begin = begin;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Sets the time when the Obsel ends.
  * @description
  * Sets the time when the Obsel ends.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {Number} end Time when the Obsel ends.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_end: 	function(end) {
    "use strict";
    this.end = end;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Returns the source Obsels of the current Obsel.
  * @returns {Array<Obsel>} Source Obsels of the current Obsel.
*/
  list_source_obsels: 	function() {
    "use strict";
    if (this.list_source_obsels === undefined) { return []; }
    return this.source_obsels;
  },
  /**
  * @summary
  * Returns the attribute names of the Obsel.
  * @returns {Array<String>} Attribute names of the Obsel.
*/
  list_attribute_types: 	function() {
    "use strict";
    if (this.attributes === undefined) { return []; }
    var attrs = [];
    for (var key in this.attributes) {
      if (this.attributes.hasOwnProperty(key))      {
        attrs.push(key);
      }
    }

    return attrs;
  },
  /**
  * @summary
  * Returns the relation types of the Obsel.
  * @returns {Array<String>} Relation types of the Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_relation_types: 	function() {
  "use strict";
  if (this.relations === undefined) { return []; }
  var rels = [];
  this.relations.forEach(function(r) {
    //var uniqueNames = [];
    if ($.inArray(r.type, rels) === -1) {
      rels.push(r.type);
    }
  });
  return rels;
},
  /**
  * @summary
  * Returns the Obsels related to the current Obsel with the given relation type.
  * @param {String} relation_type Relation type.
  * @returns {Array<Obsel>} Obsels related to the current Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_related_obsels: 	function(relation_type) {
  "use strict";
  var obss = [];
  if (this.relations !== undefined) {
    this.relations.forEach(function(r) {
      //var uniqueNames = [];
      if (r.type === relation_type) {
        obss.push(r.obsel_to);
      }
    });
  }
  if (this.inverse_relations !== undefined) {
    this.inverse_relations.forEach(function(r) {
      //var uniqueNames = [];
      if (r.type === relation_type) {
        obss.push(r.obsel_to);
      }
    });
  }
  return obss;
},
  /**
  * @summary
  * Returns the inverse relation types of the Obsel.
  * @returns {Array<String>} Inverse relation types of the Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_inverse_relation_types: function() {
  "use strict";
  if (this.inverse_relations === undefined) { return []; }
  var rels = [];
  this.inverse_relations.forEach(function(r) {
    //var uniqueNames = [];
    if ($.inArray(r.type, rels) === -1) {
      rels.push(r.type);
    }
  });
  return rels;
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Returns the value of an attribute.
  * @param {String} attr Attribute name.
  * @returns {Object} Attribute value.
  * @todo TODO Check consistency with KTBS API
*/
  get_attribute:	function(attr) {
  "use strict";
  if (this.attributes[attr] === undefined) {
    throw "Attribute " + attr + " is not defined"; // TODO
  } else {
    return this.attributes[attr];
  }
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Sets the value of an attribute.
  * @param {String} attr Attribute name.
  * @param {Object} val Attribute value.
  * @todo TODO Check consistency with KTBS API
*/
  set_attribute:	function(attr, val) {
  "use strict";
  this.attributes[attr] = val;
  this.trace.trigger('trace:edit_obsel', this);
  // TODO envoyer un event pour dier que l'obsel a changé
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Removes the attribute with the given name.
  * @description
  * Removes the attribute with the given name.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @todo TODO Check consistency with KTBS API.
  * @param {String} attr Attribute name.
*/
  del_attribute:			function(attr) {
  "use strict";
  delete this.attributes[attr];
  this.trace.trigger('trace:edit_obsel', this);
  // TODO envoyer un event pour dier que l'obsel a changé
},
  /**
  * @summary
  * Adds a relation with an Obsel.
  * @description
  * NOT YET IMPLEMENTED
  * @param {String} rel Relation type.
  * @param {Obsel} obs Target Obsel.
  * @todo TODO Check consistency with KTBS API
*/
  add_related_obsel:		function(rel, obs) {
  "use strict";

  // TODO
  throw "method not implemented yet";
  // TODO envoyer un event pour dier que l'obsel a changé
},
  /**
  * @summary
  * Removes a relation with an Obsel.
  * @description
  * NOT YET IMPLEMENTED
  * @param {String} rel Relation type.
  * @param {Obsel} obs Target Obsel.
  * @todo TODO Check consistency with KTBS API
*/
  del_related_obsel:		function(rel, obs) {
  "use strict";

  // TODO
  throw "method not implemented yet";
  // TODO envoyer un event pour dier que l'obsel a changé
},

  // NOT IN KTBS API
  /**
  * @summary
  * Copies the Obsel properties in an Object.
  * @description
  * Copies the Obsel properties in an Object
  * that can be used to create an Obsel with
  * {@link Samotraces.Obsel#Obsel} constructor or
  * {@link Samotraces.Trace#create_obsel} method.
  * @returns {Object} Object that
*/
  to_Object: function() {
  "use strict";
  var obj = {
    id: this.id,
    type: this.type,
    begin: this.begin,
    end: this.end,
    attributes: {},
    // use .slice to copy
    // TODO is it enough? <- might create bugs
    relations: this.relations.slice(),
    inverse_relations: this.inverse_relations.slice(),
    source_obsels: this.source_obsels.slice(),
    label: this.label
  };
  // copy each attributes
  for (var attr in this.attributes) {
    if (this.attributes.hasOwnProperty(attr)) {
      obj.attributes[attr] = this.attributes[attr];
    }
  }
  return obj;
},
};

module.exports = Obsel;

},{"jquery":"jquery"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS5qcyIsInNyYy9jb3JlL0V2ZW50SGFuZGxlci5qcyIsInNyYy9jb3JlL0tUQlMuQmFzZS5qcyIsInNyYy9jb3JlL0tUQlMuTW9kZWwuanMiLCJzcmMvY29yZS9LVEJTLk9ic2VsLmpzIiwic3JjL2NvcmUvS1RCUy5SZXNvdXJjZS5qcyIsInNyYy9jb3JlL0tUQlMuVHJhY2UuanMiLCJzcmMvY29yZS9LVEJTLmpzIiwic3JjL2NvcmUvT2JzZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL2NvcmUvRXZlbnRIYW5kbGVyLmpzXCIpO1xudmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL2NvcmUvT2JzZWwuanNcIik7XG52YXIgS3RicyA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5qc1wiKTtcbnZhciBLdGJzTW9kZWwgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuTW9kZWwuanNcIik7XG52YXIgS3Ric0Jhc2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuQmFzZS5qc1wiKTtcbnZhciBLdGJzVHJhY2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuVHJhY2UuanNcIik7XG5cblxudmFyIFNhbW90cmFjZXMgPSB7XG4gIE9ic2VsOiBPYnNlbCxcbiAgRXZlbnRIYW5kbGVyOiBFdmVudEhhbmRsZXIsXG4gIEt0YnM6IHtcbiAgICBLdGJzOiBLdGJzLFxuICAgIFJlc291cmNlOiBLVEJTUmVzb3VyY2UsXG4gICAgTW9kZWw6IEt0YnNNb2RlbCxcbiAgICBCYXNlOiBLdGJzQmFzZSxcbiAgICBUcmFjZTogS3Ric1RyYWNlLFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTYW1vdHJhY2VzO1xuIiwiLyoqXG4gKiBAbWl4aW5cbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIEV2ZW50SGFuZGxlciBPYmplY3QgaXMgbm90IGEgY2xhc3MuIEhvd2V2ZXIsIGl0IGlzXG4gKiBkZXNpZ25lZCBmb3Igb3RoZXIgY2xhc3NlcyB0byBpbmhlcml0IG9mIGEgcHJlZGVmaW5lZFxuICogT2JzZXJ2YWJsZSBiZWhhdmlvdXIuIEZvciB0aGlzIHJlYXNvbiwgdGhpcyBmdW5jdGlvbiBpc1xuICogZG9jdW1lbnRlZCBhcyBhIENsYXNzLlxuICpcbiAqIEluIG9yZGVyIHRvIHVzZSBjcmVhdGUgYSBjbGFzcyB0aGF0IFwiaW5oZXJpdHNcIiBmcm9tIHRoZVxuICogXCJFdmVudEhhbmRsZXIgY2xhc3NcIiwgb25lIG11c3QgcnVuIHRoZSBmb2xsb3dpbmcgY29kZSBpblxuICogdGhlIGNvbnN0cnVjdG9yOlxuICogPGNvZGU+XG4gKiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICogPC9jb2RlPlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjYWxsYmFja3NcbiAqICAgICBIYXNoIG1hdGNoaW5nIGNhbGxiYWNrcyB0byBldmVudF90eXBlcy5cbiAqL1xudmFyIEV2ZW50SGFuZGxlciA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogVHJpZ2dlcnMgYWxsIHRoZSByZWdpc3RyZWQgY2FsbGJhY2tzLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5wcm90b3R5cGVcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRfdHlwZVxuICBcdCAqICAgICBUaGUgdHlwZSBvZiB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgXHQgKiAgICAgT2JqZWN0IHNlbnQgd2l0aCB0aGUgbWVzc2FnZSB0byB0aGUgbGlzdGVuZXJzIChzZWVcbiAgXHQgKiAgICAge0BsaW5rIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyI29ufSkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnRfdHlwZSwgb2JqZWN0KSB7XG4gICAgdmFyIGUgPSB7IHR5cGU6IGV2ZW50X3R5cGUsIGRhdGE6IG9iamVjdCB9O1xuICAgIGlmICh0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSkge1xuICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0ubWFwKGZ1bmN0aW9uKGYpIHsgZihlKTsgfSk7XG4gICAgfVxuICAgIC8qXG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBcdFx0XHRjYWxsYmFjayhlKTtcbiAgICBcdFx0fSk7XG4gICAgXHRcdCovXG4gIH1cbiAgLyoqXG4gIFx0ICogQWRkcyBhIGNhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gdG8uXG4gIFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgXHQgKiAgICAgQ2FsbGJhY2sgdG8gY2FsbCB3aGVuIHRoZSBhbiBldmVudCBvZiB0eXBlXG4gIFx0ICogICAgIGV2ZW50X3R5cGUgaXMgdHJpZ2dlcmVkLiBOb3RlOiB0aGUgY2FsbGJhY2tcbiAgXHQgKiAgICAgY2FuIHJlY2VpdmUgb25lIGFyZ3VtZW50IHRoYXQgY29udGFpbnNcbiAgXHQgKiAgICAgZGV0YWlscyBhYm91dCB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqICAgICBUaGlzIGV2ZW50IGFyZ3VtZW50IGNvbnRhaW5zIHR3byBmaWVsZHM6XG4gIFx0ICogICAgIGV2ZW50LnR5cGU6IHRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXG4gIFx0ICogICAgIGV2ZW50LmRhdGE6IG9wdGlvbmFsIGRhdGEgdGhhdCBpcyB0cmFuc21pdHRlZCB3aXRoIHRoZSBldmVudFxuICBcdCAqL1xuICBmdW5jdGlvbiBvbihldmVudF90eXBlLCBjYWxsYmFjaykge1xuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGNhbGxiYWNrKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xuICAgICAgY29uc29sZS5sb2coY2FsbGJhY2spO1xuICAgICAgdGhyb3cgXCJDYWxsYmFjayBmb3IgZXZlbnQgXCIgKyBldmVudF90eXBlICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIjtcbiAgICB9XG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0gPSB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSB8fCBbXTtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAvLyBET0NVTUVOVEVEIEFCT1ZFXG4gICAgdGhpcy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcyB8fCB7fTtcbiAgICB0aGlzLnRyaWdnZXIgPSB0cmlnZ2VyO1xuICAgIHRoaXMub24gPSBvbjtcbiAgICAvKipcbiAgICBcdFx0ICogRXZlbnRDb25maWcgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICAgIFx0XHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9XG4gICAgXHRcdCAqIG9iamVjdC5cbiAgICBcdFx0ICogQHR5cGVkZWYgRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHNlZSBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ1xuICAgIFx0XHQgKi9cbiAgICAvKipcbiAgICBcdFx0ICogVGhlIEV2ZW50Q29uZmlnIG9iamVjdCBpcyB1c2VkIGZvciBjb25maWd1cmF0aW5nIHRoZVxuICAgIFx0XHQgKiBmdW5jdGlvbnMgdG8gY2FsbCBldmVudHMgYXJlIHRyaWdnZXJlZCBieSBhbiBFdmVudEhhbmRsZXIgT2JqZWN0LlxuICAgIFx0XHQgKiBFYWNoIGF0dHJpYnV0ZSBuYW1lIG9mIHRoZSBFdmVudENvbmZpZyBjb3JyZXNwb25kc1xuICAgIFx0XHQgKiB0byBhIHR5cGUgb2YgZXZlbnQgbGlzdGVuZWQgdG8sIGFuZCBlYWNoXG4gICAgXHRcdCAqIHZhbHVlIGlzIHRoZSBmdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqIEB0eXBlZGVmIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fVxuICAgIFx0XHQgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBldmVudE5hbWUgLSBGdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqL1xuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKGUpIHsgZnVuKGUuZGF0YSk7IH1cbiAgICBmb3IgKHZhciBldmVudF9uYW1lIGluIGV2ZW50cykge1xuICAgICAgXHRcdGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eShldmVudF9uYW1lKSkge1xuICAgICAgICBcdFx0dmFyIGZ1biA9IGV2ZW50c1tldmVudF9uYW1lXTtcbiAgICAgICAgXHRcdHRoaXMub24oZXZlbnRfbmFtZSwgY2FsbGJhY2spO1xuICAgICAgXHRcdH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SGFuZGxlcjtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMuQmFzZSBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5CYXNlIGlzIGEgSmF2YXNjcmlwdCBLVEJTIGJhc2VcbiAqIG9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy4gVGhpcyBPYmplY3QgaW1wbGVtZW50cyB0aGUgS1RCUyBBUEkuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZVxuICogbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBLVEJTIGJhc2UuIEFjY2VzcyBhXG4gKiBzcGVjaWZpYyB0cmFjZSwgZXRjLlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEJhc2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEJhc2UgdG8gbG9hZC5cbiAqL1xudmFyIEJhc2UgPSBmdW5jdGlvbiBCYXNlKHVyaSwgaWQpIHtcbiAgLy8gS1RCUy5CYXNlIGlzIGEgUmVzb3VyY2VcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgaWQsIHVyaSwgJ0Jhc2UnLCBcIlwiKTtcbiAgdGhpcy50cmFjZXMgPSBbXTtcbiAgdGhpcy5tb2RlbHMgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgZ2V0OiBmdW5jdGlvbihpZCkge30sXG4gIC8qKlxuICBcdCAqIEdldHMgdGhlIGxpc3Qgb2YgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgYmFzZS5cbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPFN0cmluZz59IEFycmF5IG9mIHRoZSBJRCBvZiB0aGUgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgQmFzZS5cbiAgXHQgKi9cbiAgbGlzdF90cmFjZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRyYWNlcztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X21vZGVsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzO1xuICB9LFxuICAvKipcbiAgXHQgKiBDcmVhdGUgYSBzdG9yZWQgdHJhY2UgaW4gdGhlIEtUQlNcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIGNyZWF0ZWQgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW21vZGVsXSB7TW9kZWx9IE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbb3JpZ2luXSB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtkZWZhdWx0X3N1YmplY3RdIHtTdHJpbmd9IERlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2xhYmVsXSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgY3JlYXRlX3N0b3JlZF90cmFjZTogZnVuY3Rpb24oaWQsIG1vZGVsLCBvcmlnaW4sIGRlZmF1bHRfc3ViamVjdCwgbGFiZWwpIHtcbiAgICB2YXIgbmV3X3RyYWNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiU3RvcmVkVHJhY2VcIixcbiAgICAgIFwiQGlkXCI6XHRcdGlkICsgXCIvXCJcbiAgICB9O1xuICAgIG5ld190cmFjZS5oYXNNb2RlbCA9IChtb2RlbCA9PT0gdW5kZWZpbmVkICB8fCBtb2RlbCA9PT0gIG51bGwpP1wiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWxcIjptb2RlbDtcbiAgICBuZXdfdHJhY2Uub3JpZ2luID0gKG9yaWdpbiA9PT0gdW5kZWZpbmVkIHx8IG9yaWdpbiA9PT0gIG51bGwgKT9cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI6b3JpZ2luO1xuICAgIC8vXHRcdFx0aWYob3JpZ2luPT11bmRlZmluZWQpIG5ld190cmFjZS5vcmlnaW4gPSBvcmlnaW47XG4gICAgaWYgKGRlZmF1bHRfc3ViamVjdCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UuZGVmYXVsdF9zdWJqZWN0ID0gZGVmYXVsdF9zdWJqZWN0O1xuICAgIGlmIChsYWJlbCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UubGFiZWwgPSBsYWJlbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpLFxuICAgICAgc3VjY2VzczogdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoLmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBlcnJvcicpO1xuICAgICAgICBjb25zb2xlLmxvZyhbanFYSFIsIHRleHRTdGF0dXMsIGVycm9yXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogQ3JlYXRlIGEgc3RvcmVkIHRyYWNlIGluIHRoZSBLVEJTXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSBjcmVhdGVkIHRyYWNlXG4gIFx0ICogQHBhcmFtIFttb2RlbF0ge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW29yaWdpbl0ge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbZGVmYXVsdF9zdWJqZWN0XSB7U3RyaW5nfSBEZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtsYWJlbF0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGNyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBkb2MgPSB7XG4gICAgICAnQGNvbnRleHQnOiAnaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0JyxcbiAgICAgICdAZ3JhcGgnOiBbe1xuICAgICAgICAnQGlkJzogaWQsXG4gICAgICAgICdAdHlwZSc6ICdUcmFjZU1vZGVsJyxcbiAgICAgICAgJ2luQmFzZSc6ICcuLycsXG4gICAgICAgICdoYXNVbml0JzogJ21pbGxpc2Vjb25kJ1xuICAgICAgfV1cbiAgICB9O1xuICAgIHZhciBuZXdfbW9kZWxfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YTogbmV3X21vZGVsX2RhdGEsXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuXG5cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBjcmVhdGVfY29tcHV0ZWRfdHJhY2U6IGZ1bmN0aW9uKGlkLCBtZXRob2QsIHBhcmFtZXRlcnMsIHNvdXJjZXMsIGxhYmVsKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICAvL2NyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQsIHBhcmVudHMsIGxhYmVsKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBjcmVhdGVfbWV0aG9kOiBmdW5jdGlvbihpZCwgcGFyZW50LCBwYXJhbWV0ZXJzLCBsYWJlbCkge30sXG4gIC8vLy8vLy8vLy8vXG4gIC8qKlxuICBcdCAqIE92ZXJsb2FkcyB0aGUge0BsaW5rIFNhbW90cmFjZXMuS1RCUy5SZXNvdWNlI19vbl9zdGF0ZV9yZWZyZXNoX30gbWV0aG9kLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vXHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdsYWJlbCcsIGRhdGFbXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWxcIl0sICdiYXNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ3RyYWNlcycsIGRhdGEuY29udGFpbnMsICdiYXNlOnVwZGF0ZScpO1xuICB9LFxuICAvLy8vLy8vLy8vLyBBRERFRCAvIEFQSVxuICAvKipcbiAgXHQgKiBHZXRzIGEgdHJhY2UgZnJvbSBpdHMgSURcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIHRyYWNlIHRvIGdldC5cbiAgXHQgKiBAcmV0dXJuIHtTYW1vdHJhY2VzLktUQlMuVHJhY2V9IFRoZSByZXRyaWV2ZWQgVHJhY2UuXG4gIFx0ICovXG4gIGdldF90cmFjZTogZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gbmV3IFNhbW90cmFjZXMuS1RCUy5UcmFjZSh0aGlzLnVyaSArIGlkICsgJy8nLCBpZCk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vL1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBNb2RlbCBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvIERFUkJFTCBGYXRtYVxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5Nb2RlbGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIE1vZGVsLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBMaXN0ZSBvZiB0eXBlIG9mIE9ic2VscyBmcm9tIHRoZSBLVEJTIE1vZGVsLCAuXG4gKlxuICpcbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cblxuXG52YXIgTW9kZWwgPSBmdW5jdGlvbih1cmksIGlkKSB7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnTW9kZWwnLCBcIlwiKTtcbiAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IFtdXG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG5cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGV0YWcgPSB0aGlzLmdldF9ldGFnKCk7XG4gICAgdGhpcy50cmlnZ2VyKCdNb2RlbDpnZXQnKTtcbiAgICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gdGhpcy5saXN0X29ic2VscyhkYXRhW1wiQGdyYXBoXCJdKTtcbiAgfSxcbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBMaXN0ZU9ic2VsVHlwZSA9IFtdO1xuICAgIHZhciBNID0gdGhpcztcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgdmFyIG9icyA9IHthdHRyaWJ1dGVzOiBbXX07XG4gICAgICBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIk9ic2VsVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzLmlkID0gZWxbXCJAaWRcIl07XG4gICAgICAgIG9icy50eXBlID0gZWxbXCJAaWRcIl0uc3Vic3RyKDEpO1xuICAgICAgICBvYnMuY29jaGUgPSBmYWxzZTtcbiAgICAgICAgLy9vYnNba2V5XSA9IGVsW2tleV1cbiAgICAgICAgaWYgKGVsWydoYXNTdXBlck9ic2VsVHlwZSddKSAgICAgICAge1xuICAgICAgICAgIG9icy5oYXNTdXBlck9ic2VsVHlwZSA9IGVsWydoYXNTdXBlck9ic2VsVHlwZSddXG4gICAgICAgIH1cbiAgICAgICAgTGlzdGVPYnNlbFR5cGUucHVzaChvYnMpO1xuICAgICAgICAvL00udHJpZ2dlcignTW9kZWw6RHJhd19vYnNlbCcsIG9icyk7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCd0cmlnZXInKVxuICAgICAgfSAgICAgIGVsc2UgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJBdHRyaWJ1dGVUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMgPSBNLkdldE9ic2VsVHlwZShlbFtcImhhc0F0dHJpYnV0ZU9ic2VsVHlwZVwiXSwgTGlzdGVPYnNlbFR5cGUpO1xuICAgICAgICBlbFsnY29jaGUnXSA9IGZhbHNlO1xuICAgICAgICBvYnMuYXR0cmlidXRlcy5wdXNoKGVsKTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5oYXNTdXBlck9ic2VsVHlwZSkgICAgICB7XG5cbiAgICAgICAgby5hdHRyaWJ1dGVzID0gTS5nZXRBdHRyaWJ1dGVzIChvLmhhc1N1cGVyT2JzZWxUeXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIE0udHJpZ2dlcignTW9kZWw6bGlzdGVUeXBlJywgTGlzdGVPYnNlbFR5cGUpO1xuICAgIHJldHVybiBMaXN0ZU9ic2VsVHlwZTtcblxuICB9LFxuXG4gIEdldE9ic2VsVHlwZTogZnVuY3Rpb24oaWQsIExpc3RlT2JzZWxUeXBlKSAge1xuICAgIHZhciBvYnMgPSBbXTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG9bXCJpZFwiXSA9PSBpZCkgICAgICB7XG5cbiAgICAgICAgb2JzUiA9IG87XG5cbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIG9ic1I7XG4gIH0sXG5cbiAgZ2V0QXR0cmlidXRlczogZnVuY3Rpb24oaWRlbnQpICB7XG5cbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG8uaWQgPT09IGlkZW50KSAgIHtcbiAgICAgICAgQXR0ID0gby5hdHRyaWJ1dGVzXG4gICAgICB9XG5cbiAgICB9XG4gICAgKVxuICAgIHJldHVybiBBdHQ7XG4gIH0sXG5cbiAgcHV0X21vZGVsOiBmdW5jdGlvbihtb2RlbGRhdGEpIHtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdGhhdC5vbiAoJ01vZGVsOmdldCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIGV0YWcgPSB0aGF0LmV0YWc7XG5cbiAgICAvLyBQVVRcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BVVCcsIHRoYXQuaWQsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdJZi1NYXRjaCcsIGV0YWcpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ09LT0tPSycpO1xuICAgICAgICAgIHJlc29sdmUobmV3IFNhbW90cmFjZXMuS3Ricy5Nb2RlbCh0aGF0LmlkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ1RoZXJlIHdhcyBhIG5ldHdvcmsgZXJyb3IuJykpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcblxuICB9KVxuICB9KTtcbn1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL09ic2VsLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW1vdHJhY2VzLktUQlMuT2JzZWwgaXMgcGFydCBvZiB0aGUgU2Ftb3RyYWNlcy5LVEJTIGltcGxlbWVudGF0aW9uLlxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuT2JzZWxcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEB0b2RvIFRPRE8gdXBkYXRlIHNldF9tZXRob2RzXG4gKiAtPiBzeW5jIHdpdGggS1RCUyBpbnN0ZWFkIG9mIGxvY2FsIGNoYW5nZVxuICovXG52YXIgS1RCU09ic2VsID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgcGFyYW0uaWQsIHBhcmFtLnVyaSwgJ09ic2VsJywgcGFyYW0ubGFiZWwgfHwgXCJcIik7XG5cbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xufVxuXG5LVEJTT2JzZWwucHJvdG90eXBlID0gT2JzZWwucHJvdG90eXBlO1xuXG4vKlxuU2Ftb3RyYWNlcy5LVEJTLk9ic2VsLnByb3RvdHlwZS5nZXRfa3Ric19zdGF0dXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMua3Ric19zdGF0dXNcbn07XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgUmVzb3VyY2UgT2JqZWN0cyB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIGtUQlNcbiAqIEBkZXNjcmlwdGlvbiBSZXNvdXJjZSBPYmplY3RzIGFyZSBLVEJTIG9iamVjdHMuIEFsbCByZXNvdXJjZXNcbiAqIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBjbGFzcyBSZXNvdXJjZSBPYmplY3RzIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJZCBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJJIG9mIHRoZSBSZXNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgUmVzb3VyY2UgKCdLVEJTJywnQmFzZScsXG4gKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKVxuICogQHBhcmFtIHtsYWJlbH0gW2xhYmVsXSBMYWJlbCBvZiB0aGUgUmVzb3VyY2VcbiAqL1xudmFyIEtUQlNSZXNvdXJjZSA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSB0eXBlICgnS1RCUycsJ0Jhc2UnLFxuICBcdCAqICAgICAnVHJhY2UnLCdTdG9yZWRUcmFjZScsJ0NvbXB1dGVkVHJhY2UnIG9yICdPYnNlbCcpLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfcmVzb3VyY2VfdHlwZSgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZShiYXNlLCByZWxhdGl2ZSkge1xuICAgIHZhciBzdGFjayA9IGJhc2Uuc3BsaXQoXCIvXCIpLFxuICAgICAgICBwYXJ0cyA9IHJlbGF0aXZlLnNwbGl0KFwiL1wiKTtcbiAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgZmlsZSBuYW1lIChvciBlbXB0eSBzdHJpbmcpXG4gICAgICAgICAgICAgICAgIC8vIChvbWl0IGlmIFwiYmFzZVwiIGlzIHRoZSBjdXJyZW50IGZvbGRlciB3aXRob3V0IHRyYWlsaW5nIHNsYXNoKVxuICAgIGZvciAodmFyIGk9MDsgaTxwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocGFydHNbaV0gPT0gXCIuXCIpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHBhcnRzW2ldID09IFwiLi5cIilcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFjay5wdXNoKHBhcnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YWNrLmpvaW4oXCIvXCIpO1xuICB9XG4gIC8vIFJFU09VUkNFIEFQSVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBJRCBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBJRC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X2lkKCkgeyByZXR1cm4gdGhpcy5pZDsgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBVUkkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF91cmkoKSB7IHJldHVybiB0aGlzLnVyaS5yZXBsYWNlKCcuLycsICcnKTsgfVxuICAvKipcbiAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgVVJJIG9mIHRoZSBSZXNvdXJjZS5cbiAgICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgVVJJLlxuICAgKi9cbmZ1bmN0aW9uIGdldF9ldGFnKCkgeyByZXR1cm4gdGhpcy5ldGFnOyB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgXG4gICAgICogICdvcHRpb25zLl9vbl9zdGF0ZV9yZWZyZXNoXyc6IHRydWV8ZmFsc2VcbiAgICAgKiAgIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBvbGQgYmVoYXZpb3Igb2YgY2FsbGluZyBfb25fc3RhdGVfcmVmcmVzaF8gb24gdGhlIHJlc291cmNlIGFmdGVyIHN5bmNocm9uaXNlIGNvbXBsZXRlc1xuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCUy5cbiAgXHQgKiBUaGlzIG1ldGhvZCB0cmlnZ2VycyBhIEFqYXggcXVlcnkgdGhhdCB3aWxsXG4gIFx0ICogdHJpZ2dlciB0aGUgX29uX3N0YXRlX3JlZnJlc2hfIG1ldGhvZCBvZiB0aGUgUmVzb3VyY2VcbiAgXHQgKiBvbiBzdWNjZXNzLlxuICBcdCAqL1xuICBmdW5jdGlvbiBmb3JjZV9zdGF0ZV9yZWZyZXNoKG9wdGlvbnMsIHN1Y2Nlc3MsIHJlamVjdCkge1xuICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIHJlamVjdCA9IHJlamVjdCB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7J19vbl9zdGF0ZV9yZWZyZXNoXyc6IHRydWV9OyAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXG4gICAgdmFyIHVybCA9IHRoaXMudXJpO1xuICAgIHZhciB0cmMgPSB0aGlzIDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICB4aHJGaWVsZHM6IHtcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKFhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblxuICAgICAgICBpZiAoWEhSLnN0YXR1cyA9PT0gJzQwMScpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyAoWEhSLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICAgICAgICB2YXIgTGluayA9IFhIUi5nZXRSZXNwb25zZUhlYWRlcignTGluaycpO1xuICAgICAgICAgIHZhciBEID0gTGluay5zcGxpdCAoJywnKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgRC5sZW5ndGg7aSsrKSAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgU291c0QgPSBEW2ldLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICB2YXIgbGluaztcbiAgICAgICAgICAgIHZhciBVUkxTdWNjZXNzO1xuICAgICAgICAgICAgaWYgKFNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rID0gU291c0RbMF0uc3Vic3RyKDEsIFNvdXNEWzBdLmxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFNvdXNEWzFdID09PSBcIiByZWw9c3VjY2Vzc2Z1bF9sb2dpbl9yZWRpcmVjdFwiKSAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVVJMU3VjY2VzcyA9IFNvdXNEWzBdLnN1YnN0cigyLCBTb3VzRFswXS5sZW5ndGggLSAzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2luZG93Lm9wZW4gKGxpbmspIDtcbiAgICAgICAgfVxuICAgICAgICByZWplY3QoWEhSKTtcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSwgdGV4dFN0YXR1cywgeGhyKXtcbiAgICAgICAgdHJjLmV0YWcgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0VUYWcnKTtcbiAgICAgICAgc3VjY2VzcyhkYXRhKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuX29uX3N0YXRlX3JlZnJlc2hfKSB7XG4gICAgICAgICAgdHJjLl9vbl9zdGF0ZV9yZWZyZXNoXyhkYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZVxuICBcdCAqIHdpdGggYXQgYSBnaXZlbiByZWZyZXNoaW5nIHJhdGUuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlIHdpdGggdGhlIEtUQlNcbiAgXHQgKiBldmVyeSBwZXJpb2Qgc2Vjb25kcy5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gcGVyaW9kIFRpbWUgaW4gc2Vjb25kcyBiZXR3ZWVuIHR3byBzeW5jaHJvbmlzYXRpb25zLlxuICBcdCAqL1xuXG5cbiAgZnVuY3Rpb24gc3RhcnRfYXV0b19yZWZyZXNoKHBlcmlvZCkge1xuICAgIHZhciBhID0gdGhpcy5hdXRvX3JlZnJlc2hfaWQ/dGhpcy5zdG9wX2F1dG9fcmVmcmVzaCgpOm51bGw7XG4gICAgdGhpcy5hdXRvX3JlZnJlc2hfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoLmJpbmQodGhpcyksIHBlcmlvZCAqIDEwMDApO1xuICB9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb25cbiAgXHQgKiBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTdG9wcyB0aGUgYXV0b3JlZnJlc2ggc3luY2hyb25pc2F0aW9uIG9mXG4gIFx0ICogdGhlIFJlc291cmNlLlxuICBcdCAqL1xuICBmdW5jdGlvbiBzdG9wX2F1dG9fcmVmcmVzaCgpIHtcbiAgICBpZiAodGhpcy5hdXRvX3JlZnJlc2hfaWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICAgIGRlbGV0ZSh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgfVxuICB9XG4gIC8vXHRcdGZ1bmN0aW9uIF9vbl9zdGF0ZV9yZWZyZXNoXyhkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGE7IGNvbnNvbGUubG9nKFwiaGVyZVwiKTsgfVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9yZWFkX29ubHkoKSB7fVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBEZWxldGUgdGhlIHJlc291cmNlIGZyb20gdGhlIEtUQlNcbiAgXHQgKiBAdG9kbyBJTVBST1ZFIFRISVMgTUVUSE9EIFNPIFRIQVQgUFJPUEVSIEVWRU5UIElTIFJBSVNFRFxuICBcdCAqICAgICBXSEVOIEEgUkVTT1VSQ0UgSVMgREVMRVRFRC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIGZ1bmN0aW9uIHJlZnJlc2hfcGFyZW50KCkge1xuICAgICAgLy9UUk9VVkVSIFVOIE1PWUVOIE1BTElOIERFIFJBRlJBSUNISVIgTEEgTElTVEUgREVTIEJBU0VTIERVIEtUQlMuLi5cbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnREVMRVRFJyxcbiAgICAgIHN1Y2Nlc3M6IHJlZnJlc2hfcGFyZW50LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIHRocm93IFwiQ2Fubm90IGRlbGV0ZSBcIiArIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUoKSArIFwiIFwiICsgdGhpcy51cmkgKyBcIjogXCIgKyB0ZXh0U3RhdHVzICsgJyAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3JUaHJvd24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBSZXNvdXJjZVxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfbGFiZWwoKSB7IHJldHVybiB0aGlzLmxhYmVsOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gc2V0X2xhYmVsKCkge31cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiByZXNldF9sYWJlbCgpIHt9XG5cbiAgLy8gQURERUQgRlVOQ1RJT05TXG4gIC8qKlxuICBcdCAqIE1ldGhvZCB1c2VkIHRvIGNoZWNrIGlmIHRoZSBkaXN0YW50IHZhbHVlIGlzIGRpZmZlcmVudFxuICBcdCAqIGZyb20gdGhlIGN1cnJlbnQgbG9jYWwgdmFsdWUgKGFuZCB1cGRhdGUgdGhlIGxvY2FsIHZhbHVlXG4gIFx0ICogaWYgdGhlcmUgaXMgYSBkaWZmZXJlbmNlLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICogQHBhcmFtIGxvY2FsX2ZpZWxkIHtTdHJpbmd9IE5hbWUgb2YgdGhlIGZpZWxkIG9mIHRoZSB0aGlzXG4gIFx0ICogICAgIG9iamVjdCBjb250YWluaW5nIHRoZSBpbmZvcm1hdGlvbiB0byBjaGVjay5cbiAgXHQgKiBAcGFyYW0gZGlzdGFudCB7VmFsdWV9IFZhbHVlIG9mIHRoZSBkaXN0YW50IGluZm9ybWF0aW9uLlxuICBcdCAqIEBwYXJhbSBtZXNzYWdlX2lmX2NoYW5nZWQge1N0cmluZ30gTWVzc2FnZSB0byB0cmlnZ2VyIGlmXG4gIFx0ICogICAgIHRoZSBpbmZvcm1hdGlvbiBoYXMgYmVlbiB1cGRhdGVkLlxuICBcdCAqL1xuICBmdW5jdGlvbiBfY2hlY2tfY2hhbmdlXyhsb2NhbF9maWVsZCwgZGlzdGFudCwgbWVzc2FnZV9pZl9jaGFuZ2VkKSB7XG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIHRoZSB3YW50ZWQgYmVoYXZpb3VyOlxuICAgIC8vIElmIGRpc3RhbnQgaXMgdW5kZWZpbmVkIC0+IHdoYXQgdG8gZG8/XG4gICAgaWYgKGRpc3RhbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzW2xvY2FsX2ZpZWxkXSAhPT0gZGlzdGFudCkge1xuICAgICAgdGhpc1tsb2NhbF9maWVsZF0gPSBkaXN0YW50O1xuICAgICAgdGhpcy50cmlnZ2VyKG1lc3NhZ2VfaWZfY2hhbmdlZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGlkLCB1cmksIHR5cGUsIGxhYmVsKSB7XG4gICAgLy8gYSBSZXNvdXJjZSBpcyBhbiBFdmVudEhhbmRsZXJcbiAgICBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICAvLyBBVFRSSUJVVEVTXG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMudXJpID0gdXJpO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIC8vIEFQSSBNRVRIT0RTXG4gICAgdGhpcy5nZXRfaWQgPSBnZXRfaWQ7XG4gICAgdGhpcy5nZXRfdXJpID0gZ2V0X3VyaTtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2ggPSBmb3JjZV9zdGF0ZV9yZWZyZXNoO1xuICAgIHRoaXMuZ2V0X3JlYWRfb25seSA9IGdldF9yZWFkX29ubHk7XG4gICAgdGhpcy5yZW1vdmUgPSByZW1vdmU7XG4gICAgdGhpcy5nZXRfbGFiZWwgPSBnZXRfbGFiZWw7XG4gICAgdGhpcy5zZXRfbGFiZWwgPSBzZXRfbGFiZWw7XG4gICAgdGhpcy5yZXNldF9sYWJlbCA9IHJlc2V0X2xhYmVsO1xuICAgIHRoaXMuZ2V0X2V0YWcgPSBnZXRfZXRhZztcbiAgICAvLyBoZWxwZXJcbiAgICB0aGlzLmdldF9yZXNvdXJjZV90eXBlID0gZ2V0X3Jlc291cmNlX3R5cGU7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXyA9IF9jaGVja19jaGFuZ2VfO1xuICAgIHRoaXMuc3RhcnRfYXV0b19yZWZyZXNoID0gc3RhcnRfYXV0b19yZWZyZXNoO1xuICAgIHRoaXMuc3RvcF9hdXRvX3JlZnJlc2ggPSBzdG9wX2F1dG9fcmVmcmVzaDtcbiAgICB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmU9Z2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTUmVzb3VyY2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBLVEJTT2JzZWwgPSByZXF1aXJlKFwiLi9LVEJTLk9ic2VsLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgdHJhY2UuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5UcmFjZSBpcyBhIEphdmFzY3JpcHQgVHJhY2Ugb2JqZWN0XG4gKiB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyB0cmFjZS4gVGhpcyBPYmplY3QgaW1wbGVtZW50cyB0aGUgS1RCUyBBUEkuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0XG4gKiB0aGUgT2JzZWxzIGZyb20gdGhlIEtUQlMgdHJhY2UsIGNyZWF0ZSBuZXcgT2JzZWxzLCBldGMuXG4gKlxuICogTm90ZTogdGhpcyBUcmFjZSBvYmplY3QgZG9lcyBub3QgaW1wbGVtZW50IGFsbCB0aGUgbWV0aG9kc1xuICogYXZhaWxhYmxlIGluIHRoZSBLVEJTIEFQSSB5ZXQuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgY2xhc3MgZG8gbm90IHN1cHBvcnQgdHJhbnNmb3JtYXRpb25zLlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqL1xudmFyIEtUQlNUcmFjZSA9IGZ1bmN0aW9uIFRyYWNlKHVyaSwgaWQpIHtcbiAgLy8gS1RCUy5UcmFjZSBpcyBhIFJlc291cmNlXG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnQmFzZScsIFwiXCIpO1xuXG4gIHRoaXMudGVtcCA9IHt9OyAvLyBhdHRyaWJ1dGUgdXNlZCB0byBzdG9yZSBhY3Rpb25zIG1hZGUgYnkgdGhlIHVzZXIgb24gdGhlIHRyYWNlIHdoaWxlIG5vdCBrbm93aW5nIGlmIHRoZXkgYXJlIGFsbG93ZWQuIGUuZy4sIGNyZWF0ZV9vYnNlbCwgd2hlbiB3ZSBkb24ndCBrbm93IHlldCBpZiB0aGUgVHJhY2UgaXMgYSBTdG9yZWRUcmFjZSBiZWNhdXNlIHRoZSBLVEJTIGRpZG4ndCByZXBseSB5ZXQuXG4gIHRoaXMuZGVmYXVsdF9zdWJqZWN0ID0gXCJcIjtcbiAgdGhpcy5tb2RlbF91cmkgPSBcIlwiO1xuICB0aGlzLm9ic2VsX2xpc3RfdXJpID0gdXJpICsgXCJAb2JzZWxzXCI7XG4gIHRoaXMuYmFzZV91cmkgPSBcIlwiO1xuICB0aGlzLm9yaWdpbiA9IFwiXCI7XG4gIC8vdGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKDApKS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgdGhpcy5vYnNlbF9saXN0ID0gW107IHRoaXMudHJhY2VTZXQgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5LVEJTVHJhY2UucHJvdG90eXBlID0ge1xuICAvLy8vLy8vLy8vLyBPRkZJQ0lBTCBBUElcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgYmFzZSB3aGVyZSB0aGUgdHJhY2UgaXMgc3RvcmVkLlxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZSB3aGVyZSB0aGUgdHJhY2UgaXMgc3RvcmVkLlxuICBcdCAqL1xuICBnZXRfYmFzZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZSh0aGlzLmdldF91cmkoKSx0aGlzLmJhc2VfdXJpKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgbW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEByZXR1cm5zIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgZ2V0X21vZGVsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUodGhpcy5nZXRfdXJpKCksdGhpcy5tb2RlbF91cmkpO1xuIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIG9yaWdpbiBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAdG9kbyBERUZJTkUgV0hBVCBJUyBBTiBPUklHSU5cbiAgXHQgKi9cbiAgZ2V0X29yaWdpbjogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiOyByZXR1cm4gdGhpcy5vcmlnaW47IH0sXG4gIC8vZ2V0X29yaWdpbl9vZmZzZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vcmlnaW5fb2Zmc2V0OyB9LFxuICAvKmt0YnNfb3JpZ2luX3RvX21zOiBmdW5jdGlvbihrdGJzX2RhdGVfc3RyKSB7XG4gIFx0XHR2YXIgWSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDAsNCk7XG4gIFx0XHR2YXIgTSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDUsMikgLSAxO1xuICBcdFx0dmFyIEQgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cig4LDIpO1xuICBcdFx0dmFyIGggPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxMSwyKTtcbiAgXHRcdHZhciBtID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTQsMik7XG4gIFx0XHR2YXIgcyA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDE3LDIpO1xuICBcdFx0dmFyIG1zID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMjAsMyk7XG4gIFx0XHRyZXR1cm4gRGF0ZS5VVEMoWSxNLEQsaCxtLHMsbXMpO1xuICBcdH0sKi9cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3NvdXJjZV90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgbGlzdF90cmFuc2Zvcm1lZF90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGxpc3Qgb2Ygb2JzZWxzIGluIGFuIG9wdGlvbmFsIHRpbWUgaW50ZXJ2YWwuXG4gIFx0ICogSWYgbm8gbWluaW11bSB0aW1lIGFuZCBubyBtYXhpbXVtIHRpbWUgY29uc3RyYWludCBhcmVcbiAgXHQgKiBkZWZpbmVkLCByZXR1cm5zIHRoZSB3aG9sZSBsaXN0IG9mIG9ic2Vscy5cbiAgXHQgKiBJZiBvbmUgb2YgdGhlIHR3byBjb25zdHJhaW50cyBhcmUgZGVmaW5lZCwgdGhlbiByZXR1cm5zXG4gIFx0ICogb2JzZWxzIG1hdGNoaW5nIHRoZSB0aW1lIGNvbnN0cmFpbnRzLlxuICBcdCAqXG4gIFx0ICogTm90ZTogaWYgYW4gb2JzZWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3RhcnQgb3IgdGhlIGVuZFxuICBcdCAqIGNvbnN0cmFpbnQsIHRoZW4gaXQgd2lsbCBiZSBpbmNsdWRlZCAoZm9yIGluc3RhbmNlIGFuXG4gIFx0ICogb2JzZWwgdGhhdCBzdGFydHMgYmVmb3JlIHRoZSBzdGFydCBjb25zdHJhaW50IGFuZCBlbmRzXG4gIFx0ICogYWZ0ZXIgdGhhdCBjb25zdHJhaW50IHdpbGwgYmUgaW5jbHVkZWQpLlxuICBcdCAqXG4gIFx0ICogTm90ZTogdGhlIGxpc3QgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgaXMgdGhlXG4gIFx0ICogbGlzdCBvZiBPYnNlbHMgdGhhdCBhcmUgbG9hZGVkIGxvY2FsbHkuXG4gIFx0ICogV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiBpcyBtYWRlIHRvIGtub3cgaWYgdGhlcmUgYXJlIG90aGVyIE9ic2VscyBtYXRjaGluZ1xuICBcdCAqIHRoZSBxdWVyeS4gSWYgc28sIHRoZXNlIG90aGVyIG9ic2VscyB3aWxsIGJlIGxvYWRlZFxuICBcdCAqIGluIHRoZSBsb2NhbCBjb3B5IG9mIHRoZSB0cmFjZSBhbmQgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmNyZWF0ZTpvYnNlbHx0cmFjZTpjcmVhdGU6b2JzZWx9XG4gIFx0ICogZXZlbnQgb3IgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnVwZGF0ZXx0cmFjZTp1cGRhdGV9XG4gIFx0ICogZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgdG8gbm90aWZ5IHRoYXQgb3RoZXJcbiAgXHQgKiBPYnNlbHMgaGF2ZSBiZWVuIGxvYWRlZC5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2JlZ2luXSBNaW5pbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbZW5kXSBNYXhpbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JldmVyc2U9ZmFsc2VdIFJldHVybnMgdGhlIG9ic2VsIGxpc3QgaW5cbiAgXHQgKiAgICAgcmV2ZXJzZSBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIHRydWUgYW5kIGluIG5vcm1hbFxuICBcdCAqICAgICBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIGZhbHNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48T2JzZWw+fSBMaXN0IG9mIHJlbGV2YW50IG9ic2Vsc1xuICBcdCAqIEB0b2RvIFJFVkVSU0UgSVMgTk9UIFlFVCBUQUtFTiBJTlRPIEFDQ09VTlRcbiAgXHQgKi9cbiAgLy8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0s/Pz9cbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGJlZ2luLCBlbmQsIHJldmVyc2UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm9ic2VsX2xpc3RfdXJpID0gdGhpcy51cmkgKyBcIkBvYnNlbHNcIjtcbiAgICBpZiAodGhpcy5vYnNlbF9saXN0X3VyaSA9PT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBLVEJTOlRyYWNlOmxpc3Rfb2JzZWxzKCkgdW5rbm93biB1cmlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIE9CSiA9IHRoaXM7XG5cbiAgICAvL1x0XHQkLmdldEpTT04odGhpcy5vYnNlbF9saXN0X3VyaSx0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfLmJpbmQodGhpcykpO1xuICAgIHZhciBPQkogPSB0aGlzO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMub2JzZWxfbGlzdF91cmksLy8rJy5qc29uJyxcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIGRhdGE6IHttaW5iOiBiZWdpbiwgbWF4YjogZW5kLCByZXZlcnNlOiByZXZlcnNlfSxcbiAgICAgIHhockZpZWxkczogeyB3aXRoQ3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihYSFIpIHtcbiAgICAgICAgaWYgKFhIUi5zdGF0dXMgPT09ICc0MDEnKSB7XG4gICAgICAgICAgdmFyIGxpbmtoZWFkZXIgPSBYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgICB2YXIgZCA9IGxpbmtoZWFkZXIuc3BsaXQgKCcsJyk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGQubGVuZ3RoO2krKykgICAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNvdXNEID0gZFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgICAgaWYgKHNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgbGluayA9IHNvdXNEWzBdLnN1YnN0cigxLCBzb3VzRFswXS5sZW5ndGggLSAyKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvL1x0dmFyXHRVUkxTdWNjZXNzID0gc291c0RbMF0uc3Vic3RyKDIsc291c0RbMF0ubGVuZ3RoLTMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1x0aWYgKGRhdGEub2JzZWxzLmxlbmd0aCA+IDApXHR7T0JKLkJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfIChkYXRhKTt9XHR9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgaWYgKGVuZCAmJiBvLmdldF9iZWdpbigpID4gZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGJlZ2luICYmIG8uZ2V0X2VuZCgpIDwgYmVnaW4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICBCZWZvcmVfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YVJlY3UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyBwYXIgcGFxdWV0XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpDb25maWcnLCBkYXRhUmVjdSk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbmQgPSBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKTtcblxuICAgIGlmIChkYXRhUmVjdS5vYnNlbHMpIHtcbiAgICAgIHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdS5vYnNlbHMsIGksIGVuZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1LCBpLCBlbmQpO1xuICAgIH1cblxuXG4gIH0sXG4gIF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXA6IGZ1bmN0aW9uKGRhdGFSZWN1LCBpLCBlbmQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIHZhciBkID0gZGF0YVJlY3UubGVuZ3RoIDtcbiAgICB2YXIgZGF0YVRvRHJhdyA9IGRhdGFSZWN1LnNsaWNlIChpLCBlbmQpO1xuICAgIGNvbnNvbGUubG9nICgnX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cCcpO1xuICAgICAgZm9yICh2YXIgaj0wIDsgIGogPCBkYXRhVG9EcmF3Lmxlbmd0aDsgaisrKXtcbiAgICAgICAgdGhpcy5fcGFyc2VfZ2V0X29ic2VsXyhkYXRhVG9EcmF3W2pdKTtcbiAgICAgICAgaWYgKGogPT09IGRhdGFUb0RyYXcubGVuZ3RoIC0xKXtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZVQnKTtcbiAgICAgICAgICB2YXIgaSA9IE51bWJlcihpKSArIGRhdGFUb0RyYXcubGVuZ3RoICsgTnVtYmVyKDEpO1xuICAgICAgICAgIHZhciBlbmQgPSAoTnVtYmVyKGkpICsgTnVtYmVyKDEwMCkgPiBkKT9kYXRhUmVjdS5sZW5ndGggOiBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKVxuICAgICAgICAgIGlmIChpIDw9IGQpICB7XG4gICAgICAgICAgICAgIHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdSwgaSwgZW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlQ29tcGxldGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgfSxcblxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgIGNvdW50ICsrO1xuICAgICAgdGhpcy5fcGFyc2VfZ2V0X29ic2VsXyhlbCk7XG4gICAgICBpZiAoY291bnQgPT09IGRhdGEubGVuZ3RoKSAgICAgIHt0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZVQnLCB0aGlzKTt9XG4gICAgfSwgdGhpcyk7XG5cblxuICB9LFxuXG4gIGdldF9MYXN0X29ic2VsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHZhciBtYXggPSAwO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpID4gbWF4KSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfRmlyc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1pbjEgPSA5OTk5OTk5OTk5OTk5O1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpIDwgbWluMSkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgZ2V0X0xpc3Rfb2JzZWxfUGFyVHlwZTogZnVuY3Rpb24ob2JzZWxUeXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGxpc3RlID0gW107XG5cbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby50eXBlID09PSBvYnNlbFR5cGUpIHsgbGlzdGUucHVzaChvKTsgfVxuICAgIH0pO1xuICAgIHJldHVybiBsaXN0ZTtcbiAgfSxcblxuXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgbG9jYWwgb2JzZWwgbGlzdCB0byBiZSBzeW5jaHJvbmlzZWRcbiAgXHQgKiB3aXRoIHRoZSBLVEJTIGF0IGEgZ2l2ZW4gcmVmcmVzaGluZyByYXRlLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG4gIHN0YXJ0X2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgYSA9IHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQ/dGhpcy5zdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0KCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9vYnNlbF9saXN0X2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMubGlzdF9vYnNlbHMuYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb25cbiAgXHQgKiBvZiB0aGUgb2JzZWwgbGlzdC5cbiAgXHQgKi9cbiAgc3RvcF9hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICAgIGRlbGV0ZSh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICBcdCAqIFJldHJpZXZlIGFuIG9ic2VsIGluIHRoZSB0cmFjZSBmcm9tIGl0cyBJRC5cbiAgXHQgKiBJZiB0aGUgb2JzZWwgZG9lcyBub3QgZXhpc3QgbG9jYWxseSwgcmV0dXJuc1xuICBcdCAqIHVuZGVmaW5lZCBhbmQgc2VuZCBhIHF1ZXJ5IHRvIHRoZSBLVEJTXG4gIFx0ICogKHdoaWNoIHdpbGwgcmVzdWx0IGluIGFkZGluZyB0aGlzIG9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBleGlzdHMgb24gdGhlIEtUQlMpLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJRCBvZiB0aGUgT2JzZWwgdG8gcmV0cmlldmVcbiAgXHQgKiBAcmV0dXJucyB7T2JzZWx9IE9ic2VsIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhpcyBJRFxuICBcdCAqICAgICBvciB1bmRlZmluZWQgaWYgdGhlIG9ic2VsIHdhcyBub3QgZm91bmQuXG4gIFx0ICogQHRvZG8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0tcbiAgXHQgKi9cbiAgZ2V0X29ic2VsOiBmdW5jdGlvbihpZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2lkKCkgPT09IGlkKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICBpZiAob2JzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHNlbmRzIGEgcXVlcnkgdG8gZmluZCB0aGUgb2JzZWxcbiAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgLy8gVE9ETyBpZGVhbGx5IEpTT04uLi4gV2hlbiBLVEJTIHN1cHBvcnRzIGl0IVxuICAgICAgICB1cmw6IHRoaXMudXJpICsgaWQsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBzdWNjZXNzOiB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfLmJpbmQodGhpcyksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQ2FsbGJhY2sgZm9yIHF1ZXJpZXMgd2hlcmUgYW4gb2JzZWwgaXMgZXhwZWN0ZWQgYXMgYSByZXN1bHRcbiAgXHQgKiBQYXJzZXMgdGhlIEpTT04gZGF0YSBmcm9tIHRoZSBLVEJTIHRvIGNyZWF0ZSBhIG5ldyBPYnNlbCBsb2NhbGx5XG4gIFx0ICogaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5LlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9wYXJzZV9nZXRfb2JzZWxfOiBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnMgPSB7XG4gICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgIH07XG5cbiAgICAvLyBPQlNFTCBJRFxuICAgIG9icy5pZCA9IGRhdGFbXCJAaWRcIl07XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gXCJDb21wdXRlZFRyYWNlXCIpIHtvYnMuaWQgPSBvYnMudHlwZSArIFwiX1wiICsgb2JzLmlkO31cbiAgICBpZiAob2JzLmlkLnN1YnN0cigwLCAyKSA9PT0gXCIuL1wiKSB7IG9icy5pZCA9IG9icy5pZC5zdWJzdHIoMik7IH1cblxuICAgIC8vIE9CU0VMIFRSQUNFXG4gICAgLy8gZGF0YS5oYXNUcmFjZTtcbiAgICBvYnMudHJhY2UgPSB0aGlzO1xuXG4gICAgLy8gT0JTRUwgVFlQRVxuICAgIC8vIGRhdGFbXCJAdHlwZVwiXTsgLy8gVE9ETyBCVUcgS1RCUyAtPiBVU0UgXCJtOnR5cGVcIiBpbnN0ZWFkXG4gICAgLy8gZGF0YVtcIm06dHlwZVwiXTtcbiAgICBvYnMudHlwZSA9IGRhdGFbXCJAdHlwZVwiXS5zdWJzdHIoMik7XG5cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJykpIHtcbiAgICAgIG9icy5sYWJlbCA9IGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIH1cbiAgICAvL29icy5iZWdpbiA9IGRhdGEuYmVnaW47XG4gICAgLy9vYnMuZW5kID0gZGF0YS5lbmQ7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSAodGhpcy5vcmlnaW4pO1xuICAgIG9icy5iZWdpbiA9IGQuZ2V0VGltZSgpICsgZGF0YS5iZWdpbiA7XG4gICAgb2JzLmVuZCA9IGQuZ2V0VGltZSgpICsgZGF0YS5lbmQ7XG5cbiAgICAvLyBERUxFVElORyBQUk9QRVJUSUVTIFRIQVQgSEFWRSBBTFJFQURZIEJFRU4gQ09QSUVEXG4gICAgZGVsZXRlIGRhdGFbXCJAaWRcIl07XG4gICAgZGVsZXRlIGRhdGEuaGFzVHJhY2U7XG4gICAgZGVsZXRlIGRhdGFbXCJAdHlwZVwiXTtcbiAgICBkZWxldGUgZGF0YS5iZWdpbjtcbiAgICBkZWxldGUgZGF0YS5lbmQ7XG4gICAgZGVsZXRlIGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIC8vZGVsZXRlIGRhdGFbXCJtOnR5cGVcIl07XG5cblxuICAgIC8vIEFUVFJJQlVURVNcbiAgICBmb3IgKHZhciBhdHRyIGluIGRhdGEpIHtcbiAgICAgIGlmIChhdHRyLnN1YnN0cigwLCAyKSA9PT0gXCJtOlwiKSB7IC8vIFRPRE8gdGhpcyBpcyBub3QgZ2VuZXJpYyEhISFcbiAgICAgICAgb2JzLmF0dHJpYnV0ZXNbYXR0ci5zdWJzdHIoMildID0gZGF0YVthdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhkYXRhLG9icyk7XG4gICAgdmFyIG8gPSBuZXcgS1RCU09ic2VsKG9icyk7XG4gICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7IC8vIFRPRE8gZmlyc3QgYXBwcm94aW1hdGlvblxuICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gIFx0ICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cdFx0Y29uc29sZS5sb2coZGF0YSk7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXyhkYXRhWydAdHlwZSddKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdkZWZhdWx0X3N1YmplY3QnLCBkYXRhLmhhc0RlZmF1bHRTdWJqZWN0LCAnJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbW9kZWxfdXJpJywgZGF0YS5oYXNNb2RlbCwgJ3RyYWNlOm1vZGVsJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnb2JzZWxfbGlzdF91cmknLCBkYXRhLmhhc09ic2VsTGlzdCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VfdXJpJywgZGF0YS5pbkJhc2UsICd0cmFjZTpiYXNlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luJywgZGF0YS5vcmlnaW4sICd0cmFjZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdsYWJlbCcsIGRhdGEubGFiZWwsICd0cmFjZTp1cGRhdGUnKTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZURhdGEnLCBkYXRhKTtcbiAgICAvL3RoaXMuX2NoZWNrX2NoYW5nZV8oJ29yaWdpbl9vZmZzZXQnLHRoaXMua3Ric19vcmlnaW5fdG9fbXMoZGF0YS5vcmlnaW4pLCcnKTtcbiAgfSxcbiAgX3VwZGF0ZV9tZXRob2RfOiBmdW5jdGlvbih0cmFjZV90eXBlLCBtZXRob2RfbmFtZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXNbbWV0aG9kX25hbWVdID0gdGhpc1t0cmFjZV90eXBlICsgXCJfbWV0aG9kc1wiXVttZXRob2RfbmFtZV07XG4gICAgaWYgKHRoaXMudGVtcFttZXRob2RfbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50ZW1wW21ldGhvZF9uYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHRoaXNbbWV0aG9kX25hbWVdKHBhcmFtKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgX2NoZWNrX2FuZF91cGRhdGVfdHJhY2VfdHlwZV86IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy50eXBlICE9PSB0eXBlKSB7XG4gICAgICBmb3IgKHZhciBtZXRob2RfbmFtZSBpbiB0aGlzW3R5cGUgKyBcIl9tZXRob2RzXCJdKSB7XG4gICAgICAgIGlmICh0aGlzW3R5cGUgKyBcIl9tZXRob2RzXCJdLmhhc093blByb3BlcnR5KG1ldGhvZF9uYW1lKSkgICAgICAgIHt0aGlzLl91cGRhdGVfbWV0aG9kXyh0eXBlLCBtZXRob2RfbmFtZSk7fVxuICAgICAgfVxuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG4gIH0sXG4gIC8vLy8vLy8vLy8vXG4gIC8qXHRfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YSkge1xuICAvL1x0XHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgXHRcdHZhciBpZCwgbGFiZWwsIHR5cGUsIGJlZ2luLCBlbmQsIGF0dHJpYnV0ZXMsIG9icztcbiAgXHRcdHZhciBuZXdfb2JzZWxfbG9hZGVkID0gZmFsc2U7XG4gIFx0XHRkYXRhLm9ic2Vscy5mb3JFYWNoKGZ1bmN0aW9uKGVsLGtleSkge1xuICBcdFx0XHR0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgLypcbiAgXHRcdFx0dmFyIGF0dHIgPSB7fTtcbiAgXHRcdFx0YXR0ci5pZCA9IGVsWydAaWQnXTtcbiAgXHRcdFx0YXR0ci50cmFjZSA9IHRoaXM7XG4gIFx0XHRcdGF0dHIubGFiZWwgPSBlbFsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ10gfHwgdW5kZWZpbmVkO1xuICBcdFx0XHRhdHRyLnR5cGUgPSBlbFsnQHR5cGUnXTtcbiAgXHRcdFx0YXR0ci5iZWdpbiA9IGVsWydiZWdpbiddO1xuICBcdFx0XHRhdHRyLmVuZCA9IGVsWydlbmQnXTtcbiAgXHRcdFx0YXR0ci5hdHRyaWJ1dGVzID0gZWw7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0BpZCddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydAdHlwZSddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snYmVnaW4nXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ2VuZCddKTtcbiAgXHRcdFx0b2JzID0gbmV3IFNhbW90cmFjZXMuS1RCUy5PYnNlbChhdHRyKTtcblxuICBcdFx0XHRpZighIHRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8ob2JzKSkge1xuICBcdFx0XHRcdG5ld19vYnNlbF9sb2FkZWQgPSB0cnVlO1xuICBcdFx0XHR9XG4qL1xuICAvL30sdGhpcyk7XG4gIC8qXHRcdGlmKG5ld19vYnNlbF9sb2FkZWQpIHtcbiAgXHRcdFx0dGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGUnLHRoaXMudHJhY2VTZXQpO1xuICBcdFx0fVxuKi9cbiAgLy99LCovXG4gIF9jaGVja19vYnNlbF9sb2FkZWRfOiBmdW5jdGlvbihvYnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5vYnNlbF9saXN0LnNvbWUoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uZ2V0X2lkKCkgPT09IG9icy5nZXRfaWQoKTsgLy8gZmlyc3QgYXBwcm94aW1hdGlvbjogb2JzZWwgaGFzIHRoZSBzYW1lIElEID0+IGl0IGlzIGFscmVhZHkgbG9hZGVkLi4uIFdlIGRvbid0IGNoZWNrIGlmIHRoZSBvYnNlbCBoYXMgY2hhbmdlZCFcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZWxfbGlzdC5wdXNoKG9icyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICBTdG9yZWRUcmFjZV9tZXRob2RzOiB7XG4gICAgc2V0X21vZGVsOiBmdW5jdGlvbihtb2RlbCkge30sXG4gICAgc2V0X29yaWdpbjogZnVuY3Rpb24ob3JpZ2luKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgICAgLy9cdHRoaXMub3JpZ2luX29mZnNldCA9IChuZXcgRGF0ZShvcmlnaW4pKS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICAgIC8vIFRPRE8gc3luYyB3aXRoIEtUQlNcbiAgICB9LFxuICAgIGdldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0X3N1YmplY3Q7XG4gICAgfSxcbiAgICBzZXRfZGVmYXVsdF9zdWJqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7fSxcbiAgICBjcmVhdGVfb2JzZWw6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgLy8gTE9DQUwgVFJBQ0VcbiAgICAgIC8vdmFyIG9icyA9IG5ldyBTYW1vdHJhY2VzLk9ic2VsKG9ic2VsX3BhcmFtcyk7XG4gICAgICAvLyBLVEJTIEJPR1VFXG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHZhciBqc29uX29ic2VsID0ge1xuICAgICAgICBcIkBjb250ZXh0XCI6XHRbXG4gICAgICAgIFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0XCIsXG4gICAgICAgICAgICAgICB7IFwibVwiOiBcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEvc2ltcGxlLXRyYWNlLW1vZGVsI1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJAdHlwZVwiOlx0XCJtOlwiICsgcGFyYW1zLnR5cGUsIC8vIGZpeGVkOiBcIlNpbXBsZU9ic2VsXCIsIC8vIFRPRE8gS1RCUyBCVUcgVE8gRklYXG4gICAgICAgIGhhc1RyYWNlOlx0XCJcIixcbiAgICAgICAgc3ViamVjdDpcdHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCksXG4gICAgICAgIC8vXCJtOnR5cGVcIjpcdHBhcmFtcy50eXBlXG4gICAgICB9O1xuICAgICAgLy9jb25zb2xlLmxvZyhwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJzdWJqZWN0XCIpP3BhcmFtcy5zdWJqZWN0OnRoaXMuZ2V0X2RlZmF1bHRfc3ViamVjdCgpLHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIikscGFyYW1zLnN1YmplY3QsdGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkpO1xuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImJlZ2luXCIpKSB7IGpzb25fb2JzZWwuYmVnaW4gPSBwYXJhbXMuYmVnaW47IH1cbiAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJlbmRcIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5lbmQ7fVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImF0dHJpYnV0ZXNcIikpIHtcbiAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBwYXJhbXMuYXR0cmlidXRlcykge1xuICAgICAgICAgIGlmIChwYXJhbXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkgICAgICAgICAge2pzb25fb2JzZWxbXCJtOlwiICsgYXR0cl0gPSBwYXJhbXMuYXR0cmlidXRlc1thdHRyXTt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgLypcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xvY2F0aW9uJyk7XG4gICAgICAgIFx0XHRcdFx0dmFyIHVybF9hcnJheSA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICBcdFx0XHRcdCovXG5cbiAgICAgICAgdmFyIHVybF9hcnJheSA9IGRhdGEuc3BsaXQoJy8nKTtcbiAgICAgICAgdmFyIG9ic2VsX2lkID0gdXJsX2FycmF5W3VybF9hcnJheS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy90aGlzLmdldF9vYnNlbChvYnNlbF9pZCk7XG4gICAgICAgIC8vIE9wdGltaXNhdGlvbjogZG8gbm90IGRvIGEgR0VUIHF1ZXJ5IHRvIGdldCB0aGUgT0JTRUxcbiAgICAgICAgLy8gVGhlIE9ic2VsIHBhcmFtZXRlcnMgYXJlIGFscmVhZHkga25vd24gaW4gcGFyYW1cbiAgICAgICAgLy8gV2UganVzdCBuZWVkIHRvIGFkZCB0aGUgSUQuXG4gICAgICAgIHBhcmFtcy5pZCA9IG9ic2VsX2lkO1xuICAgICAgICBwYXJhbXMudHJhY2UgPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwocGFyYW1zKTtcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBzdWNjZXNzOiBfb25fY3JlYXRlX29ic2VsX3N1Y2Nlc3NfLmJpbmQodGhpcyksXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGpzb25fb2JzZWwpXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgQ29tcHV0ZWRUcmFjZV9tZXRob2RzOiB7XG4gICAgc2V0X21ldGhvZDogZnVuY3Rpb24obWV0aG9kKSB7fSxcbiAgICBsaXN0X3BhcmFtZXRlcnM6IGZ1bmN0aW9uKGluY2x1ZGVfaW5oZXJpdGVkKSB7fSxcbiAgICBnZXRfcGFyYW1ldGVyOiBmdW5jdGlvbihrZXkpIHt9LFxuICAgIHNldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHt9LFxuICAgIGRlbF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge31cbiAgfSxcblxuICAvLyBURU1QT1JBUlkgTUVUSE9EU1xuICBjcmVhdGVfb2JzZWw6IGZ1bmN0aW9uKG9ic2VsX3BhcmFtcykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICghdGhpcy5jcmVhdGVfb2JzZWwuaGFzT3duUHJvcGVydHkoJ2NyZWF0ZV9vYnNlbCcpKSB7XG4gICAgICB0aGlzLnRlbXAuY3JlYXRlX29ic2VsID0gW107XG4gICAgfVxuICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwucHVzaCAob2JzZWxfcGFyYW1zKTtcbiAgfSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTVHJhY2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBLVEJTQmFzZSA9IHJlcXVpcmUoXCIuL0tUQlMuQmFzZS5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuS1RCUyBpcyBhIEphdmFzY3JpcHQgS1RCUyBvYmplY3QgdGhhdFxuKiBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWV0bnMgdGhlIEtUQlMgQVBJLlxuKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZSBsaXN0IG9mIGJhc2VzXG4qIGF2YWlsYWJsZSBpbiB0aGUgS1RCUy4gQWNjZXNzIGEgc3BlY2lmaWMgYmFzZSwgZXRjLlxuKlxuKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRvIGxvYWQuXG4qL1xudmFyIEtUQlMgPSBmdW5jdGlvbiBLVEJTKHVyaSkge1xuICAvLyBLVEJTIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHVyaSwgdXJpLCAnS1RCUycsIFwiXCIpO1xuICB0aGlzLmJhc2VzID0gW107XG4gIHRoaXMuYnVpbHRpbl9tZXRob2RzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCUy5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBsaXN0X2J1aWx0aW5fbWV0aG9kczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuKi9cbiAgZ2V0X2J1aWx0aW5fbWV0aG9kOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiB0aGUgVVJJIG9mIHRoZSBiYXNlcyBjb250YWluZWQgaW4gdGhlIEtUQlNcbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXJyYXkgb2YgVVJJIG9mIGJhc2VzLlxuKi9cbiAgbGlzdF9iYXNlczogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmFzZXM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIEtUQlMuQmFzZSB3aXRoIHRoZSBnaXZlbiBJRC5cbiAgKiBAcmV0dXJucyBTYW1vdHJhY2VzLktUQlMuQmFzZSBCYXNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIElEXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZVxuKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBLVEJTQmFzZSh0aGlzLnVyaSArIGlkLCBpZCk7XG4gIH0sXG4gIC8qKlxuICAqIENyZWF0ZSBhIG5ldyBiYXNlLlxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2UgKG9wdGlvbmFsKVxuICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4qL1xuICBjcmVhdGVfYmFzZTogZnVuY3Rpb24oaWQsIGxhYmVsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld19iYXNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiQmFzZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIixcbiAgICAgIFwibGFiZWxcIjpcdGxhYmVsXG4gICAgfTtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfYmFzZSksXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gICogQHByaXZhdGVcbiovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VzJywgZGF0YS5oYXNCYXNlLCAna3Riczp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdidWlsdGluX21ldGhvZHMnLCBkYXRhLmhhc0J1aWxkaW5NZXRob2QsICdrdGJzOnVwZGF0ZScpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiogT2JzZWwgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5PYnNlbH1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBPYnNlbFxuKiBAc2VlIFNhbW90cmFjZXMuT2JzZWxcbiovXG5cbi8qKlxuKiBPYnNlbFBhcmFtIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHBhcmFtZXRlcnNcbiogbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIG5ldyBvYnNlbC5cbiogVGhpcyB0eXBlIG9mIG9iamVjdCBpcyB1c2VkIGluIHNldmVyYWwgbWV0aG9kc1xuKiBzdWNoIGFzIHRoZSBPYnNlbCBjb25zdHJ1Y3Rvciwgb3IgdGhlXG4qIFRyYWNlLmNyZWF0ZV9vYnNlbCBtZXRob2QuXG4qIFRoZSBvcHRpb25hbCBwb3JwZXJ0aWVzIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlXG4qIG1ldGhvZCBjYWxsZWQuXG4qIEB0eXBlZGVmIE9ic2VsUGFyYW1cbiogQHByb3BlcnR5IHtTdHJpbmd9IFtpZF0gSWQgb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7VHJhY2V9IFt0cmFjZV0gVHJhY2Ugb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZV0gVHlwZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFtiZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcHJvcGVydHkge051bWJlcn0gW2VuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHByb3BlcnR5IHtPYmplY3R9IFthdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtyZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8UmVsYXRpb24+fSBbaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PE9ic2VsPn0gW3NvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIERFRklORSBXSEFUIElTIEEgUkVMQVRJT05cbiovXG5cbi8qKlxuKiBAc3VtbWFyeSBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBjbGFzcyBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBwYXJhbSB7T2JzZWxQYXJhbX0gcGFyYW0gUGFyYW1ldGVycyBvZiB0aGUgb2JzZWxcbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLmlkIElkZW50aWZpZXIgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1RyYWNlfSBwYXJhbS5UcmFjZSBUcmFjZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7U3RyaW5nfSBwYXJhbS50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmJlZ2luPURhdGUubm93KCldIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBzdGFydHNcbiogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbS5lbmQ9cGFyYW0uYmVnaW5dIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBlbmRzXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW0uYXR0cmlidXRlc10gQXR0cmlidXRlcyBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0ucmVsYXRpb25zXSBSZWxhdGlvbnMgZnJvbSB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW3BhcmFtLmludmVyc2VfcmVsYXRpb25zXSBSZWxhdGlvbnMgdG8gdGhpcyBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtwYXJhbS5zb3VyY2Vfb2JzZWxzXSBTb3VyY2Ugb2JzZWxzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbS5sYWJlbF0gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKiBAdG9kbyBGSVhNRSBSRUxBVElPTlMgQVJFIE5PVCBZRVQgU1VQUE9SVEVEXG4qL1xuXG52YXIgT2JzZWwgPSBmdW5jdGlvbiBPYnNlbChwYXJhbSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ2lkJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2xhYmVsJyxcdFx0XCJcIik7XG59O1xuXG5PYnNlbC5wcm90b3R5cGUgPSB7XG4gIC8vIEFUVFJJQlVURVNcbiAgYXR0cmlidXRlczoge30sXG4gIHJlbGF0aW9uczogW10sXG4gIGludmVyc2VfcmVsYXRpb25zOiBbXSxcbiAgc291cmNlX29ic2VsczogW10sXG4gIGxhYmVsOiBcIlwiLFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiBzZXQgdGhlIGF0dHJpYnV0ZSBvZiB0aGUgc2FtZSBuYW1lIHdpdGggdGhlIGRlZmF1bHRcbiAgKiB2YWx1ZS5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwYXJhbSB2YWx1ZSBEZWZhdWx0IHZhbHVlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2RlZmF1bHQ6IGZ1bmN0aW9uKHBhcmFtLCBhdHRyLCB2YWx1ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpc1thdHRyXSA9IChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKT9wYXJhbVthdHRyXTp2YWx1ZTtcbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIG5vdGhpbmcgaGFwcGVucy5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja191bmRlZjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9XG59LFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiB0aHJvdyBhbiBlcnJvci5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja19lcnJvcjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFwiUGFyYW1ldGVyIFwiICsgYXR0ciArIFwiIHJlcXVpcmVkLlwiO1xuICB9XG59LFxuICAvLyBSRVNPVVJDRVxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZSB0aGUgb2JzZWwgZnJvbSBpdHMgdHJhY2UuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpyZW1vdmVfb2JzZWx9IGV2ZW50XG4qL1xuICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5nZXRfdHJhY2UoKS5yZW1vdmVfb2JzZWwodGhpcyk7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBJZCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfaWQ6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMuaWQ7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMubGFiZWw7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcGFyYW0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5sYWJlbCA9IGxibDsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgT2JzZWwgdG8gdGhlIGVtcHR5IHN0cmluZy5cbiovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG50aGlzLmxhYmVsID0gXCJcIjsgfSxcbiAgLy8gT0JTRUxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0cmFjZSB0aGUgT2JzZWwgYmVsb25ncyB0by5cbiAgKiBAcmV0dXJucyB7VHJhY2V9IFRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuKi9cbiAgZ2V0X3RyYWNlOiBcdFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHJhY2U7IH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge1N0cmluZ30gVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBkaWZmZXJzIGZyb20gS1RCUyBBUEkgLT4gZXhwcmVzcyBpdCBjbGVhcmx5XG4qL1xuICBnZXRfdHlwZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHlwZTsgfSxcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHJldHVybnMge051bWJlcn0gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4qL1xuICBnZXRfYmVnaW46IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmJlZ2luO1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmJlZ2luO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4qL1xuICBnZXRfZW5kOiBcdFx0ZnVuY3Rpb24oKSB7XG4gICAgLy9yZXR1cm4gdGhpcy5nZXRfdHJhY2UoKS5nZXRfb3JpZ2luX29mZnNldCgpICsgdGhpcy5lbmQ7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9vYnNlbF90eXBlOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEBwYXJhbXMge051bWJlcn0gYmVnaW4gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2JlZ2luOiBmdW5jdGlvbihiZWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuYmVnaW4gPSBiZWdpbjtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBlbmQgVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9lbmQ6IFx0ZnVuY3Rpb24oZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgc291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8T2JzZWw+fSBTb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuKi9cbiAgbGlzdF9zb3VyY2Vfb2JzZWxzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmxpc3Rfc291cmNlX29ic2VscyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZV9vYnNlbHM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgYXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiovXG4gIGxpc3RfYXR0cmlidXRlX3R5cGVzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge1xuICAgICAgICBhdHRycy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gUmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRpb25fdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgdmFyIHJlbHMgPSBbXTtcbiAgdGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgICByZWxzLnB1c2goci50eXBlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVscztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwgd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpb25fdHlwZSBSZWxhdGlvbiB0eXBlLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IE9ic2VscyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRlZF9vYnNlbHM6IFx0ZnVuY3Rpb24ocmVsYXRpb25fdHlwZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9ic3MgPSBbXTtcbiAgaWYgKHRoaXMucmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2Jzcztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge0FycmF5PFN0cmluZz59IEludmVyc2UgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfaW52ZXJzZV9yZWxhdGlvbl90eXBlczogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgaWYgKCQuaW5BcnJheShyLnR5cGUsIHJlbHMpID09PSAtMSkge1xuICAgICAgcmVscy5wdXNoKHIudHlwZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbHM7XG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiAgKiBAcmV0dXJucyB7T2JqZWN0fSBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBnZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHRoaXMuYXR0cmlidXRlc1thdHRyXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgXCJBdHRyaWJ1dGUgXCIgKyBhdHRyICsgXCIgaXMgbm90IGRlZmluZWRcIjsgLy8gVE9ET1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIH1cbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgQXR0cmlidXRlIHZhbHVlLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgc2V0X2F0dHJpYnV0ZTpcdGZ1bmN0aW9uKGF0dHIsIHZhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsO1xuICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUEkuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4qL1xuICBkZWxfYXR0cmlidXRlOlx0XHRcdGZ1bmN0aW9uKGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBBZGRzIGEgcmVsYXRpb24gd2l0aCBhbiBPYnNlbC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBOT1QgWUVUIElNUExFTUVOVEVEXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbCBSZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBhZGRfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLCBvYnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVE9ET1xuICB0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZXMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGRlbF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG5cbiAgLy8gTk9UIElOIEtUQlMgQVBJXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0XG4gICogdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYW4gT2JzZWwgd2l0aFxuICAqIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsI09ic2VsfSBjb25zdHJ1Y3RvciBvclxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI2NyZWF0ZV9vYnNlbH0gbWV0aG9kLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB0aGF0XG4qL1xuICB0b19PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9iaiA9IHtcbiAgICBpZDogdGhpcy5pZCxcbiAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgYmVnaW46IHRoaXMuYmVnaW4sXG4gICAgZW5kOiB0aGlzLmVuZCxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAvLyB1c2UgLnNsaWNlIHRvIGNvcHlcbiAgICAvLyBUT0RPIGlzIGl0IGVub3VnaD8gPC0gbWlnaHQgY3JlYXRlIGJ1Z3NcbiAgICByZWxhdGlvbnM6IHRoaXMucmVsYXRpb25zLnNsaWNlKCksXG4gICAgaW52ZXJzZV9yZWxhdGlvbnM6IHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBzb3VyY2Vfb2JzZWxzOiB0aGlzLnNvdXJjZV9vYnNlbHMuc2xpY2UoKSxcbiAgICBsYWJlbDogdGhpcy5sYWJlbFxuICB9O1xuICAvLyBjb3B5IGVhY2ggYXR0cmlidXRlc1xuICBmb3IgKHZhciBhdHRyIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgIG9iai5hdHRyaWJ1dGVzW2F0dHJdID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqO1xufSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWw7XG4iXX0=
