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

  function getAbsoluteURLFromRelative(base, relative) {

    if(relative.indexOf('http://') > -1){
      return relative;
    }
    if(relative.indexOf('#') === 0){
      var position = base.indexOf('#');
      if( position === -1){
        return base + relative;
      }
      else{
        var new_base = base.substring(0,position);
        return new_base + relative;
      }
    }

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
  /*
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
        trc.trigger('getetag');
        if (options._on_state_refresh_) {
          trc._on_state_refresh_(data);
        }
        success(data);
      }
    });
  }
  */

  function load( timeout ){
    var that = this;
    var delay = timeout || 15000;
    this.loading_promise = this.loading_promise || new Promise(function(resolve, reject) {

      setTimeout(function() {
        that.loading_promise = null;
        reject("Promise timed-out after " + delay + "ms");
      }, delay);

      var xhr = new XMLHttpRequest();
      xhr.open('GET',that.uri,true);
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
              if(!that._on_state_refresh_){
                if(response['@type'] === null || response['@type'] === undefined ){
                  for(var i = 0;  i < response["@graph"].length; i++){
                    if( response["@graph"][i]["@type"] === "TraceModel" ){
                      var model = new Samotraces.Ktbs.Model(response["@graph"][i]['@id']);
                      model._on_state_refresh_(response);
                      that.loading_promise = null;
                      resolve(model);
                    }
                  }
                }
                switch(response['@type']){
                  case 'Base':
                    var base = new Samotraces.Ktbs.Base(response['@id']);
                    base._on_state_refresh_(response);
                    that.loading_promise = null;
                    resolve(base);
                  break;
                  case 'StoredTrace':
                    var trace = new Samotraces.Ktbs.Trace(response['@id'],response['@id'],'StoredTrace');
                    trace._on_state_refresh_(response);
                    that.loading_promise = null;
                    resolve(trace);
                  break;
                  case 'ComputedTrace':
                    var trace = new Samotraces.Ktbs.Trace(response['@id'],response['@id'],'ComputedTrace');
                    trace._on_state_refresh_(response);
                    that.loading_promise = null;
                    resolve(trace);
                  break;
                }
              }
              that._on_state_refresh_(response);
              that.loading_promise = null;
              resolve(that);
            }
            catch (e) {
               reject(Error('This resource has some errors on server side.'));
            }


          }
          else if(xhr.status === 304){
            that.loading_promise = null;
            resolve(that);
          }
          else {
            that.loading_promise = null;
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        that.loading_promise = null;
        reject(Error('There was a network error.'));
      };

      xhr.send();
    });

    return this.loading_promise;
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

    var that = this;
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', that.uri, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.withCredentials = true;
      xhr.onerror = function() {
        reject( "Cannot delete " + that.get_resource_type() + " " + that.uri + ": " + xhr.status );
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          resolve( xhr.response );
        }
      };
      xhr.send(null);
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
    this.uri = uri || id;
    this.label = label || "";
    this.type = type || "";
    this.etag = "";


    this.loading_promise = null;


    // API METHODS
    this.get_id = get_id;
    this.get_uri = get_uri;
    this.get_read_only = get_read_only;
    this.remove = remove;
    this.get_label = get_label;
    this.set_label = set_label;
    this.reset_label = reset_label;
    this.get_etag = get_etag;
    // helper
    this.load = load;
    this.get_resource_type = get_resource_type;
    this._check_change_ = _check_change_;
    this.start_auto_refresh = start_auto_refresh;
    this.stop_auto_refresh = stop_auto_refresh;
    this.getAbsoluteURLFromRelative = getAbsoluteURLFromRelative;
    return this;
  };
})();


module.exports = KTBSResource;
