/**
 * Created by local-rlong on 23/05/2017.
 */



namespace media {


    export function setup( module: angular.IModule ) {

        // vvv derived from https://stackoverflow.com/questions/25470475/angular-js-format-minutes-in-template

        module.filter('time', function() {

            return function( value ) {


                console.log( value );

                var sHours = "";
                if( value > 3600 ) {
                    sHours = `${Math.floor(value / 3600)}:`;
                }

                var sMinutes = "";
                {
                    let minutes = Math.floor((value % 3600) / 60);
                    if( minutes > 9 ) {

                        sMinutes = minutes.toString();
                    } else {

                        sMinutes = `0${minutes}`;
                    }
                }
                var sSeconds = "";
                {
                    let seconds = value % 60;
                    if( seconds > 9 ) {

                        sSeconds = seconds.toString();
                    } else {

                        sSeconds = `0${seconds}`;
                    }
                }

                return `${sHours}${sMinutes}:${sSeconds}`;
            };
        });

        // ^^^ derived from https://stackoverflow.com/questions/25470475/angular-js-format-minutes-in-template

    }

}
