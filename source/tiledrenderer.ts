
/* spellchecker: disable */

// import { assert, log, LogLevel } from './auxiliaries';

// import { Context } from './context';

/* spellchecker: enable */


/**
 * Todo
 */
export class TiledRenderer {

    /*
    tileSize -> limited to power of two, starting with 16x16 ... ending with 256x256
    targetSize -> limited to max texture resolution for now ... 16k by 16k
      -> this is implicitly given by target fbo...
    multiFrameNumber <- not covered here -> given by controller
    renderer -> reference to renderer for that a full multiframe is triggered per tile
    padding -> vec4 padding that is used for tile rendering -> only the non-padding area is stitched
    camera -> what camera to use (for splitting up the view projection)
       -> will be modified during rendering and reset when frame is finished
    sequence -> defines which space filling curve to use and returns array of tile indices (row first,
        starting at lower left tile with 0)
    tileCount -> number of tiles given targetSize and tileSize -> there might be tiles that have unused areas
      -> to reduce overhead, unused areas should occur only on one side per dimension, i.e., upper right
    progress$ -> observable for tracking the tile rendering progress
    target -> FBO to render into -> this implicitly provides the size for rendering
      -> since another renderer is used, the target should be configured to fit the renderer - this is not
      covered by this tiled renderer ... (in terms of format, type, etc...)
    frame -> renders a single tile (render to texture) and displays the target/result
      -> in order to speed up multiframe rendering, controller batchSize is set to multiframe number
    -> controller batch size needs to be reset when finished
    */
}

export namespace TiledRenderer {

    export enum Sequence {
        spiral = 'spiral',
        hilbert = 'hilbert',
        peano = 'peano',
        scanline = 'scanline',
    }

}
