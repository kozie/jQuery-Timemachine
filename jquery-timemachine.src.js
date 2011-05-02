/**
 * jQuery Timemachine
 * 
 * A small JS library to run JS code in the namespace of a
 * certain jQuery version.
 * 
 * @author  Koos van Egmond <flamefingers at gmail dot com>
 * @version 1.0
 **/
 
// Set own function scope
(function(window, undefined) {
    
    // Declare the main jqTimemachine function
    var jqTimemachine = function(ver, callback) {
        
        return new jqTimemachine.fn.init(ver, callback);
    },
    
    // Declare legal window.document
    doc = window.document;
    
    // Define the time machine function
    jqTimemachine.fn = jqTimemachine.prototype = {
        
        constructor: jqTimemachine,
        
        validVersions: [
            '1.2.3', '1.2.6',
            '1.3.0', '1.3.1', '1.3.2',
            '1.4.0', '1.4.1', '1.4.2', '1.4.3', '1.4.4',
            '1.5.0', '1.5.1', '1.5.2'
        ],
        
        loadedVersions: {},
        scriptBaseUrl: 'https://ajax.googleapis.com/ajax/libs/jquery/__VER__/jquery.min.js',
        
        init: function(ver, callback) {
            
            // Return false if no version was given
            if (ver === undefined) return;
            
            // Try to load/get the requested jQuery version
            // and *optionally* run the callback function
            this.loadJQuery(ver, callback);
            
            return this;
        },
        
        loadJQuery: function(ver, callback) {
            
            // Check if the requested version is legitimate
            if (!this.isValid(ver)) return;
            
            // Check if the version was already loaded
            if (this.isLoaded(ver)) {
             
                // Get the version
                var jq = this.getVersion(ver);
                
                // Return the callback?
                if ('function' == typeof callback) callback.call(jq,jq,jq);
            } else {
                
                // Construct the url to the correct jQuery version
                var url = this.scriptBaseUrl.replace('__VER__', ver),
                
                // Set fallback to this
                t = this;
                
                // Load the jQuery version dynamically
                this.load(url, function() {
                   
                   // Get the jquery version and rip it out of the window
                   var jq = jQuery.noConflict(true);
                   
                   // Put it in the loaded version stack
                   this.loadedVersions[this.verKeyName(ver)] = jq;
                   
                   // Return the callback function
                   if ('function' == typeof callback) callback.call(jq,jq,jq);
                });
            }
        },
        
        getVersion: function(ver) {
          
            return this.loadedVersion[this.verKeyName(ver)];
        },
        
        isValid: function(ver) {
            
            return this.inArray(ver, this.validVersions);
        },
        
        isLoaded: function(ver) {
          
            return this.inArray(this.verKeyName(ver), this.loadedVersions);
        },
        
        inArray: function(needle, haystack) {
            
            // Return if either one of two is undefined
            if (needle === undefined || haystack === undefined) return false;
            
            // Loop through the given array
            for (var key in haystack) {
                
                if (haystack[key] == needle) return true;
            }
            
            return false;
        },
        
        verKeyName: function(ver) {
            
            return ver.replace('.', '');
        },
        
        // This function is derived from the scriptTag method in
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
    
    // Set correct reference of the current scope
    jqTimemachine.fn.init.prototype = jqTimemachine.fn;
    
    // Define the functions into the global scope
    window.jQueryTimemachine = window.jtm = jqTimemachine;
})(window);