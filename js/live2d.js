
// Global: if chara watch the pointer
let follow = true;

// edit the model content, re-locate relative path
function setpath(model, baseurl) {
    model.url = baseurl
    model["HitAreas"] = [
        {"Name":"Head", "Id":"HitAreaHead"},
        {"Name":"Body", "Id":"HitAreaBody"}
    ]
    return model;
}
// AJAX get
function getModel(path, model, callback, callback2) {
    return fetch(path + model)
    .then(r => r.json(), alert)
    .then(data => {
        callback(setpath(data, path + model))
        callback2(data.FileReferences)
    }, alert)
}
// Pixi option
let app;
function init(x, y) {
    const option = {
        width: x,
        height: y,
        transparent: true,
        preserveDrawingBuffer: true,    // to capture
        view: document.getElementById("canvas"),
        autoStart: true
    }
    PIXI.live2d.Live2DModel.registerTicker(PIXI.Ticker)
    // PIXI.Renderer.registerPlugin('interaction', PIXI.InteractionManager);
    app = new PIXI.Application(option);
    // const sprite = new PIXI.Sprite.fromImage("./7_room2_a.jpg");
    // stage.addChild(sprite);
}
async function _show(model) {
    const settings = new PIXI.live2d.Cubism4ModelSettings(model);
    const live2dSprite = await PIXI.live2d.Live2DModel.from(settings, {
        eyeBlink: true,
        lipSyncWithSound: true,
        debugLog: false,
        debugMouseLog: false,
        randomMotion: false,
        defaultMotionGroup: "Motion",
        autoInteract: follow,
        expressionFadingDuration: 0,
        motionFadingDuration: 0,
        idleMotionFadingDuration: 0
    });
    app.stage.addChild(live2dSprite);
    live2dSprite.scale.set(0.5, 0.5);
    function t(hitAreas) {
        if (hitAreas.includes('body')) {
            live2dSprite.internalModel.motionManager.expressionManager.setRandomExpression();
        }
        live2dSprite.internalModel.motionManager.startRandomMotion("Motion");
    }
    live2dSprite.on('hit', t);
    // live2dSprite.on("click", t);
    // live2dSprite.on("touchend", t);
    // live2dSprite.on("pointerup", t);
    // let o = null;
    // live2dSprite.on("touchstart", function(evt) {
    //     o = {x: evt.data.global.x, y: evt.data.global.y};
    // });
    // live2dSprite.on("touchmove", function(evt) {
    //     if (o) {
    //         let t = {x: evt.data.global.x, y:evt.data.global.y};
    //         window.scroll(window.scrollX + o.x - t.x, window.scrollY + o.y - t.y);
    //     }
    // });
    // live2dSprite.on("touchend", function() { o = null; });
    // if (follow) {
    //     function f(evt) {
    //         const point = evt.data.global;
    //         live2dSprite.setViewPoint(point.x, point.y);
    //     }
    //     live2dSprite.on("mousemove", f);
    //     live2dSprite.on("touchstart", f);
    //     live2dSprite.on("touchend", f);
    //     live2dSprite.on("touchmove", f);
    //     live2dSprite.on("pointermove", f);
    //     live2dSprite.on("pointerdown", f);
    // }
}
function show(path, model, callback) { getModel(path, model, _show, callback); }
