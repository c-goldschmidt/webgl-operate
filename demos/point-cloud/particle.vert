precision lowp float;
precision lowp int;

@import ../../source/shaders/facade.vert;


#if __VERSION__ == 100
    attribute vec3 a_vertex;
#else
    in vec3 a_vertex;
#endif

uniform mat4 u_view;
uniform mat4 u_projection;


void main()
{
    vec4 p = u_projection * u_view * vec4(a_vertex, 1.0);

	gl_Position = p; //vec4(p, 1.0);
}
