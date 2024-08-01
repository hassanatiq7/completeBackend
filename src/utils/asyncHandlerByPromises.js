

export const asyncHandlerByPromises = ( requestHandler ) => {
    ( req, res, next ) => {
        Promise.resolve( asyncHandlerByPromises( req, res, next ) ).catch( err => next( err ) );
    }
}
