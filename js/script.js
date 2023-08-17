
var canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var engine = null;
var scene = null;
var sceneToRender = null;

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {

    //***** Настройка камеры и сцены
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 4, Math.PI / 6, 40, new BABYLON.Vector3(0, 0, 3), scene);
    camera.attachControl(canvas, true);
    scene.clearColor = new BABYLON.Color3(0, 0, 0.1);  //черный фон
    //*****Свет    
    //var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 16, 0), scene);
    //light.intensity = 0.2;
    const sunLight = new BABYLON.SpotLight("sunLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 4, 0), Math.PI, 1, scene);
    sunLight.diffuse = BABYLON.Color3.Yellow();
    sunLight.intensity = 0.9;
    //*****Создание сферы и текстуры планет
    var planetSpheres = [];
    var planetTextures = [];
    var axis = new BABYLON.Vector3(0, 6, 0);

    //**********Создание сфер и подключение текстур планет
    const createPlanets = () => {
        for (let i = 0; i < solar_db.length; i++) {
            //*********Прорисовка орбиты через 3 точки
            const a = new BABYLON.Vector3(0, 0, solar_db[i].start_x);
            const b = new BABYLON.Vector3(solar_db[i].start_x * (-1), 0, 0);
            const c = new BABYLON.Vector3(solar_db[i].start_x, 0, 0);
            const arc = BABYLON.Curve3.ArcThru3Points(a, b, c, 64, false, true);
            const arcLine = BABYLON.MeshBuilder.CreateLines("arc", { points: arc.getPoints() });
            arcLine.color = new BABYLON.Color3(0.2, 0.2, 0.2);
            arcLine.hasAlpha = true;
            planetSpheres[i] = BABYLON.MeshBuilder.CreateSphere("planet " + solar_db[i].name, { diameter: solar_db[i].size }, scene);
            planetTextures[i] = new BABYLON.StandardMaterial("planetTex" + solar_db[i].name, scene);
            planetTextures[i].emissiveTexture = new BABYLON.Texture(solar_db[i].texture);
            planetSpheres[i].material = planetTextures[i];
            planetSpheres[i].position.x = solar_db[i].start_x;
            //***** Для Сатурна добавляем плоскость "кольца"
            if (solar_db[i].rings != null) {
                const ringsTexture = new BABYLON.StandardMaterial("ringsTex", scene);
                ringsTexture.diffuseTexture = new BABYLON.Texture(solar_db[i].rings, scene);
                const rings = BABYLON.MeshBuilder.CreateGround("rings", { width: 2, height: 2 }, scene);
                rings.material = ringsTexture;
                rings.position.x = solar_db[i].start_x;
                //***** Сливаем с самой планетой
                planetSpheres[i] = BABYLON.Mesh.MergeMeshes([planetSpheres[i], rings], true);
            }
            else
                planetSpheres[i] = BABYLON.Mesh.MergeMeshes([planetSpheres[i], planetSpheres[i]], true); //танец с бубном
            //*****Добавление движения 
            scene.registerAfterRender(function () {
                planetSpheres[i].rotate(axis, solar_db[i].rotation, BABYLON.Space.LOCAL);
            });
            /*------------Rotation aroud parent--------*/
            /*if (i != 0) {
                planetSpheres[i].parent = planetSpheres[0];
                scene.registerAfterRender(function () {
                    planetSpheres[i].rotate(axis, solar_db[i].speed, BABYLON.Space.WORLD);
                });
            }*/
        }
    }
    createPlanets();

    //******Рисуем 4 сектора пояса астероидов для отрицательных и положит координат  
    createAsteroids(1, 1, 1);
    createAsteroids(-1, 1, 1);
    createAsteroids(-1, 1, -1);
    createAsteroids(1, 1, -1);
    function createAsteroids(k1, k2, k3) { //заполняем один сектор окружности для положительных или отрицательных координат

        var asteroid = [];
        for (let i = 0; i <= aster_db.count; i++) {
            let xx = Math.random() * aster_db.radius;
            xx = xx.toFixed(3);
            let yy = 0;
            let zz = Math.sqrt(aster_db.radius * aster_db.radius - xx * xx);
            zz = zz.toFixed(3);
            //*** Создаем сразу 4 точки с разными знаками*/  
            asteroid[i] = BABYLON.MeshBuilder.CreateSphere("aster" + i, { diameter: aster_db.diam * Math.random(), segments: 6 }, scene);
            asteroid[i].position = new BABYLON.Vector3(k1 * xx, k2 * yy, k3 * zz);
            asteroid[i] = BABYLON.Mesh.MergeMeshes([asteroid[i], asteroid[i]], true);
            //*** Запуск вращения
            scene.registerAfterRender(function () {
                asteroid[i].rotate(axis, aster_db.speed, BABYLON.Space.WORLD);
            });
        }
    }
    sunLight.parent = planetSpheres[0];
    //*****Вспышки на солнце
    const sunParticlesAdd = () => {
        const sunParticles = new BABYLON.ParticleSystem("sunParticles", 40, scene);
        sunParticles.particleTexture = new BABYLON.Texture("img/sun_surface.png");
        var sunEmitter = new BABYLON.SphereParticleEmitter();
        sunEmitter.radius = 0.5;
        sunEmitter.radiusRange = 0;
        sunParticles.particleEmitterType = sunEmitter;
        sunParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        sunParticles.minSize = 1.0;
        sunParticles.maxSize = 2.2;
        sunParticles.minLifeTime = 2;
        sunParticles.isBillboardBased = false;
        sunParticles.hasAlpha = true;
        sunParticles.minAngularSpeed = -0.1;
        //Градиентная смена цвета
        sunParticles.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
        sunParticles.addColorGradient(0.4, new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5));
        sunParticles.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));

        sunParticles.start();

        // Создание систем частиц - звезды
        var starsParticles = new BABYLON.ParticleSystem("starsParticles", 500, scene);
        starsParticles.particleTexture = new BABYLON.Texture("img/star.png", scene);
        //Настройка частиц-звезд
        var starsEmitter = new BABYLON.SphereParticleEmitter();
        starsEmitter.radius = 50;
        starsEmitter.radiusRange = 0;
        starsParticles.emitter = BABYLON.Mesh.CreateBox("emitter", 0.02, scene);
        starsParticles.particleEmitterType = starsEmitter;
        starsParticles.minSize = 0.25;
        starsParticles.maxSize = 0.35;
        starsParticles.minLifeTime = 999999;
        starsParticles.manualEmitCount = 1500;
        starsParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        starsParticles.minEmitPower = 0.0;
        starsParticles.maxAngularSpeed = 0.0;
        starsParticles.isBillboardBased = false;

        starsParticles.start();
    }
    sunParticlesAdd();
    return scene;
}
window.initFunction = async function () {
    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }
    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
