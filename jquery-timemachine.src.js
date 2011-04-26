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
(function(window) {
    
    // Define the time machine function
    var jQueryTimemachine = {
        
        validVersions: [
            '1.2.3', '1.2.6',
            '1.3.0', '1.3.1', '1.3.2',
            '1.4.0', '1.4.1', '1.4.2', '1.4.3', '1.4.4',
            '1.5.0', '1.5.1', '1.5.2'
        ],
        loaded: {},
        scriptBaseUrl: '',
        
        constructor: function(ver, fn) {
            
            // Check if the requested version is valid
            if (!this.isValid(ver)) return;
            
            // Load the jQuery version and continue
            loadJquery(ver, fn);
        },
        
        loadJQuery: function(ver, callback) {
            
            // Check if the version was already loaded
            
        },
        
        isValid: function(ver) {
            
            return this.inArray(ver, this.validVersion);
        },
        
        inArray: function(needle, haystack) {
            
        },
        
        wget: function(url, callback) {
            
        }
    };
    
    // Define the functions into the global scope
    window.jQueryTimemachine = window.jqtm = jQueryTimemachine;
})(window);