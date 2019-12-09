
/* spellchecker: disable */

// import { /*mat4,*/ vec3 } from 'gl-matrix';

import {
    Buffer,
    Camera,
    Canvas,
    Context,
    DefaultFramebuffer,
    Invalidate,
    MouseEventProvider,
    Navigation,
    Program,
    Renderer,
    Shader,
    Wizard,
} from 'webgl-operate';

import { Demo } from '../demo';
import { vec3 } from 'gl-matrix';

/* spellchecker: enable */


// tslint:disable:max-classes-per-file

export class PointCloudRenderer extends Renderer {

    protected _camera: Camera;
    protected _navigation: Navigation;

    protected _vertexVBO: Buffer;
    // protected _pointCount: number;

    protected _program: Program;

    // protected _uView: WebGLUniformLocation;
    // protected _uViewInverse: WebGLUniformLocation;
    // protected _uProjection: WebGLUniformLocation;
    // protected _uViewProjection: WebGLUniformLocation;

    protected _defaultFBO: DefaultFramebuffer;


    /**
     * Initializes and sets up buffer, cube geometry, camera and links shaders with program.
     * @param context - valid context to create the object for.
     * @param identifier - meaningful name for identification of this instance.
     * @param mouseEventProvider - required for mouse interaction
     * @returns - whether initialization was successful
     */
    protected onInitialize(context: Context, callback: Invalidate,
        mouseEventProvider: MouseEventProvider,
        /* keyEventProvider: KeyEventProvider, */
        /* touchEventProvider: TouchEventProvider */): boolean {

        this._defaultFBO = new DefaultFramebuffer(context, 'DefaultFBO');
        this._defaultFBO.initialize();
        this._defaultFBO.bind();

        const gl = context.gl;

        // WORLD SPACE:
        const vertices = new Float32Array([
            -0.5, -0.5, 0.0, /* UL */ +0.5, -0.5, 0.0, /* UR */ +0.5, +0.5, 0.0]);

        const vertexLocation: GLuint = 0; // x, y, z positions in world space

        this._vertexVBO = new Buffer(context, 'positionsVBO');
        this._vertexVBO.initialize(gl.ARRAY_BUFFER);
        this._vertexVBO.attribEnable(vertexLocation, 3, gl.FLOAT, false);
        this._vertexVBO.data(vertices, gl.STATIC_DRAW);


        const vert = new Shader(context, gl.VERTEX_SHADER, 'particle.vert');
        vert.initialize(require('./particle.vert'));
        const frag = new Shader(context, gl.FRAGMENT_SHADER, 'particle.frag');
        frag.initialize(require('./particle.frag'));

        this._program = new Program(context, 'ParticleProgram');
        this._program.initialize([vert, frag], false);
        this._program.attribute('a_vertex', vertexLocation);
        this._program.link();


        this._camera = new Camera();
        this._camera.center = vec3.fromValues(0.0, 0.0, 0.0);
        this._camera.up = vec3.fromValues(0.0, 1.0, 0.0);
        this._camera.eye = vec3.fromValues(0.0, 0.0, 5.0);
        this._camera.near = 1.0;
        this._camera.far = 8.0;
        this._camera.fovy = 32.043;


        this._navigation = new Navigation(callback, mouseEventProvider);
        this._navigation.camera = this._camera;

        return true;
    }

    /**
     * Uninitializes buffers, geometry and program.
     */
    protected onUninitialize(): void {
        super.uninitialize();



        this._defaultFBO.uninitialize();
    }

    /**
     * This is invoked in order to check if rendering of a frame is required by means of implementation specific
     * evaluation (e.g., lazy non continuous rendering). Regardless of the return value a new frame (preparation,
     * frame, swap) might be invoked anyway, e.g., when update is forced or canvas or context properties have
     * changed or the renderer was invalidated @see{@link invalidate}.
     * @returns whether to redraw
     */
    protected onUpdate(): boolean {
        this._navigation.update();

        return this._altered.any || this._camera.altered;

    }
    /**
     * This is invoked in order to prepare rendering of one or more frames, regarding multi-frame rendering and
     * camera-updates.
     */
    protected onPrepare(): void {
        if (this._altered.canvasSize) {
            this._camera.aspect = this._canvasSize[0] / this._canvasSize[1];
            this._camera.viewport = this._canvasSize;
        }

        if (this._altered.clearColor) {
            this._defaultFBO.clearColor(this._clearColor);
        }

        this._altered.reset();
        this._camera.altered = false;
    }

    protected onFrame(): void {
        const gl = this._context.gl;

        gl.viewport(0, 0, this._frameSize[0], this._frameSize[1]);

        this._program.bind();
        this._vertexVBO.bind();

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        this._vertexVBO.unbind();
        this._program.unbind();


    }

    protected onSwap(): void { }

}


export class PointCloudDemo extends Demo {

    private _canvas: Canvas;
    private _renderer: PointCloudRenderer;

    initialize(element: HTMLCanvasElement | string): boolean {

        this._canvas = new Canvas(element, { antialias: false });
        this._canvas.controller.multiFrameNumber = 1;
        this._canvas.framePrecision = Wizard.Precision.byte;
        this._canvas.frameScale = [1.0, 1.0];

        this._renderer = new PointCloudRenderer();
        this._canvas.renderer = this._renderer;

        return true;
    }

    uninitialize(): void {
        this._canvas.dispose();
        (this._renderer as Renderer).uninitialize();
    }

    get canvas(): Canvas {
        return this._canvas;
    }

    get renderer(): PointCloudRenderer {
        return this._renderer;
    }

}
