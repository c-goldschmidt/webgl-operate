precision lowp float;
precision lowp int;

@import ../../source/shaders/facade.vert;


#if __VERSION__ == 100
    attribute vec3 a_vertex;
    attribute vec2 a_uv;
#else
    in vec3 a_vertex;
    in vec2 a_uv;
#endif

uniform mat4 u_view;
uniform mat4 u_projection;


out vec2 v_uv;


void main()
{
    vec4 p = u_projection * u_view * vec4(a_vertex, 1.0);
    // vec4 p = vec4(a_vertex, 1.0);

    v_uv = a_uv;

//    gl_PointSize = 10.0;
	gl_Position = p; //vec4(p, 1.0);
}
