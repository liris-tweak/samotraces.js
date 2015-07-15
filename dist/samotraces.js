(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Samotraces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  this._private_check_error(param,'id');
  this._private_check_error(param,'trace');
  this._private_check_error(param,'type');
  this._private_check_default(param,'begin',	Date.now());
  this._private_check_default(param,'end',		this.begin);
  this._private_check_default(param,'attributes',	{});
  this._private_check_undef(param,'relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param,'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param,'source_obsels',		[]);
  this._private_check_undef(param,'label',		"");
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
	_private_check_default: function(param,attr,value) {
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
	_private_check_undef: function(param,attr) {
		if(param[attr] !== undefined) {
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
	_private_check_error: function(param,attr) {
		if(param[attr] !== undefined) {
			this[attr] = param[attr];
		} else {
			throw "Parameter "+attr+" required.";
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
		this.get_trace().remove_obsel(this);
	},
	/**
	 * @summary
	 * Returns the id of the Obsel.
	 * @returns {String} Id of the obsel.
	 */
	get_id: function() { return this.id; },
	/**
	 * @summary
	 * Returns the label of the Obsel.
	 * @returns {String} Label of the obsel.
	 */
	get_label: function() { return this.label; },
	/**
	 * @summary
	 * Sets the label of the Obsel.
	 * @param {String} Label of the obsel.
	 */
	set_label: function(lbl) { this.label = lbl; },
	/**
	 * @summary
	 * Sets the label of the Obsel to the empty string.
	 */
	reset_label: function() { this.label = ""; },
	// OBSEL
	/**
	 * @summary
	 * Returns the trace the Obsel belongs to.
	 * @returns {Trace} Trace the Obsel belongs to.
	 */
	get_trace: 		function() { return this.trace; },
	/**
	 * @summary
	 * Returns the type of the Obsel.
	 * @returns {String} Type of the obsel.
	 * @todo TODO differs from KTBS API -> express it clearly
	 */
	get_type: function() { return this.type; },
	/**
	 * Returns the time when the Obsel starts.
	 * @returns {Number} Time when the Obsel starts.
	 */
	get_begin: 		function() {
		//return this.get_trace().get_origin_offset() + this.begin;
		return this.begin;
	},
	/**
	 * @summary
	 * Returns the time when the Obsel ends.
	 * @returns {Number} Time when the Obsel ends.
	 */
	get_end: 		function() {
		//return this.get_trace().get_origin_offset() + this.end;
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
		this.type = type;
		this.trace.trigger('trace:edit_obsel',this);
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
		this.begin = begin;
		this.trace.trigger('trace:edit_obsel',this);
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
		this.end = end;
		this.trace.trigger('trace:edit_obsel',this);
	},
	/**
	 * @summary
	 * Returns the source Obsels of the current Obsel.
	 * @returns {Array<Obsel>} Source Obsels of the current Obsel.
	 */
	list_source_obsels: 	function() {
		if(this.list_source_obsels === undefined) { return []; }
		return this.source_obsels;
	},
	/**
	 * @summary
	 * Returns the attribute names of the Obsel.
	 * @returns {Array<String>} Attribute names of the Obsel.
	 */
	list_attribute_types: 	function() {
		if(this.attributes === undefined) { return []; }
		var attrs = []
		for(var key in this.attributes) { attrs.push(key); }
		return attrs;
	},
	/**
	 * @summary
	 * Returns the relation types of the Obsel.
	 * @returns {Array<String>} Relation types of the Obsel.
	 * @todo TODO Check how it is supposed to work in KTBS API
	 */
	list_relation_types: 	function() {
		if(this.relations === undefined) { return []; }
		var rels = [];
		this.relations.forEach(function(r) {
			var uniqueNames = [];
    		if($.inArray(r.type, rels) === -1) {
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
		var obss = [];
		if(this.relations !== undefined) {
			this.relations.forEach(function(r) {
				var uniqueNames = [];
				if(r.type === relation_type) {
					obss.push(r.obsel_to);
				}
			});
		}
		if(this.inverse_relations !== undefined) {
			this.inverse_relations.forEach(function(r) {
				var uniqueNames = [];
				if(r.type === relation_type) {
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
		if(this.inverse_relations === undefined) { return []; }
		var rels = [];
		this.inverse_relations.forEach(function(r) {
			var uniqueNames = [];
    		if($.inArray(r.type, rels) === -1) {
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
		if(this.attributes[attr] === undefined) {
			throw "Attribute "+attr+" is not defined"; // TODO
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
		this.attributes[attr] = val;
		this.trace.trigger('trace:edit_obsel',this);
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
		delete this.attributes[attr];
		this.trace.trigger('trace:edit_obsel',this);
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
	add_related_obsel:		function(rel,obs) {
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
	del_related_obsel:		function(rel,obs) {
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
		for(var attr in this.attributes) {
			obj.attributes[attr] = this.attributes[attr];
		}
		return obj;
	},
};

module.exports = Obsel;

},{}],2:[function(require,module,exports){
var Obsel = require("./core/Obsel.js");
var Samotraces = {
  "Obsel": Obsel
};

module.exports = Samotraces;


},{"./core/Obsel.js":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS9PYnNlbC5qcyIsInNyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogT2JzZWwgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICoge0BsaW5rIFNhbW90cmFjZXMuT2JzZWx9XG4gKiBvYmplY3QuXG4gKiBAdHlwZWRlZiBPYnNlbFxuICogQHNlZSBTYW1vdHJhY2VzLk9ic2VsXG4gKi9cblxuLyoqXG4gKiBPYnNlbFBhcmFtIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHBhcmFtZXRlcnNcbiAqIG5lY2Vzc2FyeSB0byBjcmVhdGUgYSBuZXcgb2JzZWwuXG4gKiBUaGlzIHR5cGUgb2Ygb2JqZWN0IGlzIHVzZWQgaW4gc2V2ZXJhbCBtZXRob2RzXG4gKiBzdWNoIGFzIHRoZSBPYnNlbCBjb25zdHJ1Y3Rvciwgb3IgdGhlXG4gKiBUcmFjZS5jcmVhdGVfb2JzZWwgbWV0aG9kLlxuICogVGhlIG9wdGlvbmFsIHBvcnBlcnRpZXMgdmFyaWVzIGRlcGVuZGluZyBvbiB0aGVcbiAqIG1ldGhvZCBjYWxsZWQuXG4gKiBAdHlwZWRlZiBPYnNlbFBhcmFtXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW2lkXSBJZCBvZiB0aGUgb2JzZWxcbiAqIEBwcm9wZXJ0eSB7VHJhY2V9IFt0cmFjZV0gVHJhY2Ugb2YgdGhlIG9ic2VsXG4gKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGVdIFR5cGUgb2YgdGhlIG9ic2VsXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2JlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4gKiBAcHJvcGVydHkge051bWJlcn0gW2VuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbYXR0cmlidXRlc10gQXR0cmlidXRlcyBvZiB0aGUgb2JzZWwuXG4gKiBAcHJvcGVydHkge0FycmF5PFJlbGF0aW9uPn0gW3JlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiAqIEBwcm9wZXJ0eSB7QXJyYXk8UmVsYXRpb24+fSBbaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuICogQHByb3BlcnR5IHtBcnJheTxPYnNlbD59IFtzb3VyY2Vfb2JzZWxzXSBTb3VyY2Ugb2JzZWxzIG9mIHRoZSBvYnNlbC5cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcGFyYW0ubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiAqIEB0b2RvIEZJWE1FIERFRklORSBXSEFUIElTIEEgUkVMQVRJT05cbiAqL1xuXG4vKipcbiAqIEBzdW1tYXJ5IEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiAqIEBjbGFzcyBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4gKiBAcGFyYW0ge09ic2VsUGFyYW19IHBhcmFtIFBhcmFtZXRlcnMgb2YgdGhlIG9ic2VsXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyYW0uaWQgSWRlbnRpZmllciBvZiB0aGUgb2JzZWwuXG4gKiBAcGFyYW0ge1RyYWNlfSBwYXJhbS5UcmFjZSBUcmFjZSBvZiB0aGUgb2JzZWwuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGFyYW0udHlwZSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW0uYmVnaW49RGF0ZS5ub3coKV0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbS5lbmQ9cGFyYW0uYmVnaW5dIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBlbmRzXG4gKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtLmF0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuICogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtwYXJhbS5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4gKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW3BhcmFtLmludmVyc2VfcmVsYXRpb25zXSBSZWxhdGlvbnMgdG8gdGhpcyBvYnNlbC5cbiAqIEBwYXJhbSB7QXJyYXk8T2JzZWw+fSBbcGFyYW0uc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4gKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4gKiBAdG9kbyBGSVhNRSBSRUxBVElPTlMgQVJFIE5PVCBZRVQgU1VQUE9SVEVEXG4gKi9cblxudmFyIE9ic2VsID0gZnVuY3Rpb24gT2JzZWwocGFyYW0pIHtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwnaWQnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwndHJhY2UnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sJ2VuZCcsXHRcdHRoaXMuYmVnaW4pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwnaW52ZXJzZV9yZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwnc291cmNlX29ic2VscycsXHRcdFtdKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwnbGFiZWwnLFx0XHRcIlwiKTtcbn07XG5cbk9ic2VsLnByb3RvdHlwZSA9IHtcblx0Ly8gQVRUUklCVVRFU1xuXHRhdHRyaWJ1dGVzOiB7fSxcblx0cmVsYXRpb25zOiBbXSxcblx0aW52ZXJzZV9yZWxhdGlvbnM6IFtdLFxuXHRzb3VyY2Vfb2JzZWxzOiBbXSxcblx0bGFiZWw6IFwiXCIsXG5cdC8qKlxuXHQgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG5cdCAqIG9mIHRoZSBzYW1lIG5hbWUgdG8gdGhlIGF0dHJpYnV0ZSB2YWx1ZSwgb3RoZXJ3aXNlXG5cdCAqIHNldCB0aGUgYXR0cmlidXRlIG9mIHRoZSBzYW1lIG5hbWUgd2l0aCB0aGUgZGVmYXVsdFxuXHQgKiB2YWx1ZS5cblx0ICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIE9iamVjdCBmcm9tIHdoaWNoIGF0dHJpYnV0ZSBpcyBjb3BpZWRcblx0ICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG5cdCAqIEBwYXJhbSB2YWx1ZSBEZWZhdWx0IHZhbHVlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRfcHJpdmF0ZV9jaGVja19kZWZhdWx0OiBmdW5jdGlvbihwYXJhbSxhdHRyLHZhbHVlKSB7XG5cdFx0dGhpc1thdHRyXSA9IChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKT9wYXJhbVthdHRyXTp2YWx1ZTtcblx0fSxcblx0LyoqXG5cdCAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcblx0ICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2Vcblx0ICogbm90aGluZyBoYXBwZW5zLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBOYW1lIG9mIHRoZSBhdHRyaWJ1dGVcblx0ICogQHByaXZhdGVcblx0ICovXG5cdF9wcml2YXRlX2NoZWNrX3VuZGVmOiBmdW5jdGlvbihwYXJhbSxhdHRyKSB7XG5cdFx0aWYocGFyYW1bYXR0cl0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuXHRcdH1cblx0fSxcblx0LyoqXG5cdCAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcblx0ICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2Vcblx0ICogdGhyb3cgYW4gZXJyb3IuXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0X3ByaXZhdGVfY2hlY2tfZXJyb3I6IGZ1bmN0aW9uKHBhcmFtLGF0dHIpIHtcblx0XHRpZihwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IFwiUGFyYW1ldGVyIFwiK2F0dHIrXCIgcmVxdWlyZWQuXCI7XG5cdFx0fVxuXHR9LFxuXHQvLyBSRVNPVVJDRVxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cblx0ICogQGRlc2NyaXB0aW9uXG5cdCAqIFJlbW92ZSB0aGUgb2JzZWwgZnJvbSBpdHMgdHJhY2UuXG5cdCAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpyZW1vdmVfb2JzZWx9IGV2ZW50XG5cdCAqL1xuXHRyZW1vdmU6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZ2V0X3RyYWNlKCkucmVtb3ZlX29ic2VsKHRoaXMpO1xuXHR9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIE9ic2VsLlxuXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBJZCBvZiB0aGUgb2JzZWwuXG5cdCAqL1xuXHRnZXRfaWQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pZDsgfSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cblx0ICogQHJldHVybnMge1N0cmluZ30gTGFiZWwgb2YgdGhlIG9ic2VsLlxuXHQgKi9cblx0Z2V0X2xhYmVsOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMubGFiZWw7IH0sXG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgT2JzZWwuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG5cdCAqL1xuXHRzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkgeyB0aGlzLmxhYmVsID0gbGJsOyB9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsIHRvIHRoZSBlbXB0eSBzdHJpbmcuXG5cdCAqL1xuXHRyZXNldF9sYWJlbDogZnVuY3Rpb24oKSB7IHRoaXMubGFiZWwgPSBcIlwiOyB9LFxuXHQvLyBPQlNFTFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmV0dXJucyB0aGUgdHJhY2UgdGhlIE9ic2VsIGJlbG9uZ3MgdG8uXG5cdCAqIEByZXR1cm5zIHtUcmFjZX0gVHJhY2UgdGhlIE9ic2VsIGJlbG9uZ3MgdG8uXG5cdCAqL1xuXHRnZXRfdHJhY2U6IFx0XHRmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMudHJhY2U7IH0sXG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBPYnNlbC5cblx0ICogQHJldHVybnMge1N0cmluZ30gVHlwZSBvZiB0aGUgb2JzZWwuXG5cdCAqIEB0b2RvIFRPRE8gZGlmZmVycyBmcm9tIEtUQlMgQVBJIC0+IGV4cHJlc3MgaXQgY2xlYXJseVxuXHQgKi9cblx0Z2V0X3R5cGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50eXBlOyB9LFxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG5cdCAqIEByZXR1cm5zIHtOdW1iZXJ9IFRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuXHQgKi9cblx0Z2V0X2JlZ2luOiBcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0Ly9yZXR1cm4gdGhpcy5nZXRfdHJhY2UoKS5nZXRfb3JpZ2luX29mZnNldCgpICsgdGhpcy5iZWdpbjtcblx0XHRyZXR1cm4gdGhpcy5iZWdpbjtcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFJldHVybnMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cblx0ICogQHJldHVybnMge051bWJlcn0gVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuXHQgKi9cblx0Z2V0X2VuZDogXHRcdGZ1bmN0aW9uKCkge1xuXHRcdC8vcmV0dXJuIHRoaXMuZ2V0X3RyYWNlKCkuZ2V0X29yaWdpbl9vZmZzZXQoKSArIHRoaXMuZW5kO1xuXHRcdHJldHVybiB0aGlzLmVuZDtcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuXHQgKiBAZGVzY3JpcHRpb25cblx0ICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG5cdCAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuXHQgKiBAcGFyYW1zIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG5cdCAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuXHQgKiBAZGVwcmVjYXRlZCBUaGlzIG1ldGhvZCBtaWdodCBub3QgYmUgc3VwcG9ydGVkIGluIHRoZSBmdXR1cmUuXG5cdCAqL1xuXHRmb3JjZV9zZXRfb2JzZWxfdHlwZTogZnVuY3Rpb24odHlwZSkge1xuXHRcdHRoaXMudHlwZSA9IHR5cGU7XG5cdFx0dGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJyx0aGlzKTtcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuXHQgKiBAZGVzY3JpcHRpb25cblx0ICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG5cdCAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuXHQgKiBAcGFyYW1zIHtOdW1iZXJ9IGJlZ2luIFRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuXHQgKiBAdG9kbyBUT0RPIG5vdCBLVEJTIEFQSSBjb21wbGlhbnRcblx0ICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuXHQgKi9cblx0Zm9yY2Vfc2V0X2JlZ2luOiBmdW5jdGlvbihiZWdpbikge1xuXHRcdHRoaXMuYmVnaW4gPSBiZWdpbjtcblx0XHR0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLHRoaXMpO1xuXHR9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuXHQgKiBAZGVzY3JpcHRpb25cblx0ICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuXHQgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcblx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcblx0ICogQHBhcmFtcyB7TnVtYmVyfSBlbmQgVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuXHQgKiBAdG9kbyBUT0RPIG5vdCBLVEJTIEFQSSBjb21wbGlhbnRcblx0ICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuXHQgKi9cblx0Zm9yY2Vfc2V0X2VuZDogXHRmdW5jdGlvbihlbmQpIHtcblx0XHR0aGlzLmVuZCA9IGVuZDtcblx0XHR0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLHRoaXMpO1xuXHR9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmV0dXJucyB0aGUgc291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cblx0ICogQHJldHVybnMge0FycmF5PE9ic2VsPn0gU291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cblx0ICovXG5cdGxpc3Rfc291cmNlX29ic2VsczogXHRmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLmxpc3Rfc291cmNlX29ic2VscyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuXHRcdHJldHVybiB0aGlzLnNvdXJjZV9vYnNlbHM7XG5cdH0sXG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBSZXR1cm5zIHRoZSBhdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cblx0ICovXG5cdGxpc3RfYXR0cmlidXRlX3R5cGVzOiBcdGZ1bmN0aW9uKCkge1xuXHRcdGlmKHRoaXMuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuXHRcdHZhciBhdHRycyA9IFtdXG5cdFx0Zm9yKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7IGF0dHJzLnB1c2goa2V5KTsgfVxuXHRcdHJldHVybiBhdHRycztcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFJldHVybnMgdGhlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cblx0ICogQHJldHVybnMge0FycmF5PFN0cmluZz59IFJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cblx0ICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuXHQgKi9cblx0bGlzdF9yZWxhdGlvbl90eXBlczogXHRmdW5jdGlvbigpIHtcblx0XHRpZih0aGlzLnJlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuXHRcdHZhciByZWxzID0gW107XG5cdFx0dGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG5cdFx0XHR2YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBcdFx0aWYoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG5cdFx0XHRcdHJlbHMucHVzaChyLnR5cGUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiByZWxzO1xuXHR9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmV0dXJucyB0aGUgT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwgd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gdHlwZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IHJlbGF0aW9uX3R5cGUgUmVsYXRpb24gdHlwZS5cblx0ICogQHJldHVybnMge0FycmF5PE9ic2VsPn0gT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwuXG5cdCAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcblx0ICovXG5cdGxpc3RfcmVsYXRlZF9vYnNlbHM6IFx0ZnVuY3Rpb24ocmVsYXRpb25fdHlwZSkge1xuXHRcdHZhciBvYnNzID0gW107XG5cdFx0aWYodGhpcy5yZWxhdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG5cdFx0XHRcdHZhciB1bmlxdWVOYW1lcyA9IFtdO1xuXHRcdFx0XHRpZihyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcblx0XHRcdFx0XHRvYnNzLnB1c2goci5vYnNlbF90byk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRpZih0aGlzLmludmVyc2VfcmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG5cdFx0XHRcdHZhciB1bmlxdWVOYW1lcyA9IFtdO1xuXHRcdFx0XHRpZihyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcblx0XHRcdFx0XHRvYnNzLnB1c2goci5vYnNlbF90byk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb2Jzcztcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFJldHVybnMgdGhlIGludmVyc2UgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuXHQgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gSW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG5cdCAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcblx0ICovXG5cdGxpc3RfaW52ZXJzZV9yZWxhdGlvbl90eXBlczogZnVuY3Rpb24oKSB7XG5cdFx0aWYodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuXHRcdHZhciByZWxzID0gW107XG5cdFx0dGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcblx0XHRcdHZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgIFx0XHRpZigkLmluQXJyYXkoci50eXBlLCByZWxzKSA9PT0gLTEpIHtcblx0XHRcdFx0cmVscy5wdXNoKHIudHlwZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHJlbHM7XG5cdH0sXG4vL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cblx0ICogQHJldHVybnMge09iamVjdH0gQXR0cmlidXRlIHZhbHVlLlxuXHQgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcblx0ICovXG5cdGdldF9hdHRyaWJ1dGU6XHRmdW5jdGlvbihhdHRyKSB7XG5cdFx0aWYodGhpcy5hdHRyaWJ1dGVzW2F0dHJdID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHRocm93IFwiQXR0cmlidXRlIFwiK2F0dHIrXCIgaXMgbm90IGRlZmluZWRcIjsgLy8gVE9ET1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuXHRcdH1cblx0fSxcbi8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gdmFsIEF0dHJpYnV0ZSB2YWx1ZS5cblx0ICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG5cdCAqL1xuXHRzZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0ciwgdmFsKSB7XG5cdFx0dGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsO1xuXHRcdHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsdGhpcyk7XG5cdFx0Ly8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcblx0fSxcbi8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBSZW1vdmVzIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cblx0ICogQGRlc2NyaXB0aW9uXG5cdCAqIFJlbW92ZXMgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuXHQgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcblx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcblx0ICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cblx0ICovXG5cdGRlbF9hdHRyaWJ1dGU6XHRcdFx0ZnVuY3Rpb24oYXR0cikge1xuXHRcdGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG5cdFx0dGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJyx0aGlzKTtcblx0XHQvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxuXHR9LFxuXHQvKipcblx0ICogQHN1bW1hcnlcblx0ICogQWRkcyBhIHJlbGF0aW9uIHdpdGggYW4gT2JzZWwuXG5cdCAqIEBkZXNjcmlwdGlvblxuXHQgKiBOT1QgWUVUIElNUExFTUVOVEVEXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSByZWwgUmVsYXRpb24gdHlwZS5cblx0ICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cblx0ICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG5cdCAqL1xuXHRhZGRfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLG9icykge1xuXHRcdC8vIFRPRE9cblx0XHR0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG5cdFx0Ly8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcblx0fSxcblx0LyoqXG5cdCAqIEBzdW1tYXJ5XG5cdCAqIFJlbW92ZXMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuXHQgKiBAZGVzY3JpcHRpb25cblx0ICogTk9UIFlFVCBJTVBMRU1FTlRFRFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG5cdCAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG5cdCAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuXHQgKi9cblx0ZGVsX3JlbGF0ZWRfb2JzZWw6XHRcdGZ1bmN0aW9uKHJlbCxvYnMpIHtcblx0XHQvLyBUT0RPXG5cdFx0dGhyb3cgXCJtZXRob2Qgbm90IGltcGxlbWVudGVkIHlldFwiO1xuXHRcdC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG5cdH0sXG5cblx0Ly8gTk9UIElOIEtUQlMgQVBJXG5cdC8qKlxuXHQgKiBAc3VtbWFyeVxuXHQgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0LlxuXHQgKiBAZGVzY3JpcHRpb25cblx0ICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdFxuXHQgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBPYnNlbCB3aXRoXG5cdCAqIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsI09ic2VsfSBjb25zdHJ1Y3RvciBvclxuXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSNjcmVhdGVfb2JzZWx9IG1ldGhvZC5cblx0ICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IHRoYXRcblx0ICovXG5cdHRvX09iamVjdDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG9iaiA9IHtcblx0XHRcdGlkOiB0aGlzLmlkLFxuXHRcdFx0dHlwZTogdGhpcy50eXBlLFxuXHRcdFx0YmVnaW46IHRoaXMuYmVnaW4sXG5cdFx0XHRlbmQ6IHRoaXMuZW5kLFxuXHRcdFx0YXR0cmlidXRlczoge30sXG5cdFx0XHQvLyB1c2UgLnNsaWNlIHRvIGNvcHlcblx0XHRcdC8vIFRPRE8gaXMgaXQgZW5vdWdoPyA8LSBtaWdodCBjcmVhdGUgYnVnc1xuXHRcdFx0cmVsYXRpb25zOiB0aGlzLnJlbGF0aW9ucy5zbGljZSgpLFxuXHRcdFx0aW52ZXJzZV9yZWxhdGlvbnM6IHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuc2xpY2UoKSxcblx0XHRcdHNvdXJjZV9vYnNlbHM6IHRoaXMuc291cmNlX29ic2Vscy5zbGljZSgpLFxuXHRcdFx0bGFiZWw6IHRoaXMubGFiZWxcblx0XHR9O1xuXHRcdC8vIGNvcHkgZWFjaCBhdHRyaWJ1dGVzXG5cdFx0Zm9yKHZhciBhdHRyIGluIHRoaXMuYXR0cmlidXRlcykge1xuXHRcdFx0b2JqLmF0dHJpYnV0ZXNbYXR0cl0gPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG5cdFx0fVxuXHRcdHJldHVybiBvYmo7XG5cdH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VsO1xuIiwidmFyIE9ic2VsID0gcmVxdWlyZShcIi4vY29yZS9PYnNlbC5qc1wiKTtcbnZhciBTYW1vdHJhY2VzID0ge1xuICBcIk9ic2VsXCI6IE9ic2VsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNhbW90cmFjZXM7XG5cbiJdfQ==
