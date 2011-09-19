/**
 * jQuery Timemachine
 * 
 * A small JS library to run JS code in the namespace of a
 * certain jQuery version.
 * 
 * @author  Koos van Egmond <flamefingers at gmail dot com>
 * @version 1.3
 **/
 
// Set own function scope
(function(window, doc, undefined) {
    
    // Declare the main jqTimemachine function
    var jqTimemachine = function(ver, callback) {
        
        return new jqTimemachine.fn.init(ver, callback);
    };
    
    // Define the time machine function
    jqTimemachine.fn = jqTimemachine.prototype = {
        
        // Link the constructor
        constructor: jqTimemachine,
        
        // A list of valid jQuery versions, hosted by Google's CDN
        validVersions: [
            '1.2', '1.3', '1.4', '1.5', '1.6', 
            '1.2.3', '1.2.6',
            '1.3.0', '1.3.1', '1.3.2',
            '1.4.0', '1.4.1', '1.4.2', '1.4.3', '1.4.4',
            '1.5.0', '1.5.1', '1.5.2',
            '1.6.0', '1.6.1', '1.6.2', '1.6.3', '1.6.4'
        ],
        
        // An object to store loaded jQuery version in
        loadedVersions: {},
        
        // The base URL to load jQuery from Google's CDN
        scriptBaseUrl: 'https://ajax.googleapis.com/ajax/libs/jquery/__VER__/jquery.min.js',
        
        // The init function to launch the rocket ;)
        init: function(ver, callback) {
            
            // Return false if no version was given
            if (ver === undefined) return;
            
            // Try to load/get the requested jQuery version
            // and *optionally* run the callback function
            this.loadJQuery(ver, callback);
            
            return this;
        },
        
        // Variable function to run the callback in the requested
        // version of jQuery
        loadJQuery: function(ver, callback) {
            
            // Check if the requested version is legitimate
            if (!this.isValid(ver)) {
            
                // Warn the user in the console and stop
                this.report('Requested version '+ver+' not available', 'warn');
                return;
            }
            
            // Check if the version was already loaded
            if (this.isLoaded(ver)) {
             
                // Get the version
                var jq = this.getVersion(ver);
                
                // Return the callback?
                if ('function' == typeof callback) callback.call(jq,jq,jq);
            } else {
                
                // Construct the url to the correct jQuery version
                var url = this.scriptBaseUrl.replace('__VER__', ver);
                
                // Load the jQuery version dynamically
                this.load(url, function() {
                   
                   // Get the jquery version and rip it out of the window
                   var jq = window.jQuery.noConflict(true);
                   
                   // Put it in the loaded version stack
                   ver = jqTimemachine.fn.verKeyName(ver);
                   jqTimemachine.fn.loadedVersions[ver] = jq;
                   
                   // Return the callback function
                   if ('function' == typeof callback) callback.call(jq,jq,jq);
                });
            }
        },
        
        // Function to get an already loaded version of jQuery
        getVersion: function(ver) {
          
            return this.loadedVersions[this.verKeyName(ver)];
        },
        
        // Function to check if a requested version is available
        isValid: function(ver) {
            
            return this.inArray(ver, this.validVersions);
        },
        
        // Function to check if a version of jQuery is already loaded
        isLoaded: function(ver) {
          
            ver = this.verKeyName(ver);
            return (undefined !== this.loadedVersions[ver]);
        },
        
        // Simple inArray function to search for the presence of needle
        // in haystack
        inArray: function(needle, haystack) {
            
            // Return if either one of two is undefined
            if (needle === undefined || haystack === undefined) return false;
            
            // Loop through the given array
            for (var key in haystack) {
                
                if (haystack[key] == needle) return true;
            }
            
            return false;
        },
        
        // Simple function to remove the dots from the versio number
        // to use as friendly keynames for arrays
        verKeyName: function(ver) {
            
            return 'v'+ver.replace(/\./g, '');
        },
        
        // Function to remove a loaded version of jQuery
        reset: function(ver) {
        
            ver = this.verKeyName(ver);
            if (this.loadedVersions[ver] !== undefined) {
                delete this.loadedVersions[ver];
            }
        },
        
        // Function to report to the console, if possible
        report: function(msg, type) {
            
            // Return false if no console exists
            if (undefined === window.console) return;
            
            // Set default type
            if (! /^(log|warn|error)$/.test(type)) type = 'log';
            
            // Check if the function does exists and do the
            // reporting to the error
            if (typeof window.console[type] != 'undefined') {
                
                // Prepend msg with jqTimemachine and return
                (window.console[type])('jqTimemachine: '+msg);
            }
            
            return this;
        },
        
        // Function to load an external script and execute a function
        // when done loading
        // NOTE: This function is derived from the scriptTag method in
        // HeadJS by Tero Piirainen
        load: function(url, callback) {
            
            // Create script element and configure
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.async = false;
            script.onreadystatechange = script.onload = function() {
                
                // Get the state, if possible
                var state = script.readyState;
                
                if (!callback.done && (!state || /loaded|complete/.test(state))) {
                    
                    callback.call(jqTimemachine.fn);
                    callback.done = true;
                }
            };
            
            // Load the script
            script.src = url;
            
            // Append the script to the head element
            doc.getElementsByTagName('head')[0].appendChild(script);
        }
    };
    
    // Current function of the timemachine is also it's prototype.
    // This is required for later references to the script
    jqTimemachine.fn.init.prototype = jqTimemachine.fn;
    
    // Define the timemachine into the global scope
    window.jqTimemachine = window.jtm = jqTimemachine;
    
})(window, window.document);