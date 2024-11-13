import { Application, Assets, Sprite } from "pixi.js";
import Tile from "../tile";

export default class Structure {

    public isTree: Boolean;
    private sprite?: Sprite;
    public interact(): void {
    };
    shake?(): any;
    public texture: string;
    public app: Application;

    constructor({ texture, app }: { texture: string, app: Application }) {
        this.isTree = false;
        // this.tile = tile;
        this.texture = texture;
        this.app = app;
    }

    public async render({ app, x, y, width, height }: { app: Application, x: number, y: number, width: number, height: number }) {


        await Assets.load(this.texture);
        this.sprite = Sprite.from(this.texture);
        this.sprite.width = width;
        this.sprite.height = height;
        this.sprite.x = x;
        this.sprite.y = y;

        this.sprite.x += (width - this.sprite.width) / 2;
        this.sprite.y += (height - this.sprite.height) / 2;

        console.log(`${this.sprite.x}, ${this.sprite.y}, ${this.sprite.width}, ${this.sprite.height}`)
        app.stage.addChild(this.sprite);

    }
    public async deRender() {
        this.sprite && (this.app.stage.removeChild(this.sprite));

    }
    public clone(): Structure {
        return new Structure({ texture: this.texture, app: this.app });
    }
    public toJSON(): {
        isTree: boolean;
        treeType?: string;
        texture: string;
        fruitOrder?: string[];
    } {
        return ({
            isTree: false,
            texture: this.texture,
        })
    }

}  