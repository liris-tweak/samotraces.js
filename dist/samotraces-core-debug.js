(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Samotraces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(JSON.stringify(new_trace));
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

    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(new_model_data);
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

    var functionsByStatus = {
      '200' : function (xhr) {
        trc.etag = xhr.getResponseHeader('ETag'); // TODO this cause 'Refused to get unsafe header "ETag"' on KTBS 0.3
        var jsonResponse = JSON.parse(xhr.response);
        success(jsonResponse);
        if (options._on_state_refresh_) {
          trc._on_state_refresh_(jsonResponse);
        }
      },
      '401': function (xhr) {
        console.log (xhr.getAllResponseHeaders());
        var link = xhr.getResponseHeader('Link');
        var d = link.split (',');
        for (var i = 0;i < d.length;i++) {
          var sousD = d[i].split(';');
          var link;
          var URLSuccess;
          if (sousD[1] === " rel=oauth_resource_server") {
            link = sousD[0].substr(1, sousD[0].length - 2);
          }
          if (sousD[1] === " rel=successful_login_redirect") {
            URLSuccess = sousD[0].substr(2, sousD[0].length - 3);
          }
        }
        window.open (link) ;
      }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.withCredentials = true;
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var process = functionsByStatus[xhr.status] || function() {
          console.log("Not Yet Implemented");
          reject(xhr);
        };
        process(xhr);
      }
    };
    xhr.send(null);
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
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', this.uri, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.withCredentials = true;
    xhr.onerror = function() {
      throw "Cannot delete " + this.get_resource_type() + " " + this.uri + ": " + xhr.status;
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        refresh_parent.bind(that);
      }
    };
    xhr.send(null);
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

},{"./EventHandler.js":2}],7:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSObsel = require("./KTBS.Obsel.js");

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
    
    var functionsByStatus = {
      '200' : function (xhr) {
        
        var jsonResponse = JSON.parse(xhr.response);
        if (jsonResponse.obsels.length > 0)
        {OBJ.Before_on_refresh_obsel_list_ (jsonResponse);}
      },
      '401': function (xhr) {
        console.log (xhr.getAllResponseHeaders());
        var link = xhr.getResponseHeader('Link');
        var d = link.split (',');
        for (var i = 0;i < d.length;i++) {
          var sousD = d[i].split(';');
          var link;
          var URLSuccess;
          if (sousD[1] === " rel=oauth_resource_server") {
            link = sousD[0].substr(1, sousD[0].length - 2);
          }
          if (sousD[1] === " rel=successful_login_redirect") {
            URLSuccess = sousD[0].substr(2, sousD[0].length - 3);
          }
        }
        window.open (link) ;
      }
    };
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', that.obsel_list_uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var process = functionsByStatus[xhr.status] || function() {
          console.log("Not Yet Implemented");
        };
        process(xhr);
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(null);
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
      
      var that = this;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', that.id, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 201) {
            console.log('OKPost');
            that._on_create_obsel_success();
          } else {
            console.log('Post error');
          }
        }
      };
      xhr.onerror = function(e) {
        console.log("Error Status: " + e.target.status);
      };
      xhr.send(JSON.stringify(json_obsel));
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

},{"./KTBS.Obsel.js":5,"./KTBS.Resource.js":6}],8:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSBase = require("./KTBS.Base.js");


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

    
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(JSON.stringify(new_base));
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

},{"./KTBS.Base.js":3,"./KTBS.Resource.js":6}],9:[function(require,module,exports){

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
    // if ($.inArray(r.type, rels) === -1) {
    //   rels.push(r.type);
    // }
    if (rels.indexOf(r.type) ===-1){
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
    // if ($.inArray(r.type, rels) === -1) {
    //   rels.push(r.type);
    // }
    if (rels.indexOf(r.type) ===-1){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS5qcyIsInNyYy9jb3JlL0V2ZW50SGFuZGxlci5qcyIsInNyYy9jb3JlL0tUQlMuQmFzZS5qcyIsInNyYy9jb3JlL0tUQlMuTW9kZWwuanMiLCJzcmMvY29yZS9LVEJTLk9ic2VsLmpzIiwic3JjL2NvcmUvS1RCUy5SZXNvdXJjZS5qcyIsInNyYy9jb3JlL0tUQlMuVHJhY2UuanMiLCJzcmMvY29yZS9LVEJTLmpzIiwic3JjL2NvcmUvT2JzZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0aUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIE9ic2VsID0gcmVxdWlyZShcIi4vY29yZS9PYnNlbC5qc1wiKTtcbnZhciBLdGJzID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLmpzXCIpO1xudmFyIEt0YnNNb2RlbCA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5Nb2RlbC5qc1wiKTtcbnZhciBLdGJzQmFzZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5CYXNlLmpzXCIpO1xudmFyIEt0YnNUcmFjZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5UcmFjZS5qc1wiKTtcblxuXG52YXIgU2Ftb3RyYWNlcyA9IHtcbiAgT2JzZWw6IE9ic2VsLFxuICBFdmVudEhhbmRsZXI6IEV2ZW50SGFuZGxlcixcbiAgS3Riczoge1xuICAgIEt0YnM6IEt0YnMsXG4gICAgUmVzb3VyY2U6IEtUQlNSZXNvdXJjZSxcbiAgICBNb2RlbDogS3Ric01vZGVsLFxuICAgIEJhc2U6IEt0YnNCYXNlLFxuICAgIFRyYWNlOiBLdGJzVHJhY2UsXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbW90cmFjZXM7XG4iLCIvKipcbiAqIEBtaXhpblxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgRXZlbnRIYW5kbGVyIE9iamVjdCBpcyBub3QgYSBjbGFzcy4gSG93ZXZlciwgaXQgaXNcbiAqIGRlc2lnbmVkIGZvciBvdGhlciBjbGFzc2VzIHRvIGluaGVyaXQgb2YgYSBwcmVkZWZpbmVkXG4gKiBPYnNlcnZhYmxlIGJlaGF2aW91ci4gRm9yIHRoaXMgcmVhc29uLCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBkb2N1bWVudGVkIGFzIGEgQ2xhc3MuXG4gKlxuICogSW4gb3JkZXIgdG8gdXNlIGNyZWF0ZSBhIGNsYXNzIHRoYXQgXCJpbmhlcml0c1wiIGZyb20gdGhlXG4gKiBcIkV2ZW50SGFuZGxlciBjbGFzc1wiLCBvbmUgbXVzdCBydW4gdGhlIGZvbGxvd2luZyBjb2RlIGluXG4gKiB0aGUgY29uc3RydWN0b3I6XG4gKiA8Y29kZT5cbiAqIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gKiA8L2NvZGU+XG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IGNhbGxiYWNrc1xuICogICAgIEhhc2ggbWF0Y2hpbmcgY2FsbGJhY2tzIHRvIGV2ZW50X3R5cGVzLlxuICovXG52YXIgRXZlbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgXHQgKiBUcmlnZ2VycyBhbGwgdGhlIHJlZ2lzdHJlZCBjYWxsYmFja3MuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICBcdCAqICAgICBPYmplY3Qgc2VudCB3aXRoIHRoZSBtZXNzYWdlIHRvIHRoZSBsaXN0ZW5lcnMgKHNlZVxuICBcdCAqICAgICB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIjb259KS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gdHJpZ2dlcihldmVudF90eXBlLCBvYmplY3QpIHtcbiAgICB2YXIgZSA9IHsgdHlwZTogZXZlbnRfdHlwZSwgZGF0YTogb2JqZWN0IH07XG4gICAgaWYgKHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5tYXAoZnVuY3Rpb24oZikgeyBmKGUpOyB9KTtcbiAgICB9XG4gICAgLypcbiAgICBcdFx0dGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0uZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIFx0XHRcdGNhbGxiYWNrKGUpO1xuICAgIFx0XHR9KTtcbiAgICBcdFx0Ki9cbiAgfVxuICAvKipcbiAgXHQgKiBBZGRzIGEgY2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIucHJvdG90eXBlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50X3R5cGVcbiAgXHQgKiAgICAgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiB0by5cbiAgXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICBcdCAqICAgICBDYWxsYmFjayB0byBjYWxsIHdoZW4gdGhlIGFuIGV2ZW50IG9mIHR5cGVcbiAgXHQgKiAgICAgZXZlbnRfdHlwZSBpcyB0cmlnZ2VyZWQuIE5vdGU6IHRoZSBjYWxsYmFja1xuICBcdCAqICAgICBjYW4gcmVjZWl2ZSBvbmUgYXJndW1lbnQgdGhhdCBjb250YWluc1xuICBcdCAqICAgICBkZXRhaWxzIGFib3V0IHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogICAgIFRoaXMgZXZlbnQgYXJndW1lbnQgY29udGFpbnMgdHdvIGZpZWxkczpcbiAgXHQgKiAgICAgZXZlbnQudHlwZTogdGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWRcbiAgXHQgKiAgICAgZXZlbnQuZGF0YTogb3B0aW9uYWwgZGF0YSB0aGF0IGlzIHRyYW5zbWl0dGVkIHdpdGggdGhlIGV2ZW50XG4gIFx0ICovXG4gIGZ1bmN0aW9uIG9uKGV2ZW50X3R5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoY2FsbGJhY2spICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG4gICAgICB0aHJvdyBcIkNhbGxiYWNrIGZvciBldmVudCBcIiArIGV2ZW50X3R5cGUgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiO1xuICAgIH1cbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSA9IHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdIHx8IFtdO1xuICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50cykge1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzIHx8IHt9O1xuICAgIHRoaXMudHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5vbiA9IG9uO1xuICAgIC8qKlxuICAgIFx0XHQgKiBFdmVudENvbmZpZyBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4gICAgXHRcdCAqIHtAbGluayBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ31cbiAgICBcdFx0ICogb2JqZWN0LlxuICAgIFx0XHQgKiBAdHlwZWRlZiBFdmVudENvbmZpZ1xuICAgIFx0XHQgKiBAc2VlIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqL1xuICAgIC8qKlxuICAgIFx0XHQgKiBUaGUgRXZlbnRDb25maWcgb2JqZWN0IGlzIHVzZWQgZm9yIGNvbmZpZ3VyYXRpbmcgdGhlXG4gICAgXHRcdCAqIGZ1bmN0aW9ucyB0byBjYWxsIGV2ZW50cyBhcmUgdHJpZ2dlcmVkIGJ5IGFuIEV2ZW50SGFuZGxlciBPYmplY3QuXG4gICAgXHRcdCAqIEVhY2ggYXR0cmlidXRlIG5hbWUgb2YgdGhlIEV2ZW50Q29uZmlnIGNvcnJlc3BvbmRzXG4gICAgXHRcdCAqIHRvIGEgdHlwZSBvZiBldmVudCBsaXN0ZW5lZCB0bywgYW5kIGVhY2hcbiAgICBcdFx0ICogdmFsdWUgaXMgdGhlIGZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICogQHR5cGVkZWYgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHR5cGUge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59XG4gICAgXHRcdCAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGV2ZW50TmFtZSAtIEZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICovXG4gICAgZnVuY3Rpb24gY2FsbGJhY2soZSkgeyBmdW4oZS5kYXRhKTsgfVxuICAgIGZvciAodmFyIGV2ZW50X25hbWUgaW4gZXZlbnRzKSB7XG4gICAgICBcdFx0aWYgKGV2ZW50Lmhhc093blByb3BlcnR5KGV2ZW50X25hbWUpKSB7XG4gICAgICAgIFx0XHR2YXIgZnVuID0gZXZlbnRzW2V2ZW50X25hbWVdO1xuICAgICAgICBcdFx0dGhpcy5vbihldmVudF9uYW1lLCBjYWxsYmFjayk7XG4gICAgICBcdFx0fVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG5cblxuLyoqXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBLVEJTLkJhc2UgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLktUQlMuQmFzZSBpcyBhIEphdmFzY3JpcHQgS1RCUyBiYXNlXG4gKiBvYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldCB0aGVcbiAqIGxpc3Qgb2YgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgS1RCUyBiYXNlLiBBY2Nlc3MgYVxuICogc3BlY2lmaWMgdHJhY2UsIGV0Yy5cbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBCYXNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBCYXNlIHRvIGxvYWQuXG4gKi9cbnZhciBCYXNlID0gZnVuY3Rpb24gQmFzZSh1cmksIGlkKSB7XG4gIC8vIEtUQlMuQmFzZSBpcyBhIFJlc291cmNlXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdCYXNlJywgXCJcIik7XG4gIHRoaXMudHJhY2VzID0gW107XG4gIHRoaXMubW9kZWxzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuQmFzZS5wcm90b3R5cGUgPSB7XG4gIGdldDogZnVuY3Rpb24oaWQpIHt9LFxuICAvKipcbiAgXHQgKiBHZXRzIHRoZSBsaXN0IG9mIHRyYWNlcyBhdmFpbGFibGUgaW4gdGhlIGJhc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxTdHJpbmc+fSBBcnJheSBvZiB0aGUgSUQgb2YgdGhlIHRyYWNlcyBhdmFpbGFibGUgaW4gdGhlIEJhc2UuXG4gIFx0ICovXG4gIGxpc3RfdHJhY2VzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50cmFjZXM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgbGlzdF9tb2RlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVscztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQ3JlYXRlIGEgc3RvcmVkIHRyYWNlIGluIHRoZSBLVEJTXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSBjcmVhdGVkIHRyYWNlXG4gIFx0ICogQHBhcmFtIFttb2RlbF0ge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW29yaWdpbl0ge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbZGVmYXVsdF9zdWJqZWN0XSB7U3RyaW5nfSBEZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtsYWJlbF0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGNyZWF0ZV9zdG9yZWRfdHJhY2U6IGZ1bmN0aW9uKGlkLCBtb2RlbCwgb3JpZ2luLCBkZWZhdWx0X3N1YmplY3QsIGxhYmVsKSB7XG4gICAgdmFyIG5ld190cmFjZSA9IHtcbiAgICAgIFwiQGNvbnRleHRcIjpcdFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0XCIsXG4gICAgICBcIkB0eXBlXCI6XHRcIlN0b3JlZFRyYWNlXCIsXG4gICAgICBcIkBpZFwiOlx0XHRpZCArIFwiL1wiXG4gICAgfTtcbiAgICBuZXdfdHJhY2UuaGFzTW9kZWwgPSAobW9kZWwgPT09IHVuZGVmaW5lZCAgfHwgbW9kZWwgPT09ICBudWxsKT9cImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEvc2ltcGxlLXRyYWNlLW1vZGVsXCI6bW9kZWw7XG4gICAgbmV3X3RyYWNlLm9yaWdpbiA9IChvcmlnaW4gPT09IHVuZGVmaW5lZCB8fCBvcmlnaW4gPT09ICBudWxsICk/XCIxOTcwLTAxLTAxVDAwOjAwOjAwWlwiOm9yaWdpbjtcbiAgICAvL1x0XHRcdGlmKG9yaWdpbj09dW5kZWZpbmVkKSBuZXdfdHJhY2Uub3JpZ2luID0gb3JpZ2luO1xuICAgIGlmIChkZWZhdWx0X3N1YmplY3QgPT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmRlZmF1bHRfc3ViamVjdCA9IGRlZmF1bHRfc3ViamVjdDtcbiAgICBpZiAobGFiZWwgPT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmxhYmVsID0gbGFiZWw7XG4gIFxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS1Bvc3QnKTtcbiAgICAgICAgICB0aGF0LmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUG9zdCBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpKTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBDcmVhdGUgYSBzdG9yZWQgdHJhY2UgaW4gdGhlIEtUQlNcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIGNyZWF0ZWQgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW21vZGVsXSB7TW9kZWx9IE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbb3JpZ2luXSB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtkZWZhdWx0X3N1YmplY3RdIHtTdHJpbmd9IERlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2xhYmVsXSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgY3JlYXRlX21vZGVsOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGRvYyA9IHtcbiAgICAgICdAY29udGV4dCc6ICdodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHQnLFxuICAgICAgJ0BncmFwaCc6IFt7XG4gICAgICAgICdAaWQnOiBpZCxcbiAgICAgICAgJ0B0eXBlJzogJ1RyYWNlTW9kZWwnLFxuICAgICAgICAnaW5CYXNlJzogJy4vJyxcbiAgICAgICAgJ2hhc1VuaXQnOiAnbWlsbGlzZWNvbmQnXG4gICAgICB9XVxuICAgIH07XG4gICAgdmFyIG5ld19tb2RlbF9kYXRhID0gSlNPTi5zdHJpbmdpZnkoZG9jKTtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS1Bvc3QnKTtcbiAgICAgICAgICB0aGF0LmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUG9zdCBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIuc2VuZChuZXdfbW9kZWxfZGF0YSk7XG4gIH0sXG5cblxuXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX2NvbXB1dGVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbWV0aG9kLCBwYXJhbWV0ZXJzLCBzb3VyY2VzLCBsYWJlbCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgLy9jcmVhdGVfbW9kZWw6IGZ1bmN0aW9uKGlkLCBwYXJlbnRzLCBsYWJlbCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX21ldGhvZDogZnVuY3Rpb24oaWQsIHBhcmVudCwgcGFyYW1ldGVycywgbGFiZWwpIHt9LFxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgXHQgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL1x0Y29uc29sZS5sb2coZGF0YSk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbGFiZWwnLCBkYXRhW1wiaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsXCJdLCAnYmFzZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCd0cmFjZXMnLCBkYXRhLmNvbnRhaW5zLCAnYmFzZTp1cGRhdGUnKTtcbiAgfSxcbiAgLy8vLy8vLy8vLy8gQURERUQgLyBBUElcbiAgLyoqXG4gIFx0ICogR2V0cyBhIHRyYWNlIGZyb20gaXRzIElEXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSB0cmFjZSB0byBnZXQuXG4gIFx0ICogQHJldHVybiB7U2Ftb3RyYWNlcy5LVEJTLlRyYWNlfSBUaGUgcmV0cmlldmVkIFRyYWNlLlxuICBcdCAqL1xuICBnZXRfdHJhY2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIG5ldyBTYW1vdHJhY2VzLktUQlMuVHJhY2UodGhpcy51cmkgKyBpZCArICcvJywgaWQpO1xuICB9LFxuICAvLy8vLy8vLy8vLy9cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBUcmFjZSBvYmplY3QgdGhhdCBpcyBzeW5jaHJvbmlzZWQgdG8gYSBLVEJTLlxuICogQGNsYXNzIEphdmFzY3JpcHQgTW9kZWwgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIE1vZGVsLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm4gLyBERVJCRUwgRmF0bWFcbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLktUQlMuTW9kZWxpcyBhIEphdmFzY3JpcHQgVHJhY2Ugb2JqZWN0XG4gKiB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyBNb2RlbC4gVGhpcyBPYmplY3QgaW1wbGVtZW50cyB0aGUgS1RCUyBBUEkuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0XG4gKiB0aGUgTGlzdGUgb2YgdHlwZSBvZiBPYnNlbHMgZnJvbSB0aGUgS1RCUyBNb2RlbCwgLlxuICpcbiAqXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICovXG5cblxudmFyIE1vZGVsID0gZnVuY3Rpb24odXJpLCBpZCkge1xuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgaWQsIHVyaSwgJ01vZGVsJywgXCJcIik7XG4gIHRoaXMubGlzdF9UeXBlc19PYnNsZXMgPSBbXVxuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcblxufTtcblxuTW9kZWwucHJvdG90eXBlID0ge1xuXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBldGFnID0gdGhpcy5nZXRfZXRhZygpO1xuICAgIHRoaXMudHJpZ2dlcignTW9kZWw6Z2V0Jyk7XG4gICAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IHRoaXMubGlzdF9vYnNlbHMoZGF0YVtcIkBncmFwaFwiXSk7XG4gIH0sXG4gIGxpc3Rfb2JzZWxzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgTGlzdGVPYnNlbFR5cGUgPSBbXTtcbiAgICB2YXIgTSA9IHRoaXM7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBrZXkpIHtcbiAgICAgIHZhciBvYnMgPSB7YXR0cmlidXRlczogW119O1xuICAgICAgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJPYnNlbFR5cGVcIikgICAgICB7XG4gICAgICAgIG9icy5pZCA9IGVsW1wiQGlkXCJdO1xuICAgICAgICBvYnMudHlwZSA9IGVsW1wiQGlkXCJdLnN1YnN0cigxKTtcbiAgICAgICAgb2JzLmNvY2hlID0gZmFsc2U7XG4gICAgICAgIC8vb2JzW2tleV0gPSBlbFtrZXldXG4gICAgICAgIGlmIChlbFsnaGFzU3VwZXJPYnNlbFR5cGUnXSkgICAgICAgIHtcbiAgICAgICAgICBvYnMuaGFzU3VwZXJPYnNlbFR5cGUgPSBlbFsnaGFzU3VwZXJPYnNlbFR5cGUnXVxuICAgICAgICB9XG4gICAgICAgIExpc3RlT2JzZWxUeXBlLnB1c2gob2JzKTtcbiAgICAgICAgLy9NLnRyaWdnZXIoJ01vZGVsOkRyYXdfb2JzZWwnLCBvYnMpO1xuICAgICAgICAvL2NvbnNvbGUubG9nICgndHJpZ2VyJylcbiAgICAgIH0gICAgICBlbHNlIGlmIChlbFtcIkB0eXBlXCJdID09IFwiQXR0cmlidXRlVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzID0gTS5HZXRPYnNlbFR5cGUoZWxbXCJoYXNBdHRyaWJ1dGVPYnNlbFR5cGVcIl0sIExpc3RlT2JzZWxUeXBlKTtcbiAgICAgICAgZWxbJ2NvY2hlJ10gPSBmYWxzZTtcbiAgICAgICAgb2JzLmF0dHJpYnV0ZXMucHVzaChlbCk7XG5cbiAgICAgIH1cblxuICAgIH0pO1xuICAgIExpc3RlT2JzZWxUeXBlLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uaGFzU3VwZXJPYnNlbFR5cGUpICAgICAge1xuXG4gICAgICAgIG8uYXR0cmlidXRlcyA9IE0uZ2V0QXR0cmlidXRlcyAoby5oYXNTdXBlck9ic2VsVHlwZVswXSlcbiAgICAgIH1cblxuICAgIH0pXG5cbiAgICBNLnRyaWdnZXIoJ01vZGVsOmxpc3RlVHlwZScsIExpc3RlT2JzZWxUeXBlKTtcbiAgICByZXR1cm4gTGlzdGVPYnNlbFR5cGU7XG5cbiAgfSxcblxuICBHZXRPYnNlbFR5cGU6IGZ1bmN0aW9uKGlkLCBMaXN0ZU9ic2VsVHlwZSkgIHtcbiAgICB2YXIgb2JzID0gW107XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSAgICB7XG5cbiAgICAgIGlmIChvW1wiaWRcIl0gPT0gaWQpICAgICAge1xuXG4gICAgICAgIG9ic1IgPSBvO1xuXG4gICAgICB9XG5cbiAgICB9XG4gICAgKVxuICAgIHJldHVybiBvYnNSO1xuICB9LFxuXG4gIGdldEF0dHJpYnV0ZXM6IGZ1bmN0aW9uKGlkZW50KSAge1xuXG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSAgICB7XG5cbiAgICAgIGlmIChvLmlkID09PSBpZGVudCkgICB7XG4gICAgICAgIEF0dCA9IG8uYXR0cmlidXRlc1xuICAgICAgfVxuXG4gICAgfVxuICAgIClcbiAgICByZXR1cm4gQXR0O1xuICB9LFxuXG4gIHB1dF9tb2RlbDogZnVuY3Rpb24obW9kZWxkYXRhKSB7XG4gICAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHRoYXQub24gKCdNb2RlbDpnZXQnLCBmdW5jdGlvbigpe1xuICAgICAgIHZhciBldGFnID0gdGhhdC5ldGFnO1xuXG4gICAgLy8gUFVUXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQVVQnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignSWYtTWF0Y2gnLCBldGFnKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS09LT0snKTtcbiAgICAgICAgICByZXNvbHZlKG5ldyBTYW1vdHJhY2VzLkt0YnMuTW9kZWwodGhhdC5pZCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh4aHIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KEVycm9yKCdUaGVyZSB3YXMgYSBuZXR3b3JrIGVycm9yLicpKTtcbiAgICB9O1xuICAgIHhoci5zZW5kKG1vZGVsZGF0YSk7XG5cbiAgfSlcbiAgfSk7XG59XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9PYnNlbC5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsIGlzIHBhcnQgb2YgdGhlIFNhbW90cmFjZXMuS1RCUyBpbXBsZW1lbnRhdGlvbi5cbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLk9ic2VsXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAdG9kbyBUT0RPIHVwZGF0ZSBzZXRfbWV0aG9kc1xuICogLT4gc3luYyB3aXRoIEtUQlMgaW5zdGVhZCBvZiBsb2NhbCBjaGFuZ2VcbiAqL1xudmFyIEtUQlNPYnNlbCA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHBhcmFtLmlkLCBwYXJhbS51cmksICdPYnNlbCcsIHBhcmFtLmxhYmVsIHx8IFwiXCIpO1xuXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbn1cblxuS1RCU09ic2VsLnByb3RvdHlwZSA9IE9ic2VsLnByb3RvdHlwZTtcblxuLypcblNhbW90cmFjZXMuS1RCUy5PYnNlbC5wcm90b3R5cGUuZ2V0X2t0YnNfc3RhdHVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmt0YnNfc3RhdHVzXG59O1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTT2JzZWw7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlc291cmNlIE9iamVjdHMgdGhhdCBpcyBzeW5jaHJvbmlzZWQgdG8gYSBrVEJTXG4gKiBAZGVzY3JpcHRpb24gUmVzb3VyY2UgT2JqZWN0cyBhcmUgS1RCUyBvYmplY3RzLiBBbGwgcmVzb3VyY2VzXG4gKiBoYXZlIGFuIHVyaSwgYW4gaWQgYW5kIGFuIG9wdGlvbmFsIGxhYmVsXG4gKiBAY2xhc3MgUmVzb3VyY2UgT2JqZWN0cyBoYXZlIGFuIHVyaSwgYW4gaWQgYW5kIGFuIG9wdGlvbmFsIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgSWQgb2YgdGhlIFJlc291cmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSSSBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIFJlc291cmNlICgnS1RCUycsJ0Jhc2UnLFxuICogICAgICdUcmFjZScsJ1N0b3JlZFRyYWNlJywnQ29tcHV0ZWRUcmFjZScgb3IgJ09ic2VsJylcbiAqIEBwYXJhbSB7bGFiZWx9IFtsYWJlbF0gTGFiZWwgb2YgdGhlIFJlc291cmNlXG4gKi9cbnZhciBLVEJTUmVzb3VyY2UgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIHJlc291cmNlIHR5cGUgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgdHlwZSAoJ0tUQlMnLCdCYXNlJyxcbiAgXHQgKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3Jlc291cmNlX3R5cGUoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUoYmFzZSwgcmVsYXRpdmUpIHtcbiAgICB2YXIgc3RhY2sgPSBiYXNlLnNwbGl0KFwiL1wiKSxcbiAgICAgICAgcGFydHMgPSByZWxhdGl2ZS5zcGxpdChcIi9cIik7XG4gICAgc3RhY2sucG9wKCk7IC8vIHJlbW92ZSBjdXJyZW50IGZpbGUgbmFtZSAob3IgZW1wdHkgc3RyaW5nKVxuICAgICAgICAgICAgICAgICAvLyAob21pdCBpZiBcImJhc2VcIiBpcyB0aGUgY3VycmVudCBmb2xkZXIgd2l0aG91dCB0cmFpbGluZyBzbGFzaClcbiAgICBmb3IgKHZhciBpPTA7IGk8cGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBhcnRzW2ldID09IFwiLlwiKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChwYXJ0c1tpXSA9PSBcIi4uXCIpXG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhY2sucHVzaChwYXJ0c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiBzdGFjay5qb2luKFwiL1wiKTtcbiAgfVxuICAvLyBSRVNPVVJDRSBBUElcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgSUQgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgSUQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9pZCgpIHsgcmV0dXJuIHRoaXMuaWQ7IH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBVUkkgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgVVJJLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfdXJpKCkgeyByZXR1cm4gdGhpcy51cmkucmVwbGFjZSgnLi8nLCAnJyk7IH1cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gICAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIFVSSS5cbiAgICovXG5mdW5jdGlvbiBnZXRfZXRhZygpIHsgcmV0dXJuIHRoaXMuZXRhZzsgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCUy5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogICdvcHRpb25zLl9vbl9zdGF0ZV9yZWZyZXNoXyc6IHRydWV8ZmFsc2VcbiAgICAgKiAgIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBvbGQgYmVoYXZpb3Igb2YgY2FsbGluZyBfb25fc3RhdGVfcmVmcmVzaF8gb24gdGhlIHJlc291cmNlIGFmdGVyIHN5bmNocm9uaXNlIGNvbXBsZXRlc1xuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCUy5cbiAgXHQgKiBUaGlzIG1ldGhvZCB0cmlnZ2VycyBhIEFqYXggcXVlcnkgdGhhdCB3aWxsXG4gIFx0ICogdHJpZ2dlciB0aGUgX29uX3N0YXRlX3JlZnJlc2hfIG1ldGhvZCBvZiB0aGUgUmVzb3VyY2VcbiAgXHQgKiBvbiBzdWNjZXNzLlxuICBcdCAqL1xuICBmdW5jdGlvbiBmb3JjZV9zdGF0ZV9yZWZyZXNoKG9wdGlvbnMsIHN1Y2Nlc3MsIHJlamVjdCkge1xuICAgIHN1Y2Nlc3MgPSBzdWNjZXNzIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIHJlamVjdCA9IHJlamVjdCB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7J19vbl9zdGF0ZV9yZWZyZXNoXyc6IHRydWV9OyAvLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXG4gICAgdmFyIHVybCA9IHRoaXMudXJpO1xuICAgIHZhciB0cmMgPSB0aGlzIDtcblxuICAgIHZhciBmdW5jdGlvbnNCeVN0YXR1cyA9IHtcbiAgICAgICcyMDAnIDogZnVuY3Rpb24gKHhocikge1xuICAgICAgICB0cmMuZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignRVRhZycpOyAvLyBUT0RPIHRoaXMgY2F1c2UgJ1JlZnVzZWQgdG8gZ2V0IHVuc2FmZSBoZWFkZXIgXCJFVGFnXCInIG9uIEtUQlMgMC4zXG4gICAgICAgIHZhciBqc29uUmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XG4gICAgICAgIHN1Y2Nlc3MoanNvblJlc3BvbnNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuX29uX3N0YXRlX3JlZnJlc2hfKSB7XG4gICAgICAgICAgdHJjLl9vbl9zdGF0ZV9yZWZyZXNoXyhqc29uUmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJzQwMSc6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgICAgY29uc29sZS5sb2cgKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgICAgIHZhciBsaW5rID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdMaW5rJyk7XG4gICAgICAgIHZhciBkID0gbGluay5zcGxpdCAoJywnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGQubGVuZ3RoO2krKykge1xuICAgICAgICAgIHZhciBzb3VzRCA9IGRbaV0uc3BsaXQoJzsnKTtcbiAgICAgICAgICB2YXIgbGluaztcbiAgICAgICAgICB2YXIgVVJMU3VjY2VzcztcbiAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1vYXV0aF9yZXNvdXJjZV9zZXJ2ZXJcIikge1xuICAgICAgICAgICAgbGluayA9IHNvdXNEWzBdLnN1YnN0cigxLCBzb3VzRFswXS5sZW5ndGggLSAyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNvdXNEWzFdID09PSBcIiByZWw9c3VjY2Vzc2Z1bF9sb2dpbl9yZWRpcmVjdFwiKSB7XG4gICAgICAgICAgICBVUkxTdWNjZXNzID0gc291c0RbMF0uc3Vic3RyKDIsIHNvdXNEWzBdLmxlbmd0aCAtIDMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIFN0YXR1czogXCIgKyBlLnRhcmdldC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICB2YXIgcHJvY2VzcyA9IGZ1bmN0aW9uc0J5U3RhdHVzW3hoci5zdGF0dXNdIHx8IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm90IFlldCBJbXBsZW1lbnRlZFwiKTtcbiAgICAgICAgICByZWplY3QoeGhyKTtcbiAgICAgICAgfTtcbiAgICAgICAgcHJvY2Vzcyh4aHIpO1xuICAgICAgfVxuICAgIH07XG4gICAgeGhyLnNlbmQobnVsbCk7XG4gIH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlXG4gIFx0ICogd2l0aCBhdCBhIGdpdmVuIHJlZnJlc2hpbmcgcmF0ZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCU1xuICBcdCAqIGV2ZXJ5IHBlcmlvZCBzZWNvbmRzLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG5cblxuICBmdW5jdGlvbiBzdGFydF9hdXRvX3JlZnJlc2gocGVyaW9kKSB7XG4gICAgdmFyIGEgPSB0aGlzLmF1dG9fcmVmcmVzaF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoKCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9pZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb24gb2ZcbiAgXHQgKiB0aGUgUmVzb3VyY2UuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHN0b3BfYXV0b19yZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLmF1dG9fcmVmcmVzaF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH1cbiAgLy9cdFx0ZnVuY3Rpb24gX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YTsgY29uc29sZS5sb2coXCJoZXJlXCIpOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3JlYWRfb25seSgpIHt9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IERlbGV0ZSB0aGUgcmVzb3VyY2UgZnJvbSB0aGUgS1RCU1xuICBcdCAqIEB0b2RvIElNUFJPVkUgVEhJUyBNRVRIT0QgU08gVEhBVCBQUk9QRVIgRVZFTlQgSVMgUkFJU0VEXG4gIFx0ICogICAgIFdIRU4gQSBSRVNPVVJDRSBJUyBERUxFVEVELlxuICBcdCAqL1xuICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZnVuY3Rpb24gcmVmcmVzaF9wYXJlbnQoKSB7XG4gICAgICAvL1RST1VWRVIgVU4gTU9ZRU4gTUFMSU4gREUgUkFGUkFJQ0hJUiBMQSBMSVNURSBERVMgQkFTRVMgRFUgS1RCUy4uLlxuICAgIH1cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdERUxFVEUnLCB0aGlzLnVyaSwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IFwiQ2Fubm90IGRlbGV0ZSBcIiArIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUoKSArIFwiIFwiICsgdGhpcy51cmkgKyBcIjogXCIgKyB4aHIuc3RhdHVzO1xuICAgIH07XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICByZWZyZXNoX3BhcmVudC5iaW5kKHRoYXQpO1xuICAgICAgfVxuICAgIH07XG4gICAgeGhyLnNlbmQobnVsbCk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIFJlc291cmNlXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9sYWJlbCgpIHsgcmV0dXJuIHRoaXMubGFiZWw7IH1cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiBzZXRfbGFiZWwoKSB7fVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHJlc2V0X2xhYmVsKCkge31cblxuICAvLyBBRERFRCBGVU5DVElPTlNcbiAgLyoqXG4gIFx0ICogTWV0aG9kIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGRpc3RhbnQgdmFsdWUgaXMgZGlmZmVyZW50XG4gIFx0ICogZnJvbSB0aGUgY3VycmVudCBsb2NhbCB2YWx1ZSAoYW5kIHVwZGF0ZSB0aGUgbG9jYWwgdmFsdWVcbiAgXHQgKiBpZiB0aGVyZSBpcyBhIGRpZmZlcmVuY2UuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKiBAcGFyYW0gbG9jYWxfZmllbGQge1N0cmluZ30gTmFtZSBvZiB0aGUgZmllbGQgb2YgdGhlIHRoaXNcbiAgXHQgKiAgICAgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIHRvIGNoZWNrLlxuICBcdCAqIEBwYXJhbSBkaXN0YW50IHtWYWx1ZX0gVmFsdWUgb2YgdGhlIGRpc3RhbnQgaW5mb3JtYXRpb24uXG4gIFx0ICogQHBhcmFtIG1lc3NhZ2VfaWZfY2hhbmdlZCB7U3RyaW5nfSBNZXNzYWdlIHRvIHRyaWdnZXIgaWZcbiAgXHQgKiAgICAgdGhlIGluZm9ybWF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIF9jaGVja19jaGFuZ2VfKGxvY2FsX2ZpZWxkLCBkaXN0YW50LCBtZXNzYWdlX2lmX2NoYW5nZWQpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgdGhlIHdhbnRlZCBiZWhhdmlvdXI6XG4gICAgLy8gSWYgZGlzdGFudCBpcyB1bmRlZmluZWQgLT4gd2hhdCB0byBkbz9cbiAgICBpZiAoZGlzdGFudCAhPT0gdW5kZWZpbmVkICYmIHRoaXNbbG9jYWxfZmllbGRdICE9PSBkaXN0YW50KSB7XG4gICAgICB0aGlzW2xvY2FsX2ZpZWxkXSA9IGRpc3RhbnQ7XG4gICAgICB0aGlzLnRyaWdnZXIobWVzc2FnZV9pZl9jaGFuZ2VkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oaWQsIHVyaSwgdHlwZSwgbGFiZWwpIHtcbiAgICAvLyBhIFJlc291cmNlIGlzIGFuIEV2ZW50SGFuZGxlclxuICAgIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vIEFUVFJJQlVURVNcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgLy8gQVBJIE1FVEhPRFNcbiAgICB0aGlzLmdldF9pZCA9IGdldF9pZDtcbiAgICB0aGlzLmdldF91cmkgPSBnZXRfdXJpO1xuICAgIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCA9IGZvcmNlX3N0YXRlX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRfcmVhZF9vbmx5ID0gZ2V0X3JlYWRfb25seTtcbiAgICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgICB0aGlzLmdldF9sYWJlbCA9IGdldF9sYWJlbDtcbiAgICB0aGlzLnNldF9sYWJlbCA9IHNldF9sYWJlbDtcbiAgICB0aGlzLnJlc2V0X2xhYmVsID0gcmVzZXRfbGFiZWw7XG4gICAgdGhpcy5nZXRfZXRhZyA9IGdldF9ldGFnO1xuICAgIC8vIGhlbHBlclxuICAgIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUgPSBnZXRfcmVzb3VyY2VfdHlwZTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfID0gX2NoZWNrX2NoYW5nZV87XG4gICAgdGhpcy5zdGFydF9hdXRvX3JlZnJlc2ggPSBzdGFydF9hdXRvX3JlZnJlc2g7XG4gICAgdGhpcy5zdG9wX2F1dG9fcmVmcmVzaCA9IHN0b3BfYXV0b19yZWZyZXNoO1xuICAgIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZT1nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSkoKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNSZXNvdXJjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNPYnNlbCA9IHJlcXVpcmUoXCIuL0tUQlMuT2JzZWwuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgVHJhY2Ugb2JqZWN0IHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEgS1RCUy5cbiAqIEBjbGFzcyBKYXZhc2NyaXB0IFRyYWNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLlRyYWNlIGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIHRyYWNlLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBPYnNlbHMgZnJvbSB0aGUgS1RCUyB0cmFjZSwgY3JlYXRlIG5ldyBPYnNlbHMsIGV0Yy5cbiAqXG4gKiBOb3RlOiB0aGlzIFRyYWNlIG9iamVjdCBkb2VzIG5vdCBpbXBsZW1lbnQgYWxsIHRoZSBtZXRob2RzXG4gKiBhdmFpbGFibGUgaW4gdGhlIEtUQlMgQVBJIHlldC5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBjbGFzcyBkbyBub3Qgc3VwcG9ydCB0cmFuc2Zvcm1hdGlvbnMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICovXG52YXIgS1RCU1RyYWNlID0gZnVuY3Rpb24gVHJhY2UodXJpLCBpZCkge1xuICAvLyBLVEJTLlRyYWNlIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdCYXNlJywgXCJcIik7XG5cbiAgdGhpcy50ZW1wID0ge307IC8vIGF0dHJpYnV0ZSB1c2VkIHRvIHN0b3JlIGFjdGlvbnMgbWFkZSBieSB0aGUgdXNlciBvbiB0aGUgdHJhY2Ugd2hpbGUgbm90IGtub3dpbmcgaWYgdGhleSBhcmUgYWxsb3dlZC4gZS5nLiwgY3JlYXRlX29ic2VsLCB3aGVuIHdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBUcmFjZSBpcyBhIFN0b3JlZFRyYWNlIGJlY2F1c2UgdGhlIEtUQlMgZGlkbid0IHJlcGx5IHlldC5cbiAgdGhpcy5kZWZhdWx0X3N1YmplY3QgPSBcIlwiO1xuICB0aGlzLm1vZGVsX3VyaSA9IFwiXCI7XG4gIHRoaXMub2JzZWxfbGlzdF91cmkgPSB1cmkgKyBcIkBvYnNlbHNcIjtcbiAgdGhpcy5iYXNlX3VyaSA9IFwiXCI7XG4gIHRoaXMub3JpZ2luID0gXCJcIjtcbiAgLy90aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUoMCkpLmdldE1pbGxpc2Vjb25kcygpO1xuICB0aGlzLm9ic2VsX2xpc3QgPSBbXTsgdGhpcy50cmFjZVNldCA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbktUQlNUcmFjZS5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICovXG4gIGdldF9iYXNlOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlKHRoaXMuZ2V0X3VyaSgpLHRoaXMuYmFzZV91cmkpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBtb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHRvZG8gREVGSU5FIFdIQVQgSVMgQSBNT0RFTFxuICBcdCAqL1xuICBnZXRfbW9kZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZSh0aGlzLmdldF91cmkoKSx0aGlzLm1vZGVsX3VyaSk7XG4gfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgb3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAcmV0dXJucyB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBnZXRfb3JpZ2luOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7IHJldHVybiB0aGlzLm9yaWdpbjsgfSxcbiAgLy9nZXRfb3JpZ2luX29mZnNldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm9yaWdpbl9vZmZzZXQ7IH0sXG4gIC8qa3Ric19vcmlnaW5fdG9fbXM6IGZ1bmN0aW9uKGt0YnNfZGF0ZV9zdHIpIHtcbiAgXHRcdHZhciBZID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMCw0KTtcbiAgXHRcdHZhciBNID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoNSwyKSAtIDE7XG4gIFx0XHR2YXIgRCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDgsMik7XG4gIFx0XHR2YXIgaCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDExLDIpO1xuICBcdFx0dmFyIG0gPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxNCwyKTtcbiAgXHRcdHZhciBzID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTcsMik7XG4gIFx0XHR2YXIgbXMgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigyMCwzKTtcbiAgXHRcdHJldHVybiBEYXRlLlVUQyhZLE0sRCxoLG0scyxtcyk7XG4gIFx0fSwqL1xuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3Rfc291cmNlX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3RyYW5zZm9ybWVkX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgbGlzdCBvZiBvYnNlbHMgaW4gYW4gb3B0aW9uYWwgdGltZSBpbnRlcnZhbC5cbiAgXHQgKiBJZiBubyBtaW5pbXVtIHRpbWUgYW5kIG5vIG1heGltdW0gdGltZSBjb25zdHJhaW50IGFyZVxuICBcdCAqIGRlZmluZWQsIHJldHVybnMgdGhlIHdob2xlIGxpc3Qgb2Ygb2JzZWxzLlxuICBcdCAqIElmIG9uZSBvZiB0aGUgdHdvIGNvbnN0cmFpbnRzIGFyZSBkZWZpbmVkLCB0aGVuIHJldHVybnNcbiAgXHQgKiBvYnNlbHMgbWF0Y2hpbmcgdGhlIHRpbWUgY29uc3RyYWludHMuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiBpZiBhbiBvYnNlbCBvdmVybGFwcyB3aXRoIHRoZSBzdGFydCBvciB0aGUgZW5kXG4gIFx0ICogY29uc3RyYWludCwgdGhlbiBpdCB3aWxsIGJlIGluY2x1ZGVkIChmb3IgaW5zdGFuY2UgYW5cbiAgXHQgKiBvYnNlbCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhlIHN0YXJ0IGNvbnN0cmFpbnQgYW5kIGVuZHNcbiAgXHQgKiBhZnRlciB0aGF0IGNvbnN0cmFpbnQgd2lsbCBiZSBpbmNsdWRlZCkuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiB0aGUgbGlzdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpcyB0aGVcbiAgXHQgKiBsaXN0IG9mIE9ic2VscyB0aGF0IGFyZSBsb2FkZWQgbG9jYWxseS5cbiAgXHQgKiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYSBxdWVyeSB0byB0aGUgS1RCU1xuICBcdCAqIGlzIG1hZGUgdG8ga25vdyBpZiB0aGVyZSBhcmUgb3RoZXIgT2JzZWxzIG1hdGNoaW5nXG4gIFx0ICogdGhlIHF1ZXJ5LiBJZiBzbywgdGhlc2Ugb3RoZXIgb2JzZWxzIHdpbGwgYmUgbG9hZGVkXG4gIFx0ICogaW4gdGhlIGxvY2FsIGNvcHkgb2YgdGhlIHRyYWNlIGFuZCBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6Y3JlYXRlOm9ic2VsfHRyYWNlOmNyZWF0ZTpvYnNlbH1cbiAgXHQgKiBldmVudCBvciBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6dXBkYXRlfHRyYWNlOnVwZGF0ZX1cbiAgXHQgKiBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB0byBub3RpZnkgdGhhdCBvdGhlclxuICBcdCAqIE9ic2VscyBoYXZlIGJlZW4gbG9hZGVkLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbYmVnaW5dIE1pbmltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRdIE1heGltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtCb29sZWFufSBbcmV2ZXJzZT1mYWxzZV0gUmV0dXJucyB0aGUgb2JzZWwgbGlzdCBpblxuICBcdCAqICAgICByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgdHJ1ZSBhbmQgaW4gbm9ybWFsXG4gIFx0ICogICAgIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgZmFsc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxPYnNlbD59IExpc3Qgb2YgcmVsZXZhbnQgb2JzZWxzXG4gIFx0ICogQHRvZG8gUkVWRVJTRSBJUyBOT1QgWUVUIFRBS0VOIElOVE8gQUNDT1VOVFxuICBcdCAqL1xuICAvLyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDSz8/P1xuICBsaXN0X29ic2VsczogZnVuY3Rpb24oYmVnaW4sIGVuZCwgcmV2ZXJzZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub2JzZWxfbGlzdF91cmkgPSB0aGlzLnVyaSArIFwiQG9ic2Vsc1wiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3RfdXJpID09PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIEtUQlM6VHJhY2U6bGlzdF9vYnNlbHMoKSB1bmtub3duIHVyaVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgT0JKID0gdGhpcztcblxuICAgIC8vXHRcdCQuZ2V0SlNPTih0aGlzLm9ic2VsX2xpc3RfdXJpLHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8uYmluZCh0aGlzKSk7XG4gICAgdmFyIE9CSiA9IHRoaXM7XG4gICAgXG4gICAgdmFyIGZ1bmN0aW9uc0J5U3RhdHVzID0ge1xuICAgICAgJzIwMCcgOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIganNvblJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICBpZiAoanNvblJlc3BvbnNlLm9ic2Vscy5sZW5ndGggPiAwKVxuICAgICAgICB7T0JKLkJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfIChqc29uUmVzcG9uc2UpO31cbiAgICAgIH0sXG4gICAgICAnNDAxJzogZnVuY3Rpb24gKHhocikge1xuICAgICAgICBjb25zb2xlLmxvZyAoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICAgICAgdmFyIGxpbmsgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgdmFyIGQgPSBsaW5rLnNwbGl0ICgnLCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgZC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgdmFyIHNvdXNEID0gZFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgIHZhciBsaW5rO1xuICAgICAgICAgIHZhciBVUkxTdWNjZXNzO1xuICAgICAgICAgIGlmIChzb3VzRFsxXSA9PT0gXCIgcmVsPW9hdXRoX3Jlc291cmNlX3NlcnZlclwiKSB7XG4gICAgICAgICAgICBsaW5rID0gc291c0RbMF0uc3Vic3RyKDEsIHNvdXNEWzBdLmxlbmd0aCAtIDIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpIHtcbiAgICAgICAgICAgIFVSTFN1Y2Nlc3MgPSBzb3VzRFswXS5zdWJzdHIoMiwgc291c0RbMF0ubGVuZ3RoIC0gMyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vcGVuIChsaW5rKSA7XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCB0aGF0Lm9ic2VsX2xpc3RfdXJpLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHZhciBwcm9jZXNzID0gZnVuY3Rpb25zQnlTdGF0dXNbeGhyLnN0YXR1c10gfHwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgWWV0IEltcGxlbWVudGVkXCIpO1xuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzKHhocik7XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgICByZXR1cm4gdGhpcy5vYnNlbF9saXN0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoZW5kICYmIG8uZ2V0X2JlZ2luKCkgPiBlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoYmVnaW4gJiYgby5nZXRfZW5kKCkgPCBiZWdpbikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9LFxuXG4gIEJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhUmVjdSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIHBhciBwYXF1ZXRcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOkNvbmZpZycsIGRhdGFSZWN1KTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVuZCA9IE51bWJlcihpKSArIE51bWJlcigxMDApO1xuXG4gICAgaWYgKGRhdGFSZWN1Lm9ic2Vscykge1xuICAgICAgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1Lm9ic2VscywgaSwgZW5kKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3UsIGksIGVuZCk7XG4gICAgfVxuXG5cbiAgfSxcbiAgX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cDogZnVuY3Rpb24oZGF0YVJlY3UsIGksIGVuZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGQgPSBkYXRhUmVjdS5sZW5ndGggO1xuICAgIHZhciBkYXRhVG9EcmF3ID0gZGF0YVJlY3Uuc2xpY2UgKGksIGVuZCk7XG4gICAgY29uc29sZS5sb2cgKCdfb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwJyk7XG4gICAgICBmb3IgKHZhciBqPTAgOyAgaiA8IGRhdGFUb0RyYXcubGVuZ3RoOyBqKyspe1xuICAgICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGRhdGFUb0RyYXdbal0pO1xuICAgICAgICBpZiAoaiA9PT0gZGF0YVRvRHJhdy5sZW5ndGggLTEpe1xuICAgICAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcpO1xuICAgICAgICAgIHZhciBpID0gTnVtYmVyKGkpICsgZGF0YVRvRHJhdy5sZW5ndGggKyBOdW1iZXIoMSk7XG4gICAgICAgICAgdmFyIGVuZCA9IChOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKSA+IGQpP2RhdGFSZWN1Lmxlbmd0aCA6IE51bWJlcihpKSArIE51bWJlcigxMDApXG4gICAgICAgICAgaWYgKGkgPD0gZCkgIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1LCBpLCBlbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVDb21wbGV0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICB9LFxuXG4gIF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgY291bnQgKys7XG4gICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgICAgIGlmIChjb3VudCA9PT0gZGF0YS5sZW5ndGgpICAgICAge3RoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcsIHRoaXMpO31cbiAgICB9LCB0aGlzKTtcblxuXG4gIH0sXG5cbiAgZ2V0X0xhc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1heCA9IDA7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPiBtYXgpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIGdldF9GaXJzdF9vYnNlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB2YXIgbWluMSA9IDk5OTk5OTk5OTk5OTk7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPCBtaW4xKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfTGlzdF9vYnNlbF9QYXJUeXBlOiBmdW5jdGlvbihvYnNlbFR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbGlzdGUgPSBbXTtcblxuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLnR5cGUgPT09IG9ic2VsVHlwZSkgeyBsaXN0ZS5wdXNoKG8pOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3RlO1xuICB9LFxuXG5cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBsb2NhbCBvYnNlbCBsaXN0IHRvIGJlIHN5bmNocm9uaXNlZFxuICBcdCAqIHdpdGggdGhlIEtUQlMgYXQgYSBnaXZlbiByZWZyZXNoaW5nIHJhdGUuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBUaW1lIGluIHNlY29uZHMgYmV0d2VlbiB0d28gc3luY2hyb25pc2F0aW9ucy5cbiAgXHQgKi9cbiAgc3RhcnRfYXV0b19yZWZyZXNoX29ic2VsX2xpc3Q6IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBhID0gdGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoX29ic2VsX2xpc3QoKTpudWxsO1xuICAgIHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5saXN0X29ic2Vscy5iaW5kKHRoaXMpLCBwZXJpb2QgKiAxMDAwKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBvYnNlbCBsaXN0LlxuICBcdCAqL1xuICBzdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogUmV0cmlldmUgYW4gb2JzZWwgaW4gdGhlIHRyYWNlIGZyb20gaXRzIElELlxuICBcdCAqIElmIHRoZSBvYnNlbCBkb2VzIG5vdCBleGlzdCBsb2NhbGx5LCByZXR1cm5zXG4gIFx0ICogdW5kZWZpbmVkIGFuZCBzZW5kIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiAod2hpY2ggd2lsbCByZXN1bHQgaW4gYWRkaW5nIHRoaXMgb2JzZWwgbG9jYWxseVxuICBcdCAqIGlmIGl0IGV4aXN0cyBvbiB0aGUgS1RCUykuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGlkIElEIG9mIHRoZSBPYnNlbCB0byByZXRyaWV2ZVxuICBcdCAqIEByZXR1cm5zIHtPYnNlbH0gT2JzZWwgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIElEXG4gIFx0ICogICAgIG9yIHVuZGVmaW5lZCBpZiB0aGUgb2JzZWwgd2FzIG5vdCBmb3VuZC5cbiAgXHQgKiBAdG9kbyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDS1xuICBcdCAqL1xuICBnZXRfb2JzZWw6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfaWQoKSA9PT0gaWQpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIGlmIChvYnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gc2VuZHMgYSBxdWVyeSB0byBmaW5kIHRoZSBvYnNlbFxuICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAvLyBUT0RPIGlkZWFsbHkgSlNPTi4uLiBXaGVuIEtUQlMgc3VwcG9ydHMgaXQhXG4gICAgICAgIHVybDogdGhpcy51cmkgKyBpZCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHN1Y2Nlc3M6IHRoaXMuX3BhcnNlX2dldF9vYnNlbF8uYmluZCh0aGlzKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICAvKipcbiAgXHQgKiBDYWxsYmFjayBmb3IgcXVlcmllcyB3aGVyZSBhbiBvYnNlbCBpcyBleHBlY3RlZCBhcyBhIHJlc3VsdFxuICBcdCAqIFBhcnNlcyB0aGUgSlNPTiBkYXRhIGZyb20gdGhlIEtUQlMgdG8gY3JlYXRlIGEgbmV3IE9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHkuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX3BhcnNlX2dldF9vYnNlbF86IGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icyA9IHtcbiAgICAgIGF0dHJpYnV0ZXM6IHt9XG4gICAgfTtcblxuICAgIC8vIE9CU0VMIElEXG4gICAgb2JzLmlkID0gZGF0YVtcIkBpZFwiXTtcbiAgICBpZiAodGhpcy50eXBlID09PSBcIkNvbXB1dGVkVHJhY2VcIikge29icy5pZCA9IG9icy50eXBlICsgXCJfXCIgKyBvYnMuaWQ7fVxuICAgIGlmIChvYnMuaWQuc3Vic3RyKDAsIDIpID09PSBcIi4vXCIpIHsgb2JzLmlkID0gb2JzLmlkLnN1YnN0cigyKTsgfVxuXG4gICAgLy8gT0JTRUwgVFJBQ0VcbiAgICAvLyBkYXRhLmhhc1RyYWNlO1xuICAgIG9icy50cmFjZSA9IHRoaXM7XG5cbiAgICAvLyBPQlNFTCBUWVBFXG4gICAgLy8gZGF0YVtcIkB0eXBlXCJdOyAvLyBUT0RPIEJVRyBLVEJTIC0+IFVTRSBcIm06dHlwZVwiIGluc3RlYWRcbiAgICAvLyBkYXRhW1wibTp0eXBlXCJdO1xuICAgIG9icy50eXBlID0gZGF0YVtcIkB0eXBlXCJdLnN1YnN0cigyKTtcblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KCdodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnKSkge1xuICAgICAgb2JzLmxhYmVsID0gZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgfVxuICAgIC8vb2JzLmJlZ2luID0gZGF0YS5iZWdpbjtcbiAgICAvL29icy5lbmQgPSBkYXRhLmVuZDtcbiAgICB2YXIgZCA9IG5ldyBEYXRlICh0aGlzLm9yaWdpbik7XG4gICAgb2JzLmJlZ2luID0gZC5nZXRUaW1lKCkgKyBkYXRhLmJlZ2luIDtcbiAgICBvYnMuZW5kID0gZC5nZXRUaW1lKCkgKyBkYXRhLmVuZDtcblxuICAgIC8vIERFTEVUSU5HIFBST1BFUlRJRVMgVEhBVCBIQVZFIEFMUkVBRFkgQkVFTiBDT1BJRURcbiAgICBkZWxldGUgZGF0YVtcIkBpZFwiXTtcbiAgICBkZWxldGUgZGF0YS5oYXNUcmFjZTtcbiAgICBkZWxldGUgZGF0YVtcIkB0eXBlXCJdO1xuICAgIGRlbGV0ZSBkYXRhLmJlZ2luO1xuICAgIGRlbGV0ZSBkYXRhLmVuZDtcbiAgICBkZWxldGUgZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgLy9kZWxldGUgZGF0YVtcIm06dHlwZVwiXTtcblxuXG4gICAgLy8gQVRUUklCVVRFU1xuICAgIGZvciAodmFyIGF0dHIgaW4gZGF0YSkge1xuICAgICAgaWYgKGF0dHIuc3Vic3RyKDAsIDIpID09PSBcIm06XCIpIHsgLy8gVE9ETyB0aGlzIGlzIG5vdCBnZW5lcmljISEhIVxuICAgICAgICBvYnMuYXR0cmlidXRlc1thdHRyLnN1YnN0cigyKV0gPSBkYXRhW2F0dHJdO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGRhdGEsb2JzKTtcbiAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwob2JzKTtcbiAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHsgLy8gVE9ETyBmaXJzdCBhcHByb3hpbWF0aW9uXG4gICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgIH1cbiAgfSxcblxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgXHQgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL1x0XHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLl9jaGVja19hbmRfdXBkYXRlX3RyYWNlX3R5cGVfKGRhdGFbJ0B0eXBlJ10pO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2RlZmF1bHRfc3ViamVjdCcsIGRhdGEuaGFzRGVmYXVsdFN1YmplY3QsICcnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdtb2RlbF91cmknLCBkYXRhLmhhc01vZGVsLCAndHJhY2U6bW9kZWwnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvYnNlbF9saXN0X3VyaScsIGRhdGEuaGFzT2JzZWxMaXN0LCAndHJhY2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZV91cmknLCBkYXRhLmluQmFzZSwgJ3RyYWNlOmJhc2UnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvcmlnaW4nLCBkYXRhLm9yaWdpbiwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YS5sYWJlbCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlRGF0YScsIGRhdGEpO1xuICAgIC8vdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luX29mZnNldCcsdGhpcy5rdGJzX29yaWdpbl90b19tcyhkYXRhLm9yaWdpbiksJycpO1xuICB9LFxuICBfdXBkYXRlX21ldGhvZF86IGZ1bmN0aW9uKHRyYWNlX3R5cGUsIG1ldGhvZF9uYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpc1ttZXRob2RfbmFtZV0gPSB0aGlzW3RyYWNlX3R5cGUgKyBcIl9tZXRob2RzXCJdW21ldGhvZF9uYW1lXTtcbiAgICBpZiAodGhpcy50ZW1wW21ldGhvZF9uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRlbXBbbWV0aG9kX25hbWVdLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgdGhpc1ttZXRob2RfbmFtZV0ocGFyYW0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBfY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXzogZnVuY3Rpb24odHlwZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGUpIHtcbiAgICAgIGZvciAodmFyIG1ldGhvZF9uYW1lIGluIHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0pIHtcbiAgICAgICAgaWYgKHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0uaGFzT3duUHJvcGVydHkobWV0aG9kX25hbWUpKSAgICAgICAge3RoaXMuX3VwZGF0ZV9tZXRob2RfKHR5cGUsIG1ldGhvZF9uYW1lKTt9XG4gICAgICB9XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLypcdF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gIC8vXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuICBcdFx0dmFyIGlkLCBsYWJlbCwgdHlwZSwgYmVnaW4sIGVuZCwgYXR0cmlidXRlcywgb2JzO1xuICBcdFx0dmFyIG5ld19vYnNlbF9sb2FkZWQgPSBmYWxzZTtcbiAgXHRcdGRhdGEub2JzZWxzLmZvckVhY2goZnVuY3Rpb24oZWwsa2V5KSB7XG4gIFx0XHRcdHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAvKlxuICBcdFx0XHR2YXIgYXR0ciA9IHt9O1xuICBcdFx0XHRhdHRyLmlkID0gZWxbJ0BpZCddO1xuICBcdFx0XHRhdHRyLnRyYWNlID0gdGhpcztcbiAgXHRcdFx0YXR0ci5sYWJlbCA9IGVsWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSB8fCB1bmRlZmluZWQ7XG4gIFx0XHRcdGF0dHIudHlwZSA9IGVsWydAdHlwZSddO1xuICBcdFx0XHRhdHRyLmJlZ2luID0gZWxbJ2JlZ2luJ107XG4gIFx0XHRcdGF0dHIuZW5kID0gZWxbJ2VuZCddO1xuICBcdFx0XHRhdHRyLmF0dHJpYnV0ZXMgPSBlbDtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snQGlkJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0B0eXBlJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydiZWdpbiddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snZW5kJ10pO1xuICBcdFx0XHRvYnMgPSBuZXcgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsKGF0dHIpO1xuXG4gIFx0XHRcdGlmKCEgdGhpcy5fY2hlY2tfb2JzZWxfbG9hZGVkXyhvYnMpKSB7XG4gIFx0XHRcdFx0bmV3X29ic2VsX2xvYWRlZCA9IHRydWU7XG4gIFx0XHRcdH1cbiovXG4gIC8vfSx0aGlzKTtcbiAgLypcdFx0aWYobmV3X29ic2VsX2xvYWRlZCkge1xuICBcdFx0XHR0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZScsdGhpcy50cmFjZVNldCk7XG4gIFx0XHR9XG4qL1xuICAvL30sKi9cbiAgX2NoZWNrX29ic2VsX2xvYWRlZF86IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3Quc29tZShmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5nZXRfaWQoKSA9PT0gb2JzLmdldF9pZCgpOyAvLyBmaXJzdCBhcHByb3hpbWF0aW9uOiBvYnNlbCBoYXMgdGhlIHNhbWUgSUQgPT4gaXQgaXMgYWxyZWFkeSBsb2FkZWQuLi4gV2UgZG9uJ3QgY2hlY2sgaWYgdGhlIG9ic2VsIGhhcyBjaGFuZ2VkIVxuICAgIH0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFN0b3JlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7fSxcbiAgICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgLy8gVE9ETyBzeW5jIHdpdGggS1RCU1xuICAgIH0sXG4gICAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRfc3ViamVjdDtcbiAgICB9LFxuICAgIHNldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHt9LFxuICAgIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAvLyBMT0NBTCBUUkFDRVxuICAgICAgLy92YXIgb2JzID0gbmV3IFNhbW90cmFjZXMuT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICAgIC8vIEtUQlMgQk9HVUVcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdmFyIGpzb25fb2JzZWwgPSB7XG4gICAgICAgIFwiQGNvbnRleHRcIjpcdFtcbiAgICAgICAgXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgICAgICAgICAgIHsgXCJtXCI6IFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWwjXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcIkB0eXBlXCI6XHRcIm06XCIgKyBwYXJhbXMudHlwZSwgLy8gZml4ZWQ6IFwiU2ltcGxlT2JzZWxcIiwgLy8gVE9ETyBLVEJTIEJVRyBUTyBGSVhcbiAgICAgICAgaGFzVHJhY2U6XHRcIlwiLFxuICAgICAgICBzdWJqZWN0Olx0cGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKT9wYXJhbXMuc3ViamVjdDp0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSxcbiAgICAgICAgLy9cIm06dHlwZVwiOlx0cGFyYW1zLnR5cGVcbiAgICAgIH07XG4gICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkscGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKSxwYXJhbXMuc3ViamVjdCx0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSk7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYmVnaW5cIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5iZWdpbjsgfVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImVuZFwiKSkgeyBqc29uX29ic2VsLmJlZ2luID0gcGFyYW1zLmVuZDt9XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYXR0cmlidXRlc1wiKSkge1xuICAgICAgICBmb3IgKHZhciBhdHRyIGluIHBhcmFtcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHIpKSAgICAgICAgICB7anNvbl9vYnNlbFtcIm06XCIgKyBhdHRyXSA9IHBhcmFtcy5hdHRyaWJ1dGVzW2F0dHJdO31cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gX29uX2NyZWF0ZV9vYnNlbF9zdWNjZXNzXyhkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICAvKlxuICAgICAgICBcdFx0XHRcdHZhciB1cmwgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlcignTG9jYXRpb24nKTtcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsX2FycmF5ID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIFx0XHRcdFx0Ki9cblxuICAgICAgICB2YXIgdXJsX2FycmF5ID0gZGF0YS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgb2JzZWxfaWQgPSB1cmxfYXJyYXlbdXJsX2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvL3RoaXMuZ2V0X29ic2VsKG9ic2VsX2lkKTtcbiAgICAgICAgLy8gT3B0aW1pc2F0aW9uOiBkbyBub3QgZG8gYSBHRVQgcXVlcnkgdG8gZ2V0IHRoZSBPQlNFTFxuICAgICAgICAvLyBUaGUgT2JzZWwgcGFyYW1ldGVycyBhcmUgYWxyZWFkeSBrbm93biBpbiBwYXJhbVxuICAgICAgICAvLyBXZSBqdXN0IG5lZWQgdG8gYWRkIHRoZSBJRC5cbiAgICAgICAgcGFyYW1zLmlkID0gb2JzZWxfaWQ7XG4gICAgICAgIHBhcmFtcy50cmFjZSA9IHRoaXM7XG4gICAgICAgIHZhciBvID0gbmV3IEtUQlNPYnNlbChwYXJhbXMpO1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci5vcGVuKCdQT1NUJywgdGhhdC5pZCwgdHJ1ZSk7XG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ09LUG9zdCcpO1xuICAgICAgICAgICAgdGhhdC5fb25fY3JlYXRlX29ic2VsX3N1Y2Nlc3MoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3QgZXJyb3InKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBTdGF0dXM6IFwiICsgZS50YXJnZXQuc3RhdHVzKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShqc29uX29ic2VsKSk7XG4gICAgfVxuICB9LFxuXG4gIENvbXB1dGVkVHJhY2VfbWV0aG9kczoge1xuICAgIHNldF9tZXRob2Q6IGZ1bmN0aW9uKG1ldGhvZCkge30sXG4gICAgbGlzdF9wYXJhbWV0ZXJzOiBmdW5jdGlvbihpbmNsdWRlX2luaGVyaXRlZCkge30sXG4gICAgZ2V0X3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5KSB7fSxcbiAgICBzZXRfcGFyYW1ldGVyOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7fSxcbiAgICBkZWxfcGFyYW1ldGVyOiBmdW5jdGlvbihrZXkpIHt9XG4gIH0sXG5cbiAgLy8gVEVNUE9SQVJZIE1FVEhPRFNcbiAgY3JlYXRlX29ic2VsOiBmdW5jdGlvbihvYnNlbF9wYXJhbXMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAoIXRoaXMuY3JlYXRlX29ic2VsLmhhc093blByb3BlcnR5KCdjcmVhdGVfb2JzZWwnKSkge1xuICAgICAgdGhpcy50ZW1wLmNyZWF0ZV9vYnNlbCA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnRlbXAuY3JlYXRlX29ic2VsLnB1c2ggKG9ic2VsX3BhcmFtcyk7XG4gIH0sXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gS1RCU1RyYWNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgS1RCU0Jhc2UgPSByZXF1aXJlKFwiLi9LVEJTLkJhc2UuanNcIik7XG5cblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuS1RCUyBpcyBhIEphdmFzY3JpcHQgS1RCUyBvYmplY3QgdGhhdFxuKiBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWV0bnMgdGhlIEtUQlMgQVBJLlxuKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZSBsaXN0IG9mIGJhc2VzXG4qIGF2YWlsYWJsZSBpbiB0aGUgS1RCUy4gQWNjZXNzIGEgc3BlY2lmaWMgYmFzZSwgZXRjLlxuKlxuKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRvIGxvYWQuXG4qL1xudmFyIEtUQlMgPSBmdW5jdGlvbiBLVEJTKHVyaSkge1xuICAvLyBLVEJTIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHVyaSwgdXJpLCAnS1RCUycsIFwiXCIpO1xuICB0aGlzLmJhc2VzID0gW107XG4gIHRoaXMuYnVpbHRpbl9tZXRob2RzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCUy5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBsaXN0X2J1aWx0aW5fbWV0aG9kczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuKi9cbiAgZ2V0X2J1aWx0aW5fbWV0aG9kOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiB0aGUgVVJJIG9mIHRoZSBiYXNlcyBjb250YWluZWQgaW4gdGhlIEtUQlNcbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXJyYXkgb2YgVVJJIG9mIGJhc2VzLlxuKi9cbiAgbGlzdF9iYXNlczogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmFzZXM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIEtUQlMuQmFzZSB3aXRoIHRoZSBnaXZlbiBJRC5cbiAgKiBAcmV0dXJucyBTYW1vdHJhY2VzLktUQlMuQmFzZSBCYXNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIElEXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZVxuKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBLVEJTQmFzZSh0aGlzLnVyaSArIGlkLCBpZCk7XG4gIH0sXG4gIC8qKlxuICAqIENyZWF0ZSBhIG5ldyBiYXNlLlxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2UgKG9wdGlvbmFsKVxuICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4qL1xuICBjcmVhdGVfYmFzZTogZnVuY3Rpb24oaWQsIGxhYmVsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld19iYXNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiQmFzZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIixcbiAgICAgIFwibGFiZWxcIjpcdGxhYmVsXG4gICAgfTtcblxuICAgIFxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS1Bvc3QnKTtcbiAgICAgICAgICB0aGF0LmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUG9zdCBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShuZXdfYmFzZSkpO1xuICB9LFxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZXMnLCBkYXRhLmhhc0Jhc2UsICdrdGJzOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2J1aWx0aW5fbWV0aG9kcycsIGRhdGEuaGFzQnVpbGRpbk1ldGhvZCwgJ2t0YnM6dXBkYXRlJyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlM7XG4iLCJcbi8qKlxuKiBPYnNlbCBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsfVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIE9ic2VsXG4qIEBzZWUgU2Ftb3RyYWNlcy5PYnNlbFxuKi9cblxuLyoqXG4qIE9ic2VsUGFyYW0gaXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgcGFyYW1ldGVyc1xuKiBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgbmV3IG9ic2VsLlxuKiBUaGlzIHR5cGUgb2Ygb2JqZWN0IGlzIHVzZWQgaW4gc2V2ZXJhbCBtZXRob2RzXG4qIHN1Y2ggYXMgdGhlIE9ic2VsIGNvbnN0cnVjdG9yLCBvciB0aGVcbiogVHJhY2UuY3JlYXRlX29ic2VsIG1ldGhvZC5cbiogVGhlIG9wdGlvbmFsIHBvcnBlcnRpZXMgdmFyaWVzIGRlcGVuZGluZyBvbiB0aGVcbiogbWV0aG9kIGNhbGxlZC5cbiogQHR5cGVkZWYgT2JzZWxQYXJhbVxuKiBAcHJvcGVydHkge1N0cmluZ30gW2lkXSBJZCBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtUcmFjZX0gW3RyYWNlXSBUcmFjZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlXSBUeXBlIG9mIHRoZSBvYnNlbFxuKiBAcHJvcGVydHkge051bWJlcn0gW2JlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4qIEBwcm9wZXJ0eSB7TnVtYmVyfSBbZW5kXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgZW5kc1xuKiBAcHJvcGVydHkge09iamVjdH0gW2F0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PFJlbGF0aW9uPn0gW3JlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtpbnZlcnNlX3JlbGF0aW9uc10gUmVsYXRpb25zIHRvIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8T2JzZWw+fSBbc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcGFyYW0ubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiogQHRvZG8gRklYTUUgREVGSU5FIFdIQVQgSVMgQSBSRUxBVElPTlxuKi9cblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQGNsYXNzIEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQHBhcmFtIHtPYnNlbFBhcmFtfSBwYXJhbSBQYXJhbWV0ZXJzIG9mIHRoZSBvYnNlbFxuKiBAcGFyYW0ge1N0cmluZ30gcGFyYW0uaWQgSWRlbnRpZmllciBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7VHJhY2V9IHBhcmFtLlRyYWNlIFRyYWNlIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLnR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW0uYmVnaW49RGF0ZS5ub3coKV0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmVuZD1wYXJhbS5iZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHBhcmFtIHtPYmplY3R9IFtwYXJhbS5hdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtwYXJhbS5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0uaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PE9ic2VsPn0gW3BhcmFtLnNvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIFJFTEFUSU9OUyBBUkUgTk9UIFlFVCBTVVBQT1JURURcbiovXG5cbnZhciBPYnNlbCA9IGZ1bmN0aW9uIE9ic2VsKHBhcmFtKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAnaWQnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnbGFiZWwnLFx0XHRcIlwiKTtcbn07XG5cbk9ic2VsLnByb3RvdHlwZSA9IHtcbiAgLy8gQVRUUklCVVRFU1xuICBhdHRyaWJ1dGVzOiB7fSxcbiAgcmVsYXRpb25zOiBbXSxcbiAgaW52ZXJzZV9yZWxhdGlvbnM6IFtdLFxuICBzb3VyY2Vfb2JzZWxzOiBbXSxcbiAgbGFiZWw6IFwiXCIsXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHNldCB0aGUgYXR0cmlidXRlIG9mIHRoZSBzYW1lIG5hbWUgd2l0aCB0aGUgZGVmYXVsdFxuICAqIHZhbHVlLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHBhcmFtIHZhbHVlIERlZmF1bHQgdmFsdWVcbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX3ByaXZhdGVfY2hlY2tfZGVmYXVsdDogZnVuY3Rpb24ocGFyYW0sIGF0dHIsIHZhbHVlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzW2F0dHJdID0gKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpP3BhcmFtW2F0dHJdOnZhbHVlO1xufSxcbiAgLyoqXG4gICogSWYgYXR0cmlidXRlIGV4aXN0cywgdGhlbiBzZXQgdGhlIGNsYXNzIGF0dHJpYnV0ZVxuICAqIG9mIHRoZSBzYW1lIG5hbWUgdG8gdGhlIGF0dHJpYnV0ZSB2YWx1ZSwgb3RoZXJ3aXNlXG4gICogbm90aGluZyBoYXBwZW5zLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX3VuZGVmOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH1cbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHRocm93IGFuIGVycm9yLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2Vycm9yOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgXCJQYXJhbWV0ZXIgXCIgKyBhdHRyICsgXCIgcmVxdWlyZWQuXCI7XG4gIH1cbn0sXG4gIC8vIFJFU09VUkNFXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBSZW1vdmUgdGhlIG9ic2VsIGZyb20gaXRzIHRyYWNlLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnJlbW92ZV9vYnNlbH0gZXZlbnRcbiovXG4gIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmdldF90cmFjZSgpLnJlbW92ZV9vYnNlbCh0aGlzKTtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IElkIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9pZDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5pZDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9sYWJlbDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5sYWJlbDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmxhYmVsID0gbGJsOyB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbCB0byB0aGUgZW1wdHkgc3RyaW5nLlxuKi9cbiAgcmVzZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbnRoaXMubGFiZWwgPSBcIlwiOyB9LFxuICAvLyBPQlNFTFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuICAqIEByZXR1cm5zIHtUcmFjZX0gVHJhY2UgdGhlIE9ic2VsIGJlbG9uZ3MgdG8uXG4qL1xuICBnZXRfdHJhY2U6IFx0XHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50cmFjZTsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAgKiBAdG9kbyBUT0RPIGRpZmZlcnMgZnJvbSBLVEJTIEFQSSAtPiBleHByZXNzIGl0IGNsZWFybHlcbiovXG4gIGdldF90eXBlOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50eXBlOyB9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiovXG4gIGdldF9iZWdpbjogXHRcdGZ1bmN0aW9uKCkge1xuICAgIC8vcmV0dXJuIHRoaXMuZ2V0X3RyYWNlKCkuZ2V0X29yaWdpbl9vZmZzZXQoKSArIHRoaXMuYmVnaW47XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmVnaW47XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiovXG4gIGdldF9lbmQ6IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmVuZDtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X29ic2VsX3R5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBiZWdpbiBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAdG9kbyBUT0RPIG5vdCBLVEJTIEFQSSBjb21wbGlhbnRcbiAgKiBAZGVwcmVjYXRlZCBUaGlzIG1ldGhvZCBtaWdodCBub3QgYmUgc3VwcG9ydGVkIGluIHRoZSBmdXR1cmUuXG4qL1xuICBmb3JjZV9zZXRfYmVnaW46IGZ1bmN0aW9uKGJlZ2luKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5iZWdpbiA9IGJlZ2luO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtOdW1iZXJ9IGVuZCBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2VuZDogXHRmdW5jdGlvbihlbmQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBzb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IFNvdXJjZSBPYnNlbHMgb2YgdGhlIGN1cnJlbnQgT2JzZWwuXG4qL1xuICBsaXN0X3NvdXJjZV9vYnNlbHM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMubGlzdF9zb3VyY2Vfb2JzZWxzID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlX29ic2VscztcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBhdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBBdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuKi9cbiAgbGlzdF9hdHRyaWJ1dGVfdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHZhciBhdHRycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgICAgICB7XG4gICAgICAgIGF0dHJzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cnM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBSZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGlvbl90eXBlczogXHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLnJlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgIC8vIGlmICgkLmluQXJyYXkoci50eXBlLCByZWxzKSA9PT0gLTEpIHtcbiAgICAvLyAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIC8vIH1cbiAgICBpZiAocmVscy5pbmRleE9mKHIudHlwZSkgPT09LTEpe1xuICAgICAgcmVscy5wdXNoKHIudHlwZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbHM7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIE9ic2VscyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IE9ic2VsIHdpdGggdGhlIGdpdmVuIHJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aW9uX3R5cGUgUmVsYXRpb24gdHlwZS5cbiAgKiBAcmV0dXJucyB7QXJyYXk8T2JzZWw+fSBPYnNlbHMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGhvdyBpdCBpcyBzdXBwb3NlZCB0byB3b3JrIGluIEtUQlMgQVBJXG4qL1xuICBsaXN0X3JlbGF0ZWRfb2JzZWxzOiBcdGZ1bmN0aW9uKHJlbGF0aW9uX3R5cGUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBvYnNzID0gW107XG4gIGlmICh0aGlzLnJlbGF0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgICAgaWYgKHIudHlwZSA9PT0gcmVsYXRpb25fdHlwZSkge1xuICAgICAgICBvYnNzLnB1c2goci5vYnNlbF90byk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgICAgaWYgKHIudHlwZSA9PT0gcmVsYXRpb25fdHlwZSkge1xuICAgICAgICBvYnNzLnB1c2goci5vYnNlbF90byk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG9ic3M7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGludmVyc2UgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBJbnZlcnNlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGhvdyBpdCBpcyBzdXBwb3NlZCB0byB3b3JrIGluIEtUQlMgQVBJXG4qL1xuICBsaXN0X2ludmVyc2VfcmVsYXRpb25fdHlwZXM6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgdmFyIHJlbHMgPSBbXTtcbiAgdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgIC8vIGlmICgkLmluQXJyYXkoci50eXBlLCByZWxzKSA9PT0gLTEpIHtcbiAgICAvLyAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIC8vIH1cbiAgICBpZiAocmVscy5pbmRleE9mKHIudHlwZSkgPT09LTEpe1xuICAgICAgcmVscy5wdXNoKHIudHlwZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbHM7XG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiAgKiBAcmV0dXJucyB7T2JqZWN0fSBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBnZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHRoaXMuYXR0cmlidXRlc1thdHRyXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgXCJBdHRyaWJ1dGUgXCIgKyBhdHRyICsgXCIgaXMgbm90IGRlZmluZWRcIjsgLy8gVE9ET1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIH1cbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgQXR0cmlidXRlIHZhbHVlLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgc2V0X2F0dHJpYnV0ZTpcdGZ1bmN0aW9uKGF0dHIsIHZhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsO1xuICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUEkuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4qL1xuICBkZWxfYXR0cmlidXRlOlx0XHRcdGZ1bmN0aW9uKGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBBZGRzIGEgcmVsYXRpb24gd2l0aCBhbiBPYnNlbC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBOT1QgWUVUIElNUExFTUVOVEVEXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbCBSZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBhZGRfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLCBvYnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVE9ET1xuICB0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZXMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGRlbF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG5cbiAgLy8gTk9UIElOIEtUQlMgQVBJXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0XG4gICogdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYW4gT2JzZWwgd2l0aFxuICAqIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsI09ic2VsfSBjb25zdHJ1Y3RvciBvclxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI2NyZWF0ZV9vYnNlbH0gbWV0aG9kLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB0aGF0XG4qL1xuICB0b19PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9iaiA9IHtcbiAgICBpZDogdGhpcy5pZCxcbiAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgYmVnaW46IHRoaXMuYmVnaW4sXG4gICAgZW5kOiB0aGlzLmVuZCxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAvLyB1c2UgLnNsaWNlIHRvIGNvcHlcbiAgICAvLyBUT0RPIGlzIGl0IGVub3VnaD8gPC0gbWlnaHQgY3JlYXRlIGJ1Z3NcbiAgICByZWxhdGlvbnM6IHRoaXMucmVsYXRpb25zLnNsaWNlKCksXG4gICAgaW52ZXJzZV9yZWxhdGlvbnM6IHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBzb3VyY2Vfb2JzZWxzOiB0aGlzLnNvdXJjZV9vYnNlbHMuc2xpY2UoKSxcbiAgICBsYWJlbDogdGhpcy5sYWJlbFxuICB9O1xuICAvLyBjb3B5IGVhY2ggYXR0cmlidXRlc1xuICBmb3IgKHZhciBhdHRyIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgIG9iai5hdHRyaWJ1dGVzW2F0dHJdID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqO1xufSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWw7XG4iXX0=
