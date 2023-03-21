
import { _decorator, Component, Node, Camera, CCBoolean } from 'cc';
import { GameInput, InputType } from './InputHandler';
const { ccclass, property } = _decorator;

 
@ccclass('InputCamera')
export class InputCamera extends Component {
    
    public static instance : InputCamera;

    @property(CCBoolean)
    public setActiveOnStart: boolean = false;

    @property(Camera)
    camera : Camera ;
    

    start(){
        if(this.setActiveOnStart){
            this.SetActive();
        }
    }

    lateUpdate(){
        GameInput.Clear();
    }

    Diactivate(){
        GameInput.off(this);
    }

    SetActive(){

        if(InputCamera.instance != this && InputCamera.instance != null){
            InputCamera.instance.Diactivate();
        }

        InputCamera.instance = this;
        if(this.camera == null)
            this.camera = this.getComponent(Camera);
        GameInput.Init(this, this.camera, this.node);
    }
    
}

