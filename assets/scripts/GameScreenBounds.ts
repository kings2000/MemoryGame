import { _decorator, Component, Node, Camera, director, Canvas, view, UITransform, math, sys } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('GameScreenBounds')
@requireComponent(Camera)
export class GameScreenBounds extends Component {
    
    public static instance : GameScreenBounds ;
    private camera : Camera;
    private canvas : Canvas;

    Xmin : number = 0;
    Xmax : number = 0;

    start(){
        GameScreenBounds.instance = this;
        this.camera = this.getComponent(Camera);
        this.canvas = this.node.parent.getComponent(Canvas);
        this.updateBounds();
        
    }

    updateBounds(){
        // console.log(view.getViewportRect());
        // console.log(view.getVisibleSize());
        
        //let mapUI = this.canvas.getComponent(UITransform);
        //let right: number = mapUI.contentSize.x;

        const aspect = GameScreenBounds.GetScreenSafeAspect();
        
        let boundX = (this.camera.orthoHeight * aspect);
        this.Xmax = boundX;
        this.Xmin = -boundX;

        //console.log(boundX);
    }

    public GetWidthBounds(){
       
        return new math.Size(this.Xmin, this.Xmax)
    }

    public static GetScreenSafeAspect()
    {
        const size = sys.getSafeAreaRect();
        return size.width / size.height;
    }

    public static GetScreenAspect()
    {
        const size = view.getVisibleSize();
        return size.width / size.height;
    }
}

