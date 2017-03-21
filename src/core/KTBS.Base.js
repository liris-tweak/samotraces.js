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
var Base = function Base(uri, id, label) {
  // KTBS.Base is a Resource
  var id = id || uri;
  var label = label || "";
  KTBSResource.call(this, id, uri, 'Base', label);
  this.contains = [];
  this.attributes = {};
  this._propertiesPromise = null
};

Base.prototype = {
  get: function(id) {},

  /**
  	 * Create a stored trace in the KTBS
  	 * @param id {String} ID of the created trace
  	 * @param [model] {Model} Model of the trace
  	 * @param [origin] {Origin} Origin of the trace
  	 * @param [default_subject] {String} Default subject of the trace
  	 * @param [label] {String} Label of the trace
     * @param [comment] {String} Comment of the trace
  	 */
  create_stored_trace: function(id, model, origin, default_subject, label, comment) {
    var new_trace = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"StoredTrace",
      "@id":		id + "/"
    };
    new_trace.hasModel = model || "http://liris.cnrs.fr/silex/2011/simple-trace-model";
    new_trace.origin = origin || "1970-01-01T00:00:00Z";
    new_trace.default_subject = default_subject || "";
    new_trace.label = label || "";
    new_trace["rdfs:comment"] = comment || "";

    var that = this;

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST',that.uri,true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 201) {
            resolve( new Samotraces.Ktbs.Trace( xhr.response.replace('>','').replace('<',''), null, 'StoredTrace' ) );
          }
          else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };

      xhr.send( JSON.stringify(new_trace) );
    });
  },

  iter_bases: function(){
    function IterablePromise(arrayLike, process) {
      var that = this;
      var lst = [];
      var i = 0;
      that.forEach = function(callback) {
        if (i >= arrayLike.length) {
          return Promise.resolve(lst);
        } else {
          return Promise.resolve(arrayLike[i++])
          .then(process)
          .then(function(x) { lst.push(x); return x; })
          .then(callback)
          .then(that.forEach.bind(that, callback))
          ;
        }
      };
      that.then = function(onFullfilled, onRejected) {
        return that.forEach(function(){}).then(onFullfilled, onRejected);
      };
      that.catch = function(onRejected) {
        return that.forEach(function(){}).catch(onRejected);
      };
    }

    function createBaseResource( baseUri ){
      return new Samotraces.Ktbs.Base( baseUri, null, 'Base' );
    }

    var bases_uri = [];
    for(var j = 0 ; j < this.contains.length; j++){
      if( this.contains[j]['@type'] === 'Base' )
        bases_uri.push( this.getAbsoluteURLFromRelative( this.uri, this.contains[j]['@id']) );
    }

    return new IterablePromise(bases_uri, createBaseResource);

  },

  list_bases: function(){
    var that = this;
    return new Promise( function(resolve, reject){
      that.iter_stored_traces()
          .then( function(x){
            resolve(x);
          })
          .catch( function(err){
            reject(err);
          })
    });
  },

  load_properties: function(props, timeout){
    var that = this;
    var delay = timeout || 15000;


    var targetURI = that.uri+'?prop=';

    for(var i = 0; i < props.length; i++){
      targetURI += props[i] ;
      if( i < props.length - 1 )
        targetURI += ","
    }

    if( !this._propertiesPromise ){
      this._propertiesPromise = new Promise(function(resolve, reject) {

        setTimeout(function() {
          that._propertiesPromise = null;
          reject("Promise timed-out after " + delay + "ms");
        }, delay);

        var xhr = new XMLHttpRequest();
        xhr.open('GET',targetURI,true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/ld+json');
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 200) {
              var response = undefined
              try {
                response = JSON.parse(xhr.response);
                that.etag = xhr.getResponseHeader('ETag');
                that._propertiesPromise = null;
                resolve(response.contains);
              }
              catch (e) {
                that._propertiesPromise = null;
                reject(Error('This resource has some errors on server side.'));
              }
            }
            else {
              that._propertiesPromise = null;
              reject(xhr);
            }
          }
        };
        xhr.onerror = function() {
          that._propertiesPromise = null;
          reject(Error('There was a network error.'));
        };
        xhr.send();
      });
    }
    return this._propertiesPromise;
  },

  iter_stored_traces: function(){
    function IterablePromise(arrayLike, process) {
      var that = this;
      var lst = [];
      var i = 0;
      that.forEach = function(callback) {
        if (i >= arrayLike.length) {
          return Promise.resolve(lst);
        } else {
          return Promise.resolve(arrayLike[i++])
          .then(process)
          .then(function(x) { lst.push(x); return x; })
          .then(callback)
          .then(that.forEach.bind(that, callback))
          ;
        }
      };
      that.then = function(onFullfilled, onRejected) {
        return that.forEach(function(){}).then(onFullfilled, onRejected);
      };
      that.catch = function(onRejected) {
        return that.forEach(function(){}).catch(onRejected);
      };
    }

    function createBaseResource( traceUri ){
      return new Samotraces.Ktbs.Trace( traceUri, null, 'StoredTrace' );
    }

    var traces_uri = [];
    for(var j = 0 ; j < this.contains.length; j++){
      if( this.contains[j]['@type'] === 'StoredTrace' )
        traces_uri.push( this.getAbsoluteURLFromRelative( this.uri, this.contains[j]['@id']) );
    }

    return new IterablePromise(traces_uri, createBaseResource);

  },

  list_stored_traces: function(){
    var that = this;
    return new Promise( function(resolve, reject){
      that.iter_stored_traces()
          .then( function(x){
            resolve(x);
          })
          .catch( function(err){
            reject(err);
          })
    });
  },

  iter_computed_traces: function(){
    function IterablePromise(arrayLike, process) {
      var that = this;
      var lst = [];
      var i = 0;
      that.forEach = function(callback) {
        if (i >= arrayLike.length) {
          return Promise.resolve(lst);
        } else {
          return Promise.resolve(arrayLike[i++])
          .then(process)
          .then(function(x) { lst.push(x); return x; })
          .then(callback)
          .then(that.forEach.bind(that, callback))
          ;
        }
      };
      that.then = function(onFullfilled, onRejected) {
        return that.forEach(function(){}).then(onFullfilled, onRejected);
      };
      that.catch = function(onRejected) {
        return that.forEach(function(){}).catch(onRejected);
      };
    }

    function createBaseResource( traceUri ){
      return new Samotraces.Ktbs.Trace( traceUri, null, 'ComputedTrace' );
    }

    var traces_uri = [];
    for(var j = 0 ; j < this.contains.length; j++){
      if( this.contains[j]['@type'] === 'ComputedTrace' )
        traces_uri.push( this.getAbsoluteURLFromRelative( this.uri, this.contains[j]['@id']) );
    }

    return new IterablePromise(traces_uri, createBaseResource);

  },

  list_computed_traces: function(){
    var that = this;
    return new Promise( function(resolve, reject){
      that.iter_stored_traces()
          .then( function(x){
            resolve(x);
          })
          .catch( function(err){
            reject(err);
          })
    });
  },

  iter_models: function(){
    function IterablePromise(arrayLike, process) {
      var that = this;
      var lst = [];
      var i = 0;
      that.forEach = function(callback) {
        if (i >= arrayLike.length) {
          return Promise.resolve(lst);
        } else {
          return Promise.resolve(arrayLike[i++])
          .then(process)
          .then(function(x) { lst.push(x); return x; })
          .then(callback)
          .then(that.forEach.bind(that, callback))
          ;
        }
      };
      that.then = function(onFullfilled, onRejected) {
        return that.forEach(function(){}).then(onFullfilled, onRejected);
      };
      that.catch = function(onRejected) {
        return that.forEach(function(){}).catch(onRejected);
      };
    }

    function createBaseResource( traceUri ){
      return new Samotraces.Ktbs.Model( traceUri, null );
    }

    var traces_uri = [];
    for(var j = 0 ; j < this.contains.length; j++){
      if( this.contains[j]['@type'] === 'TraceModel' )
        traces_uri.push( this.getAbsoluteURLFromRelative( this.uri, this.contains[j]['@id']) );
    }

    return new IterablePromise(traces_uri, createBaseResource);

  },

  list_models: function(){
    var that = this;
    return new Promise( function(resolve, reject){
      var result = [];
      that.iter_stored_traces()
          .then( function(x){
            if(x)
              result.push(x);
            else
              resolve(result);
          })
          .catch( function(err){
            reject(err);
          })
    });
  },

  /**
  * Change the attributes of the Base. Add or change the attributes passed in parameter.
  * Example of attributes :
  * attributes = [ [attributes_name_1,attribute_value_1], [attribute_name_2,attribute_value_2], ...];
  *
  * Returns a Promise with the base as a parameter if the modification succeed.
  * @param attributes {Array} Array of Array, with the name of the attribute in the 1st position, the value of the parameter in the 2nd position.
  */
  modify_attributes: function( attributes ){
    var that = this;
    return new Promise(function(resolve, reject) {
      that.load()
        .then( function(){
          var old_attributes = that.attributes;
          for(var i = 0; i < attributes.length; i++){
            old_attributes[attributes[i][0]] = attributes[i][1];
          }

          // Pour le inRoot qui bug
          if(old_attributes['inRoot'] && old_attributes['inRoot'] === '..' )
            old_attributes['inRoot'] = '../';

          var modeldata = JSON.stringify(old_attributes);

          var etag = that.etag;
          var xhr = new XMLHttpRequest();
          xhr.open('PUT', that.uri, true);
          xhr.setRequestHeader('Content-Type', 'application/ld+json');
          xhr.setRequestHeader('If-Match', etag);
          xhr.withCredentials = true;
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if(xhr.status === 200) {
                that.etag = xhr.getResponseHeader('ETag');
                that._on_state_refresh_( JSON.parse( xhr.response ) );
                resolve( xhr.response );
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
        .catch( function(err){
          console.log(err);
        })
      } );
  },

  /**
  * Create a TraceModel in the KTBS.
  * Returns a Promise, with the created TraceModel as a parameter.
  * @param id {String} ID of the created TraceModel.
  * @param [label] {String} Label of the TraceModel.
  */
  create_model: function(id, label, comment, unit) {
    var doc = {
      '@context': 'http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context',
      '@graph': [{
        '@id': id,
        'label':label || '',
        'rdfs:comment' : comment || "",
        '@type': 'TraceModel',
        'inBase': './',
        'hasUnit': unit || 'millisecond'
      }]
    };
    var that = this;
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('POST',that.uri,true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 201) {
            resolve( new Samotraces.Ktbs.Model( xhr.response.replace('>','').replace('<',''), null, 'TraceModel' ) );
          }
          else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };

      xhr.send( JSON.stringify(doc) );
    });
  },

  /**
  * Create a BAse in this base ("Baseception").
  * Returns a Promise, with the created Base as a parameter.
  * @param id {String} ID of the created Base.
  * @param {!optionnal} label {String} Label of the Base.
  * @param {!optionnal} comment {String} Label of the Base.
  */
  create_base: function(id, label, comment) {
    var doc = {
      "@id": id + '/',
      "@type": "Base",
      "inBase": "./",
      "label": label || "",
      "http://www.w3.org/2000/01/rdf-schema#comment": comment || ""
    };
    var that = this;
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('POST',that.uri,true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 201) {
            resolve( new Samotraces.Ktbs.Base( xhr.response.replace('>','').replace('<','') ) );
          }
          else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };

      xhr.send( JSON.stringify(doc) );
    });
  },



  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_computed_trace: function(id, method, parameters, sources, label) {
    var query = {
      "@id": id,
      "@type": "ComputedTrace",
      "label": label,
      "hasMethod": method,
      "hasSource": sources,
      "parameter": parameters
    }
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.uri, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/ld+json');
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 201) {
            try {
              var response = JSON.parse(xhr.response);
              resolve(response);
            } catch (e) {
              resolve( xhr.response );
            } finally {
              resolve( xhr.response );
            }

          }
          else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };
      var string_query = JSON.stringify(query);
      console.log(string_query);
      xhr.send(string_query);
    }.bind(this));
  },
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
    this._check_change_('label', data["label"], 'base:update');
    var comment = data["http://www.w3.org/2000/01/rdf-schema#comment"] || "";
    this._check_change_('comment', comment, 'base:update');
    this._check_change_('contains', data.contains, 'base:update');
    this._check_change_('attributes', data, 'base:attrSet');
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
