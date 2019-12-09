precision lowp float;
precision lowp int;

@import ../../source/shaders/facade.vert;


#if __VERSION__ == 100
    attribute vec3 a_vertex;
#else
    in vec3 a_vertex;
#endif

void main()
{
	gl_Position = vec4(a_vertex, 1.0);
}
