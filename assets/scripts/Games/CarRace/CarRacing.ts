import { _decorator, Component, Node, Vec3, math, EventTouch, tween, easing, Prefab } from 'cc';
import { GameScreenBounds } from '../../GameScreenBounds';
import { GameInput } from '../../InputHandler';
const { ccclass, property } = _decorator;

enum PosState
{
    Left = "Left",
    Right = "Right"
}

const RightPositions : {[x : string] : Vec3} = {
    Left : new Vec3(227.989, 230.386, 0),
    Right : new Vec3(301.817, 230.386, 0)
}
const LeftPositions : {[x : string] : Vec3} = {
    Left : new Vec3(66.033, 230.386, 0),
    Right : new Vec3(147.011, 230.386)
}

@ccclass('CarRacing')
export class CarRacing extends Component {
    
    public static instance : CarRacing;

    @property(Node)
    environment : Node;
    @property(Node)
    car1 : Node;
    @property(Node)
    car2 : Node;

    @property(Prefab)
    coinPrefab : Prefab;

    currentSpeed : number = 1;
    currentMap : Node;

    car1State : PosState = PosState.Left;
    car2State : PosState = PosState.Left;

    onLoad()
    {
        CarRacing.instance = this;
    }

    start() {

        //this.node.on(Node.EventType.TOUCH_START,this.OnTouch, this);
        this.scheduleOnce(() => {
            console.log(GameScreenBounds.instance.GetWidthBounds());
        }, 1)
    }

    OnTouch(touch : EventTouch)
    {
        console.log(touch.getLocation());
    }

    DetectInput()
    {
        if(GameInput.clicked)
        {
            const relative = this.node.inverseTransformPoint(new Vec3(), new Vec3(GameInput.mouseWorldPosition.x, GameInput.mouseWorldPosition.y, 0));
            if(relative.x < 0)
            {
                const nextState = (this.car2State == PosState.Left) ? PosState.Right : PosState.Left;
                const pos = LeftPositions[nextState];
                this.car2State = nextState;
                tween(this.car2)
                    .to(0.5, {worldPosition : pos}, {easing : "linear"})
                    .start();

            }else{
                const nextState = (this.car1State == PosState.Left) ? PosState.Right : PosState.Left;
                const pos = RightPositions[nextState];
                this.car1State = nextState;
                tween(this.car1)
                    .to(0.5, {worldPosition : pos}, {easing : "linear"})
                    .start();
            }
        }
    }

    update(deltaTime: number) {

        this.DetectInput();

        const children = this.environment.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            element.position = element.position.add3f(0, -this.currentSpeed, 0);
            if(element.position.y <= -1000)
            {
                const nextY = 1000 - Math.abs(element.position.y + 1000) ;
                element.position = new Vec3(0, nextY, 0);
            }
            this.currentMap = element;
        }

        if(this.currentSpeed <= 10)
            this.currentSpeed += deltaTime * 0.1;
    }
}


