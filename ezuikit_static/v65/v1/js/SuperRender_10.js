"use strict";
 //顶点着色器
//attribute修饰符用于声明由浏览器（javascript）传输给顶点着色器的变量值；
// vertexPos即我们定义的顶点坐标；
// gl_Position是一个内建的传出变量。
var vertexYUVShader = [
    'attribute vec4 vertexPos;',
    'attribute vec2 texturePos;',
    'varying vec2 textureCoord;',

    'void main()',
    '{',
        'gl_Position = vertexPos;',
        'textureCoord = texturePos;',
    '}'
    ].join('\n');
    //像素着色器(yuv->rgb)
var fragmentYUVShader = [
    'precision highp float;',
    'varying highp vec2 textureCoord;',
    'uniform sampler2D ySampler;',
    'uniform sampler2D uSampler;',
    'uniform sampler2D vSampler;',
    'const mat4 YUV2RGB = mat4',
    '(',
        '1.1643828125, 0, 1.59602734375, -.87078515625,',
        '1.1643828125, -.39176171875, -.81296875, .52959375,',
        '1.1643828125, 2.017234375, 0, -1.081390625,',
        '0, 0, 0, 1',
    ');',
  
    'void main(void) {',
        'highp float y = texture2D(ySampler,  textureCoord).r;',
        'highp float u = texture2D(uSampler,  textureCoord).r;',
        'highp float v = texture2D(vSampler,  textureCoord).r;',
        'gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;',
    '}'
    ].join('\n');

