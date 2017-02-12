//  Copyright (c) 2013 Richard Long & HexBeerium
//
//  Released under the MIT license ( http://opensource.org/licenses/MIT )
//

function buildPingResponseCriteria() {

    var answer = [

        function($){ return "response"===$[0] },
        function($){ return "jsonbroker.TestService"===$[2] },
        function($){ return "ping"===$[3] },
        function($){ return 0===$[4].length() },
        function($){ return 0===$[5].length() }

    ];
    return answer;
}

