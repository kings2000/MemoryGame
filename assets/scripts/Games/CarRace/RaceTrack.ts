import { _decorator, Component, Node, UITransform, randomRange, Vec3, instantiate } from 'cc';
import { CarRacing } from './CarRacing';
const { ccclass, property } = _decorator;



@ccclass('RaceTrack')
export class RaceTrack extends Component {

    @property(UITransform)
    l_laneWidth : UITransform;
    @property(UITransform)
    r_laneWidth : UITransform;

    
    maxY : number = 500;
    minY : number = -500;

    points : Vec3[] = [];
    coins : Node[] = []


    start() {
        this.GenerateLevel();

    }
    

    GenerateLevel()
    {
        const L_leftXPoint = this.l_laneWidth.node.position.x - (this.l_laneWidth.contentSize.x / 2);
        const L_rightXPoint = this.l_laneWidth.node.position.x + (this.l_laneWidth.contentSize.x / 2);

        const R_leftXPoint = this.r_laneWidth.node.position.x - (this.r_laneWidth.contentSize.x / 2);
        const R_rightXPoint = this.r_laneWidth.node.position.x + (this.r_laneWidth.contentSize.x / 2);

        for (let index = 0; index < 1000; index += 200) {

            const randY = randomRange(index, index + 150) - 500;
            if(randomRange(0, 10) > 5)
            {
                if(randomRange(0, 10) > 5)
                {
                    const L_leftRandY = randY + randomRange(-20, 20);
                    this.points.push(new Vec3(L_leftXPoint, L_leftRandY, 0));
                }else
                {
                    const L_rightRandY = randY + randomRange(-20, 20);
                    this.points.push(new Vec3(L_rightXPoint, L_rightRandY, 0));
                }

            }else{
                if(randomRange(0, 10) > 5)
                {
                    const R_leftRandY = randY + randomRange(-20, 20);
                    this.points.push(new Vec3(R_leftXPoint, R_leftRandY, 0));
                }else{
                    const R_rightRandY = randY + randomRange(-20, 20);
                    this.points.push(new Vec3(R_rightXPoint, R_rightRandY, 0));
                }
                
            }

        }

        for (let index = 0; index < this.points.length; index++) {
            const element = this.points[index];
            
            if(this.coins.length <= index)
            {   
                let item = instantiate(CarRacing.instance.coinPrefab);
                this.node.addChild(item);
                item.position = element;

            }else{
                let item = this.coins[index];
                item.position = element;
            }
        }
    }
}


