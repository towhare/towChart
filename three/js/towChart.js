(function(undefined) {
    "use strict"
    var _global;
    var towChart = {
        add: function(n1,n2){ return n1 + n2; },//加
        line:{
            //创建绘制多个线条：材质，线条组，场景
            initLines:function(lineMaterial,linesGeometries,scene){
                var lines = [];
                for(var i = 0;i < linesGeometries.length; i++){
                    var line = new THREE.Line(linesGeometries[i],lineMaterial)
                    lines.push(line)
                    scene.add(line)
                }
                return lines
            },
            //创建根据点生成的线条或者折线的几何框架 传入点数组 点数组的x,y,z分别表示位置
            initLineGeometry:function(pointArr){
                var geometry = new THREE.Geometry()
                for(var i = 0 ; i < pointArr.length;i++){
                    geometry.vertices.push(new THREE.Vector3(pointArr[i].x,pointArr[i].y,pointArr[i].z))
                }
                return geometry
            },
            //产生并且X轴返回线几何框架对象的函数 其中包括起始点和终点 间距 长度 线条数量
            initXLines:function(spacing,lineNum,lineLength){
                var linesGeometry = []
                for(var i = 0 ; i < lineNum; i++){
                    var geometry = this.initLineGeometry([{x:0,y:spacing*(i+1),z:0},{x:lineLength,y:spacing*(i+1),z:0}])
                    console.log(geometry);
                    linesGeometry.push(geometry)
                }
                return linesGeometry
            },
            //产生并且z轴返回线几何框架对象的函数 其中包括起始点和终点 间距 长度 线条数量
            initZLines:function(spacing,lineNum,lineLength){
                var linesGeometry = []
                for(var i = 0 ; i < lineNum; i++){
                    var geometry = this.initLineGeometry([{x:0,y:spacing*(i+1),z:0},{x:0,y:spacing*(i+1),z:lineLength}])
                    console.log(geometry)
                    linesGeometry.push(geometry)
                }
                return linesGeometry
            },
            initGrid:function(spacing,lineNum,face){
                var lineLength = spacing*lineNum
                face = typeof face !== 'undefined' ?  face : 'y';
                function cacu(i){
                    return spacing*i
                }
                var linesGeometry = []
                for(var i = 0 ; i < lineNum; i++){
                    var step = cacu(i+1)
                    var point1 = {
                        x:step,
                        y:0,
                        z:0
                    }
                    var point2 = {
                        x:step,
                        y:0,
                        z:lineLength,
                    }
                    var point3 = {
                        x:0,
                        y:0,
                        z:step
                    }
                    var point4 = {
                        x:lineLength,
                        y:0,
                        z:step
                    }
                    if(face === 'y'){
                        var geometry = this.initLineGeometry([{x:point1.x,y:point1.y,z:point1.z},{x:point2.x,y:point2.y,z:point2.z}])
                        var geometry2 = this.initLineGeometry([{x:point3.x,y:point3.y,z:point3.z},{x:point4.x,y:point4.y,z:point4.z}])
                    }else if(face === 'x'){
                        var geometry = this.initLineGeometry([{x:point1.y ,y:point1.x,z:point1.z},{x:point2.y ,y:point2.x,z:point2.z}])
                        var geometry2 = this.initLineGeometry([{x:point3.y ,y:point3.x,z:point3.z},{x:point4.y ,y:point4.x,z:point4.z}])
                    }else{
                        var geometry = this.initLineGeometry([{x:point1.x,y:point1.z,z:point1.y},{x:point2.x,y:point2.z,z:point2.y}])
                        var geometry2 = this.initLineGeometry([{x:point3.x,y:point3.z,z:point3.y},{x:point4.x,y:point4.z,z:point4.y}])
                    }
                    linesGeometry.push(geometry)
                    linesGeometry.push(geometry2)
                }
                return linesGeometry
            },
            drawGrid:function(lineNum,spacing,material,face,scene){
                var gridGeometries = this.initGrid(spacing,lineNum,face);
                for(var i = 0 ; i < gridGeometries.length; i++ ){
                    var currentLine = new THREE.Line(gridGeometries[i],material)
                    scene.add(currentLine)
                }
            },
            oneCurve:function(p1,p2,material){
                var halfX = (p1.x+p2.x)/2;
                var halfY = (p1.z+p2.z)/2;
                var curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3( p1.x, p1.y, p1.z ),
                    new THREE.Vector3( halfX, p1.y, halfY ),
                    new THREE.Vector3( halfX, p2.y, halfY ),
                    new THREE.Vector3( p2.x, p2.y, p2.z )
                );
                var points = curve.getPoints( 32 );
                var geometry = new THREE.BufferGeometry().setFromPoints( points );

                var curveObject = new THREE.Line( geometry, material );

                scene.add(curveObject);
            },
        },
        helper:{

        },
        addPath:function(){
            var path = new THREE.Path();

            path.lineTo( 0, 0 );
            path.quadraticCurveTo( 20, 20, 0, 20 );
            path.lineTo( 10, 10 );

            var points = path.getPoints();

            var geometry = new THREE.BufferGeometry().setFromPoints( points );
            var material = new THREE.LineBasicMaterial( { color: 0xffffff } );

            var line = new THREE.Line( geometry, material );
            scene.add( line );
        },

        addCatmullRomLine:function(){//样条线 不会经过点
            var curve = new THREE.CatmullRomCurve3( [
                new THREE.Vector3( -10, 0, 10 ),
                new THREE.Vector3( -5, 5, 5 ),
                new THREE.Vector3( 0, 0, 0 ),
                new THREE.Vector3( 5, -5, 5 ),
                new THREE.Vector3( 10, 0, 10 )
            ] );

            var points = curve.getPoints( 50 );
            var geometry = new THREE.BufferGeometry().setFromPoints( points );

            var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

            var curveObject = new THREE.Line( geometry, material );

            scene.add(curveObject);
        },
        addCube(w,h,d,material,position){
            var geometry = new THREE.BoxGeometry( w, h, d )
            var cube = new THREE.Mesh( geometry, material )
            cube.position.set(2,2,2)
            scene.add( cube )
        },
        addBar(w,h,d,material,position){/*创建柱状体*/
            var geometry = new THREE.BoxGeometry( w, h, d )
            var bar = new THREE.Mesh(geometry,material)
            bar.position.set(position.x+w/2,h/2,position.y+d/2)
            scene.add( bar )
        },

        addBars(){

        },
        initTextCanvas:function(options){
            var settings
            if(typeof options === 'undefined'){
                console.log('没有传入任何从参数 字是白色的');
                settings = {
                    canvasW : 1000,
                    canvasH : 1000,
                    text:'测试文字',
                    fontColor: 'black',
                    font:'40 微软雅黑'
                }
            }else{
                settings = {
                    canvasW : options.canvasWidth || 400,
                    canvasH : options.canvasHeight || 400,
                    text: options.text || '测试文字',
                    fontColor: options.color || 'white',
                    font:options.font || '30px 微软雅黑'
                }
            }
            var canvas = document.createElement('canvas')
            canvas.width = settings.canvasW
            canvas.height = settings.canvasH
            var ctx = canvas.getContext('2d')


            ctx.font = settings.font
            ctx.fillStyle = settings.fontColor
            ctx.textAlign = 'center'
            ctx.fillText(settings.text,settings.canvasW/2,settings.canvasH/2);

            return canvas;

        },
        initTextSprite:function(canvas){
            var spriteMaterial = new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas)})
            var TextSprite = new  THREE.Sprite(spriteMaterial)
            console.log(TextSprite)
            return TextSprite
        }
    }
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = towChart;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return towChart;});
    } else {
        !('towChart' in _global) && (_global.towChart = towChart);
    }
}());