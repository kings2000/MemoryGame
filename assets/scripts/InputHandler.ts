import { Camera, EventTouch, Node, Vec2, Vec3, Component, input, Input } from 'cc';
import { GameScreenBounds } from './GameScreenBounds';


export enum InputType{
    NONE,
    TOUCH_START,
    TOUCH_MOVE,
    TOUCH_END,
    TOUCH_CANCEL
}


export interface IInputListener{

    OnInputStart(touchPosition : Vec3);
    OnTouchMove(touchPosition : Vec3);
    OnClick(touchPosition : Vec3);

}

export class InputHandler {
    
    public static Init(callback : Function, target : Component){
        
        input.on(Input.EventType.TOUCH_START, function (event: EventTouch) {
            callback(InputType.TOUCH_START, event);
        }, target);
        input.on(Input.EventType.TOUCH_MOVE, function (event: EventTouch) {
            callback(InputType.TOUCH_MOVE, event);
        });
        input.on(Input.EventType.TOUCH_END, function( event : EventTouch){
            callback(InputType.TOUCH_END, event);
        });
        input.on(Input.EventType.TOUCH_CANCEL, function( event : EventTouch){
            callback(InputType.TOUCH_CANCEL, event);
        });
        
    }
}

export class GameInput {
    
    public static mousePosition : Vec2 = new Vec2();
    public static mouseStartPosition : Vec2 = new Vec2();
    public static mouseWorldPosition : Vec2 = new Vec2();
    public static mouseStartWorldPosition : Vec2 = new Vec2();
    public static mouseUiPosition : Vec3 = new Vec3();

    public static inputType : InputType;

    public static clicked : boolean = false;
    public static mouseDown : Boolean = false;
    public static mouseUp : boolean = true;
    private static clickStartTime : number;
    public static camara : Camera;

    public static worldCatch : Vec3 = new Vec3();
    private static posCatch : Vec2;
    public static uiclickedOnInputFrame : boolean;
    public static rootNode : Node;
    public static touch : EventTouch;
    //private static 

    static Init(target : any, cam : Camera, rootNode : Node){
        
        GameInput.rootNode = rootNode;
        GameInput.camara = cam;
        input.on(Input.EventType.TOUCH_MOVE, GameInput.onMouseMove, target);
        input.on(Input.EventType.TOUCH_START, GameInput.onMouseStart, target);
        input.on(Input.EventType.TOUCH_END , GameInput.onMouseEnd, target);
        
    }

    static off(target: any){
        input.off(Input.EventType.TOUCH_MOVE, GameInput.onMouseMove, target);
        input.off(Input.EventType.TOUCH_START, GameInput.onMouseStart, target);
        input.off(Input.EventType.TOUCH_END , GameInput.onMouseEnd, target);
        
    }

    static onMouseMove(event : EventTouch){
        GameInput.touch = event;
        GameInput.GetMouseWorldPosition(event);
        GameInput.inputType = InputType.TOUCH_MOVE;
        
    }

    static onMouseStart(event : EventTouch){
        GameInput.touch = event;
        GameScreenBounds.instance.updateBounds();
        GameInput.clickStartTime = new Date().getTime()/1000;
        //if(Input.inputType == InputType.TOUCH_START) return;
        GameInput.mouseUp = false;
        GameInput.inputType = InputType.TOUCH_START;
        GameInput.clicked = false;
        //Input.GetMouseWorldPosition(event);
        
        GameInput.mouseStartWorldPosition = GameInput.GetMouseWorldPosition(event);
        GameInput.mouseStartPosition = event.getLocation();
        
        GameInput.mouseDown = true;
        
        //console.log(event.getLocationInView());
    }

    static onMouseEnd(event : EventTouch){
        GameInput.touch = event;
        if(GameInput.inputType == InputType.TOUCH_END) return;

        GameInput.inputType = InputType.TOUCH_END;
        let mouseEndPoint = GameInput.GetMouseWorldPosition(event);
        let lastTouchTime = new Date().getTime()/1000;

        let diff = lastTouchTime - GameInput.clickStartTime;
        let disMoved = Vec2.distance(mouseEndPoint, GameInput.mouseStartWorldPosition);

        //console.log(disMoved ,diff);
        if(GameInput.mouseDown){
            if(diff < 0.2  && disMoved < 2){
                GameInput.clicked = true;
                setTimeout(() => {
                    GameInput.clicked = false;
                    GameInput.uiclickedOnInputFrame = false;
                    GameInput.inputType = InputType.NONE;
                },15);
            }
        }
        GameInput.mouseDown = false;
        GameInput.mouseUp = true;
    }

    static GetMouseWorldPosition(event : EventTouch){
        let v3 = new Vec3(event.getLocationX(), event.getLocationY(), 0);
        let pos = GameInput.camara.screenToWorld(v3, GameInput.worldCatch);
        
        GameInput.mouseWorldPosition = new Vec2(pos.x, pos.y);
        GameInput.mousePosition = new Vec2(v3.x, v3.y);
        GameInput.mouseUiPosition = pos.multiply3f(-1,1,1).add3f(GameInput.rootNode.position.x + (GameScreenBounds.instance.GetWidthBounds().y * 2), 0, 0);

        return GameInput.mouseWorldPosition;
    }

    static GetWorldPositionFromPoint(x : number, y : number, z : number = 0){
        let v3 = new Vec3(x, y, z);
        let pos = GameInput.camara.screenToWorld(v3, GameInput.worldCatch);
        return new Vec2(pos.x, pos.y);
    }

    static Clear(){
        //GameInput.clicked = false;
        
        GameInput.inputType = InputType.NONE;
    }

}
