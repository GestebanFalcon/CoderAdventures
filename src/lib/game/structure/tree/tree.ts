import { Application } from "pixi.js";
import Tile from "../../tile";
import Structure from "../structure";
import Fruit from "./fruit";

export enum TreeType {
    STRAWBERRY = "Strawberry",
    OAK = "Acorn",
    APPLE = "Apple",
    PEAR = "Pear"

}

export default class Tree extends Structure {

    private fruitCount: number;
    private type: string;
    private fruitOrder?: string[]

    constructor({ texture, type, app, fruitOrder }: { texture: string, type: string, app: Application, fruitOrder?: string[] }) {

        super({ texture, app })
        this.fruitCount = Math.round(Math.random() * 5) + 5;
        this.type = type;
        this.isTree = true;

        fruitOrder && (this.fruitOrder = fruitOrder);
    }

    public interact(): void {
        console.log("its a tree");
    }

    shake(): undefined | Fruit {
        if (this.fruitCount === 0) {
            return;
        }
        // if (Math.random() < 0.5) {
        //     return;
        // }
        this.fruitCount--;
        const fruit = new Fruit({
            type: (this.fruitOrder ? (
                this.fruitOrder[(this.fruitCount % this.fruitOrder.length)]
            ) : this.type)
        });
        return (fruit);
    }

    public clone() {
        return new Tree({ texture: this.texture, type: this.type, app: this.app });
    }

    public toJSON() {
        const json = {
            isTree: true,
            treeType: this.type,
            texture: this.texture,
            fruitOrder: this.fruitOrder && this.fruitOrder
        }
        return json;
    }

    public static fromJSON({ treeType, texture, app, fruitOrder }: { treeType?: string, texture: string, app: Application, fruitOrder?: string[] }): any {
        if (treeType) {
            return new Tree({ type: treeType, texture, app: app, fruitOrder: fruitOrder });
        }
    }

}