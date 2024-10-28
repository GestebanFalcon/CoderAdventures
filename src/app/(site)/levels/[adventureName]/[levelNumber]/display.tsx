"use client"

import Interpreter from "js-interpreter";
import { useBlocklyWorkspace } from "react-blockly";
import * as Blockly from "blockly"
import { javascriptGenerator } from "blockly/javascript";
import GameDisplay from "@/components/activityDisplay/gameDisplay/gameDisplay";
import { Workspace } from "@/components/activityDisplay/googleBlockly/workspace";
import { useEffect, useState, useRef } from "react";
import { Application } from "pixi.js";
import Level from "@/lib/game/level";
import { Direction } from "@/lib/game/entity";
import Tree from "@/lib/game/structure/tree/tree";
import Tile, { TileType } from "@/lib/game/tile";
import Link from "next/link";

export default function Display({ levelNumber, adventureName }: { levelNumber: number, adventureName: string }) {


    const workspaceRef = useRef(null);

    const [isComplete, setIsComplete] = useState(false);
    const app = new Application();
    const [level, setLevel] = useState<Level>(new Level(levelNumber, app, setIsComplete, [5, 5], "move02"));

    Blockly.Blocks['move_right'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Right");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("This block runs a custom script.");
            this.setHelpUrl("");
        }
    }
    Blockly.Blocks['move_left'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Left");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("This block runs a custom script.");
            this.setHelpUrl("");
        }
    }
    Blockly.Blocks['move_up'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Up");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("This block runs a custom script.");
            this.setHelpUrl("");
        }
    }
    Blockly.Blocks['move_down'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move Down");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("This block runs a custom script.");
            this.setHelpUrl("");
        }
    }

    javascriptGenerator.forBlock['move_right'] = function (block: Blockly.Block, generator: Blockly.Generator) {
        const code = `moveRight();`;
        return code
    }
    javascriptGenerator.forBlock['move_left'] = function (block: Blockly.Block, generator: Blockly.Generator) {
        const code = `moveLeft();`;
        return code
    }
    javascriptGenerator.forBlock['move_up'] = function (block: Blockly.Block, generator: Blockly.Generator) {
        const code = `moveUp();`;
        return code
    }
    javascriptGenerator.forBlock['move_down'] = function (block: Blockly.Block, generator: Blockly.Generator) {
        const code = `moveDown();`;
        return code
    }


    const toolbox = {
        // There are two kinds of toolboxes. The simpler one is a flyout toolbox.
        kind: 'flyoutToolbox',
        // The contents is the blocks and other items that exist in your toolbox.
        contents: [
            {
                kind: 'block',
                type: 'controls_if'
            },
            {
                kind: 'block',
                type: 'controls_whileUntil'
            },
            {
                kind: 'block',
                type: 'move_right'
            },
            {
                kind: 'block',
                type: 'move_left',
            },
            {
                kind: 'block',
                type: 'move_up'
            },
            {
                kind: 'block',
                type: 'move_down'
            }
            // You can add more blocks to this array.
        ]
    };

    const { workspace, xml } = useBlocklyWorkspace({
        ref: workspaceRef,
        toolboxConfiguration: toolbox,
        workspaceConfiguration: {}
    });

    useEffect(() => {

        const pixiInit = async () => {

            // await app.init({ width: 390, height: 390 })
            // document.getElementById("stageDiv")?.appendChild(app.canvas);

            const res = await fetch(`/api/getLevel/${levelNumber}`);
            const body = await res.json();
            const { levelJSON } = body;
            console.log(body);
            console.log(levelJSON);

            await level.init();

            if (levelJSON) {
                console.log(level);
                const newLevel = Level.fromJSON({ setIsComplete, tiles: levelJSON.tiles, index: levelJSON.index, mainCoords: levelJSON.mainCoords, dimensions: levelJSON.dimensions, app: level.app, winCon: levelJSON.winCon });
                console.log(newLevel);
                setLevel(prevLevel => {
                    prevLevel.board.deRender();
                    return newLevel
                });
                //the error is here. In the setlevle. Its not setting it. Why
                console.log(level);
            } else {
                await level.reset();
            }


            // const newTile = new Tile({ type: TileType.GROUND, board: level.board, structure: new Tree({ texture: "https://static.vecteezy.com/system/resources/thumbnails/026/795/005/small/mango-fruit-tropical-transparent-png.png", type: "mango", app: level.app }) });
            // level.board.insertTile(0, 2, newTile);
            // await level.board.board[0][2].render(64, 0, level.app);




        }

        pixiInit();

    }, [])
    useEffect(() => {
        console.log(level.mainCharacter);
        const render = async () => {
            // await level.init();
            await level.board.render();
        }
        render()
    }, [level]);

    const initApi = (interpreter: any, globalObject: any) => {
        var wrapper = function moveRight() {
            return (level.move("right"));
        }
        interpreter.setProperty(globalObject, 'moveRight', interpreter.createNativeFunction(wrapper));

        wrapper = function moveLeft() {
            return (level.move("left"));
        }
        interpreter.setProperty(globalObject, 'moveLeft', interpreter.createNativeFunction(wrapper));

        wrapper = function moveUp() {
            return (level.move("up"));
        }
        interpreter.setProperty(globalObject, 'moveUp', interpreter.createNativeFunction(wrapper));

        wrapper = function moveDown() {
            return (level.move("down"));
        }
        interpreter.setProperty(globalObject, 'moveDown', interpreter.createNativeFunction(wrapper));
    }

    const runCode = () => {
        console.log(level);
        const code = javascriptGenerator.workspaceToCode(workspace);
        const myInterpreter = new Interpreter(code, initApi);
        function nextStep() {
            if (myInterpreter.step()) {
                setTimeout(nextStep, 10);
            }
        }
        nextStep();

        // eval(code);


    }
    return (<div id="levelsContainer" className="flex flex-row h-full">
        {isComplete && (
            <div className=" absolute top-0 left-0 w-full h-full z-50 flex justify-center items-center text-white text-4xl font-bold">
                <div className=" bg-yellow-200 rounded-lg px-16 py-8 opacity-100 border-gray-900 border-2 flex flex-col items-middle justify-center">
                    Level {levelNumber} Complete!
                    <p>Good Job</p>
                    {levelNumber < 3 ? (<Link href={`/levels/${adventureName}/${+levelNumber + 1}`}>Continue</Link>) : <p>Thank You For Playing,<br></br><Link href="/info/review">Leave a review?</Link></p>}

                </div>
            </div>
        )}
        <div id="displayContainerBig" className=" p-8 bg-gray-300">
            <div id="displayContainerLittle" className=" w-full h-full">
                <div id="stageDiv" style={{
                    width: 6 * 32 * 2, height: 6 * 32 * 2
                }}>

                </div>
                <button onClick={runCode}>Run</button> <button onClick={async () => {
                    await level.reset();
                }}>Reload {isComplete && (<>true</>)} </button>
            </div>
        </div>

        <div id="blocklyContainer" className=" flex-grow bg-gray-400">
            <div className=' h-full w-full '>
                <div ref={workspaceRef} id='workspaceDiv' className=" h-full w-full">

                </div>
            </div>
        </div>

    </div>)
}