(function (root, factory) {
    root.SuperRender = factory();
}(this, function () {
    
    function RenderManager(canvas) {

        this.canvasElement = document.getElementById(canvas);

        this.initContextGL();

        if(this.contextGL) {
            this.YUVProgram = this.initProgram(vertexYUVShader, fragmentYUVShader);
            this.initBuffers();
            this.initTextures();
        }
    };

    /**
     * 初始化WebGL上下文
     */
    RenderManager.prototype.initContextGL = function() {
        
        var canvas = this.canvasElement;

        var gl = null;

        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {
            gl = null;
        }

        if(!gl || typeof gl.getParameter !== "function") {
            gl = null;
        }

        this.contextGL = gl;

        console.log("WebGL1.0");
    };

    /**
     * 初始化着色器程序
     * @param vertexShaderScript    顶点着色器脚本
     * @param fragmentShaderScript  片段着色器脚本
     */
    RenderManager.prototype.initProgram = function(vertexShaderScript, fragmentShaderScript) {
        
        var gl = this.contextGL;
        
        var vertexShader = gl.createShader(gl.VERTEX_SHADER); //创建定点着色器
        gl.shaderSource(vertexShader, vertexShaderScript);
        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.log('Vertex shader failed to compile: ' + gl.getShaderInfoLog(vertexShader));
        }

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderScript);
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.log('Fragment shader failed to compile: ' + gl.getShaderInfoLog(fragmentShader));
        }

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log('Program failed to compile: ' + gl.getProgramInfoLog(program));
        }
        
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        return program;
    };

    /**
     * 初始化数据缓存
     */
    RenderManager.prototype.initBuffers = function() {
        
        var gl = this.contextGL;
    
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texturePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.vertexPosBuffer  = vertexPosBuffer;
        this.texturePosBuffer = texturePosBuffer;
    };

    /**
     * 创建纹理
     */
    RenderManager.prototype.initTexture = function() {

        var gl = this.contextGL;

        var textureRef = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureRef);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return textureRef;
    };

    /**
     * 初始化YUV纹理
     */
    RenderManager.prototype.initTextures = function() {
        
        var gl = this.contextGL;
        
        var program = this.YUVProgram;
        gl.useProgram(program);
        
        var yTextureRef = this.initTexture();
        var ySamplerRef = gl.getUniformLocation(program, 'ySampler');
        gl.uniform1i(ySamplerRef, 0);
        this.yTextureRef = yTextureRef;

        var uTextureRef = this.initTexture();
        var uSamplerRef = gl.getUniformLocation(program, 'uSampler');
        gl.uniform1i(uSamplerRef, 1);
        this.uTextureRef = uTextureRef;

        var vTextureRef = this.initTexture();
        var vSamplerRef = gl.getUniformLocation(program, 'vSampler');
        gl.uniform1i(vSamplerRef, 2);
        this.vTextureRef = vTextureRef;
        
        gl.useProgram(null);
    };

    /**
     * 显示帧数据
     * @param nWidth    宽度
     * @param nHeight   高度
     * @param nHeight   帧数据
     */
    RenderManager.prototype.SR_DisplayFrameData = function(nWidth, nHeight, pData,dWidth,dHeight) {

        if(nWidth <= 0 || nHeight <= 0)
        {
            return;
        }

        var gl = this.contextGL;

        if(null == pData)
        {
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return;
        }

        var canvas = this.canvasElement;

        this.nWindowWidth = canvas.width;
        this.nWindowHeight = canvas.height;
        
        var nWindowWidth = this.nWindowWidth;
        var nWindowHeight = this.nWindowHeight;

        gl.clearColor(0.8, 0.8, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0, 0, nWindowWidth, nWindowHeight);

        this.updateFrameData(nWidth, nHeight, pData,dWidth,dHeight);

        var program = this.YUVProgram;
        gl.useProgram(program);

        var vertexPosBuffer = this.vertexPosBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertexPosRef = gl.getAttribLocation(program, 'vertexPos');
        gl.enableVertexAttribArray(vertexPosRef);
        gl.vertexAttribPointer(vertexPosRef, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var texturePosBuffer = this.texturePosBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        var texturePosRef = gl.getAttribLocation(program, 'texturePos');
        gl.enableVertexAttribArray(texturePosRef);
        gl.vertexAttribPointer(texturePosRef, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); 

        gl.disableVertexAttribArray(vertexPosRef);
        gl.disableVertexAttribArray(texturePosRef);

        gl.useProgram(null);
    };

    /**
     * 上传YUV数据到纹理
     * @param nWidth    宽度
     * @param nHeight   高度
     * @param nHeight   帧数据
     */
    RenderManager.prototype.updateFrameData = function(width, height, data,dWidth,dHeight) {

        var gl = this.contextGL;

        var yTextureRef = this.yTextureRef;
        var uTextureRef = this.uTextureRef;
        var vTextureRef = this.vTextureRef;

        var i420Data = data;
        // debugger;
		if(width == dWidth && height == dHeight)
		{
			var yDataLength = width * height;
			var yData = i420Data.subarray(0, yDataLength);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData);
			
			var cbDataLength = width/2 * height/2;
			var cbData = i420Data.subarray(width*height, width*height + cbDataLength);
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width/2, height/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, cbData);
			
			var crDataLength = cbDataLength;
			var crData = i420Data.subarray(width*height + width*height/4, width*height + width*height/4 + crDataLength);
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width/2, height/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, crData);
			
		}
        else
		{
			 // //裁剪宽
			var yDataLength = dWidth * dHeight;
			var yData=new Uint8Array(yDataLength) ;
			for(var i=0;i<dHeight;i++)
			{
				//var ySonData=new Uint8Array(dWidth) ;
				var ySonData = i420Data.subarray(i*width, i*width+dWidth);
				for (var j = 0; j < dWidth; j++) {
					yData[i*dWidth + j] = ySonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, yTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth, dHeight, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData);
			yData=null;
			ySonData=null;

			var cbDataLength = dWidth/2 * dHeight/2;
			var cbData =new Uint8Array(cbDataLength);
			//var cbSonData=new Uint8Array(dWidth/2) ;
			for(var i=0;i<dHeight/2;i++)
			{
				 var cbSonData = i420Data.subarray(width*height+i*width/2, width*height+i*width/2+dWidth/2);
				for (var j = 0; j < dWidth/2; j++) {
					cbData[i*dWidth/2 + j] = cbSonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, uTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth/2, dHeight/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, cbData);
			cbData=null;
			cbSonData=null;

			var crDataLength = cbDataLength;
			var crData = new Uint8Array(crDataLength);
			for(var i=0;i<dHeight/2;i++)
			{
				var crSonData = i420Data.subarray(width*height*5/4+i*width/2, width*height*5/4+i*width/2+dWidth/2);
				for (var j = 0; j < dWidth/2; j++) {
					crData[i*dWidth/2 + j] = crSonData[j];
				}
			}
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, vTextureRef);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, dWidth/2, dHeight/2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, crData);
			crData=null;
			crSonData=null;
		}
       
    };

    /**
     * 设置显示区域
     * @param stDisplayRect    显示区域
     */
    RenderManager.prototype.SR_SetDisplayRect = function(stDisplayRect) {

        var gl = this.contextGL;

        var nWindowWidth = this.nWindowWidth;
        var nWindowHeight = this.nWindowHeight;
        
        var texturePosValues = null;
        
        if(stDisplayRect && nWindowWidth > 0 && nWindowHeight > 0) {
            var fLeft = stDisplayRect.left / nWindowWidth;
            var fTop = stDisplayRect.top / nWindowHeight;
            var fRight = stDisplayRect.right / nWindowWidth;
            var fBottom = stDisplayRect.bottom / nWindowHeight;

            texturePosValues = new Float32Array([fRight, fTop, fLeft, fTop, fRight, fBottom, fLeft, fBottom]);
        }
        else {
            texturePosValues = new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]);
        }

        var texturePosBuffer = this.texturePosBuffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, texturePosBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, texturePosValues);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };

    /**
     * 释放显示资源
     */
    RenderManager.prototype.SR_Destroy = function() {

        var gl = this.contextGL;
        
        var YUVProgram = this.YUVProgram;
        gl.deleteProgram(YUVProgram);

        var vertexPosBuffer = this.vertexPosBuffer;
        var texturePosBuffer = this.texturePosBuffer;
        
        gl.deleteBuffer(vertexPosBuffer);
        gl.deleteBuffer(texturePosBuffer);

        var yTextureRef = this.yTextureRef;
        var uTextureRef = this.uTextureRef;
        var vTextureRef = this.vTextureRef;
        gl.deleteTexture(yTextureRef);
        gl.deleteTexture(uTextureRef);
        gl.deleteTexture(vTextureRef);
    };

    return RenderManager;

}));